"use client";

import { useEffect, useState, useRef } from "react";
import { ModeToggle } from "@/components/toggle-theme";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import Image from "next/image";
import { Thermometer, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface HangangData {
  success: boolean;
  temperature: number;
  location: string;
  date: string;
  time: string;
}

export default function Home() {
  const [showBackground, setShowBackground] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [waterTemp, setWaterTemp] = useState<HangangData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [jumpCount, setJumpCount] = useState(0);
  const [containerHeight, setContainerHeight] = useState(96);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isClicked, setIsClicked] = useState(false);

  const fetchWaterTemp = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/hangang");
      const data = await response.json();
      setWaterTemp(data);
    } catch (error) {
      console.error("한강 수온 데이터를 가져오는데 실패했습니다:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWaterTemp();
    const waterTempTimer = setInterval(fetchWaterTemp, 300000);
    return () => clearInterval(waterTempTimer);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("showBackground");
    if (stored !== null) {
      setShowBackground(JSON.parse(stored));
    } else {
      localStorage.setItem("showBackground", JSON.stringify(false));
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleToggle = (checked: boolean) => {
    setShowBackground(checked);
    localStorage.setItem("showBackground", JSON.stringify(checked));
  };

  const formatDateTime = (date: string, time: string) => {
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);
    return `${month}월 ${day}일 ${time}`;
  };

  const getDayTimeImage = () => {
    const hour = currentTime.getHours();

    // 아침 (05:00 - 11:59)
    if (hour >= 5 && hour < 9) {
      return "https://images.unsplash.com/photo-1622649494866-880bf82f73d2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    }
    // 낮 (12:00 - 16:59)
    if (hour >= 9 && hour < 17) {
      return "https://images.unsplash.com/photo-1636595497638-336f8e0fa9cf?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    }
    // 저녁 (17:00 - 19:59)
    if (hour >= 17 && hour < 20) {
      return "https://images.unsplash.com/photo-1634104761447-1ffc30db1c4a?q=80&w=2944&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    }
    // 밤 (20:00 - 04:59)
    return "https://images.unsplash.com/photo-1556513583-a50f8a1a0b34?q=80&w=2836&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  };

  useEffect(() => {
    const calculateHeight = () => {
      if (textRef.current) {
        const lineHeight = 32; // 한 줄당 높이
        const baseHeight = 96; // 기본 높이
        const element = textRef.current;
        const lines = Math.ceil(element.scrollHeight / lineHeight);
        const additionalLines = Math.max(0, lines - 1); // 1줄 초과분에 대해서만 계산
        setContainerHeight(baseHeight + additionalLines * 32);
      }
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, [jumpCount]);

  // 오늘 날짜의 시작과 끝 시간 구하기
  const getTodayRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  };

  // 오늘의 점프 수 가져오기
  const fetchTodayJumpCount = async () => {
    const { start, end } = getTodayRange();

    const { count, error } = await supabase
      .from("jump")
      .select("*", { count: "exact" })
      .gte("created_at", start)
      .lt("created_at", end);

    if (error) {
      console.error("점프 수를 가져오는데 실패했습니다:", error);
      return;
    }

    setJumpCount(count || 0);
  };

  // 새로운 점프 추가
  const handleClick = async () => {
    try {
      const { error } = await supabase
        .from("jump")
        .insert([{ created_at: new Date().toISOString() }]);

      if (error) throw error;

      setJumpCount((prev) => prev + 1);
      setIsClicked(true);
    } catch (error) {
      console.error("점프를 추가하는데 실패했습니다:", error);
    }
  };

  // 컴포넌트 마운트시 초기 데이터 로드
  useEffect(() => {
    fetchTodayJumpCount();

    // 1분마다 업데이트
    const jumpCountTimer = setInterval(fetchTodayJumpCount, 3000);
    return () => clearInterval(jumpCountTimer);
  }, []);

  const handleMouseLeave = () => {
    setIsClicked(false);
  };

  return (
    <div className="relative w-full h-screen items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      {showBackground && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-background/60 z-10" />
          <Image
            src={getDayTimeImage()}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      <header
        id="header"
        className="absolute top-0 flex justify-between w-full gap-2 p-3 z-50"
      >
        <div className="flex items-center space-x-2">
          <Switch checked={showBackground} onCheckedChange={handleToggle} />
          <Label>Show Background</Label>
        </div>
        <ModeToggle />
      </header>
      <main className="w-full h-full flex flex-col flex-1 justify-center items-center relative z-10 p-4">
        <div className=" font-bold text-foreground/80 ">
          <div className="flex mb-2 items-center gap-1">
            <span className="text-sm text-foreground/50 font-medium">
              {waterTemp
                ? `${formatDateTime(waterTemp.date, waterTemp.time)} 기준`
                : "Loading..."}{" "}
            </span>
          </div>
          <div className="w-full text-foreground/70 font-medium flex justify-self-start items-center  flex-wrap text-lg sm:text-xl md:text-2xl lg:text-3xl ">
            <span className="">지금 한강의 수온은</span>
            {/* {isLoading ? (
              <LoaderCircle
                size={42}
                className="animate-spin text-foreground/70"
              />
            ) : ( */}
            <div className="flex items-center gap-2 font-bold text-foreground/80 ">
              <Thermometer size={42} />
              <span className=" font-bold">
                {isLoading && waterTemp === null
                  ? "-- "
                  : waterTemp?.temperature}
                °C
              </span>
            </div>
            {/* // )} */}
            <span className="">&nbsp;입니다</span>

            {/* <button
              onClick={fetchWaterTemp}
              className="flex items-center gap-2 text-xs text-foreground/40 hover:text-foreground/70 
                        transition-colors duration-200 px-3 py-1 rounded-full
                        hover:bg-foreground/10"
            >
              <RotateCcw size={14} />
              <span>새로고침</span>
            </button> */}
          </div>

          <div className="font-mono text-[5rem] sm:text-[7rem] md:text-[9rem] lg:text-[11rem] w-full flex justify-center items-center">
            {currentTime.toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })}
          </div>
        </div>
        <div className="absolute bottom-8 flex flex-col items-center gap-6 select-none">
          <div
            className={`group relative overflow-hidden rounded-2xl bg-background/10 backdrop-blur-md border border-background 
                      shadow-lg hover:shadow-xl transition-all duration-300
                      cursor-pointer
                      ${!isClicked && "hover:scale-105"}`}
            onClick={handleClick}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div
                className="min-w-80 max-w-full relative overflow-hidden"
                style={{ height: `${containerHeight}px` }}
              >
                <div
                  className={`flex flex-col transition-transform duration-500 ${
                    !isClicked && "group-hover:-translate-y-1/2"
                  }`}
                >
                  <div className="p-4 flex flex-col items-center gap-2">
                    <span className="h-6 flex items-center justify-center text-foreground/80 text-sm gap-2">
                      <Users size={18} />
                      오늘 이 사이트에서 뛰어든 사람들
                    </span>

                    <span
                      ref={textRef}
                      className="text-2xl font-bold text-foreground/70 break-all"
                    >
                      {jumpCount.toLocaleString()} 명
                    </span>
                  </div>
                  <div className="p-4 flex flex-col items-center gap-2">
                    <span className="h-6 flex items-center justify-center text-foreground/50 text-sm">
                      클릭하여 지친 마음을 털어버리세요
                    </span>
                    <span className="h-6 flex items-center justify-center text-foreground/70 font-bold">
                      나도 뛰어들기 💧
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 물결 효과 */}
            <div className="absolute inset-0 z-0">
              <svg
                className={`absolute w-full h-[300%] bottom-[-60%] transition-all duration-700 
                           ${!isClicked && "group-hover:bottom-0"}`}
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
              >
                <path className="fill-blue-400/20">
                  <animate
                    attributeName="d"
                    dur="2s"
                    repeatCount="indefinite"
                    values="
                      M0 25 Q 20 20, 50 25 Q 80 30, 100 25 L 100 50 L 0 50 Z;
                      M0 25 Q 20 30, 50 25 Q 80 20, 100 25 L 100 50 L 0 50 Z;
                      M0 25 Q 20 20, 50 25 Q 80 30, 100 25 L 100 50 L 0 50 Z"
                  />
                </path>
                <path className="fill-blue-500/20">
                  <animate
                    attributeName="d"
                    dur="5s"
                    repeatCount="indefinite"
                    values="
                      M0 25 Q 30 22, 50 25 Q 70 28, 100 25 L 100 50 L 0 50 Z;
                      M0 25 Q 30 28, 50 25 Q 70 22, 100 25 L 100 50 L 0 50 Z;
                      M0 25 Q 30 22, 50 25 Q 70 28, 100 25 L 100 50 L 0 50 Z"
                  />
                </path>
                <path className="fill-blue-600/20">
                  <animate
                    attributeName="d"
                    dur="4s"
                    repeatCount="indefinite"
                    values="
                      M0 25 Q 25 23, 50 25 Q 75 27, 100 25 L 100 50 L 0 50 Z;
                      M0 25 Q 25 27, 50 25 Q 75 23, 100 25 L 100 50 L 0 50 Z;
                      M0 25 Q 25 23, 50 25 Q 75 27, 100 25 L 100 50 L 0 50 Z"
                  />
                </path>
              </svg>
            </div>
          </div>
        </div>
      </main>
      {/* <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer> */}
    </div>
  );
}
