"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { ChatSkeleton } from "@/components/ui/c-loader";
import { P } from "@/components/ui/p";
import Spinner from "@/components/ui/spinner";
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
import { useActiveChatSession } from "@/context/useActiveChatSession";
import { useActiveChatSessions } from "@/context/useActiveChatSessions";
import useLang from "@/context/useLang";
import usePromptInput from "@/context/usePromptInput";
import { useThemeConfig } from "@/context/useThemeConfig";
import useDataState from "@/hooks/useDataState";
import { useScrollBottom } from "@/hooks/useScrollBottom";
import { isEmptyArray } from "@/utils/array";
import { formatDate } from "@/utils/formatter";
import { Alert, Badge, HStack, StackProps } from "@chakra-ui/react";
import { ArrowDownIcon, RefreshCwIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const Messages = (props: StackProps) => {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const activeChat = useActiveChatSession((s) => s.activeChat);
  const setMessages = useActiveChatSession((s) => s.setMessages);
  const setSession = useActiveChatSession((s) => s.setSession);
  const removeActiveChatSession = useActiveChatSessions(
    (s) => s.removeActiveChatSession,
  );
  const updateHasLoadedHistory = useActiveChatSession(
    (s) => s.updateHasLoadedHistory,
  );

  // const resetChat = useActiveChatSession((s) => s.resetChat);

  // Hooks
  const { sessionId } = useParams();
  const router = useRouter();

  // States
  const activeChatSessionId = activeChat?.session?.id;
  const shouldFetchHistory = !activeChat.hasLoadedHistory;
  const { error, status, initialLoading, data, onRetry } = useDataState<any>({
    url: `${CHAT_API_SHOW_CHAT}/${sessionId}`,
    dataResource: false,
    dependencies: [shouldFetchHistory],
    conditions: shouldFetchHistory,
  });
  const messages = activeChat.messages;
  const lastMessage = messages[messages.length - 1];
  const canRegenerate = lastMessage && lastMessage.role === "assistant";

  useEffect(() => {
    if (activeChatSessionId !== sessionId) {
      updateHasLoadedHistory(false);
    }
  }, [sessionId]);

  // Set active chat on data load
  useEffect(() => {
    if (data) {
      setSession(data?.session);
      setMessages(data?.messages);
    }
  }, [data]);

  // Handle 404 - redirect and remove session
  useEffect(() => {
    if (status === 404) {
      removeActiveChatSession(sessionId as string);
      router.push("/new-chat");
    }
  }, [status]);

  const render = {
    loading: <ChatSkeleton />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <CContainer flex={1} gap={4}>
        <CContainer>
          <P fontSize={"xl"} fontWeight={"semibold"}>
            {activeChat.session?.title}
          </P>

          <P color={"fg.subtle"}>{formatDate(activeChat.session?.createdAt)}</P>
        </CContainer>

        <CContainer gap={4}>
          {activeChat.messages.map((message: Interface__ChatMessage) => {
            const emptyMessage = !message.content;
            const isStreaming = activeChat.isStreaming;

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
                  {isStreaming && emptyMessage ? (
                    <Spinner size={"sm"} ml={2} />
                  ) : (
                    <>
                      <MarkdownChat error={true}>
                        {message.content}
                      </MarkdownChat>

                      <HStack>
                        {message?.sources?.map((source, index) => {
                          return <Badge key={index}>{source}</Badge>;
                        })}
                      </HStack>

                      {message.error && (
                        <CContainer key={message.id} gap={2}>
                          <Alert.Root
                            status="error"
                            maxW={"70%"}
                            rounded={themeConfig.radii.component}
                          >
                            <Alert.Indicator />
                            <Alert.Title>
                              {l.msg_assistant_response_error}
                            </Alert.Title>
                          </Alert.Root>
                        </CContainer>
                      )}

                      <HStack wrap={"wrap"}>
                        <Clipboard>{message.content}</Clipboard>

                        {canRegenerate && (
                          <Btn iconButton size={"xs"} variant={"ghost"}>
                            <AppIcon icon={RefreshCwIcon} />
                          </Btn>
                        )}
                      </HStack>
                    </>
                  )}
                </CContainer>
              );
            }
          })}
        </CContainer>
      </CContainer>
    ),
  };

  return (
    <CContainer flex={1} {...props}>
      {shouldFetchHistory && (
        <>
          {initialLoading && render.loading}
          {!initialLoading && (
            <>
              {error && render.error}
              {!error && (
                <>
                  {!isEmptyArray(messages) && render.loaded}
                  {isEmptyArray(messages) && render.empty}
                </>
              )}
            </>
          )}
        </>
      )}

      {!shouldFetchHistory && <>{render.loaded}</>}
    </CContainer>
  );
};

export default function Page() {
  // Contexts
  const promptInputStyle = usePromptInput((s) => s.style);

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
        flex={1}
        p={4}
        overflowY={"auto"}
        scrollBehavior={"smooth"}
      >
        <ContainerLayout gap={8} pb={`calc(${promptInputStyle?.h} + 64px)`}>
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
              <ContinuePrompt mb={4} />
            </CContainer>
          </ContainerLayout>
        </CContainer>
      </CContainer>
    </PageContainer>
  );
}
