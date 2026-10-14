export function SiteFooter({ brand }: { brand: string }) {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-6xl space-y-1 px-4 py-8 pb-20 text-xs text-neutral-500">
        <p className="font-semibold tracking-[0.2em] text-neutral-700">{brand}</p>
        <p>고객센터 1588-0000 · 평일 10:00 - 17:00</p>
        <p>본 사이트는 GA4 측정 실험을 위한 데모 쇼핑몰입니다. 실제 상품 판매 및 결제가 이루어지지 않습니다.</p>
      </div>
    </footer>
  );
}
