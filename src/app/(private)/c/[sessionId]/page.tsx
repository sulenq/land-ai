"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { ChatSessionPageSkeleton } from "@/components/ui/c-loader";
import { AppIcon } from "@/components/widget/AppIcon";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { Messages } from "@/components/widget/Messages";
import { ContainerLayout, PageContainer } from "@/components/widget/Page";
import { ContinuePrompt } from "@/components/widget/PromptComposer";
import { CHAT_API_SESSION_SHOW } from "@/constants/apis";
import { useActiveChat } from "@/context/useActiveChat";
import { useBreadcrumbs } from "@/context/useBreadcrumbs";
import { useChatSessions } from "@/context/useChatSessions";
import useMessageContainer from "@/context/useMessageContainer";
import useDataState from "@/hooks/useDataState";
import { useScrollBottom } from "@/hooks/useScrollBottom";
import { isEmptyArray } from "@/utils/array";
import { ArrowDownIcon } from "lucide-react";
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
  const removeFromChatSessions = useChatSessions(
    (s) => s.removeFromChatSessions,
  );

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { sessionId } = useParams();
  const router = useRouter();
  const scrollBottom = useScrollBottom(containerRef);

  // States
  const activeChatSessionId = activeChat?.session?.id;
  const shouldFetchHistory = !activeChat.hasLoadedHistory;
  // const initialLoading = true;
  const { initialLoading, error, status, data, onRetry } = useDataState<any>({
    url: `${CHAT_API_SESSION_SHOW}/${sessionId}`,
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
      removeFromChatSessions(sessionId as string);
      router.push("/new-chat");
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
    if (activeChat.session) {
      setBreadcrumbs({
        activeNavs: [
          {
            labelKey: `navs.your_chats`,
            path: `/c`,
          },
          {
            label: activeChat.session?.title,
            path: `/c/${sessionId}`,
          },
        ],
      });
    } else {
      setBreadcrumbs({
        activeNavs: [
          {
            labelKey: `navs.your_chats`,
            path: `/c`,
          },
          {
            label: "...",
            path: `/c/${sessionId}`,
          },
        ],
      });
    }
  }, [activeChat.session]);

  const render = {
    loading: <ChatSessionPageSkeleton />,
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

        <CContainer
          align={"center"}
          px={4}
          gap={4}
          position={"absolute"}
          left={0}
          bottom={0}
        >
          <ContainerLayout gap={4} align={"center"}>
            <Btn
              iconButton
              clicky={false}
              w={"fit"}
              variant={"surface"}
              size={"xs"}
              bg={"body"}
              opacity={scrollBottom > 1 ? 1 : 0}
              visibility={scrollBottom > 1 ? "visible" : "hidden"}
              transition={"200ms"}
              onClick={scrollToBottom}
            >
              <AppIcon icon={ArrowDownIcon} />
            </Btn>

            <CContainer bg={"body"}>
              <ContinuePrompt mb={4} />
            </CContainer>
          </ContainerLayout>
        </CContainer>
      </CContainer>
    </PageContainer>
  );
}
