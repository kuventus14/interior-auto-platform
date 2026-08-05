/** Quiet Materiality — 페이지를 넘어 유지되는 모의 프로젝트 상태와 조용한 선택 경험. */

import { DESIGN_CONCEPTS, PROJECTS } from "@/data/mockData";
import type { ProjectDraft } from "@/types/inspira";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

const initialDraft: ProjectDraft = {
  title: "나의 새 프로젝트",
  roomType: "거실",
  area: "34평",
  width: "", depth: "", ceilingHeight: "", keepItems: "기존 창호와 마루", removeItems: "", description: "", styles: ["웜 미니멀"], mood: "차분하고 따뜻한 휴식 공간", avoidColors: "", preferredColors: "아이보리, 라이트 오크", brightness: "밝고 부드럽게", budget: "3,000–4,000만원", brands: [], uploads: [],
};

interface InspiraContextValue {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  favoriteConceptIds: string[];
  favoriteMaterialIds: string[];
  favoriteProjectIds: string[];
  toggleFavorite: (kind: "concept" | "material" | "project", id: string) => void;
  compareIds: string[];
  toggleCompare: (id: string) => void;
  replaceCompare: (oldId: string, newId: string) => void;
  draft: ProjectDraft;
  updateDraft: (patch: Partial<ProjectDraft>) => void;
  resetDraft: () => void;
  createdProjectTitle: string;
  setCreatedProjectTitle: (title: string) => void;
}

const InspiraContext = createContext<InspiraContextValue | null>(null);

export function InspiraProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [favoriteConceptIds, setFavoriteConceptIds] = useState<string[]>(["c-01", "c-04"]);
  const [favoriteMaterialIds, setFavoriteMaterialIds] = useState<string[]>(["m-01", "m-14"]);
  const [favoriteProjectIds, setFavoriteProjectIds] = useState<string[]>(["p-01"]);
  const [compareIds, setCompareIds] = useState<string[]>(["c-01", "c-02", "c-04"]);
  const [draft, setDraft] = useState<ProjectDraft>(initialDraft);
  const [createdProjectTitle, setCreatedProjectTitle] = useState("34평 아파트 거실");

  const toggleFavorite = (kind: "concept" | "material" | "project", id: string) => {
    const setter = kind === "concept" ? setFavoriteConceptIds : kind === "material" ? setFavoriteMaterialIds : setFavoriteProjectIds;
    setter((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const toggleCompare = (id: string) => {
    setCompareIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length >= 3 ? [...current.slice(1), id] : [...current, id]);
  };

  const replaceCompare = (oldId: string, newId: string) => {
    setCompareIds((current) => current.map((item) => item === oldId ? newId : item));
  };

  const value = useMemo(() => ({
    isAuthenticated, setAuthenticated, favoriteConceptIds, favoriteMaterialIds, favoriteProjectIds, toggleFavorite, compareIds, toggleCompare, replaceCompare,
    draft, updateDraft: (patch: Partial<ProjectDraft>) => setDraft((current) => ({ ...current, ...patch })), resetDraft: () => setDraft(initialDraft), createdProjectTitle, setCreatedProjectTitle,
  }), [isAuthenticated, favoriteConceptIds, favoriteMaterialIds, favoriteProjectIds, compareIds, draft, createdProjectTitle]);

  return <InspiraContext.Provider value={value}>{children}</InspiraContext.Provider>;
}

export function useInspira() {
  const context = useContext(InspiraContext);
  if (!context) throw new Error("useInspira must be used within InspiraProvider");
  return context;
}

export const FEATURED_PROJECT = PROJECTS[0];
export const FEATURED_CONCEPTS = DESIGN_CONCEPTS;
