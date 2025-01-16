import { useCallback, useRef } from "react";

export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastRun = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (lastRun.current && now < lastRun.current + wait) {
        // 마지막 실행으로부터 대기 시간이 지나지 않았으면 실행하지 않음
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      lastRun.current = now;
      func(...args);
    },
    [func, wait]
  ) as T;
}
