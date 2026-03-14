"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import type { HangangData, WaterTempResult } from "@/lib/types";

export function useWaterTemp() {
  const [waterTemp, setWaterTemp] = useState<WaterTempResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWaterTemp = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<HangangData>(
          "https://api.hangang.life/",
        );

        const locations = Object.entries(response.data.DATAs.DATA.HANGANG);

        const validLocations = locations.filter(
          ([_, data]) => data.TEMP !== null,
        );

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
          },
        );

        setWaterTemp({ location: latestLocation, data: latestData });
      } catch (error) {
        console.error("한강 수온 데이터를 가져오는데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWaterTemp();
    const timer = setInterval(fetchWaterTemp, 300000);
    return () => clearInterval(timer);
  }, []);

  return { waterTemp, isLoading };
}
