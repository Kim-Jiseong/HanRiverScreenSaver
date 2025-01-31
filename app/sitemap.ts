import { MetadataRoute } from "next";

/**
 * sitemap.xml 생성을 위한 함수
 * - 공식 문서: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hangang.live";

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
