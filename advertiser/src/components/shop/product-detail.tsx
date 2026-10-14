"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { trackViewItem } from "@/lib/analytics/ecommerce";
import { findProduct, finalPrice, formatPrice, toGaItem } from "@/lib/catalog/fashion-products";
import { ProductImage } from "./product-image";

export function ProductDetail({ site }: { site: string }) {
  const router = useRouter();
  const productNo = Number(useSearchParams().get("product_no"));
  const product = findProduct(productNo);

  const [color, setColor] = useState(product?.colors[0].name ?? "");
  const [size, setSize] = useState(product?.sizes.length === 1 ? product.sizes[0] : "");

  useEffect(() => {
    if (product) trackViewItem(toGaItem(product));
  }, [product]);

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center text-sm text-neutral-500">
        상품을 찾을 수 없습니다.{" "}
        <Link href={`/${site}`} className="underline">
          메인으로
        </Link>
      </div>
    );
  }

  const hex = product.colors.find((c) => c.name === color)?.hex ?? product.colors[0].hex;

  const buyNow = () => {
    const query = new URLSearchParams({ product_no: String(product.productNo), color, size });
    router.push(`/${site}/order/orderform?${query}`);
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-2 md:py-12">
      <ProductImage name={product.category} hex={hex} />

      <div className="flex flex-col gap-6">
        <div>
          <p className="text-xs tracking-[0.2em] text-neutral-500">{product.category}</p>
          <h1 className="mt-1 text-2xl font-light">{product.name}</h1>
          <p className="mt-3 text-lg">
            <span className="font-semibold">{formatPrice(finalPrice(product))}</span>
            {product.salePrice && (
              <span className="ml-2 text-sm text-neutral-400 line-through">{formatPrice(product.price)}</span>
            )}
          </p>
        </div>

        <p className="text-sm leading-relaxed text-neutral-600">{product.description}</p>

        <OptionGroup label="색상" options={product.colors.map((c) => c.name)} value={color} onChange={setColor} />
        <OptionGroup label="사이즈" options={product.sizes} value={size} onChange={setSize} />

        <button
          type="button"
          disabled={!color || !size}
          onClick={buyNow}
          className="h-12 bg-neutral-900 text-sm text-white disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {color && size ? "바로 구매" : "옵션을 선택해 주세요"}
        </button>
      </div>
    </div>
  );
}

function OptionGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs text-neutral-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`min-w-12 border px-3 py-2 text-sm ${
              value === option ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
