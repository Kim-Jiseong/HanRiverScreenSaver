import type { Metadata } from "next";

import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
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

export const metadata: Metadata = {
  title: "한강 물 온도 화면보호기 - 실시간 한강 수온과 시계",
  description:
    "실시간으로 업데이트되는 한강 수온 정보와 시계를 화면보호기로 즐겨보세요. 서울 한강의 현재 수온을 실시간으로 확인할 수 있습니다.",
  keywords:
    "한강 수온, 한강 물 온도, 화면보호기, 실시간 시계, 서울 한강, 한강 정보",
  authors: [{ name: "Thermit" }],
  openGraph: {
    title: "한강 물 온도 화면보호기 - 실시간 한강 수온과 시계",
    description:
      "실시간으로 업데이트되는 한강 수온 정보와 시계를 화면보호기로 즐겨보세요.",
    type: "website",
    locale: "ko_KR",
    url: "https://your-domain.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "한강 물 온도 화면보호기",
    description:
      "실시간으로 업데이트되는 한강 수온 정보와 시계를 화면보호기로 즐겨보세요.",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  alternates: {
    canonical: "https://your-domain.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {/* <Header /> */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
