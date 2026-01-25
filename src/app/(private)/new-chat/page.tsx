"use client";

import { ContainerLayout, PageContainer } from "@/components/widget/Page";
import { NewPrompt } from "@/components/widget/PromptComposer";
import { useActiveChat } from "@/context/useActiveChat";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  // Contexts
  const activeChat = useActiveChat((s) => s.activeChat);

  // Hooks
  const router = useRouter();

  // States
  const isNewChat = activeChat.isNewChat;
  const sessionId = activeChat.session?.id;
  const initialLoading = activeChat.isNewChat && activeChat.isStreaming;

  // Reroute to new chat session on sessionId ready
  useEffect(() => {
    if (isNewChat && sessionId) {
      router.push(`/c/${sessionId}`);
    }
  }, [isNewChat, sessionId]);

  return (
    <PageContainer p={4}>
      <ContainerLayout>
        {/* {isInitialPrompted && <InitialPrompted />} */}

        <NewPrompt loading={initialLoading} m={"auto"} />
      </ContainerLayout>
    </PageContainer>
  );
}
