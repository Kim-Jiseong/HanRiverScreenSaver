import { MetadataRoute } from "next";

/**
 * sitemap.xml 생성
 * - changeFrequency: "hourly" (수온 데이터가 자주 갱신되므로)
 * - priority: 1 (메인 페이지 최우선)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hangang.live";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
  ];
}
