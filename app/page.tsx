"use client";

import { useEffect, useState } from "react";
import { Background } from "@/components/background";
import { HeaderControls } from "@/components/header-controls";
import { ClockDisplay } from "@/components/clock-display";
import { JumpCounter } from "@/components/jump-counter";
import { ChatWidget } from "@/components/chat-widget";
import { SeoFooter } from "@/components/seo-footer";
import { useWaterTemp } from "@/hooks/use-water-temp";
import { useJumpCount } from "@/hooks/use-jump-count";

export default function Home() {
  const [showBackground, setShowBackground] = useState(true);
  const [backgroundType, setBackgroundType] = useState<"image" | "live">(
    "image",
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isChatOpen, setIsChatOpen] = useState(true);

  const { waterTemp, isLoading } = useWaterTemp();
  const { jumpCount, isClicked, handleClick, handleMouseLeave } =
    useJumpCount();

  // 시간 1초 간격으로 갱신
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 로컬 스토리지에서 설정값 복원
  useEffect(() => {
    const storedBackground = localStorage.getItem("showBackground");
    const storedType = localStorage.getItem("backgroundType");

    if (storedBackground !== null) {
      setShowBackground(JSON.parse(storedBackground));
    } else {
      localStorage.setItem("showBackground", JSON.stringify(false));
    }

    if (storedType !== null) {
      setBackgroundType(storedType === "live" ? "live" : "image");
    } else {
      localStorage.setItem("backgroundType", "image");
    }

    const storedChat = localStorage.getItem("isChatOpen");
    if (storedChat !== null) {
      setIsChatOpen(JSON.parse(storedChat));
    } else {
      localStorage.setItem("isChatOpen", JSON.stringify(true));
    }
  }, []);

  const handleToggleBackground = (checked: boolean) => {
    setShowBackground(checked);
    localStorage.setItem("showBackground", JSON.stringify(checked));
  };

  const handleToggleLive = (checked: boolean) => {
    const newType = checked ? "live" : "image";
    setBackgroundType(newType);
    localStorage.setItem("backgroundType", newType);
  };

  const handleToggleChat = (checked: boolean) => {
    setIsChatOpen(checked);
    localStorage.setItem("isChatOpen", JSON.stringify(checked));
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "한강물 온도",
        alternateName: ["한강 수온", "한강물온도", "한강 물 온도", "hangang.live"],
        url: "https://hangang.live",
        description:
          "한강물 온도를 실시간으로 확인할 수 있는 웹사이트입니다. 서울 한강 수온 측정 데이터를 기반으로 실시간 수온 정보를 제공합니다.",
        inLanguage: "ko",
      },
      {
        "@type": "WebApplication",
        name: "한강물 온도 - 실시간 한강 수온 확인",
        url: "https://hangang.live",
        description:
          "실시간 한강 수온 정보와 시계를 제공하는 화면보호기 웹 애플리케이션",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
        author: { "@type": "Person", name: "Thermit" },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "한강물 온도는 어떻게 측정하나요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "서울시 수질 자동측정망을 통해 실시간으로 측정되며, 주요 지점(노량진, 선유 등)의 데이터를 제공합니다.",
            },
          },
          {
            "@type": "Question",
            name: "한강물 온도 데이터는 얼마나 자주 업데이트되나요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "약 5분 간격으로 갱신되며, 화면에는 가장 최근 측정 시간이 함께 표시됩니다.",
            },
          },
          {
            "@type": "Question",
            name: "한강 입수 적정 수온은 몇 도인가요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "적정 수온은 약 22°C~28°C입니다. 20°C 이하에서는 체온 저하 위험이 있습니다.",
            },
          },
          {
            "@type": "Question",
            name: "hangang.live는 어떤 사이트인가요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "실시간 한강물 온도를 아름다운 시계 화면보호기, 라이브 캠 영상과 함께 제공하는 서비스입니다.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="relative w-full min-h-screen items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
        <Background
          show={showBackground}
          type={backgroundType}
          currentHour={currentTime.getHours()}
        />

        <HeaderControls
          showBackground={showBackground}
          onToggleBackground={handleToggleBackground}
          backgroundType={backgroundType}
          onToggleLive={handleToggleLive}
          isChatOpen={isChatOpen}
          onToggleChat={handleToggleChat}
        />

        <main className="w-full min-h-screen flex flex-col relative z-20 p-4 pt-16">
          <ClockDisplay
            currentTime={currentTime}
            waterTemp={waterTemp}
            isLoading={isLoading}
          />

          {/* 하단 점프 박스 & 채팅 위젯 */}
          <div className="w-full shrink-0 flex flex-col md:grid md:grid-cols-3 items-end relative z-40 pb-4 px-4 sm:px-8 gap-4 pointer-events-none">
            <div className="hidden md:block" />

            <div className="w-full max-w-md mx-auto md:max-w-none md:ml-auto md:mr-0 flex justify-end pointer-events-auto order-1 md:order-3 md:relative md:h-24">
              <ChatWidget
                isVisible={isChatOpen}
                className="w-full md:w-80 md:absolute md:bottom-0 md:right-0 transition-all duration-500"
              />
            </div>

            <JumpCounter
              jumpCount={jumpCount}
              isClicked={isClicked}
              onClick={handleClick}
              onMouseLeave={handleMouseLeave}
            />
          </div>
        </main>
      </div>

      <SeoFooter />
    </>
  );
}
