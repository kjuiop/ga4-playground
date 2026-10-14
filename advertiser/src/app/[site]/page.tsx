import Link from "next/link";
import { ProductImage } from "@/components/shop/product-image";
import { ViewItemListTracker } from "@/components/shop/view-item-list-tracker";
import { FASHION_PRODUCTS, finalPrice, formatPrice } from "@/lib/catalog/fashion-products";

export default async function SiteMainPage({ params }: PageProps<"/[site]">) {
  const { site } = await params;

  return (
    <>
      <ViewItemListTracker listId="main_new" listName="메인 신상품" />

      <section className="bg-[#efe9e1]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-16 md:py-24">
          <p className="text-xs tracking-[0.3em] text-neutral-500">2026 FALL / WINTER</p>
          <h1 className="text-3xl font-light leading-tight md:text-5xl">
            일상에 스며드는
            <br />
            조용한 온기
          </h1>
          <Link
            href={`/${site}/product/detail?product_no=101`}
            className="mt-4 w-fit border border-neutral-900 px-6 py-2.5 text-sm hover:bg-neutral-900 hover:text-white"
          >
            컬렉션 보기
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-sm font-semibold tracking-[0.2em]">NEW ARRIVALS</h2>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
          {FASHION_PRODUCTS.map((product) => (
            <li key={product.productNo}>
              <Link href={`/${site}/product/detail?product_no=${product.productNo}`} className="group block">
                <ProductImage name={product.category} hex={product.colors[0].hex} className="group-hover:opacity-90" />
                <p className="mt-3 text-sm">{product.name}</p>
                <p className="mt-1 text-sm">
                  {product.salePrice && (
                    <span className="mr-2 text-red-600">
                      {Math.round((1 - product.salePrice / product.price) * 100)}%
                    </span>
                  )}
                  <span className="font-semibold">{formatPrice(finalPrice(product))}</span>
                  {product.salePrice && (
                    <span className="ml-2 text-xs text-neutral-400 line-through">{formatPrice(product.price)}</span>
                  )}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
