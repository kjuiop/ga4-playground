import "server-only";
import { SITES } from "./site-catalog";
import type { SiteConfig, SiteRepository } from "./types";

/** 측정 ID 는 환경변수(GA_ID_{CODE})에서 읽는다. api 단계에서 ApiSiteRepository 로 교체한다. */
const envKey = (code: string) => `GA_ID_${code.toUpperCase()}`;

export class EnvSiteRepository implements SiteRepository {
  findAll(): SiteConfig[] {
    return SITES.map((site) => ({
      ...site,
      gaMeasurementId: process.env[envKey(site.code)] || undefined,
    }));
  }

  findByCode(code: string): SiteConfig | undefined {
    return this.findAll().find((site) => site.code === code);
  }
}

export const siteRepository: SiteRepository = new EnvSiteRepository();
