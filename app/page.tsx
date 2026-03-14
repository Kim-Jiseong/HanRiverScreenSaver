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

  return (
    <>
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
