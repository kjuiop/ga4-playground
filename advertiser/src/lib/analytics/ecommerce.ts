/** GA4 권장 전자상거래 이벤트 (https://developers.google.com/analytics/devguides/collection/ga4/ecommerce) */
import { trackEvent } from "./gtag";

export interface GaItem {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_category?: string;
  item_variant?: string;
  price: number;
  quantity?: number;
  index?: number;
}

const CURRENCY = "KRW";

const sum = (items: GaItem[]) =>
  items.reduce((total, item) => total + item.price * (item.quantity ?? 1), 0);

export function trackViewItemList(listId: string, listName: string, items: GaItem[]) {
  trackEvent("view_item_list", { item_list_id: listId, item_list_name: listName, items });
}

export function trackViewItem(item: GaItem) {
  trackEvent("view_item", { currency: CURRENCY, value: sum([item]), items: [item] });
}

export function trackBeginCheckout(items: GaItem[]) {
  trackEvent("begin_checkout", { currency: CURRENCY, value: sum(items), items });
}

const PURCHASE_SENT_KEY = "purchase_sent";

/**
 * 같은 transaction_id 는 한 번만 전송한다.
 * (새로고침, 뒤로 가기 시 Activity 로 effect 가 재실행되는 경우 대비)
 */
export function trackPurchase(transactionId: string, items: GaItem[]) {
  const sent: string[] = JSON.parse(sessionStorage.getItem(PURCHASE_SENT_KEY) ?? "[]");
  if (sent.includes(transactionId)) return false;
  sessionStorage.setItem(PURCHASE_SENT_KEY, JSON.stringify([...sent, transactionId]));

  trackEvent("purchase", {
    transaction_id: transactionId,
    currency: CURRENCY,
    value: sum(items),
    items,
  });
  return true;
}

export function trackLogin() {
  trackEvent("login", { method: "test_account" });
}
