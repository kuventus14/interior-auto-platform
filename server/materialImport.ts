/** 자재 가져오기 — 외부 사이트 URL을 받아 Python 크롤러(crawler/lxzin_crawler.py)로 제품 정보를 수집한다. */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { TRPCError } from "@trpc/server";

export interface ImportedMaterial {
  manufacturer: string;
  brand: string;
  material_category: string | null;
  product_series: string | null;
  product_subcategory: string | null;
  product_name: string | null;
  model_code: string | null;
  color: string | null;
  color_hex: string | null;
  spec: string | null;
  material: string | null;
  pattern_image_urls: string[] | null;
  construction_image_urls: string[] | null;
  unclassified_image_urls: string[] | null;
  video_urls: string[] | null;
  construction_case_urls: string[] | null;
  detail_url: string;
  collected_at: string;
  missing_fields: string[];
}

/** 현재 크롤러가 구조를 알고 있는 사이트만 허용한다(임의 주소 요청 방지). */
export const SUPPORTED_HOSTS = ["www.lxzin.com", "lxzin.com"] as const;

const ROOT = process.cwd();
const CRAWLER = path.join(ROOT, "crawler", "lxzin_crawler.py");
// 사이트 1곳을 동시에 여러 번 긁지 않도록 한 번에 한 작업만 실행한다.
let running = false;

function pythonBin() {
  if (process.env.CRAWLER_PYTHON) return process.env.CRAWLER_PYTHON;
  const venv = process.platform === "win32"
    ? path.join(ROOT, "crawler", ".venv", "Scripts", "python.exe")
    : path.join(ROOT, "crawler", ".venv", "bin", "python");
  return existsSync(venv) ? venv : "python";
}

export function validateImportUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new TRPCError({ code: "BAD_REQUEST", message: "올바른 URL 형식이 아니에요." });
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new TRPCError({ code: "BAD_REQUEST", message: "http(s) 주소만 사용할 수 있어요." });
  }
  if (!(SUPPORTED_HOSTS as readonly string[]).includes(url.hostname)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `아직 지원하지 않는 사이트예요. 지원 사이트: ${SUPPORTED_HOSTS[0]}`,
    });
  }
  return url;
}

export async function importMaterials(rawUrl: string, limit: number): Promise<ImportedMaterial[]> {
  const url = validateImportUrl(rawUrl);
  if (running) {
    throw new TRPCError({ code: "CONFLICT", message: "다른 가져오기 작업이 진행 중이에요. 잠시 후 다시 시도해 주세요." });
  }
  running = true;
  try {
    return await runCrawler(url.toString(), limit);
  } finally {
    running = false;
  }
}

function runCrawler(url: string, limit: number): Promise<ImportedMaterial[]> {
  return new Promise((resolve, reject) => {
    const child = spawn(pythonBin(), [CRAWLER, "--category-url", url, "--limit", String(limit), "--stdout"], {
      cwd: ROOT,
      env: { ...process.env, PYTHONIOENCODING: "utf-8" },
      windowsHide: true,
    });
    let stdout = "";
    let stderr = "";
    // 요청 간격 2초 × (목록 1 + 제품 N) + 여유
    const timer = setTimeout(() => child.kill(), (limit + 5) * 2_000 + 60_000);
    child.stdout.setEncoding("utf8").on("data", chunk => (stdout += chunk));
    child.stderr.setEncoding("utf8").on("data", chunk => (stderr += chunk));
    child.on("error", err => {
      clearTimeout(timer);
      reject(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `크롤러를 실행할 수 없어요: ${err.message}` }));
    });
    child.on("close", code => {
      clearTimeout(timer);
      const lastLog = stderr.trim().split("\n").filter(Boolean).at(-1) ?? "";
      let rows: ImportedMaterial[] = [];
      try {
        rows = stdout.trim() ? JSON.parse(stdout) : [];
      } catch {
        return reject(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "크롤러 결과를 해석하지 못했어요." }));
      }
      if (rows.length) return resolve(rows);
      reject(new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `가져온 제품이 없어요 (종료 코드 ${code}). ${lastLog.replace(/^\[[\d:]+\]\s*/, "")}`.trim(),
      }));
    });
  });
}
