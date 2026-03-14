"use client";

import Image from "next/image";

function getDayTimeImage(hour: number) {
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
}

interface BackgroundProps {
  show: boolean;
  type: "image" | "live";
  currentHour: number;
}

export function Background({ show, type, currentHour }: BackgroundProps) {
  if (!show) return null;

  if (type === "live") {
    return (
      <iframe
        className="absolute inset-0 w-full h-full z-0"
        src="https://www.youtube.com/embed/-JhoMGoAfFc?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&rel=0&disablekb=1&iv_load_policy=3"
        title="실시간 서울 한강 라이브캠"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-background/60 z-10" />
      <Image
        src={getDayTimeImage(currentHour)}
        alt="서울 한강 풍경 배경 이미지"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
