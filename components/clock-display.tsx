"use client";

import { Thermometer } from "lucide-react";
import type { WaterTempResult } from "@/lib/types";

function formatDateTime(dateTime: string) {
  const date = new Date(dateTime);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const time = date.toTimeString().slice(0, 5);
  return `${month}월 ${day}일 ${time}`;
}

interface ClockDisplayProps {
  currentTime: Date;
  waterTemp: WaterTempResult | null;
  isLoading: boolean;
}

export function ClockDisplay({
  currentTime,
  waterTemp,
  isLoading,
}: ClockDisplayProps) {
  return (
    <div className="w-full flex-1 flex flex-col justify-center items-center font-bold text-foreground/80 min-h-[300px]">
      <h1>실시간 한강 수온</h1>
      <div className="flex mb-2 items-center gap-1">
        <span className="text-sm text-foreground/50 font-medium">
          {waterTemp
            ? `${formatDateTime(waterTemp.data.LAST_UPDATE)} ${waterTemp.location} 기준`
            : "Loading..."}{" "}
        </span>
      </div>
      <div className="w-full text-foreground/70 font-medium flex justify-center sm:justify-self-start items-center flex-wrap text-lg sm:text-xl md:text-2xl lg:text-3xl">
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
  );
}
