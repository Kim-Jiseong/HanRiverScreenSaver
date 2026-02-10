import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
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
    // other: { "naver-site-verification": "your-naver-verification-code" },
  },
};

/**
 * 4) JSON-LD 구조화 데이터 - 3가지 스키마
 * - WebSite: 사이트 기본 정보 + 대체 이름(검색어 변형)
 * - WebApplication: 웹 앱으로서의 정보 (무료, 유틸리티)
 * - FAQPage: 자주 묻는 질문 (구글 리치 스니펫 생성)
 */
function StructuredData() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "한강물 온도",
    alternateName: ["한강 수온", "한강물온도", "한강 물 온도", "hangang.live"],
    url: "https://hangang.live",
    description:
      "한강물 온도를 실시간으로 확인할 수 있는 웹사이트입니다. 서울 한강 수온 측정 데이터를 기반으로 실시간 수온 정보를 제공합니다.",
    inLanguage: "ko",
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "한강물 온도 - 실시간 한강 수온 확인",
    url: "https://hangang.live",
    description:
      "실시간 한강 수온 정보와 시계를 제공하는 화면보호기 웹 애플리케이션",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    author: {
      "@type": "Person",
      name: "Thermit",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "한강물 온도는 어떻게 측정하나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "한강 수온은 서울시에서 운영하는 수질 자동측정망을 통해 실시간으로 측정됩니다. 노량진, 선유, 탄천, 중랑천, 안양천 등 주요 지점에 설치된 자동측정 장비가 수온을 포함한 수질 데이터를 수집합니다.",
        },
      },
      {
        "@type": "Question",
        name: "한강물 온도는 실시간으로 업데이트 되나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "네, hangang.live는 한강 수온 데이터를 실시간으로 업데이트합니다. 약 5분 간격으로 서울시 수질 측정망의 최신 수온 데이터를 가져와 표시합니다.",
        },
      },
      {
        "@type": "Question",
        name: "한강 물놀이 적정 수온은 몇 도인가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "일반적으로 수영이나 물놀이에 적합한 수온은 약 22°C~28°C입니다. 20°C 이하의 수온에서는 체온 저하의 위험이 있으므로 주의가 필요합니다. 한강 수영장은 보통 6월 말~8월 중순에 운영됩니다.",
        },
      },
      {
        "@type": "Question",
        name: "겨울철 한강 수온은 보통 몇 도인가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "겨울철 한강 수온은 보통 1°C~5°C 사이이며, 가장 추운 1~2월에는 0°C에 가까워질 수 있습니다. 여름철에는 20°C~27°C까지 상승합니다. 봄과 가을에는 10°C~18°C 사이를 유지합니다.",
        },
      },
      {
        "@type": "Question",
        name: "hangang.live는 어떤 사이트인가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "hangang.live는 실시간 한강물 온도를 아름다운 시계 화면보호기와 함께 보여주는 웹사이트입니다. 한강 수온 확인은 물론, 시간대별 배경 이미지와 실시간 한강 라이브캠을 통해 화면보호기로도 활용할 수 있습니다.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <GoogleAnalytics gaId="G-2T3P3YL8DF" />
        </ThemeProvider>
      </body>
    </html>
  );
}
