import { NextResponse, type NextRequest } from "next/server";
import { SITE_CODES } from "@/lib/site/site-catalog";

/**
 * 등록되지 않은 사이트 코드는 렌더링 전에 404 로 응답한다.
 * (레이아웃의 notFound() 는 스트리밍이 시작된 뒤라 HTTP 상태가 200 으로 나간다)
 */
export function proxy(request: NextRequest) {
  const [, segment] = request.nextUrl.pathname.split("/");
  if (segment && !SITE_CODES.includes(segment)) {
    return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  // 루트(/), Next 내부 경로, 확장자가 있는 정적 파일(public/ 이미지, robots.txt 등)은 제외
  matcher: ["/((?!_next/|_not-found|.*\\..*).+)"],
};
