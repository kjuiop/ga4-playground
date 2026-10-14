import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GA4 Playground",
  robots: { index: false, follow: false },
};

/** 루트 레이아웃에는 GA 태그를 넣지 않는다 — 광고주 사이트([site]) 레이아웃에서만 로드 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
