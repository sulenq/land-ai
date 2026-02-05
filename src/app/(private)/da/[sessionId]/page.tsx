"use client";

import { CContainer } from "@/components/ui/c-container";
import { ChatSkeleton } from "@/components/ui/c-loader";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { Messages } from "@/components/widget/Messages";
import { ContainerLayout, PageContainer } from "@/components/widget/Page";
import { DA_API_SESSION_DETAIL } from "@/constants/apis";
import { useActiveChat } from "@/context/useActiveChat";
import { useBreadcrumbs } from "@/context/useBreadcrumbs";
import { useDASessions } from "@/context/useDASessions";
import useMessageContainer from "@/context/useMessageContainer";
import useDataState from "@/hooks/useDataState";
import { isEmptyArray } from "@/utils/array";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Page() {
  // Contexts
  const setBreadcrumbs = useBreadcrumbs((s) => s.setBreadcrumbs);
  const messageContainerStyle = useMessageContainer((s) => s.style);
  const activeChat = useActiveChat((s) => s.activeChat);
  const setMessages = useActiveChat((s) => s.setMessages);
  const setSession = useActiveChat((s) => s.setSession);
  const clearActiveChat = useActiveChat((s) => s.clearActiveChat);
  const updateHasLoadedHistory = useActiveChat((s) => s.updateHasLoadedHistory);
  const updateIsNewChat = useActiveChat((s) => s.updateIsNewChat);
  const removeFromDASessions = useDASessions((s) => s.removeFromDASessions);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const router = useRouter();

  // States
  const { sessionId } = useParams();
  const activeChatSessionId = activeChat?.session?.id;
  const shouldFetchHistory = !activeChat.hasLoadedHistory;
  const { error, status, initialLoading, data, onRetry } = useDataState<any>({
    url: `${DA_API_SESSION_DETAIL}/${sessionId}`,
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
    updateIsNewChat(false);
    if (activeChatSessionId !== sessionId) {
      updateHasLoadedHistory(false);
      clearActiveChat();
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
      removeFromDASessions(sessionId as string);
      router.push("/new-da");
    }
  }, [status]);

  // Scroll to bottom on messages change
  useEffect(() => {
    if (!isEmptyArray(messages) && activeChat.isStreaming) {
      scrollToBottom();
    }
  }, [messages]);

  // Update breadcroumbs
  useEffect(() => {
    setBreadcrumbs({
      activeNavs: [
        {
          labelKey: `navs.your_da_analysis`,
          path: `/c/${activeChat.session?.id}`,
        },
        {
          labelKey: activeChat.session?.title as string,
          label: activeChat.session?.title,
          path: `/c/${activeChat.session?.id}`,
        },
      ],
    });
  }, []);

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
        <ContainerLayout gap={8} pb={messageContainerStyle?.pb}>
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
      </CContainer>
    </PageContainer>
  );
}
