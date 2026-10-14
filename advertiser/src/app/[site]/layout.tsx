import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GaProvider } from "@/components/analytics/ga-provider";
import { SessionHydrator } from "@/components/analytics/session-hydrator";
import { DebugPanel } from "@/components/debug/debug-panel";
import { SiteFooter } from "@/components/shop/site-footer";
import { SiteHeader } from "@/components/shop/site-header";
import { getCurrentAccount } from "@/lib/auth/session";
import { siteRepository } from "@/lib/site/env-site-repository";
import type { SiteConfig } from "@/lib/site/types";

/** 등록된 사이트는 빌드 시 프리렌더. 목록에 없는 코드는 레이아웃의 notFound() 로 404 */
export function generateStaticParams() {
  return siteRepository.findAll().map((site) => ({ site: site.code }));
}

export async function generateMetadata({ params }: LayoutProps<"/[site]">): Promise<Metadata> {
  const site = siteRepository.findByCode((await params).site);
  return {
    title: site ? { default: site.name, template: `%s | ${site.name}` } : undefined,
    robots: { index: false, follow: false },
  };
}

/** 로그인 쿠키를 읽는 부분 — Cache Components 에서는 Suspense 안에 있어야 한다 */
async function SiteSession({ site }: { site: SiteConfig }) {
  const account = await getCurrentAccount(site.code);
  const clientAccount = account
    ? { loginId: account.loginId, userId: account.userId, label: account.label }
    : null;
  return (
    <>
      <SessionHydrator account={clientAccount} />
      <GaProvider
        site={site.code}
        measurementId={site.gaMeasurementId}
        cookiePrefix={site.cookiePrefix}
        userId={account?.userId ?? null}
      />
    </>
  );
}

export default async function SiteLayout({ children, params }: LayoutProps<"/[site]">) {
  const site = siteRepository.findByCode((await params).site);
  if (!site) notFound();

  return (
    <div className="flex min-h-full flex-col bg-white text-neutral-900">
      <SiteHeader site={site.code} brand={site.name} />
      <main className="flex-1">{children}</main>
      <SiteFooter brand={site.name} />
      <Suspense fallback={null}>
        <SiteSession site={site} />
      </Suspense>
      <DebugPanel site={site.code} />
    </div>
  );
}
