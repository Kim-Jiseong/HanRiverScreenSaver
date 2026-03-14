"use server";

import { headers } from "next/headers";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

export async function submitChatMessage(message: string) {
  if (!message || message.trim() === "") {
    return { error: "메시지를 입력해주세요." };
  }

  if (message.length > 200) {
    return { error: "메시지가 너무 깁니다. 200자 이내로 작성해주세요." };
  }

  // 1. IP 주소 가져오기
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  let ip = "unknown";

  if (forwardedFor) {
    ip = forwardedFor.split(",")[0].trim();
  } else if (realIp) {
    ip = realIp;
  }

  // 2. IP 해싱 (개인정보 보호)
  const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

  // 4. 메시지 저장
  const { error: insertError } = await supabase
    .from("chat_messages")
    .insert([{ message: message.trim(), ip_hash: ipHash }]);

  if (insertError) {
    console.error("채팅 저장 에러:", insertError);
    return { error: "메시지 전송에 실패했습니다." };
  }

  return { success: true };
}
