"use client";

import { PageContainer } from "@/components/widget/Page";
import { CHAT_API_SHOW_CHAT } from "@/constants/apis";
import useDataState from "@/hooks/useDataState";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Page() {
  // Hooks
  const { sessionId } = useParams();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const { error, initialLoading, data, onRetry } = useDataState<any>({
    initialData: undefined,
    url: `${CHAT_API_SHOW_CHAT}/${sessionId}`,
  });

  // Scroll to bottom on load
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  return (
    <PageContainer ref={containerRef} minH={"300vh"}>
      Tes
    </PageContainer>
  );
}
