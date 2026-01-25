"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { ChatSkeleton } from "@/components/ui/c-loader";
import { AppIcon } from "@/components/widget/AppIcon";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { Messages } from "@/components/widget/Messages";
import { ContainerLayout, PageContainer } from "@/components/widget/Page";
import { ContinuePrompt } from "@/components/widget/PromptComposer";
import { CHAT_API_SHOW_CHAT } from "@/constants/apis";
import { useActiveChatSession } from "@/context/useActiveChatSession";
import { useActiveChatSessions } from "@/context/useActiveChatSessions";
import usePromptInput from "@/context/usePromptInput";
import useDataState from "@/hooks/useDataState";
import { useScrollBottom } from "@/hooks/useScrollBottom";
import { isEmptyArray } from "@/utils/array";
import { ArrowDownIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

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
  const scrollBottom = useScrollBottom(containerRef);

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
