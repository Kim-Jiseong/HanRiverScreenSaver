"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function getTodayRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export function useJumpCount() {
  const [jumpCount, setJumpCount] = useState(0);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
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

    fetchTodayJumpCount();
    const timer = setInterval(fetchTodayJumpCount, 3000);
    return () => clearInterval(timer);
  }, []);

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

  return { jumpCount, isClicked, handleClick, handleMouseLeave };
}
