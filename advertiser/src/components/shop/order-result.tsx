"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { trackPurchase } from "@/lib/analytics/ecommerce";
import { useSession } from "@/lib/auth/session-store";
import { findProduct, finalPrice, formatPrice, toGaItem } from "@/lib/catalog/fashion-products";

export function OrderResult({ site }: { site: string }) {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") ?? "";
  const variant = searchParams.get("variant") ?? "";
  const product = findProduct(Number(searchParams.get("product_no")));
  const { status, account } = useSession();

  // 로그인 상태가 확정된 뒤 전송한다 (user_id 가 config/set 으로 반영된 이후)
  useEffect(() => {
    if (status !== "ready" || !orderId || !product) return;
    trackPurchase(orderId, [toGaItem(product, { variant })]);
  }, [status, orderId, product, variant]);

  if (!orderId || !product) {
    return <p className="py-24 text-center text-sm text-neutral-500">주문 정보가 없습니다.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <p className="text-xs tracking-[0.3em] text-neutral-500">ORDER COMPLETE</p>
      <h1 className="mt-2 text-2xl font-light">주문이 완료되었습니다</h1>
      <dl className="mx-auto mt-8 max-w-sm space-y-2 border-y border-neutral-200 py-6 text-left text-sm">
        <Row label="주문번호" value={orderId} />
        <Row label="상품" value={`${product.name} (${variant})`} />
        <Row label="결제금액" value={formatPrice(finalPrice(product))} />
        <Row label="주문자" value={status === "ready" ? (account ? account.loginId : "비회원") : "…"} />
      </dl>
      <Link href={`/${site}`} className="mt-8 inline-block border border-neutral-900 px-6 py-2.5 text-sm">
        쇼핑 계속하기
      </Link>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
