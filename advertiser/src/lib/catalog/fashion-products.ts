import type { GaItem } from "@/lib/analytics/ecommerce";

export interface Product {
  productNo: number;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  /** public/ 기준 이미지 경로 (출처: public/products/fashion/CREDITS.md) */
  image: string;
  colors: string[];
  sizes: string[];
  description: string;
}

/** 가상 브랜드 NOVA LANE 상품 (테스트용 고정 데이터) */
export const FASHION_PRODUCTS: Product[] = [
  {
    productNo: 101,
    name: "싱글 버튼 울 블레이저",
    category: "아우터",
    price: 259000,
    salePrice: 219000,
    image: "/products/fashion/101.jpg",
    colors: ["차콜", "블랙"],
    sizes: ["S", "M", "L"],
    description: "울 혼방 원단의 싱글 버튼 블레이저. 셔츠와 데님 어디에나 어울리는 베이직한 실루엣입니다.",
  },
  {
    productNo: 102,
    name: "체크 울 머플러",
    category: "액세서리",
    price: 49000,
    image: "/products/fashion/102.jpg",
    colors: ["네이비 체크"],
    sizes: ["ONE SIZE"],
    description: "도톰한 울 소재의 체크 머플러. 컬러 포인트로 겨울 코디에 생기를 더해 줍니다.",
  },
  {
    productNo: 103,
    name: "와이드 데님 팬츠",
    category: "팬츠",
    price: 69000,
    salePrice: 59000,
    image: "/products/fashion/103.jpg",
    colors: ["미드 블루"],
    sizes: ["S", "M", "L", "XL"],
    description: "허리선이 높은 와이드 핏 데님. 밑단 스티치 디테일로 빈티지한 무드를 더했습니다.",
  },
  {
    productNo: 104,
    name: "레더 반지갑",
    category: "지갑",
    price: 89000,
    image: "/products/fashion/104.jpg",
    colors: ["블랙"],
    sizes: ["ONE SIZE"],
    description: "부드러운 소가죽 반지갑. 카드 슬롯 6개와 지폐 수납 공간으로 실용적입니다.",
  },
  {
    productNo: 105,
    name: "메탈 프레임 선글라스",
    category: "아이웨어",
    price: 129000,
    salePrice: 109000,
    image: "/products/fashion/105.jpg",
    colors: ["골드/블랙"],
    sizes: ["ONE SIZE"],
    description: "얇은 메탈 프레임과 스모크 렌즈의 스퀘어 선글라스. UV400 자외선 차단.",
  },
  {
    productNo: 106,
    name: "코튼 버킷햇",
    category: "모자",
    price: 39000,
    image: "/products/fashion/106.jpg",
    colors: ["베이지", "카키"],
    sizes: ["M", "L"],
    description: "가벼운 코튼 소재의 와이드 브림 버킷햇. 접어서 휴대하기 좋습니다.",
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
