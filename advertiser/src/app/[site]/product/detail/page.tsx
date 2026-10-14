import { Suspense } from "react";
import { ProductDetail } from "@/components/shop/product-detail";

/** product_no 는 쿼리스트링(런타임 데이터)이라 Suspense 안에서 읽는다 */
export default async function ProductDetailPage({ params }: PageProps<"/[site]/product/detail">) {
  const { site } = await params;
  return (
    <Suspense fallback={<div className="h-96" />}>
      <ProductDetail site={site} />
    </Suspense>
  );
}
