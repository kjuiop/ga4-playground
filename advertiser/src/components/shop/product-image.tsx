/** 외부 이미지 없이 색상 기반 플레이스홀더로 상품 이미지를 표현한다 */
export function ProductImage({ name, hex, className = "" }: { name: string; hex: string; className?: string }) {
  return (
    <div
      className={`relative flex aspect-[3/4] items-end overflow-hidden rounded-sm ${className}`}
      style={{ background: `linear-gradient(160deg, ${hex}22 0%, ${hex}99 100%)` }}
    >
      <div
        className="absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[40%]"
        style={{ background: hex, opacity: 0.85 }}
      />
      <span className="relative m-3 text-[10px] uppercase tracking-[0.2em] text-neutral-700/70">{name}</span>
    </div>
  );
}
