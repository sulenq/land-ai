"use client";

import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import Spinner from "@/components/ui/spinner";
import { UserBubbleChat } from "@/components/widget/Chatting";
import { Clipboard } from "@/components/widget/Clipboard";
import { PageContainer, ContainerLayout } from "@/components/widget/Page";
import { ContinuePrompt, NewPrompt } from "@/components/widget/PromptComposer";
import { useActiveChatSession } from "@/context/useActiveChatSession";
import useLang from "@/context/useLang";
import { formatDate } from "@/utils/formatter";
import { HStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const InitialPrompted = () => {
  // Contexts
  const { l } = useLang();
  const activeChat = useActiveChatSession((s) => s.activeChat);

  // States
  const userInitialPrompt = activeChat.messages?.[0].content;

  return (
    <CContainer flex={1}>
      <CContainer mb={4}>
        <P fontSize={"xl"} fontWeight={"semibold"}>
          {l.new_chat}
        </P>

        <P color={"fg.subtle"}>{formatDate(activeChat.session?.createdAt)}</P>
      </CContainer>

      <CContainer gap={4}>
        <CContainer gap={2}>
          <UserBubbleChat>{userInitialPrompt}</UserBubbleChat>

          <HStack wrap={"wrap"} justify={"end"}>
            <Clipboard>{userInitialPrompt}</Clipboard>
          </HStack>

          <Spinner size={"sm"} ml={2} />
        </CContainer>
      </CContainer>

      <ContinuePrompt mt={"auto"} disabled />
    </CContainer>
  );
};

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
        {isInitialPrompted && <InitialPrompted />}

        {!isInitialPrompted && <NewPrompt m={"auto"} />}
      </ContainerLayout>
    </PageContainer>
  );
}
