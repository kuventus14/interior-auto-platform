/** Quiet Materiality — INSPIRA의 서비스 로직과 UI를 분리하기 위한 미래 API 친화형 타입. */

export type MaterialCategory =
  | "마루"
  | "도배지"
  | "필름"
  | "타일"
  | "상판"
  | "가구"
  | "조명";

export type ProjectStatus = "시안 완료" | "생성 중" | "초안";

export interface Material {
  id: string;
  category: MaterialCategory;
  brand: string;
  productName: string;
  productCode: string;
  colorFamily: string;
  materialType: string;
  finish: string;
  swatch: string;
  description: string;
  productUrl?: string;
  usageCount: number;
}

export interface MaterialMatch {
  id: string;
  conceptId: string;
  materialId: string;
  similarityScore: number;
  recommendationReason: string;
  applicationArea: string;
}

export interface DesignConcept {
  id: string;
  projectId: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  viewpoints: string[];
  styleTags: string[];
  colorPalette: string[];
  lighting: string;
  score: number;
  priceRange: string;
  createdAt: string;
  materialIds: string[];
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  roomType: string;
  area: string;
  description: string;
  uploadedImages: string[];
  preferredStyles: string[];
  preferredBrands: string[];
  budget: string;
  status: ProjectStatus;
  updatedAt: string;
  conceptIds: string[];
}

export interface Brand {
  id: string;
  name: string;
  headline: string;
  description: string;
  categories: MaterialCategory[];
  materialCount: number;
  color: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
}

export interface ProjectDraft {
  title: string;
  roomType: string;
  area: string;
  width: string;
  depth: string;
  ceilingHeight: string;
  keepItems: string;
  removeItems: string;
  description: string;
  styles: string[];
  mood: string;
  avoidColors: string;
  preferredColors: string;
  brightness: string;
  budget: string;
  brands: string[];
  uploads: string[];
}
