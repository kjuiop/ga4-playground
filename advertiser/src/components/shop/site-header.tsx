"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth/session-store";

const NAV = ["NEW", "아우터", "니트", "팬츠", "가방", "슈즈"];

export function SiteHeader({ site, brand }: { site: string; brand: string }) {
  const { status, account } = useSession();

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="bg-neutral-900 py-1.5 text-center text-xs tracking-wide text-white">
        신규 회원 첫 구매 10% 할인 · 5만원 이상 무료배송
      </div>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href={`/${site}`} className="text-lg font-semibold tracking-[0.3em]">
          {brand}
        </Link>
        <nav className="hidden gap-6 text-sm text-neutral-600 md:flex">
          {NAV.map((item) => (
            <Link key={item} href={`/${site}`} className="hover:text-neutral-900">
              {item}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-sm">
          {status === "ready" &&
            (account ? (
              <Link href={`/${site}/member/login`} className="text-neutral-600 hover:text-neutral-900">
                {account.loginId}님
              </Link>
            ) : (
              <Link href={`/${site}/member/login`} className="text-neutral-600 hover:text-neutral-900">
                로그인
              </Link>
            ))}
          <span aria-label="장바구니" className="relative text-neutral-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 7h12l-1 13H7L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
          </span>
        </div>
      </div>
    </header>
  );
}
