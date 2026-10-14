"use client";

import { useEffect } from "react";
import { trackViewItemList } from "@/lib/analytics/ecommerce";
import { FASHION_PRODUCTS, toGaItem } from "@/lib/catalog/fashion-products";

export function ViewItemListTracker({ listId, listName }: { listId: string; listName: string }) {
  useEffect(() => {
    trackViewItemList(
      listId,
      listName,
      FASHION_PRODUCTS.map((product, index) => toGaItem(product, { index })),
    );
  }, [listId, listName]);
  return null;
}
