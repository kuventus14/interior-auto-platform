/** Quiet Materiality — INSPIRA의 모든 화면이 공유하는 API 교체 가능 Mock Data. */

import type { Brand, DesignConcept, Material, MaterialMatch, NotificationItem, Project, UserProfile } from "@/types/inspira";

export const ASSET = {
  logo: "/manus-storage/inspira-symbol_14539640.png",
  living: "/manus-storage/inspira-hero-living-room_9e738d27.jpg",
  luxury: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
  bedroom: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85",
  study: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
  homeCafe: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85",
  gallery: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
} as const;

export const USER: UserProfile = {
  id: "user-01",
  name: "김인스",
  role: "프로 계정",
  email: "inspira@example.com",
};

export const STYLE_OPTIONS = [
  "웜 미니멀",
  "모던 럭셔리",
  "내추럴",
  "호텔 스타일",
  "소프트 베이지",
  "웜 그레이",
  "재팬디",
  "미드센추리 모던",
  "컨템포러리",
  "클래식 모던",
];

export const BRAND_OPTIONS = ["LX하우시스", "동화자연마루", "KCC", "현대L&C", "영림", "한샘", "리바트", "브랜드 상관없음"];

export const MATERIALS: Material[] = [
  { id: "m-01", category: "마루", brand: "동화자연마루", productName: "나투스진 그란데 라이트 오크", productCode: "MOCK-DW-6091", colorFamily: "라이트 오크", materialType: "강마루", finish: "무광", swatch: "linear-gradient(135deg,#d8b985,#b98751)", description: "밝은 오크 결이 자연광과 부드럽게 이어지는 바닥재입니다.", usageCount: 48 },
  { id: "m-02", category: "마루", brand: "LX하우시스", productName: "지아마루 내추럴 베이지", productCode: "MOCK-LX-8241", colorFamily: "내추럴 베이지", materialType: "강마루", finish: "저광", swatch: "linear-gradient(135deg,#c9a770,#987041)", description: "차분한 베이지 톤의 넓은 판형 마루입니다.", usageCount: 36 },
  { id: "m-03", category: "마루", brand: "KCC", productName: "숲 강마루 오크 모던", productCode: "MOCK-KC-9024", colorFamily: "오크", materialType: "강마루", finish: "매트", swatch: "linear-gradient(135deg,#b99361,#79542f)", description: "우드톤의 깊이를 안정적으로 잡아주는 마루입니다.", usageCount: 29 },
  { id: "m-04", category: "도배지", brand: "LX하우시스", productName: "디아망 에센스 웜 아이보리", productCode: "MOCK-LX-EW129", colorFamily: "웜 아이보리", materialType: "실크벽지", finish: "텍스처", swatch: "linear-gradient(135deg,#f2eee5,#ddd5c7)", description: "부드러운 결감으로 빛을 고르게 받아들이는 벽지입니다.", usageCount: 51 },
  { id: "m-05", category: "도배지", brand: "신한벽지", productName: "리브레 린넨 베이지", productCode: "MOCK-SH-2218", colorFamily: "린넨 베이지", materialType: "합지벽지", finish: "리넨 질감", swatch: "repeating-linear-gradient(90deg,#ddd2c0 0 2px,#e9e0d1 2px 5px)", description: "리넨의 결을 닮은 은은한 베이지 표면입니다.", usageCount: 33 },
  { id: "m-06", category: "도배지", brand: "KCC", productName: "센스 오프화이트", productCode: "MOCK-KC-4103", colorFamily: "오프화이트", materialType: "실크벽지", finish: "매트", swatch: "linear-gradient(135deg,#f7f5ef,#ebe6db)", description: "어떤 가구와도 자연스럽게 어우러지는 기본 벽지입니다.", usageCount: 27 },
  { id: "m-07", category: "필름", brand: "LX하우시스", productName: "인테리어필름 스톤 그레이", productCode: "MOCK-LX-EW123", colorFamily: "스톤 그레이", materialType: "인테리어 필름", finish: "무광", swatch: "linear-gradient(135deg,#aa9f92,#7a7067)", description: "TV 벽과 도어 프레임에 깊이를 주는 웜 그레이 필름입니다.", usageCount: 19 },
  { id: "m-08", category: "필름", brand: "현대L&C", productName: "보닥 레이어드 오크", productCode: "MOCK-HL-7709", colorFamily: "샌드 오크", materialType: "인테리어 필름", finish: "우드 엠보", swatch: "linear-gradient(135deg,#d2ae78,#a36f3f)", description: "공간의 수직 면에 따뜻한 나뭇결을 더합니다.", usageCount: 26 },
  { id: "m-09", category: "필름", brand: "영림", productName: "에코필름 크림 스톤", productCode: "MOCK-YL-3308", colorFamily: "크림 스톤", materialType: "인테리어 필름", finish: "소프트 매트", swatch: "linear-gradient(135deg,#ddd5c7,#bfb5a4)", description: "돌처럼 고요한 표면감의 크림 계열 필름입니다.", usageCount: 17 },
  { id: "m-10", category: "타일", brand: "윤현상재", productName: "라임스톤 샌드 600", productCode: "MOCK-YH-600S", colorFamily: "샌드", materialType: "포세린 타일", finish: "혼드", swatch: "linear-gradient(135deg,#d7cdbb,#a99b86)", description: "현관이나 주방에 질감 있는 무게감을 만드는 타일입니다.", usageCount: 14 },
  { id: "m-11", category: "타일", brand: "대동타일", productName: "모노 웜그레이 300", productCode: "MOCK-DD-303W", colorFamily: "웜 그레이", materialType: "세라믹 타일", finish: "매트", swatch: "linear-gradient(135deg,#c9c3b9,#938d83)", description: "은은한 웜 그레이가 공간의 온도를 유지합니다.", usageCount: 12 },
  { id: "m-12", category: "상판", brand: "현대L&C", productName: "하넥스 크림 베인", productCode: "MOCK-HN-2102", colorFamily: "크림", materialType: "인조대리석", finish: "새틴", swatch: "linear-gradient(135deg,#f4efe6,#d2c7b7)", description: "가벼운 베인으로 주방에 정제된 인상을 줍니다.", usageCount: 21 },
  { id: "m-13", category: "상판", brand: "LX하우시스", productName: "비아테라 샌드 린넨", productCode: "MOCK-LX-V817", colorFamily: "샌드 베이지", materialType: "엔지니어드 스톤", finish: "혼드", swatch: "linear-gradient(135deg,#dfd1bb,#b9a383)", description: "따뜻한 석재감을 담은 주방·테이블 상판입니다.", usageCount: 18 },
  { id: "m-14", category: "가구", brand: "한샘", productName: "오브 소파 503", productCode: "MOCK-HS-0503", colorFamily: "아이보리", materialType: "패브릭 소파", finish: "부클", swatch: "linear-gradient(135deg,#ede7db,#c9c0b0)", description: "낮고 넓은 실루엣이 미니멀한 거실을 완성합니다.", usageCount: 63 },
  { id: "m-15", category: "가구", brand: "리바트", productName: "무드 로우 테이블", productCode: "MOCK-LV-1120", colorFamily: "라이트 오크", materialType: "원목 테이블", finish: "오일", swatch: "linear-gradient(135deg,#d7ae71,#9c6e3c)", description: "시선 높이를 낮추어 여유로운 라운지를 만듭니다.", usageCount: 41 },
  { id: "m-16", category: "가구", brand: "일룸", productName: "플랫 라운지 체어", productCode: "MOCK-IL-1807", colorFamily: "웜 토프", materialType: "패브릭 체어", finish: "텍스처", swatch: "linear-gradient(135deg,#b9ab9b,#827466)", description: "소프트한 질감으로 침실이나 서재에 균형을 줍니다.", usageCount: 22 },
  { id: "m-17", category: "조명", brand: "루이스폴센", productName: "리니어 펜던트 2700K", productCode: "MOCK-LP-2700", colorFamily: "매트 블랙", materialType: "펜던트 조명", finish: "파우더 코팅", swatch: "linear-gradient(135deg,#4d4a45,#1f1d1a)", description: "식탁 위에 절제된 선형 포인트를 더하는 조명입니다.", usageCount: 25 },
  { id: "m-18", category: "조명", brand: "한샘", productName: "코브 라인 간접등", productCode: "MOCK-HS-L912", colorFamily: "웜 화이트", materialType: "간접 조명", finish: "매립형", swatch: "linear-gradient(135deg,#fff7d8,#d7bd7f)", description: "천장 면을 부드럽게 띄워 공간을 넓어 보이게 합니다.", usageCount: 57 },
  { id: "m-19", category: "조명", brand: "아르떼미데", productName: "오브 월 램프", productCode: "MOCK-AR-381", colorFamily: "샌드", materialType: "벽등", finish: "유리", swatch: "radial-gradient(circle at 35% 35%,#fff8df,#c9ae75 70%)", description: "침실 벽면에 따뜻한 빛의 레이어를 더하는 벽등입니다.", usageCount: 13 },
  { id: "m-20", category: "마루", brand: "구정마루", productName: "프리미엄 티크 내추럴", productCode: "MOCK-GJ-5910", colorFamily: "내추럴 브라운", materialType: "원목마루", finish: "브러시드", swatch: "linear-gradient(135deg,#b07b45,#71451f)", description: "밀도 높은 우드 결로 무게감 있는 공간을 만듭니다.", usageCount: 11 },
  { id: "m-21", category: "도배지", brand: "개나리벽지", productName: "모멘트 토프", productCode: "MOCK-GN-0907", colorFamily: "토프", materialType: "실크벽지", finish: "파우더", swatch: "linear-gradient(135deg,#c6b8a8,#9c8f82)", description: "조용한 톤온톤 인테리어를 위한 벽지입니다.", usageCount: 15 },
  { id: "m-22", category: "필름", brand: "현대L&C", productName: "보닥 클라우드 화이트", productCode: "MOCK-HL-1112", colorFamily: "클라우드 화이트", materialType: "인테리어 필름", finish: "소프트", swatch: "linear-gradient(135deg,#fbfaf6,#dedbd3)", description: "수납장과 도어를 가볍게 정리하는 밝은 필름입니다.", usageCount: 24 },
  { id: "m-23", category: "가구", brand: "무인양품", productName: "오크 수납 벤치", productCode: "MOCK-MJ-4821", colorFamily: "화이트 오크", materialType: "원목 수납가구", finish: "무광", swatch: "linear-gradient(135deg,#ddc59e,#b18c5d)", description: "현관이나 거실에 자연스러운 정리감을 더하는 벤치입니다.", usageCount: 16 },
  { id: "m-24", category: "조명", brand: "PH", productName: "소프트 글로브 스탠드", productCode: "MOCK-PH-6018", colorFamily: "오팔 화이트", materialType: "플로어 램프", finish: "오팔 글라스", swatch: "radial-gradient(circle at 35% 35%,#ffffff,#d8d4cb 72%)", description: "코너에 낮은 밝기의 휴식감을 더하는 스탠드입니다.", usageCount: 20 },
];

export const DESIGN_CONCEPTS: DesignConcept[] = [
  { id: "c-01", projectId: "p-01", title: "웜 미니멀", subtitle: "마룻결과 자연광의 온도", description: "밝은 오크와 아이보리 패브릭을 중심으로, 공간 본연의 여백을 살린 가장 편안한 방향입니다.", imageUrl: ASSET.living, viewpoints: [ASSET.living, ASSET.luxury, ASSET.bedroom, ASSET.study], styleTags: ["따뜻한 느낌", "모던", "우드톤"], colorPalette: ["#E8DDCC", "#D3B88A", "#F6F2EA"], lighting: "2700K 코브 간접조명", score: 96, priceRange: "2,800–3,600만원", createdAt: "2026.08.05", materialIds: ["m-01", "m-04", "m-08", "m-14", "m-18"] },
  { id: "c-02", projectId: "p-01", title: "모던 럭셔리", subtitle: "짙은 선과 밝은 석재의 균형", description: "웜 뉴트럴 바탕 위에 매트 블랙 조명과 월넛을 절제해 밀도 있는 라운지로 구성했습니다.", imageUrl: ASSET.luxury, viewpoints: [ASSET.luxury, ASSET.living, ASSET.study, ASSET.bedroom], styleTags: ["모던", "월넛", "스톤"], colorPalette: ["#332E29", "#D7CBB9", "#A17047"], lighting: "2700K 라인 펜던트", score: 91, priceRange: "3,400–4,300만원", createdAt: "2026.08.05", materialIds: ["m-03", "m-07", "m-12", "m-15", "m-17"] },
  { id: "c-03", projectId: "p-01", title: "내추럴 호텔", subtitle: "머무는 시간을 부드럽게", description: "리넨·라임워시·낮은 가구를 조합해 집 안에 고요한 호텔 스위트의 밀도를 더했습니다.", imageUrl: ASSET.bedroom, viewpoints: [ASSET.bedroom, ASSET.living, ASSET.study, ASSET.luxury], styleTags: ["내추럴", "호텔", "리넨"], colorPalette: ["#EFE7DA", "#C9B296", "#D8D0C4"], lighting: "2700K 벽면 조명", score: 89, priceRange: "3,100–3,900만원", createdAt: "2026.08.05", materialIds: ["m-02", "m-05", "m-09", "m-16", "m-19"] },
  { id: "c-04", projectId: "p-01", title: "소프트 베이지", subtitle: "톤온톤으로 완성한 라운지", description: "피부에 닿는 소재의 온도를 닮은 베이지 레이어로, 거실을 가장 부드럽고 넓게 보이도록 제안합니다.", imageUrl: ASSET.gallery, viewpoints: [ASSET.gallery, ASSET.living, ASSET.bedroom, ASSET.luxury], styleTags: ["소프트 베이지", "밝은 공간", "패브릭"], colorPalette: ["#F1E8DA", "#D9C9B3", "#F8F5EF"], lighting: "3000K 천장 간접조명", score: 94, priceRange: "2,700–3,400만원", createdAt: "2026.08.05", materialIds: ["m-01", "m-06", "m-13", "m-14", "m-24"] },
  { id: "c-05", projectId: "p-01", title: "웜 그레이 컨템포러리", subtitle: "구조적이면서 온화한 장면", description: "웜 그레이 빌트인과 라이트 오크를 기준으로, 선이 정돈된 도시형 주거 공간을 만듭니다.", imageUrl: ASSET.study, viewpoints: [ASSET.study, ASSET.living, ASSET.luxury, ASSET.bedroom], styleTags: ["웜 그레이", "컨템포러리", "빌트인"], colorPalette: ["#A99E92", "#DCCDAE", "#53504B"], lighting: "3000K 매입 간접조명", score: 87, priceRange: "3,000–3,800만원", createdAt: "2026.08.05", materialIds: ["m-20", "m-21", "m-07", "m-23", "m-18"] },
];

export const PROJECTS: Project[] = [
  { id: "p-01", userId: USER.id, title: "34평 아파트 거실", roomType: "거실", area: "34평", description: "큰 창과 기존 마루를 유지하는 가족 거실", uploadedImages: [ASSET.living], preferredStyles: ["웜 미니멀", "소프트 베이지"], preferredBrands: ["동화자연마루", "LX하우시스"], budget: "3,000–4,000만원", status: "시안 완료", updatedAt: "2026.08.05", conceptIds: ["c-01", "c-02", "c-03", "c-04", "c-05"] },
  { id: "p-02", userId: USER.id, title: "30평 아파트 전체", roomType: "전체 공간", area: "30평", description: "오래된 아파트의 따뜻한 전체 리노베이션", uploadedImages: [ASSET.gallery], preferredStyles: ["내추럴", "호텔 스타일"], preferredBrands: ["한샘"], budget: "5,000–6,000만원", status: "시안 완료", updatedAt: "2026.07.28", conceptIds: ["c-03", "c-04", "c-01", "c-02", "c-05"] },
  { id: "p-03", userId: USER.id, title: "홈카페 인테리어", roomType: "상업공간", area: "18평", description: "낮에는 카페, 밤에는 작은 모임을 위한 공간", uploadedImages: [ASSET.homeCafe], preferredStyles: ["모던 럭셔리"], preferredBrands: ["현대L&C", "영림"], budget: "2,000–3,000만원", status: "시안 완료", updatedAt: "2026.07.15", conceptIds: ["c-02", "c-05", "c-03", "c-01", "c-04"] },
  { id: "p-04", userId: USER.id, title: "신혼집 안방", roomType: "침실", area: "12평", description: "차분한 아침과 휴식을 위한 안방", uploadedImages: [ASSET.bedroom], preferredStyles: ["내추럴", "웜 그레이"], preferredBrands: ["리바트", "한샘"], budget: "1,500–2,000만원", status: "초안", updatedAt: "2026.07.09", conceptIds: ["c-03", "c-05", "c-04", "c-01", "c-02"] },
];

export const MATERIAL_MATCHES: MaterialMatch[] = DESIGN_CONCEPTS.flatMap((concept) =>
  concept.materialIds.map((materialId, index) => ({
    id: `${concept.id}-${materialId}`,
    conceptId: concept.id,
    materialId,
    similarityScore: 97 - index * 3,
    recommendationReason: index === 0 ? "공간의 가장 넓은 면적에서 이미지 속 밝기와 결감을 자연스럽게 재현합니다." : "시안의 색온도와 질감을 보완해 전체 톤의 균형을 유지합니다.",
    applicationArea: ["바닥", "벽면", "TV 월", "가구", "조명"][index] ?? "마감",
  })),
);

export const BRANDS: Brand[] = [
  { id: "b-01", name: "동화자연마루", headline: "자연스러운 결이 남기는 생활의 온도", description: "주거 공간을 중심으로 차분한 오크와 뉴트럴 마루를 제안합니다.", categories: ["마루"], materialCount: 42, color: "#B38A59" },
  { id: "b-02", name: "LX하우시스", headline: "공간을 연결하는 표면의 언어", description: "마루, 벽지, 필름과 상판을 통합적으로 제안하는 인테리어 소재 브랜드입니다.", categories: ["마루", "도배지", "필름", "상판"], materialCount: 58, color: "#D7C4A5" },
  { id: "b-03", name: "KCC", headline: "일상에 오래 남는 재료의 기준", description: "차분한 표면과 균형 잡힌 색으로 다양한 주거 공간을 설계합니다.", categories: ["마루", "도배지"], materialCount: 31, color: "#7A746A" },
  { id: "b-04", name: "현대L&C", headline: "기능을 넘어 공간의 표정을 만드는 마감", description: "도어와 벽면을 위한 필름, 상판, 타일의 섬세한 조합을 제안합니다.", categories: ["필름", "상판", "타일"], materialCount: 37, color: "#C69D71" },
  { id: "b-05", name: "영림", headline: "정돈된 선으로 채우는 실내", description: "도어와 필름을 중심으로 미니멀한 실내의 구조를 완성합니다.", categories: ["필름"], materialCount: 26, color: "#AEA49A" },
  { id: "b-06", name: "한샘", headline: "생활을 닮은 가구와 조명", description: "공간을 사용하는 사람의 동선에 맞춘 가구와 라이팅을 제안합니다.", categories: ["가구", "조명"], materialCount: 45, color: "#A67855" },
];

export const NOTIFICATIONS: NotificationItem[] = [
  { id: "n-01", title: "34평 아파트 거실 시안이 완성되었어요.", detail: "새로운 5개 시안을 확인해 보세요.", time: "방금", unread: true },
  { id: "n-02", title: "즐겨찾기한 자재의 유사 제품이 추가되었어요.", detail: "라이트 오크 계열 마루 4개를 확인할 수 있습니다.", time: "어제", unread: true },
  { id: "n-03", title: "홈카페 인테리어 프로젝트가 저장되었어요.", detail: "언제든 이어서 수정할 수 있습니다.", time: "7월 15일", unread: false },
];
