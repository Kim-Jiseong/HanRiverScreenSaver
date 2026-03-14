"use client";

import { Users } from "lucide-react";

interface JumpCounterProps {
  jumpCount: number;
  isClicked: boolean;
  onClick: () => void;
  onMouseLeave: () => void;
}

export function JumpCounter({
  jumpCount,
  isClicked,
  onClick,
  onMouseLeave,
}: JumpCounterProps) {
  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center gap-6 select-none pointer-events-auto order-2 md:order-2">
      <div
        className={`group w-full relative overflow-hidden rounded-2xl bg-background/10 backdrop-blur-md border border-background
          shadow-lg hover:shadow-xl transition-all duration-300
          cursor-pointer
          ${!isClicked && "hover:scale-105"}`}
        onClick={onClick}
        onMouseLeave={onMouseLeave}
      >
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-full relative overflow-hidden h-24">
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
                <span className="text-2xl font-bold text-foreground/70 break-all">
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
  );
}
