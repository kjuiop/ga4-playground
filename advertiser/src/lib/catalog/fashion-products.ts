import type { GaItem } from "@/lib/analytics/ecommerce";

export interface Product {
  productNo: number;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
}

/** 가상 브랜드 NOVA LANE 상품 (테스트용 고정 데이터) */
export const FASHION_PRODUCTS: Product[] = [
  {
    productNo: 101,
    name: "울 블렌드 싱글 코트",
    category: "아우터",
    price: 289000,
    salePrice: 239000,
    colors: [
      { name: "카멜", hex: "#b08a62" },
      { name: "차콜", hex: "#3f4146" },
    ],
    sizes: ["S", "M", "L"],
    description: "울 60% 블렌드 원단의 미니멀 싱글 코트. 가벼운 무게감으로 간절기부터 겨울까지 활용도가 높습니다.",
  },
  {
    productNo: 102,
    name: "릴렉스 핏 니트 가디건",
    category: "니트",
    price: 89000,
    colors: [
      { name: "오트밀", hex: "#d9cbb4" },
      { name: "네이비", hex: "#2d3a55" },
    ],
    sizes: ["FREE"],
    description: "도톰한 짜임의 루즈한 실루엣 가디건. 셔츠, 티셔츠 어디에나 레이어드하기 좋습니다.",
  },
  {
    productNo: 103,
    name: "와이드 데님 팬츠",
    category: "팬츠",
    price: 69000,
    salePrice: 59000,
    colors: [{ name: "라이트 블루", hex: "#8fa9c7" }],
    sizes: ["S", "M", "L", "XL"],
    description: "허리선이 높은 와이드 핏 데님. 워싱 처리로 자연스러운 빈티지 무드를 더했습니다.",
  },
  {
    productNo: 104,
    name: "레더 미니 크로스백",
    category: "가방",
    price: 129000,
    colors: [
      { name: "블랙", hex: "#1f1f1f" },
      { name: "탄", hex: "#a67b52" },
    ],
    sizes: ["ONE SIZE"],
    description: "소가죽 소재의 컴팩트한 크로스백. 탈착 가능한 스트랩으로 숄더백으로도 연출할 수 있습니다.",
  },
  {
    productNo: 105,
    name: "코튼 오버핏 셔츠",
    category: "셔츠",
    price: 59000,
    colors: [
      { name: "화이트", hex: "#f2f0eb" },
      { name: "스카이", hex: "#b9cfe4" },
    ],
    sizes: ["M", "L"],
    description: "부드러운 코튼 100% 오버핏 셔츠. 단독으로도, 아우터 안에 레이어드해도 좋습니다.",
  },
  {
    productNo: 106,
    name: "스웨이드 첼시 부츠",
    category: "슈즈",
    price: 159000,
    salePrice: 135000,
    colors: [{ name: "브라운", hex: "#6b4a33" }],
    sizes: ["230", "240", "250", "260", "270"],
    description: "스웨이드 소재의 클래식 첼시 부츠. 양쪽 밴딩으로 신고 벗기 편합니다.",
  },
];

export const BRAND = "NOVA LANE";

export const findProduct = (productNo: number) =>
  FASHION_PRODUCTS.find((product) => product.productNo === productNo);

export const finalPrice = (product: Product) => product.salePrice ?? product.price;

export function toGaItem(product: Product, options: { variant?: string; index?: number } = {}): GaItem {
  return {
    item_id: String(product.productNo),
    item_name: product.name,
    item_brand: BRAND,
    item_category: product.category,
    ...(options.variant ? { item_variant: options.variant } : {}),
    price: finalPrice(product),
    quantity: 1,
    ...(options.index !== undefined ? { index: options.index } : {}),
  };
}

export const formatPrice = (value: number) => `${value.toLocaleString("ko-KR")}원`;
