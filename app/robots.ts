import { MetadataRoute } from "next";

/**
 * robots.txt 생성을 위한 함수
 * - 공식 문서: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#robots
 */
export default function robots(): MetadataRoute.Robots {
  return {
    // 크롤러 규칙
    rules: [
      {
        userAgent: "*",
        allow: "/",      
        disallow: "/api" 
      },
    ],
    sitemap: "https://hangang.live/sitemap.xml",
  };
}
