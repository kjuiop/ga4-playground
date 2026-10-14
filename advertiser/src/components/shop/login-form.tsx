"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { login, logout } from "@/app/[site]/member/actions";
import { trackLogin } from "@/lib/analytics/ecommerce";
import { setUserId } from "@/lib/analytics/gtag";
import type { TestAccount } from "@/lib/auth/types";
import { setSession, useSession } from "@/lib/auth/session-store";

export function LoginForm({ site, accounts }: { site: string; accounts: TestAccount[] }) {
  const router = useRouter();
  const returnTo = useSearchParams().get("return_to");
  const { status, account } = useSession();
  const [pending, startTransition] = useTransition();

  const handleLogin = (target: TestAccount) =>
    startTransition(async () => {
      const { userId } = await login(site, target.loginId);
      setUserId(userId); // user_id 를 먼저 설정한 뒤 login 이벤트 전송
      trackLogin();
      setSession({ loginId: target.loginId, userId, label: target.label });
      // 오픈 리다이렉트 방지: 같은 사이트 경로만 허용
      if (returnTo?.startsWith(`/${site}/`)) router.push(returnTo);
    });

  const handleLogout = () =>
    startTransition(async () => {
      await logout(site);
      setUserId(null);
      setSession(null);
    });

  if (status === "loading") return <p className="text-sm text-neutral-400">확인 중…</p>;

  if (account) {
    return (
      <div className="space-y-4">
        <p className="text-sm">
          <span className="font-medium">{account.loginId}</span> ({account.label})로 로그인되어 있습니다.
        </p>
        <button
          type="button"
          disabled={pending}
          onClick={handleLogout}
          className="h-11 w-full border border-neutral-900 text-sm disabled:opacity-50"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-neutral-500">테스트 계정을 선택하면 로그인됩니다. (30일 유지)</p>
      {accounts.map((target) => (
        <button
          key={target.loginId}
          type="button"
          disabled={pending}
          onClick={() => handleLogin(target)}
          className="flex h-12 w-full items-center justify-between border border-neutral-300 px-4 text-sm hover:border-neutral-900 disabled:opacity-50"
        >
          <span className="font-medium">{target.loginId}</span>
          <span className="text-xs text-neutral-500">{target.label}</span>
        </button>
      ))}
    </div>
  );
}
