import { MetadataRoute } from "next";

/**
 * robots.txt 생성
 * - 모든 크롤러 허용 (Googlebot, Yeti/Naver 등)
 * - /api 경로만 차단
 * - sitemap 및 host 명시
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api",
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "Yeti",
        allow: "/",
      },
    ],
    sitemap: "https://hangang.live/sitemap.xml",
    host: "https://hangang.live",
  };
}
