"use client";

import Script from "next/script";
import { useEffect } from "react";
import { initAnalytics } from "@/lib/analytics/gtag";
import { captureLandingUtm, resolveDebug } from "@/lib/analytics/landing";

interface GaProviderProps {
  site: string;
  measurementId?: string;
  cookiePrefix: string;
  userId: string | null;
}

/** [site] 레이아웃에서만 렌더한다. 서버가 쿠키에서 읽은 userId 를 받아 첫 config 에 넣는다. */
export function GaProvider({ site, measurementId, cookiePrefix, userId }: GaProviderProps) {
  useEffect(() => {
    captureLandingUtm(site);
    initAnalytics({ measurementId, cookiePrefix, userId, debug: resolveDebug(site) });
  }, [site, measurementId, cookiePrefix, userId]);

  if (!measurementId) return null;
  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      strategy="afterInteractive"
    />
  );
}
