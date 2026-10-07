"""LX Z:IN 제품 정보 샘플 크롤러.

- requests + BeautifulSoup만 사용한다. 대상 페이지는 Nuxt 2 SSR이라 제품 데이터가
  HTML 안의 window.__NUXT__ 에 포함되어 있어 브라우저 렌더링이 필요 없다.
- robots.txt를 확인하고, 요청은 순차 실행 + 최소 간격(기본 2초)을 둔다.
- 429는 Retry-After(없으면 60초)만큼 대기 후 재시도, 401/403 등 접근 차단은 우회하지 않고 중단한다.
- 이미지 파일은 다운로드하지 않고 절대 URL만 수집한다.

사용 예:
    python crawler/lxzin_crawler.py --limit 10
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.robotparser import RobotFileParser

import requests
from bs4 import BeautifulSoup

sys.path.insert(0, str(Path(__file__).resolve().parent))
from nuxt_state import parse_nuxt_state  # noqa: E402

SITE = "https://www.lxzin.com"
IMG_BASE = "https://octapi.lxzin.com/"  # prdInfo.mainImgFilePath 에서 확인된 이미지 호스트
DEFAULT_CATEGORY_URL = f"{SITE}/zin/category/a070000?mcate=a070100"
USER_AGENT = "Mozilla/5.0 (compatible; InspiraMaterialCollector/0.1; sample-validation)"
KST = timezone(timedelta(hours=9))
PRODUCT_PATH = re.compile(r"^/zin/product/\d+/?$")

MANUFACTURER = "LX하우시스"
BRAND = "LX Z:IN"

# 이미지 분류 근거로 인정하는 키워드 (ALT/설명 문구 기준). 매칭이 없으면 미분류.
PATTERN_KEYWORDS = ("패턴", "텍스처", "텍스쳐", "무늬", "스와치", "칩")
CONSTRUCTION_KEYWORDS = ("시공", "룸셋", "연출", "적용 사례", "인테리어 사례")

FIELDS = [
    "manufacturer",
    "brand",
    "material_category",
    "product_series",
    "product_subcategory",
    "product_name",
    "model_code",
    "color",
    "color_hex",
    "spec",
    "material",
    "pattern_image_urls",
    "construction_image_urls",
    "unclassified_image_urls",
    "video_urls",
    "construction_case_urls",
    "detail_url",
    "collected_at",
    "missing_fields",
]
# 누락 검사 대상(요청 항목)
REQUIRED_FIELDS = [
    "material_category",
    "product_series",
    "product_name",
    "model_code",
    "color",
    "spec",
    "material",
    "pattern_image_urls",
    "construction_image_urls",
]


class AccessBlocked(RuntimeError):
    """접근 차단 응답. 우회하지 않고 수집을 중단한다."""


class PoliteSession:
    def __init__(self, delay: float, max_429_retries: int = 3):
        self.s = requests.Session()
        self.s.headers.update({"User-Agent": USER_AGENT, "Accept-Language": "ko-KR,ko;q=0.9"})
        self.delay = delay
        self.max_429_retries = max_429_retries
        self._last = 0.0
        self.robots = RobotFileParser()
        self.request_count = 0

    def _wait(self) -> None:
        gap = time.monotonic() - self._last
        if gap < self.delay:
            time.sleep(self.delay - gap)

    def load_robots(self) -> None:
        self._wait()
        r = self.s.get(f"{SITE}/robots.txt", timeout=20)
        self._last = time.monotonic()
        self.request_count += 1
        self.robots.parse(r.text.splitlines() if r.ok else [])
        log(f"robots.txt {r.status_code} 로드")

    def get(self, url: str) -> str:
        if not self.robots.can_fetch(USER_AGENT, url):
            raise AccessBlocked(f"robots.txt 에서 허용되지 않은 URL: {url}")
        for attempt in range(self.max_429_retries + 1):
            self._wait()
            r = self.s.get(url, timeout=30)
            self._last = time.monotonic()
            self.request_count += 1
            log(f"GET {r.status_code} {url}")
            if r.status_code == 429:
                wait = _retry_after(r.headers.get("Retry-After"), default=60.0)
                if attempt >= self.max_429_retries:
                    raise AccessBlocked(f"429 반복 — 수집 중단: {url}")
                log(f"429 수신 — {wait:.0f}초 대기 후 재시도 ({attempt + 1}/{self.max_429_retries})")
                time.sleep(wait)
                continue
            if r.status_code in (401, 403, 451):
                raise AccessBlocked(f"접근 차단 응답 {r.status_code} — 우회하지 않고 중단: {url}")
            r.raise_for_status()
            r.encoding = r.encoding if r.encoding and r.encoding.lower() != "iso-8859-1" else "utf-8"
            return r.text
        raise AccessBlocked(url)


def _retry_after(value: str | None, default: float) -> float:
    if not value:
        return default
    try:
        return max(float(value), 1.0)
    except ValueError:
        return default


def log(msg: str) -> None:
    print(f"[{datetime.now(KST):%H:%M:%S}] {msg}", file=sys.stderr, flush=True)


def abs_img(path: str | None) -> str | None:
    if not path:
        return None
    return path if urlparse(path).scheme else urljoin(IMG_BASE, path.lstrip("/"))


def _clean(v):
    if isinstance(v, str):
        v = re.sub(r"\s+", " ", v).strip()
        return v or None
    return v


# ---------------------------------------------------------------- list page
def parse_list(html: str, base_url: str) -> list[dict]:
    soup = BeautifulSoup(html, "lxml")
    items: list[dict] = []
    seen: set[str] = set()
    for a in soup.select("a.list_item_body[href*='/zin/product/']"):
        url = urljoin(base_url, a["href"]).split("?")[0]
        if url in seen:
            continue
        seen.add(url)
        code = a.select_one("p.code")
        items.append({"detail_url": url, "model_code": _clean(code.get_text()) if code else None})
    if not items:  # 카드 마크업이 바뀐 경우 대비: 모든 제품 링크
        for a in soup.select("a[href*='/zin/product/']"):
            url = urljoin(base_url, a["href"]).split("?")[0]
            if url not in seen:
                seen.add(url)
                items.append({"detail_url": url, "model_code": None})
    return items


# -------------------------------------------------------------- detail page
def classify_image(text: str | None) -> str:
    t = text or ""
    if any(k in t for k in PATTERN_KEYWORDS):
        return "pattern"
    if any(k in t for k in CONSTRUCTION_KEYWORDS):
        return "construction"
    return "unclassified"


def parse_detail(html: str, url: str) -> dict:
    state = parse_nuxt_state(html)
    info = None
    if state:
        for d in state.get("data") or []:
            if isinstance(d, dict) and isinstance(d.get("prdInfo"), dict):
                info = d["prdInfo"]
                break
    rec = parse_detail_from_state(info) if info else parse_detail_from_dom(html)
    rec["detail_url"] = url
    return rec


def parse_detail_from_state(p: dict) -> dict:
    specs = [s for s in p.get("specList") or [] if s.get("SPEC_TEXT")]
    spec_items = [f"{_clean(s.get('SPEC_TITLE'))}: {_clean(s.get('SPEC_TEXT'))}" for s in specs]
    material = [
        _clean(s["SPEC_TEXT"]) for s in specs if re.search(r"소재|재질|원재료", s.get("SPEC_TITLE") or "")
    ]
    colors = [f for f in p.get("filterList") or [] if (f.get("DISPLAY_NM") or "").strip() == "색상"]

    pattern, construction, unclassified, videos = [], [], [], []
    for m in p.get("imgVdoList") or []:
        url = abs_img(m.get("FILE_PATH")) or m.get("URL")
        if not url:
            continue
        if m.get("TP") == "02":  # 영상 (썸네일 THUMB 별도)
            videos.append(url)
            continue
        bucket = classify_image(" ".join(filter(None, [m.get("ALT"), m.get("DSC")])))
        {"pattern": pattern, "construction": construction, "unclassified": unclassified}[bucket].append(url)

    # '제품 시공사례' 섹션: 사이트가 이 제품이 사용된 시공사례로 연결한 목록.
    # (샘플 확인: 시공사례 상세 이미지에 해당 제품 핀(/zin/product/{id})이 걸려 있음)
    cases = p.get("prdUsedInteriorList") or []
    for c in cases:
        u = abs_img(c.get("H_IMG")) or abs_img(c.get("V_IMG"))
        if u:
            construction.append(u)
    case_urls = [urljoin(SITE, c["link"]) for c in cases if c.get("link")]

    return {
        "material_category": _clean(p.get("DEPTH1_CATE_NAME")),
        "product_series": _clean(p.get("DEPTH2_CATE_NAME")),
        "product_subcategory": _clean(p.get("CATE_NAME")),
        "product_name": _clean(p.get("ZIN_PRD_NAME")),
        "model_code": _clean(p.get("ZIN_PRD_NO")),
        "color": ", ".join(_clean(c["FILTER_DTL_NM"]) for c in colors if c.get("FILTER_DTL_NM")) or None,
        "color_hex": ", ".join(c["RGB"] for c in colors if c.get("RGB")) or None,
        "spec": " / ".join(spec_items) or None,
        "material": ", ".join(material) or None,
        "pattern_image_urls": _dedupe(pattern),
        "construction_image_urls": _dedupe(construction),
        "unclassified_image_urls": _dedupe(unclassified),
        "video_urls": _dedupe(videos),
        "construction_case_urls": _dedupe(case_urls),
        "_site_product_id": p.get("ZIN_PRD_ID"),
    }


def parse_detail_from_dom(html: str) -> dict:
    """Nuxt 상태가 없을 때의 대체 경로: 화면에 렌더링된 값만 사용."""
    soup = BeautifulSoup(html, "lxml")
    opts = {}
    for item in soup.select(".product_option_info .product_option_item"):
        t = item.select_one(".option_title")
        v = item.select_one(".option_info_area")
        if t and v:
            opts[_clean(t.get_text())] = _clean(v.get_text(" "))
    crumbs = [_clean(s.get_text()) for s in soup.select(".breadcrumb_list span")]
    h1 = soup.select_one(".product_ttl h1")
    imgs = [abs_img(i.get("src")) for i in soup.select(".product-info-wrap .main-thumb img")]
    return {
        "material_category": crumbs[1] if len(crumbs) > 1 else None,
        "product_series": crumbs[2] if len(crumbs) > 2 else None,
        "product_subcategory": crumbs[3] if len(crumbs) > 3 else None,
        "product_name": _clean(h1.get_text()) if h1 else None,
        "model_code": opts.get("제품코드"),
        "color": opts.get("색상"),
        "color_hex": None,
        "spec": f"사이즈: {opts['사이즈']}" if opts.get("사이즈") else None,
        "material": opts.get("소재") or opts.get("재질"),
        "pattern_image_urls": [],
        "construction_image_urls": [],
        "unclassified_image_urls": _dedupe([i for i in imgs if i]),
        "video_urls": [],
        "construction_case_urls": [],
    }


def _dedupe(seq):
    return list(dict.fromkeys(seq))


# ------------------------------------------------------------------- main
def finalize(rec: dict) -> dict:
    out = {
        "manufacturer": MANUFACTURER,
        "brand": BRAND,
        **{k: rec.get(k) for k in FIELDS if k not in ("manufacturer", "brand")},
    }
    for k in ("pattern_image_urls", "construction_image_urls", "unclassified_image_urls",
              "video_urls", "construction_case_urls"):
        out[k] = out[k] or None  # 빈 목록은 null
    out["collected_at"] = datetime.now(KST).isoformat(timespec="seconds")
    out["missing_fields"] = [k for k in REQUIRED_FIELDS if out.get(k) in (None, "", [])]
    return out


def write_outputs(rows: list[dict], out_dir: Path, stem: str) -> tuple[Path, Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    jp, cp = out_dir / f"{stem}.json", out_dir / f"{stem}.csv"
    jp.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")
    with cp.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        for r in rows:
            w.writerow({k: (" | ".join(v) if isinstance(v, list) else v) for k, v in r.items()})
    return jp, cp


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="LX Z:IN 제품 정보 샘플 수집")
    ap.add_argument("--category-url", default=DEFAULT_CATEGORY_URL)
    ap.add_argument("--limit", type=int, default=10)
    ap.add_argument("--delay", type=float, default=2.0, help="요청 간 최소 간격(초), 2초 미만 불가")
    ap.add_argument("--out-dir", default=str(Path(__file__).resolve().parent.parent / "data"))
    ap.add_argument("--stem", default="lxzin_sample")
    ap.add_argument("--stdout", action="store_true", help="파일 저장 대신 결과 JSON을 표준출력으로 내보냄")
    args = ap.parse_args(argv)
    delay = max(args.delay, 2.0)
    for stream in (sys.stdout, sys.stderr):  # Windows 콘솔/파이프에서도 한글 깨짐 방지
        stream.reconfigure(encoding="utf-8")

    host = urlparse(args.category_url).hostname or ""
    if host not in ("www.lxzin.com", "lxzin.com"):
        log(f"지원하지 않는 사이트: {host or args.category_url}")
        return 2

    sess = PoliteSession(delay)
    rows: list[dict] = []
    try:
        sess.load_robots()
        if PRODUCT_PATH.search(urlparse(args.category_url).path):
            # 제품 상세 URL이 직접 들어온 경우: 그 제품 하나만 수집
            listing = [{"detail_url": urljoin(SITE, urlparse(args.category_url).path), "model_code": None}]
        else:
            listing = parse_list(sess.get(args.category_url), args.category_url)
            log(f"목록에서 제품 링크 {len(listing)}개 발견")

        seen_urls, seen_codes = set(), set()
        for item in listing:
            if len(rows) >= args.limit:
                break
            url, code = item["detail_url"], item["model_code"]
            if url in seen_urls or (code and code in seen_codes):
                log(f"중복 건너뜀: {code} {url}")
                continue
            rec = finalize(parse_detail(sess.get(url), url))
            seen_urls.add(url)
            if rec["model_code"] and rec["model_code"] in seen_codes:
                log(f"중복 모델코드 건너뜀: {rec['model_code']} {url}")
                continue
            if rec["model_code"]:
                seen_codes.add(rec["model_code"])
            rows.append(rec)
            log(f"수집 {len(rows)}/{args.limit}: {rec['model_code']} {rec['product_name']}"
                f" | 누락: {', '.join(rec['missing_fields']) or '없음'}")
    except AccessBlocked as e:
        log(f"중단: {e}")
    finally:
        if args.stdout:
            sys.stdout.write(json.dumps(rows, ensure_ascii=False))
            sys.stdout.flush()
        elif rows:
            jp, cp = write_outputs(rows, Path(args.out_dir), args.stem)
            log(f"저장: {jp} / {cp} ({len(rows)}건, 요청 {sess.request_count}회)")
    return 0 if rows else 1


if __name__ == "__main__":
    raise SystemExit(main())
