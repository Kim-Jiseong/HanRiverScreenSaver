import { MetadataRoute } from "next";

/**
 * Web App Manifest - PWA 및 모바일 SEO 향상
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "한강물 온도 - 실시간 한강 수온 확인",
    short_name: "한강물 온도",
    description:
      "한강물 온도를 실시간으로 확인하세요. 서울 한강 수온과 시계 화면보호기.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
