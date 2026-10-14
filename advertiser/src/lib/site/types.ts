export type SiteType = "commerce" | "content";

export interface SiteConfig {
  /** URL 첫 세그먼트 (예: "fashion") */
  code: string;
  /** 가상 브랜드명 */
  name: string;
  type: SiteType;
  /** GA4 측정 ID. 미설정이면 GA 비활성 (로컬 개발) */
  gaMeasurementId?: string;
  /** GA cookie_prefix — 사이트별 client_id 분리 */
  cookiePrefix: string;
}

export interface SiteRepository {
  findAll(): SiteConfig[];
  findByCode(code: string): SiteConfig | undefined;
}
