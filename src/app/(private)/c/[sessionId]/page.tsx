"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { ChatSkeleton } from "@/components/ui/c-loader";
import { P } from "@/components/ui/p";
import { AppIcon } from "@/components/widget/AppIcon";
import { MarkdownChat, UserBubbleChat } from "@/components/widget/Chatting";
import { Clipboard } from "@/components/widget/Clipboard";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { ContainerLayout, PageContainer } from "@/components/widget/Page";
import { ContinuePrompt } from "@/components/widget/PromptComposer";
import { CHAT_API_SHOW_CHAT } from "@/constants/apis";
import { Interface__ChatMessage } from "@/constants/interfaces";
import useActiveChatSession from "@/context/useActiveChatSession";
import usePromptInput from "@/context/usePromptInput";
import useDataState from "@/hooks/useDataState";
import { useScrollBottom } from "@/hooks/useScrollBottom";
import { isEmptyArray } from "@/utils/array";
import { formatDate } from "@/utils/formatter";
import { HStack } from "@chakra-ui/react";
import { ArrowDownIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Page() {
  // Contexts
  const promptInputStyle = usePromptInput((s) => s.style);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const scrollBottom = useScrollBottom(containerRef);
  const { sessionId } = useParams();

  // States
  const { error, initialLoading, data, onRetry } = useDataState<any>({
    url: `${CHAT_API_SHOW_CHAT}/${sessionId}`,
    dataResource: false,
  });
  const activeChat = useActiveChatSession((s) => s.activeChat);

  // Utils
  function scrollToBottom() {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }

  // Scroll to bottom on load
  useEffect(() => {
    scrollToBottom();
  }, []);

  const render = {
    loading: <ChatSkeleton />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <CContainer flex={1} gap={4}>
        {activeChat.messages.map((message: Interface__ChatMessage) => {
          if (message.role === "user") {
            return (
              <CContainer key={message.id} gap={2}>
                <UserBubbleChat>{message.content}</UserBubbleChat>

                <HStack wrap={"wrap"} justify={"end"}>
                  <Clipboard>{message.content}</Clipboard>
                </HStack>
              </CContainer>
            );
          }

          if (message.role === "assistant") {
            return (
              <CContainer key={message.id} gap={2}>
                <MarkdownChat>{message.content}</MarkdownChat>

                <HStack wrap={"wrap"}>
                  <Clipboard>{message.content}</Clipboard>
                </HStack>
              </CContainer>
            );
          }
        })}
      </CContainer>
    ),
  };

  let content = null;
  if (activeChat.isNewSession) {
    content = render.loaded;
  } else {
    if (initialLoading) {
      content = render.loading;
    } else if (error) {
      content = render.error;
    } else if (!data || isEmptyArray(data)) {
      content = render.empty;
    } else {
      content = render.loaded;
    }
  }

  return (
    <PageContainer pos={"relative"}>
      <CContainer
        ref={containerRef}
        p={4}
        overflowY={"auto"}
        scrollBehavior={"smooth"}
      >
        <ContainerLayout
          justify={"space-between"}
          gap={8}
          pb={`calc(${promptInputStyle?.h} + 30px)`}
        >
          <CContainer>
            <P fontSize={"xl"} fontWeight={"semibold"}>
              {activeChat.session?.title}
            </P>

            <P color={"fg.subtle"}>
              {formatDate(activeChat.session?.createdAt)}
            </P>
          </CContainer>

          {content}
        </ContainerLayout>

        <CContainer
          align={"center"}
          gap={4}
          position={"absolute"}
          left={0}
          bottom={0}
        >
          <ContainerLayout gap={4} align={"center"}>
            {scrollBottom > 1 && (
              <Btn
                iconButton
                clicky={false}
                onClick={scrollToBottom}
                size={"xs"}
                w={"fit"}
                bg={"body"}
                variant={"surface"}
              >
                <AppIcon icon={ArrowDownIcon} />
              </Btn>
            )}

            <CContainer bg={"body"}>
              <ContinuePrompt mb={2} />
            </CContainer>
          </ContainerLayout>
        </CContainer>
      </CContainer>
    </PageContainer>
  );
}
