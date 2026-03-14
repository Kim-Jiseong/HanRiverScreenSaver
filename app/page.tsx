"use client";

import { useEffect, useState, useRef } from "react";
import { ModeToggle } from "@/components/toggle-theme";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";

import Image from "next/image";
import { Thermometer, Users } from "lucide-react";
import axios from "axios";

interface HangangLocation {
  TEMP: number;
  LAST_UPDATE: string;
  PH: number;
}

interface HangangData {
  STATUS: string;
  MSG: string;
  DATAs: {
    CACHE_META: {
      CREATED_AT: number;
      UPDATED_AT: number;
      DATA_KEY: string;
    };
    DATA: {
      HANGANG: {
        [key: string]: HangangLocation;
      };
    };
  };
}

export default function Home() {
  /**
   * 배경 표시 여부
   */
  const [showBackground, setShowBackground] = useState(true);

  /**
   * 배경 타입: 이미지 or 라이브
   */
  const [backgroundType, setBackgroundType] = useState<"image" | "live">(
    "image"
  );

  const [currentTime, setCurrentTime] = useState(new Date());
  const [waterTemp, setWaterTemp] = useState<{
    location: string;
    data: HangangLocation;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [jumpCount, setJumpCount] = useState(0);
  const [containerHeight, setContainerHeight] = useState(96);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isClicked, setIsClicked] = useState(false);

  /**
   * 한강 수온 API 호출
   */
  const fetchWaterTemp = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<HangangData>(
        "https://api.hangang.life/"
      );

      // 가장 최근 데이터와 위치 선택
      const locations = Object.entries(response.data.DATAs.DATA.HANGANG);
      
      // TEMP 값이 존재하는 (null이 아닌) 데이터만 필터링
      const validLocations = locations.filter(([_, data]) => data.TEMP !== null);

      if (validLocations.length === 0) {
        throw new Error("유효한 수온 데이터가 없습니다.");
      }

      const [latestLocation, latestData] = validLocations.reduce(
        ([prevLoc, prevData], [currLoc, currData]) => {
          const prevTime = new Date(prevData.LAST_UPDATE).getTime();
          const currTime = new Date(currData.LAST_UPDATE).getTime();
          return currTime > prevTime
            ? [currLoc, currData]
            : [prevLoc, prevData];
        }
      );

      setWaterTemp({ location: latestLocation, data: latestData });
    } catch (error) {
      console.error("한강 수온 데이터를 가져오는데 실패했습니다:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 한강 수온 데이터 5분 간격으로 갱신
   */
  useEffect(() => {
    fetchWaterTemp();
    const waterTempTimer = setInterval(fetchWaterTemp, 300000);
    return () => clearInterval(waterTempTimer);
  }, []);

  /**
   * 시간 1초 간격으로 갱신
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /**
   * 로컬 스토리지에서 showBackground, backgroundType 가져오기
   */
  useEffect(() => {
    const storedBackground = localStorage.getItem("showBackground");
    const storedType = localStorage.getItem("backgroundType");

    if (storedBackground !== null) {
      setShowBackground(JSON.parse(storedBackground));
    } else {
      localStorage.setItem("showBackground", JSON.stringify(false));
    }

    if (storedType !== null) {
      const parsedType = storedType === "live" ? "live" : "image";
      setBackgroundType(parsedType);
    } else {
      localStorage.setItem("backgroundType", "image");
    }
  }, []);

  /**
   * 배경 On/Off 토글 핸들러
   */
  const handleToggleBackground = (checked: boolean) => {
    setShowBackground(checked);
    localStorage.setItem("showBackground", JSON.stringify(checked));
  };

  /**
   * 배경 타입 라이브/이미지 전환 핸들러
   */
  const handleToggleLive = (checked: boolean) => {
    const newType = checked ? "live" : "image";
    setBackgroundType(newType);
    localStorage.setItem("backgroundType", newType);
  };

  /**
   * 수온 정보 날짜/시간 포맷
   */
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const time = date.toTimeString().slice(0, 5);
    return `${month}월 ${day}일 ${time}`;
  };

  /**
   * 시간대별 배경 이미지
   */
  const getDayTimeImage = () => {
    const hour = currentTime.getHours();
    // 아침 (05:00 - 08:59)
    if (hour >= 5 && hour < 9) {
      return "https://images.unsplash.com/photo-1622649494866-880bf82f73d2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3";
    }
    // 낮 (09:00 - 16:59)
    if (hour >= 9 && hour < 17) {
      return "https://images.unsplash.com/photo-1636595497638-336f8e0fa9cf?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3";
    }
    // 저녁 (17:00 - 19:59)
    if (hour >= 17 && hour < 20) {
      return "https://images.unsplash.com/photo-1634104761447-1ffc30db1c4a?q=80&w=2944&auto=format&fit=crop&ixlib=rb-4.0.3";
    }
    // 밤 (20:00 - 04:59)
    return "https://images.unsplash.com/photo-1556513583-a50f8a1a0b34?q=80&w=2836&auto=format&fit=crop&ixlib=rb-4.0.3";
  };

  /**
   * Text block 높이 계산
   */
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

  /**
   * 오늘 날짜의 시작과 끝 구하기
   */
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

  /**
   * 오늘의 점프 수 가져오기
   */
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

    const randomAddition = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
    setJumpCount(count || 0);
    // setJumpCount((count || 0) + randomAddition);
  };

  /**
   * 새로운 점프 추가
   */
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

  const handleMouseLeave = () => {
    setIsClicked(false);
  };

  /**
   * 마운트시 초기 점프 수 로드 및 3초 간격 업데이트
   */
  useEffect(() => {
    fetchTodayJumpCount();
    const jumpCountTimer = setInterval(fetchTodayJumpCount, 3000);
    return () => clearInterval(jumpCountTimer);
  }, []);

  return (
    <>
    <div className="relative w-full h-screen items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      {/* 배경 표시 여부 & 배경 타입(live / image)에 따라 표시 */}
      {showBackground && (
        <>
          {backgroundType === "live" ? (
            /**
             * 유튜브 라이브 배경 (mute, autoplay 등을 파라미터로)
             * 실제 라이브 URL로 대체해서 사용 가능
             */
            <iframe
              className="absolute inset-0 w-full h-full z-0"
              src="https://www.youtube.com/embed/-JhoMGoAfFc?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&rel=0&disablekb=1&iv_load_policy=3"
              title="실시간 서울 한강 라이브캠"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            // <iframe width="1021" height="562" src="https://www.youtube.com/embed/-JhoMGoAfFc" title="실시간 서울 한강 라이브캠 - 반포대교 4K Hangang Live Cam  24시간 로파이 노동요" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            /**
             * 이미지 배경
             */
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-background/60 z-10" />
              <Image
                src={getDayTimeImage()}
                alt="서울 한강 풍경 배경 이미지"
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </>
      )}

      {/* 헤더 영역 */}
      <header
        id="header"
        className="absolute top-0 flex justify-between w-full gap-2 p-3 z-50"
      >
        <div className="flex items-center space-x-2">
          {/* 배경 ON/OFF */}
          <Switch
            checked={showBackground}
            onCheckedChange={handleToggleBackground}
          />
          <Label>Show Background</Label>

          {/* 배경이 ON일 때만 이미지/라이브 선택 토글 표시 */}
          {showBackground && (
            <div className="flex items-center space-x-2 ml-4">
              <Switch
                checked={backgroundType === "live"}
                onCheckedChange={handleToggleLive}
              />
              <Label>Live</Label>
            </div>
          )}
        </div>
        <ModeToggle />
      </header>

      {/* 메인 컨텐츠 */}
      <main className="w-full h-full flex flex-col flex-1 justify-center items-center relative z-10 p-4">
        <div className="font-bold text-foreground/80">
          <h1 className="text-xs sm:text-sm text-foreground/30 font-normal tracking-wider mb-4">
            한강물 온도 실시간
          </h1>
          <div className="flex mb-2 items-center gap-1">
            <span className="text-sm text-foreground/50 font-medium">
              {waterTemp
                ? `${formatDateTime(waterTemp.data.LAST_UPDATE)} ${
                    waterTemp.location
                  } 기준`
                : "Loading..."}{" "}
            </span>
          </div>
          <div className="w-full text-foreground/70 font-medium flex justify-self-start items-center flex-wrap text-lg sm:text-xl md:text-2xl lg:text-3xl">
            <span>지금 한강의 수온은</span>
            <div className="flex items-center gap-2 font-bold text-foreground/80 ml-2">
              <Thermometer size={42} />
              <span>
                {isLoading && waterTemp === null ? "--" : waterTemp?.data.TEMP}
                °C
              </span>
            </div>
            <span>&nbsp;입니다</span>
          </div>

          <div className="font-mono text-[4.5rem] sm:text-[7rem] md:text-[9rem] lg:text-[11rem] w-full px-4 sm:px-0 flex justify-center items-center break-keep text-center">
            {currentTime.toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })}
          </div>
        </div>

        {/* 점프(뛰어들기) 카운트 섹션 */}
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
                  {/* 현재 점프 상태 */}
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
                  {/* 유도 메시지 */}
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

            {/* 물결 애니메이션 */}
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
    </div>

    {/* SEO Content Section - Below Fold */}
    <footer className="relative w-full bg-background border-t border-foreground/10">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground/80 mb-4">
            한강물 온도 실시간 정보
          </h2>
          <p className="text-foreground/60 leading-relaxed mb-3">
            hangang.live는 서울 한강의 실시간 수온 정보를 제공합니다.
            서울시 수질 자동측정망에서 수집한 데이터를 기반으로,
            노량진, 선유, 탄천, 중랑천, 안양천 등 주요 측정 지점의
            한강물 온도를 실시간으로 확인할 수 있습니다.
          </p>
          <p className="text-foreground/60 leading-relaxed">
            한강 수온은 계절에 따라 크게 변화합니다.
            여름철(6~8월)에는 20°C~27°C까지 상승하며,
            겨울철(12~2월)에는 1°C~5°C까지 하강합니다.
            봄과 가을에는 10°C~18°C 사이를 유지합니다.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground/80 mb-6">
            자주 묻는 질문
          </h2>
          <div className="space-y-4">
            <details className="group border-b border-foreground/10 pb-4">
              <summary className="cursor-pointer text-foreground/70 font-medium hover:text-foreground/90 transition-colors">
                한강물 온도는 어떻게 측정하나요?
              </summary>
              <p className="mt-3 text-foreground/50 text-sm leading-relaxed pl-4">
                서울시 수질 자동측정망을 통해 실시간으로 측정되며, 주요 지점(노량진, 선유 등)의 데이터를 제공합니다.
              </p>
            </details>
            <details className="group border-b border-foreground/10 pb-4">
              <summary className="cursor-pointer text-foreground/70 font-medium hover:text-foreground/90 transition-colors">
                한강 물놀이 적정 수온은 몇 도인가요?
              </summary>
              <p className="mt-3 text-foreground/50 text-sm leading-relaxed pl-4">
                적정 수온은 약 22°C~28°C입니다. 20°C 이하에서는 체온 저하 위험이 있습니다.
              </p>
            </details>
            <details className="group border-b border-foreground/10 pb-4">
              <summary className="cursor-pointer text-foreground/70 font-medium hover:text-foreground/90 transition-colors">
                겨울철 한강 수온은 보통 몇 도인가요?
              </summary>
              <p className="mt-3 text-foreground/50 text-sm leading-relaxed pl-4">
                일반적으로 1°C~5°C 사이이며, 매우 추운 날씨에는 0°C에 가까워집니다.
              </p>
            </details>
            <details className="group border-b border-foreground/10 pb-4">
              <summary className="cursor-pointer text-foreground/70 font-medium hover:text-foreground/90 transition-colors">
                한강물 온도 데이터는 얼마나 자주 업데이트되나요?
              </summary>
              <p className="mt-3 text-foreground/50 text-sm leading-relaxed pl-4">
                약 5분 간격으로 갱신되며, 화면에는 가장 최근 측정 시간이 함께 표시됩니다.
              </p>
            </details>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground/80 mb-4">
            한강 수온 측정 위치
          </h2>
          <p className="text-foreground/60 leading-relaxed">
            서울시는 한강 본류와 주요 지천의 수질을 모니터링하기 위해
            여러 지점에 자동측정 장비를 운영하고 있습니다.
            주요 측정 지점으로는 노량진, 선유, 탄천, 중랑천, 안양천 등이 있으며,
            hangang.live는 이 중 가장 최근에 업데이트된 측정 지점의
            데이터를 대표값으로 표시합니다.
          </p>
        </section>

        <div className="pt-8 border-t border-foreground/10 text-center">
          <p className="text-foreground/30 text-xs">
            © {new Date().getFullYear()} hangang.live - 한강물 온도 실시간 확인
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}
