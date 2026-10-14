"use server";

import { cookies } from "next/headers";
import { authProvider } from "@/lib/auth/fixed-account-auth-provider";
import { SESSION_MAX_AGE, sessionCookieName } from "@/lib/auth/session";
import { siteRepository } from "@/lib/site/env-site-repository";

function cookieOptions(site: string) {
  return {
    path: `/${site}`, // 사이트별 로그인 분리
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

function assertSite(site: string) {
  if (!siteRepository.findByCode(site)) throw new Error(`unknown site: ${site}`);
}

/** 쿠키에는 loginId 만 저장하고, user_id 는 서버에서 매핑해 돌려준다 */
export async function login(site: string, loginId: string): Promise<{ userId: string }> {
  assertSite(site);
  const account = authProvider.findByLoginId(loginId);
  if (!account) throw new Error(`unknown account: ${loginId}`);

  (await cookies()).set(sessionCookieName(site), account.loginId, {
    ...cookieOptions(site),
    maxAge: SESSION_MAX_AGE,
  });
  return { userId: account.userId };
}

export async function logout(site: string): Promise<void> {
  assertSite(site);
  (await cookies()).set(sessionCookieName(site), "", { ...cookieOptions(site), maxAge: 0 });
}
