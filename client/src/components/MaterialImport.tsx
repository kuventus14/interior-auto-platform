/** Quiet Materiality — 외부 사이트 주소로 자재 정보를 가져오는 대화상자와 결과 카드. */

import { Tag } from "@/components/InteriorPieces";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import type { AppRouter } from "../../../server/routers";
import type { inferRouterOutputs } from "@trpc/server";
import { AlertCircle, ExternalLink, Globe, Loader2 } from "lucide-react";
import { useState } from "react";

export type ImportedMaterial = inferRouterOutputs<AppRouter>["materialImport"]["fetch"][number];

const EXAMPLE_URL = "https://www.lxzin.com/zin/category/a070000?mcate=a070100";
const FIELD_LABELS: Record<string, string> = {
  material_category: "자재 분류",
  product_series: "시리즈",
  product_name: "제품명",
  model_code: "모델코드",
  color: "색상",
  spec: "규격",
  material: "소재",
  pattern_image_urls: "패턴 이미지",
  construction_image_urls: "시공 이미지",
};

export function MaterialImportDialog({ open, onOpenChange, onImported }: { open: boolean; onOpenChange: (open: boolean) => void; onImported: (rows: ImportedMaterial[], url: string) => void }) {
  const [url, setUrl] = useState("");
  const [limit, setLimit] = useState(10);
  const mutation = trpc.materialImport.fetch.useMutation({
    onSuccess: (rows, input) => { onImported(rows, input.url); onOpenChange(false); },
  });
  const pending = mutation.isPending;
  const submit = (event: React.FormEvent) => { event.preventDefault(); if (url.trim() && !pending) mutation.mutate({ url: url.trim(), limit }); };
  return <Dialog open={open} onOpenChange={(next) => { if (!pending) onOpenChange(next); }}>
    <DialogContent className="sm:max-w-[520px]">
      <form onSubmit={submit}>
        <DialogHeader>
          <DialogTitle className="text-[16px]">자재 가져오기</DialogTitle>
          <DialogDescription className="text-[12px] leading-5">제품 목록 또는 제품 상세 페이지 주소를 넣으면 제품 정보와 이미지 주소를 가져와요. 현재 지원 사이트: LX Z:IN(lxzin.com)</DialogDescription>
        </DialogHeader>
        <label className="mt-5 block text-[11px] font-semibold text-[#5f574d]">사이트 주소</label>
        <div className="relative mt-1.5"><Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#948b80]" /><input type="url" required value={url} onChange={(event) => setUrl(event.target.value)} placeholder={EXAMPLE_URL} disabled={pending} className="quiet-input h-11" style={{ paddingLeft: 36 }} /></div>
        <button type="button" onClick={() => setUrl(EXAMPLE_URL)} disabled={pending} className="mt-1.5 text-[10px] font-semibold text-[#7c7064] underline underline-offset-4">예시 주소 넣기 (LX Z:IN 디아망 벽지)</button>
        <label className="mt-4 block text-[11px] font-semibold text-[#5f574d]">가져올 제품 수</label>
        <select value={limit} onChange={(event) => setLimit(Number(event.target.value))} disabled={pending} className="quiet-input mt-1.5 h-11">{[5, 10, 20].map((n) => <option key={n} value={n}>{n}개</option>)}</select>
        <p className="mt-2 text-[10px] leading-4 text-[#93897e]">사이트 부담을 줄이려고 요청 사이에 2초씩 쉬어요. {limit}개 기준 약 {(limit + 2) * 2}초 걸려요.</p>
        {mutation.error && <p className="mt-4 flex items-start gap-2 rounded-lg bg-[#f8ecea] px-3 py-2.5 text-[11px] leading-5 text-[#8a4f45]"><AlertCircle size={14} className="mt-0.5 shrink-0" />{mutation.error.message}</p>}
        <DialogFooter className="mt-6">
          <button type="button" onClick={() => onOpenChange(false)} disabled={pending} className="rounded-lg border border-[#e2ddd5] bg-white px-4 py-2.5 text-[11px] font-semibold text-[#5d554b] disabled:opacity-50">취소</button>
          <button type="submit" disabled={pending || !url.trim()} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#24221e] px-4 py-2.5 text-[11px] font-semibold text-white disabled:opacity-50">{pending ? <><Loader2 size={13} className="animate-spin" /> 가져오는 중…</> : "가져오기"}</button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>;
}

export function ImportedMaterialCard({ item }: { item: ImportedMaterial }) {
  const cover = item.pattern_image_urls?.[0] ?? item.unclassified_image_urls?.[0] ?? null;
  const installs = item.construction_image_urls ?? [];
  return <article className="flex flex-col rounded-[16px] border border-[#ebe7e0] bg-white p-3 shadow-[0_6px_18px_rgba(65,52,38,.035)]">
    <div className="aspect-[1.25] w-full overflow-hidden rounded-[11px] bg-[#efebe5]">{cover ? <img src={cover} alt={`${item.product_name ?? "자재"} 이미지`} loading="lazy" referrerPolicy="no-referrer" className="size-full object-cover" /> : <span className="grid size-full place-items-center text-[10px] text-[#a0978c]">이미지 없음</span>}</div>
    <div className="flex flex-1 flex-col pt-3">
      <p className="text-[10px] text-[#8e867c]">{item.brand} · {item.product_series ?? "시리즈 없음"}</p>
      <h3 className="mt-1 text-[12px] font-semibold leading-[1.45] text-[#322f29]">{item.product_name ?? "제품명 없음"}</h3>
      <p className="mt-1 text-[10px] text-[#978f84]">{item.model_code ?? "모델코드 없음"}</p>
      <dl className="mt-2.5 space-y-1 text-[10px] leading-4 text-[#6f675e]">
        <div className="flex gap-2"><dt className="w-8 shrink-0 text-[#9a9187]">색상</dt><dd className="flex items-center gap-1.5">{item.color_hex?.split(", ").map((hex) => <span key={hex} className="size-3 rounded-full border border-black/10" style={{ background: hex }} />)}{item.color ?? "—"}</dd></div>
        <div className="flex gap-2"><dt className="w-8 shrink-0 text-[#9a9187]">규격</dt><dd>{item.spec?.replace(/^사이즈:\s*/, "") ?? "—"}</dd></div>
        <div className="flex gap-2"><dt className="w-8 shrink-0 text-[#9a9187]">소재</dt><dd>{item.material ?? "—"}</dd></div>
      </dl>
      {installs.length > 0 && <div className="mt-3"><p className="text-[9px] font-semibold text-[#93897e]">시공 이미지 {installs.length}장</p><div className="mt-1 flex gap-1">{installs.slice(0, 4).map((src) => <img key={src} src={src} alt="시공 사례" loading="lazy" referrerPolicy="no-referrer" className="aspect-square w-1/4 rounded-md bg-[#efebe5] object-cover" />)}</div></div>}
      {item.missing_fields.length > 0 && <div className="mt-3 flex flex-wrap gap-1">{item.missing_fields.map((field) => <Tag key={field} className="bg-[#f6efe6] text-[#8a6a45]">{FIELD_LABELS[field] ?? field} 없음</Tag>)}</div>}
      <a href={item.detail_url} target="_blank" rel="noreferrer" className="mt-auto inline-flex items-center gap-1 pt-3 text-[10px] font-semibold text-[#6e6255] underline underline-offset-4">원본 페이지 <ExternalLink size={11} /></a>
    </div>
  </article>;
}
