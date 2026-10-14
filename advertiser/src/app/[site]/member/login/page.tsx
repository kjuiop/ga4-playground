import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/shop/login-form";
import { authProvider } from "@/lib/auth/fixed-account-auth-provider";

export const metadata: Metadata = { title: "로그인" };

export default async function LoginPage({ params }: PageProps<"/[site]/member/login">) {
  const { site } = await params;
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-8 text-center text-xl font-light tracking-[0.2em]">LOGIN</h1>
      <Suspense fallback={<div className="h-64" />}>
        <LoginForm site={site} accounts={authProvider.listAccounts()} />
      </Suspense>
    </div>
  );
}
