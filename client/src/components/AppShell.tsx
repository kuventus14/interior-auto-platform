/** Quiet Materiality — 와이드 작업 캔버스, 얇은 경계와 모바일 하단 내비게이션을 가진 앱 쉘. */

import { ASSET, NOTIFICATIONS, USER } from "@/data/mockData";
import { useInspira } from "@/contexts/InspiraContext";
import { cn } from "@/lib/utils";
import { Bell, BookOpen, Boxes, Building2, ChevronRight, FolderOpen, Heart, House, LayoutDashboard, LogOut, Menu, Settings, ShieldCheck, Sparkles, UserCircle2, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function AppLogo({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <Link href="/dashboard" className="inline-flex items-center gap-2.5 group" aria-label="INSPIRA 대시보드">
      <span className={cn("grid size-8 place-items-center rounded-[11px] bg-[#1d1c19] shadow-sm", inverse && "bg-white")}>
        <img src={ASSET.logo} alt="" className={cn("size-[21px] object-contain", inverse && "brightness-0")} />
      </span>
      {!compact && <span className={cn("font-display text-[16px] font-semibold tracking-[0.12em]", inverse ? "text-white" : "text-[#201f1c]")}>INSPIRA</span>}
    </Link>
  );
}

const primaryItems = [
  { href: "/dashboard", label: "홈", icon: House },
  { href: "/projects", label: "프로젝트", icon: FolderOpen },
  { href: "/concepts", label: "시안 보기", icon: LayoutDashboard },
  { href: "/materials", label: "자재 라이브러리", icon: Boxes },
  { href: "/brands", label: "브랜드", icon: Building2 },
  { href: "/favorites", label: "즐겨찾기", icon: Heart },
];

const secondaryItems = [
  { href: "/notifications", label: "알림", icon: Bell },
  { href: "/settings", label: "설정", icon: Settings },
];

function isPathActive(path: string, href: string) {
  if (href === "/dashboard") return path === href;
  return path === href || path.startsWith(`${href}/`);
}

function NavItems({ close }: { close?: () => void }) {
  const [location] = useLocation();
  return (
    <nav className="space-y-1" aria-label="주요 메뉴">
      {primaryItems.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} onClick={close} className={cn("sidebar-link", isPathActive(location, href) && "sidebar-link-active")}>
          <Icon size={17} strokeWidth={1.7} /><span>{label}</span>
        </Link>
      ))}
      <div className="my-5 border-t border-[#e9e6e0]" />
      {secondaryItems.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} onClick={close} className={cn("sidebar-link", isPathActive(location, href) && "sidebar-link-active")}>
          <Icon size={17} strokeWidth={1.7} /><span>{label}</span>
          {href === "/notifications" && NOTIFICATIONS.filter((item) => item.unread).length > 0 && <span className="ml-auto size-1.5 rounded-full bg-[#1f1e1a]" />}
        </Link>
      ))}
    </nav>
  );
}

function Sidebar() {
  const { setAuthenticated } = useInspira();
  return (
    <aside className="sticky top-0 hidden h-screen w-[244px] shrink-0 border-r border-[#e7e3dc] bg-white px-4 py-7 lg:flex lg:flex-col">
      <div className="px-3"><AppLogo /></div>
      <p className="mt-1.5 px-3 text-[10px] font-medium tracking-[0.02em] text-[#8b857b]">인테리어, 이 쉽게.</p>
      <div className="mt-9 flex-1"><NavItems /></div>
      <div className="rounded-[18px] border border-[#edeae5] bg-[#fbfaf8] p-2.5">
        <Link href="/profile" className="flex items-center gap-2.5 rounded-xl p-2 transition-colors hover:bg-white">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#d9c6ad] text-sm font-semibold text-[#51463c]">김</span>
          <span className="min-w-0 flex-1"><span className="block truncate text-[12px] font-semibold text-[#292723]">{USER.name}님</span><span className="block text-[10px] text-[#8b857b]">{USER.role}</span></span>
          <ChevronRight size={15} className="text-[#9b958c]" />
        </Link>
        <button onClick={() => setAuthenticated(false)} className="mt-1 flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-[11px] text-[#7c766d] transition-colors hover:bg-white hover:text-[#37332d]">
          <LogOut size={13} /> 로그아웃
        </button>
      </div>
    </aside>
  );
}

function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-[#ebe7e0] bg-[#faf9f7]/90 px-5 backdrop-blur-xl lg:hidden">
      <AppLogo />
      <Sheet>
        <SheetTrigger asChild><Button variant="ghost" size="icon" aria-label="메뉴 열기" className="rounded-full"><Menu size={20} /></Button></SheetTrigger>
        <SheetContent side="left" className="w-[292px] border-[#e6e1da] bg-[#fbfaf8] p-5">
          <SheetHeader className="mb-8"><SheetTitle><AppLogo /></SheetTitle></SheetHeader>
          <NavItems />
        </SheetContent>
      </Sheet>
    </header>
  );
}

function MobileNav() {
  const [location] = useLocation();
  const items = [
    { href: "/dashboard", label: "홈", icon: House }, { href: "/projects", label: "프로젝트", icon: FolderOpen }, { href: "/concepts", label: "시안", icon: Sparkles }, { href: "/materials", label: "자재", icon: Boxes }, { href: "/profile", label: "마이", icon: UserCircle2 },
  ];
  return <nav className="fixed inset-x-0 bottom-0 z-40 flex h-[70px] items-center justify-around border-t border-[#e8e4dc] bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden" aria-label="모바일 주요 메뉴">
    {items.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={cn("flex min-w-0 flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium text-[#8a847a]", isPathActive(location, href) && "text-[#1d1c19]")}><Icon size={18} strokeWidth={isPathActive(location, href) ? 2.1 : 1.7} /><span>{label}</span></Link>)}
  </nav>;
}

export function AppShell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className="min-h-screen bg-[#f8f7f4] text-[#272520]"><Sidebar /><div className="min-w-0 flex-1"><MobileHeader /><main className={cn("min-h-screen px-4 pb-24 pt-5 sm:px-6 sm:pt-7 lg:px-10 lg:pb-10 lg:pt-9 xl:px-12", className)}>{children}</main></div><MobileNav /></div>;
}

export function UtilityPage({ title, description, icon: Icon }: { title: string; description: string; icon: typeof Bell }) {
  return <AppShell><div className="mx-auto flex max-w-[720px] flex-col items-center py-24 text-center"><span className="grid size-14 place-items-center rounded-2xl bg-[#ebe3d6] text-[#372e25]"><Icon size={25} strokeWidth={1.5} /></span><h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">{title}</h1><p className="mt-3 max-w-md text-sm leading-7 text-[#756f66]">{description}</p><Link href="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#1e1d1a] px-4 py-3 text-sm font-medium text-white transition-transform active:scale-[.97]"><House size={16} /> 홈으로 돌아가기</Link></div></AppShell>;
}
