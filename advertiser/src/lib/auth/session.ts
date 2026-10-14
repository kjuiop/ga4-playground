import "server-only";
import { cookies } from "next/headers";
import { authProvider } from "./fixed-account-auth-provider";
import type { TestAccount } from "./types";

export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30일 — 시나리오 D(다음 날 재방문) 대비

export const sessionCookieName = (site: string) => `${site}_session`;

/** 사이트 경로(Path=/{site})에 한정된 로그인 쿠키에서 현재 계정을 읽는다. Suspense 안에서만 호출. */
export async function getCurrentAccount(site: string): Promise<TestAccount | undefined> {
  const loginId = (await cookies()).get(sessionCookieName(site))?.value;
  return loginId ? authProvider.findByLoginId(loginId) : undefined;
}
