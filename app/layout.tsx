import localFont from "next/font/local";
import "./globals.css";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import type { Metadata, Viewport } from "next";

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
 * 2) Viewport 설정 (Next.js 14+ 권장 방식: metadata와 분리)
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

/**
 * 3) 메타데이터 설정 - SEO 최적화
 * - 타이틀: "한강물 온도"를 최우선 키워드로 배치 (검색어 정확 매칭)
 * - 디스크립션: 주요 키워드 변형 포함
 * - 키워드: 검색량 높은 키워드 17개 타겟팅
 * - robots: googleBot max-image-preview, max-snippet 설정
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://hangang.live"),
  title: {
    default: "한강물 온도 - 실시간 한강 수온 확인 | hangang.live",
    template: "%s | 한강물 온도 - hangang.live",
  },
  description:
    "한강물 온도를 실시간으로 확인하세요. 서울시 수질 자동측정망 데이터 기반으로 노량진, 선유, 탄천 등 주요 지점의 실시간 한강 수온 정보를 제공합니다. 아름다운 시계 화면보호기와 함께 한강 수온을 확인할 수 있습니다.",
  keywords: [
    "한강물 온도",
    "한강물온도",
    "한강 수온",
    "한강 물 온도",
    "실시간 한강 수온",
    "한강물 온도 실시간",
    "한강 온도",
    "오늘 한강 수온",
    "지금 한강 온도",
    "한강 수온 확인",
    "서울 한강 수온",
    "한강 물 온도 화면보호기",
    "한강 수온 실시간 확인",
    "한강 수온 몇도",
    "한강 물온도",
    "화면보호기",
    "실시간 시계",
  ],
  authors: [{ name: "Thermit", url: "https://hangang.live" }],
  creator: "Thermit",
  publisher: "Thermit",
  category: "weather",
  openGraph: {
    title: "한강물 온도 - 실시간 한강 수온 확인",
    siteName: "한강물 온도 - hangang.live",
    description:
      "한강물 온도를 실시간으로 확인하세요. 서울 한강 수온과 아름다운 시계 화면보호기를 즐겨보세요.",
    type: "website",
    locale: "ko_KR",
    url: "https://hangang.live",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "한강물 온도 실시간 확인 - hangang.live",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "한강물 온도 - 실시간 한강 수온 확인",
    description:
      "한강물 온도를 실시간으로 확인하세요. 서울 한강 수온과 아름다운 시계 화면보호기.",
    images: ["/opengraph-image.png"],
    creator: "@thermit_io",
    site: "@thermit_io",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://hangang.live",
  },
  verification: {
    // Google Search Console 등록 후 인증 코드 추가
    // google: "your-google-verification-code",
    // Naver 웹마스터 도구 등록 후 인증 코드 추가
    other: {
      "naver-site-verification": "e01777ef9217587981fd60f2aa48fcde124646eb",
    },
  },
};

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
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8710277766749613"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <GoogleAnalytics gaId="G-2T3P3YL8DF" />
        </ThemeProvider>
      </body>
    </html>
  );
}
