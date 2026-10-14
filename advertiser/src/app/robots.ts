import type { MetadataRoute } from "next";

/** 데모 사이트 — 검색엔진 수집 차단 (외부 유입으로 GA 데이터가 오염되지 않게) */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
