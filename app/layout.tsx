import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

/**
 * 1) 폰트 설정
 */
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

/**
 * 2) 메타데이터 설정
 * - metadataBase: canonical URL 등의 베이스가 되는 주소
 * - title, description: 기본 타이틀/설명
 * - openGraph, twitter: SNS 공유용 메타 태그
 * - icons: 파비콘 및 아이콘 설정
 * - alternates: canonical 및 다국어 페이지 있을 경우 활용
 * - keywords, authors, robots 등
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://hangang.live"),
  title: {
    default: "한강 물 온도 화면보호기 - 실시간 한강 수온과 시계",
    template: "%s | 한강 물 온도 화면보호기", // 페이지마다 타이틀이 달라질 때 
  },
  description:
    "실시간으로 업데이트되는 한강 수온 정보와 시계를 화면보호기로 즐겨보세요. 서울 한강의 현재 수온을 실시간으로 확인할 수 있습니다.",
  keywords: [
    "한강 수온",
    "한강 물 온도",
    "한강물온도",
    "화면보호기",
    "실시간 시계",
    "서울 한강",
    "한강 정보",
  ],
  authors: [{ name: "Thermit" }],
  openGraph: {
    title: "한강 물 온도 화면보호기 - 실시간 한강 수온과 시계",
    siteName: "한강 물 온도 화면보호기",
    description:
      "실시간으로 업데이트되는 한강 물 온도와 시계를 화면보호기로 즐겨보세요.",
    type: "website",
    locale: "ko_KR",
    url: "https://hangang.live",
    images: [
      {
        url: "/og-image.png", 
        width: 1200,
        height: 630,
        alt: "한강 물 온도 화면보호기 미리보기 이미지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "한강 물 온도 화면보호기",
    description:
      "실시간으로 업데이트되는 한강 수온 정보와 시계를 화면보호기로 즐겨보세요.",
    images: ["/og-image.png"],
    creator: "@thermit_io", 
    site: "@thermit_io",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://hangang.live",
    // 다국어 페이지가 있다면 다음 식으로 추가:
    // languages: {
    //   "en-US": "https://hangang.live/en",
    //   "ko-KR": "https://hangang.live/ko",
    // },
  },
  // Next.js 14부터 JSON-LD, 추가 메타 태그 등을 삽입할 때는 Head나 레이아웃에서 직접 <script> 태그 사용 가능
};

/**
 * 3) JSON-LD 구조화 데이터
 * - 검색엔진이 해당 사이트에 대한 구체적인 정보를 파악하기 쉽게 만들어줌
 * - "WebSite", "Organization", "CreativeWork" 등 다양한 유형이 있으니 목적에 맞춰 추가
 */
function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "한강 물 온도 화면보호기",
    url: "https://hangang.live",
    description:
      "실시간으로 업데이트되는 한강 수온 정보와 시계를 화면보호기로 즐겨보세요.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {/* JSON-LD 구조화 데이터 삽입 */}
          <StructuredData />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
