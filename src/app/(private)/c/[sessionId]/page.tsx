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

interface Props__Messages extends StackProps {
  messages: Interface__ChatMessage[];
}
const Messages = (props: Props__Messages) => {
  // Props
  const { messages, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const activeChat = useActiveChatSession((s) => s.activeChat);

  // States
  const lastMessage = messages[messages.length - 1];
  const canRegenerate = lastMessage && lastMessage.role === "assistant";

  return (
    <CContainer flex={1} {...restProps}>
      <CContainer flex={1} gap={4} px={2}>
        <CContainer mb={4}>
          <P fontSize={"xl"} fontWeight={"semibold"}>
            {activeChat.session?.title}
          </P>

          <P color={"fg.subtle"}>{formatDate(activeChat.session?.createdAt)}</P>
        </CContainer>

        <CContainer gap={4}>
          {activeChat.messages.map((message: Interface__ChatMessage) => {
            const emptyMessage = !message.content;
            const isStreaming = message.isStreaming;

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

                      <HStack wrap={"wrap"} gap={1}>
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
    </CContainer>
  );
};

export default function Page() {
  // Contexts
  const promptInputStyle = usePromptInput((s) => s.style);
  const activeChat = useActiveChatSession((s) => s.activeChat);
  const setMessages = useActiveChatSession((s) => s.setMessages);
  const setSession = useActiveChatSession((s) => s.setSession);
  const resetActiveChat = useActiveChatSession((s) => s.resetActiveChat);
  const updateHasLoadedHistory = useActiveChatSession(
    (s) => s.updateHasLoadedHistory,
  );
  const removeActiveChatSession = useActiveChatSessions(
    (s) => s.removeActiveChatSession,
  );

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const router = useRouter();

  // States
  const { sessionId } = useParams();
  const activeChatSessionId = activeChat?.session?.id;
  const shouldFetchHistory = !activeChat.hasLoadedHistory;
  const { error, status, initialLoading, data, onRetry } = useDataState<any>({
    url: `${CHAT_API_SHOW_CHAT}/${sessionId}`,
    dataResource: false,
    dependencies: [shouldFetchHistory],
    conditions: shouldFetchHistory,
  });
  const messages = activeChat.messages;

  // Utils
  function scrollToBottom() {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }

  const scrollBottom = useScrollBottom(containerRef, [data]);

  // Update has loaded history on session change
  useEffect(() => {
    if (activeChatSessionId !== sessionId) {
      updateHasLoadedHistory(false);
      resetActiveChat();
    }
  }, [sessionId]);

  // Set active chat on data load
  useEffect(() => {
    if (data) {
      setSession({
        ...data?.session,
        isStreaming: false,
      });
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

  // Scroll to bottom on load
  // useEffect(() => {
  //   scrollToBottom();
  // }, []);

  const render = {
    loading: <ChatSkeleton />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: <Messages messages={messages} />,
  };

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
          {shouldFetchHistory && (
            <>
              {initialLoading && render.loading}
              {!initialLoading && (
                <>
                  {error && render.error}
                  {!error && <>{!isEmptyArray(messages) && render.loaded}</>}
                </>
              )}
            </>
          )}

          {!shouldFetchHistory && <>{render.loaded}</>}
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
