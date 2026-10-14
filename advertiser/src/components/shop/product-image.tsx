import Image from "next/image";
import type { Product } from "@/lib/catalog/fashion-products";

export function ProductImage({
  product,
  priority = false,
  sizes = "(min-width: 768px) 33vw, 50vw",
  className = "",
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <div className={`relative aspect-[3/4] overflow-hidden bg-neutral-100 ${className}`}>
      <Image
        src={product.image}
        alt={product.name}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
