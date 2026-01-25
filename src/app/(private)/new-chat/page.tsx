"use client";

import { ContainerLayout, PageContainer } from "@/components/widget/Page";
import { NewPrompt } from "@/components/widget/PromptComposer";
import { useActiveChatSession } from "@/context/useActiveChatSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  // Contexts
  const activeChat = useActiveChatSession((s) => s.activeChat);
  const resetActiveChat = useActiveChatSession((s) => s.resetActiveChat);

  // Hooks
  const router = useRouter();

  // States
  const isInitialPrompted = activeChat.messages?.length === 1;
  const sessionId = activeChat.session?.id;

  // Reroute to new chat session on sessionId ready
  useEffect(() => {
    if (isInitialPrompted && sessionId) {
      router.push(`/c/${sessionId}`);
    } else {
      resetActiveChat();
    }
  }, [isInitialPrompted, sessionId]);

  return (
    <PageContainer p={4}>
      <ContainerLayout>
        {/* {isInitialPrompted && <InitialPrompted />} */}

        <NewPrompt loading={isInitialPrompted} m={"auto"} />
      </ContainerLayout>
    </PageContainer>
  );
}
