"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { trackBeginCheckout } from "@/lib/analytics/ecommerce";
import { useSession } from "@/lib/auth/session-store";
import { findProduct, finalPrice, formatPrice, toGaItem } from "@/lib/catalog/fashion-products";

const newTransactionId = () => `T${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;

export function OrderForm({ site }: { site: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const product = findProduct(Number(searchParams.get("product_no")));
  const color = searchParams.get("color") ?? "";
  const size = searchParams.get("size") ?? "";
  const variant = [color, size].filter(Boolean).join(" / ");

  const { status, account } = useSession();
  const [guest, setGuest] = useState(false);

  useEffect(() => {
    if (product) trackBeginCheckout([toGaItem(product, { variant })]);
  }, [product, variant]);

  if (!product) {
    return <p className="py-24 text-center text-sm text-neutral-500">주문할 상품 정보가 없습니다.</p>;
  }

  const returnTo = `/${site}/order/orderform?${searchParams.toString()}`;
  const canPay = status === "ready" && (account || guest);

  const pay = () => {
    const query = new URLSearchParams({
      order_id: newTransactionId(),
      product_no: String(product.productNo),
      variant,
    });
    router.push(`/${site}/order/result?${query}`);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
      <h1 className="text-xl font-light">주문서 작성</h1>

      <section className="border-y border-neutral-200 py-4">
        <p className="text-sm">{product.name}</p>
        <p className="mt-1 text-xs text-neutral-500">{variant} · 1개</p>
        <p className="mt-2 text-sm font-semibold">{formatPrice(finalPrice(product))}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">주문자</h2>
        {status === "loading" && <p className="text-sm text-neutral-400">확인 중…</p>}
        {status === "ready" && account && (
          <p className="text-sm">
            <span className="font-medium">{account.loginId}</span> 회원으로 주문합니다.
          </p>
        )}
        {status === "ready" && !account && (
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/${site}/member/login?return_to=${encodeURIComponent(returnTo)}`}
              className="border border-neutral-900 py-3 text-center text-sm"
            >
              회원 로그인
            </Link>
            <button
              type="button"
              onClick={() => setGuest(true)}
              className={`border py-3 text-sm ${guest ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300"}`}
            >
              비회원 주문
            </button>
          </div>
        )}
      </section>

      <button
        type="button"
        disabled={!canPay}
        onClick={pay}
        className="h-12 w-full bg-neutral-900 text-sm text-white disabled:cursor-not-allowed disabled:bg-neutral-300"
      >
        {formatPrice(finalPrice(product))} 결제하기
      </button>
      <p className="text-center text-xs text-neutral-400">
        실제 결제가 이루어지지 않는 데모 사이트입니다.
      </p>
    </div>
  );
}
