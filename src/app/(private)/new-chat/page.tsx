"use client";

import { ContainerLayout, PageContainer } from "@/components/widget/Page";
import { NewPrompt } from "@/components/widget/PromptComposer";
import { useActiveChatSession } from "@/context/useActiveChatSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  // Contexts
  const activeChat = useActiveChatSession((s) => s.activeChat);
  const isInitialPrompted = activeChat.messages?.length === 1;
  const sessionId = activeChat.session?.id;

  // Hooks
  const router = useRouter();

  // Reroute to new chat session on sessionId ready
  useEffect(() => {
    if (sessionId) {
      router.push(`/c/${sessionId}`);
    }
  }, [sessionId]);

  return (
    <PageContainer p={4}>
      <ContainerLayout>
        {/* {isInitialPrompted && <InitialPrompted />} */}

        <NewPrompt loading={isInitialPrompted} m={"auto"} />
      </ContainerLayout>
    </PageContainer>
  );
}
