import type { SiteConfig } from "./types";

/**
 * 등록된 광고주 사이트 목록 (측정 ID 제외).
 * proxy.ts 에서도 import 하므로 server-only / 환경변수에 의존하지 않는다.
 */
export const SITES: Omit<SiteConfig, "gaMeasurementId">[] = [
  { code: "fashion", name: "NOVA LANE", type: "commerce", cookiePrefix: "fashion" },
];

export const SITE_CODES = SITES.map((site) => site.code);
