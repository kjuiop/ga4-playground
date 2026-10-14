import Link from "next/link";
import { siteRepository } from "@/lib/site/env-site-repository";

export default function Home() {
  const sites = siteRepository.findAll();
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-16">
      <h1 className="text-xl font-semibold">GA4 Playground · Advertiser</h1>
      <p className="mt-2 text-sm text-neutral-500">GA4 측정 실험용 광고주 사이트 목록</p>
      <ul className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
        {sites.map((site) => (
          <li key={site.code}>
            <Link href={`/${site.code}`} className="flex items-center justify-between py-4 text-sm hover:bg-neutral-50">
              <span>
                <span className="font-medium">{site.name}</span>
                <span className="ml-2 text-neutral-500">/{site.code}</span>
              </span>
              <span className="text-xs text-neutral-500">
                {site.type} · {site.gaMeasurementId ? "GA 연결됨" : "GA 미설정"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
