"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { submitChatMessage } from "@/app/actions/chat";
import { Send, ChevronUp, ChevronDown } from "lucide-react";

interface ChatMessage {
  id: string;
  created_at: string;
  message: string;
  ip_hash: string;
}

interface ChatWidgetProps {
  isVisible: boolean;
  className?: string; // 추가적인 스타일 바인딩을 위한 props
}

export function ChatWidget({ isVisible, className = "" }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. 기존 메시지 로드 및 구독 설정
  useEffect(() => {
    if (!isVisible) return;

    const fetchMessages = async () => {
      const twentyFourHoursAgo = new Date(
        Date.now() - 24 * 60 * 60 * 1000,
      ).toISOString();

      const { data, error } = await supabase
        .from("chat_messages")
        .select("id, created_at, message, ip_hash")
        .gte("created_at", twentyFourHoursAgo)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
    };

    fetchMessages();

    // Realtime 구독
    const channel = supabase
      .channel("public:chat_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => {
            // 중복 확인
            if (prev.find((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isVisible]);

  // 2. 메시지 자동 스크롤
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [messages, isExpanded]);

  // 3. 메시지 전송
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSubmitting) return;

    // 30초 발송 쿨타임 체크 (프론트엔드 최적화)
    const lastSent = localStorage.getItem("lastChatSent");
    if (lastSent) {
      const timeDiff = Date.now() - parseInt(lastSent, 10);
      const cooldown = 30000; // 30초
      if (timeDiff < cooldown) {
        const remaining = Math.ceil((cooldown - timeDiff) / 1000);
        setErrorMsg(`${remaining}초 후에 다시 보낼 수 있습니다`);
        setTimeout(() => setErrorMsg(""), 3000);
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const { error, success } = await submitChatMessage(newMessage);

    if (error) {
      setErrorMsg(error);
      setIsSubmitting(false);
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    if (success) {
      setNewMessage("");
      localStorage.setItem("lastChatSent", Date.now().toString());
      setIsSubmitting(false);
    }
  };

  // IP 해시를 짧게 잘라서 표시
  const formatIp = (ipHash?: string) => {
    if (!ipHash) return "???";
    return ipHash.substring(0, 4);
  };

  // 상대 시간 표시 포맷 (X분 전, X시간 전 등)
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "방금 전";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}일 전`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}달 전`;
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}년 전`;
  };

  if (!isVisible) return null;

  return (
    <div
      className={`relative flex flex-col pointer-events-auto z-50 transition-all duration-500 opacity-90 hover:opacity-100 bg-background/10 backdrop-blur-md rounded-2xl border border-background shadow-lg overflow-hidden ${
        isExpanded ? "h-[22rem]" : "h-24" // 닫혔을 때 점프 카드 높이(약 96px)와 일치
      } ${className}`}
    >
      {/* 아코디언 토글 헤더 (얇고 길게 배치) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
        className="w-full flex-none h-3 flex justify-center items-center bg-foreground/5 hover:bg-foreground/10 transition-colors border-b border-foreground/10 cursor-pointer"
        title={isExpanded ? "채팅창 접기" : "채팅창 확장"}
      >
        {isExpanded ? (
          <ChevronDown size={12} className="text-foreground/40" />
        ) : (
          <ChevronUp size={12} className="text-foreground/40" />
        )}
      </button>

      {/* 내부 컨텐츠 패딩 래퍼 */}
      <div className="flex flex-col flex-1 px-3 py-1 overflow-hidden">
        {/* 
          마스크 이미지를 통해 리스트 위쪽으로 갈수록 투명해지는 그라데이션 페이드 효과 적용 
        */}
        <div
          className={`w-full flex-1 overflow-y-auto mb-2 pr-1 transition-colors ${
            isExpanded ? "scrollbar-thin" : "scrollbar-hide"
          }`}
          style={{
            maskImage: isExpanded
              ? "linear-gradient(to top, black 80%, transparent 100%)"
              : "none",
            WebkitMaskImage: isExpanded
              ? "linear-gradient(to top, black 80%, transparent 100%)"
              : "none",
          }}
        >
          <div className="flex flex-col justify-end min-h-full space-y-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="flex  items-end gap-2 text-foreground/70 animate-fade-in-up"
                // PC: 우측 정렬, 모바일: 중앙 하단 배치 (부모 className에서 flex-col, items-end/center 등으로 조정)
              >
                {/* 메타 정보 (모바일에서는 좌측, PC에서는 좌측에 붙여도 무방. PC는 부모가 items-end일 시 정렬이 반대) */}
                <span className="text-sm break-keep leading-tight font-light tracking-wide">
                  {msg.message}
                </span>{" "}
                <span className="text-[0.6rem] text-foreground/30 font-mono tracking-tighter shrink-0 mb-[1px]">
                  {formatIp(msg.ip_hash)} • {formatRelativeTime(msg.created_at)}
                </span>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="flex-1 w-full flex items-end justify-center text-foreground/30 text-xs italic font-light pb-2">
                조용한 한강변에서 대화를 시작하세요
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 에러 메시지 */}
        {errorMsg && (
          <div className="flex-none text-destructive text-[0.7rem] animate-pulse mb-1 self-center md:self-end">
            {errorMsg}
          </div>
        )}

        {/* 입력 폼 (투명하고 미니멀한 라인 디자인) */}
        <form
          onSubmit={handleSubmit}
          className="flex-none flex items-center border-b border-foreground/20 focus-within:border-foreground/50 transition-colors w-full gap-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="다른 사람들과 대화해보세요 (최대 100자)"
            disabled={isSubmitting}
            maxLength={100}
            className="flex-1 bg-transparent border-none text-sm text-foreground/80 placeholder:text-foreground/30 focus:outline-none focus:ring-0 disabled:opacity-50 font-light"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newMessage.trim()}
            className="text-foreground/30 hover:text-foreground/70 disabled:opacity-30 transition-colors p-1 flex-shrink-0"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
