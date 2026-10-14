import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderResult } from "@/components/shop/order-result";

export const metadata: Metadata = { title: "주문 완료" };

export default async function OrderResultPage({ params }: PageProps<"/[site]/order/result">) {
  const { site } = await params;
  return (
    <Suspense fallback={<div className="h-96" />}>
      <OrderResult site={site} />
    </Suspense>
  );
}
