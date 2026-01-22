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
import useActiveChatSession, {
  DEFAULT_ACTIVE_CHAT,
} from "@/context/useActiveChatSession";
import useLang from "@/context/useLang";
import usePromptInput from "@/context/usePromptInput";
import useDataState from "@/hooks/useDataState";
import { useScrollBottom } from "@/hooks/useScrollBottom";
import { isEmptyArray } from "@/utils/array";
import { formatDate } from "@/utils/formatter";
import { Badge, HStack } from "@chakra-ui/react";
import { ArrowDownIcon, RefreshCwIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

const Messages = () => {
  // Contexts
  const { l } = useLang();
  const activeChat = useActiveChatSession((s) => s.activeChat);
  const setActiveChat = useActiveChatSession((s) => s.setActiveChat);

  // Hooks
  const { sessionId } = useParams();

  // States
  const { error, initialLoading, data, onRetry } = useDataState<any>({
    url: `${CHAT_API_SHOW_CHAT}/${sessionId}`,
    dataResource: false,
    dependencies: [activeChat.isNewSession],
    conditions: !activeChat.isNewSession || !activeChat.session,
  });
  const messages = activeChat.messages;

  // Reset active chat on sessionId change
  useEffect(() => {
    setActiveChat(DEFAULT_ACTIVE_CHAT);
  }, [sessionId]);

  // Set active chat on data load
  useEffect(() => {
    if (!activeChat.isNewSession && data) {
      setActiveChat({
        session: data.session,
        messages: data.messages || [],
        totalMessages: data.totalMessage || data.messages?.length || 0,
        isNewSession: false,
      });
    }
  }, [data]);

  const render = {
    loading: <ChatSkeleton />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <CContainer flex={1} gap={4} px={2}>
        {activeChat.messages.map((message: Interface__ChatMessage) => {
          // User Message
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

          // Assistant Message
          if (message.role === "assistant") {
            return (
              <CContainer key={message.id} gap={2}>
                <MarkdownChat error={true}>{message.content}</MarkdownChat>

                <HStack>
                  {message?.sources?.map((source, index) => {
                    return <Badge key={index}>{source}</Badge>;
                  })}
                </HStack>

                {message.error && (
                  <P color={"fg.error"}>{l.msg_assistant_response_error}</P>
                )}

                <HStack wrap={"wrap"}>
                  <Clipboard>{message.content}</Clipboard>

                  <Btn iconButton size={"xs"} variant={"ghost"}>
                    <AppIcon icon={RefreshCwIcon} />
                  </Btn>
                </HStack>
              </CContainer>
            );
          }
        })}
      </CContainer>
    ),
  };

  return (
    <>
      {initialLoading && render.loading}
      {!initialLoading && (
        <>
          {error && render.error}
          {!error && (
            <>
              {messages && render.loaded}
              {(!messages || isEmptyArray(messages)) && render.empty}
            </>
          )}
        </>
      )}
    </>
  );
};

export default function Page() {
  // Contexts
  const promptInputStyle = usePromptInput((s) => s.style);
  const activeChat = useActiveChatSession((s) => s.activeChat);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const scrollBottom = useScrollBottom(containerRef);

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
          pb={`calc(${promptInputStyle?.h} + 56px)`}
        >
          <CContainer>
            <P fontSize={"xl"} fontWeight={"semibold"}>
              {activeChat.session?.title}
            </P>

            <P color={"fg.subtle"}>
              {formatDate(activeChat.session?.createdAt)}
            </P>
          </CContainer>

          <Messages />
        </ContainerLayout>

        <CContainer
          align={"center"}
          px={4}
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
