import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderForm } from "@/components/shop/order-form";

export const metadata: Metadata = { title: "주문서" };

export default async function OrderFormPage({ params }: PageProps<"/[site]/order/orderform">) {
  const { site } = await params;
  return (
    <Suspense fallback={<div className="h-96" />}>
      <OrderForm site={site} />
    </Suspense>
  );
}
