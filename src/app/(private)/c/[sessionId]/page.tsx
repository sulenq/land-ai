"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { ChatSessionPageSkeleton } from "@/components/ui/c-loader";
import { P } from "@/components/ui/p";
import { FadingSkeletonContainer } from "@/components/ui/skeleton";
import { AppIcon } from "@/components/widget/AppIcon";
import { ClampText } from "@/components/widget/ClampText";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { MContainer } from "@/components/widget/MContainer";
import { Messages } from "@/components/widget/Messages";
import { ContainerLayout, PageContainer } from "@/components/widget/PageShell";
import { ContinuePrompt } from "@/components/widget/PromptComposer";
import { CHAT_API_SESSION_SHOW } from "@/constants/apis";
import { R_SPACING_MD, R_SUBTITLE, R_TITLE } from "@/constants/styles";
import { useActiveChat } from "@/context/useActiveChat";
import { useBreadcrumbs } from "@/context/useBreadcrumbs";
import { useChatSessions } from "@/context/useChatSessions";
import { useThemeConfig } from "@/context/useThemeConfig";
import useDataState from "@/hooks/useDataState";
import { useScrollBottom } from "@/hooks/useScrollBottom";
import { isEmptyArray } from "@/utils/array";
import { formatDate } from "@/utils/formatter";
import { ArrowDownIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Page() {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const setBreadcrumbs = useBreadcrumbs((s) => s.setBreadcrumbs);
  // const messageContainerStyle = useMessageContainer((s) => s.style);
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

  // Scroll to bottom on messages length change
  useEffect(() => {
    if (activeChat.totalMessages && activeChat.isStreaming) {
      scrollToBottom();
    }
  }, [activeChat.totalMessages]);

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
    loaded: (
      <CContainer gap={4} px={2}>
        <CContainer gap={1} mb={4}>
          <ClampText fontSize={R_TITLE} fontWeight={"semibold"}>
            {activeChat.session?.title}
          </ClampText>

          <P fontSize={R_SUBTITLE} color={"fg.subtle"}>
            {formatDate(activeChat.session?.createdAt) || "-"}
          </P>
        </CContainer>

        <Messages messages={messages} />
      </CContainer>
    ),
  };

  return (
    <PageContainer flex={1} overflowY={"clip"} pos={"relative"}>
      <CContainer flex={1} overflowY={"auto"}>
        <CContainer flex={1} overflowY={"auto"}>
          <MContainer
            ref={containerRef}
            flex={1}
            px={4}
            maskingBottom={"24px"}
            overflowY={"auto"}
            scrollBehavior={"smooth"}
          >
            {shouldFetchHistory && (
              <>
                <FadingSkeletonContainer px={4} loading={initialLoading} mt={8}>
                  <ContainerLayout flex={1}>{render.loading}</ContainerLayout>
                </FadingSkeletonContainer>

                {!initialLoading && (
                  <ContainerLayout
                    flex={1}
                    gap={8}
                    py={R_SPACING_MD}
                    // pb={messageContainerStyle?.pb}
                  >
                    {error && render.error}
                    {!error && (
                      <>
                        {data && render.loaded}
                        {(!data || isEmptyArray(data)) && render.empty}
                      </>
                    )}
                  </ContainerLayout>
                )}
              </>
            )}

            {!shouldFetchHistory && (
              <ContainerLayout
                flex={1}
                gap={8}
                py={8}
                // pb={messageContainerStyle?.pb}
              >
                {render.loaded}
              </ContainerLayout>
            )}
          </MContainer>
        </CContainer>

        {/* Prompt Input */}
        <CContainer
          align={"center"}
          gap={4}
          px={[0, null, 4]}
          pb={[0, null, 4]}
        >
          <ContainerLayout gap={4} align={"center"}>
            <Btn
              iconButton
              flexShrink={0}
              clicky={false}
              w={"fit"}
              variant={"surface"}
              size={"xs"}
              bg={"body"}
              opacity={scrollBottom > 1 ? 1 : 0}
              visibility={scrollBottom > 1 ? "visible" : "hidden"}
              transition={"200ms"}
              onClick={scrollToBottom}
              mt={"-48px"}
            >
              <AppIcon icon={ArrowDownIcon} />
            </Btn>

            <CContainer bg={"body"}>
              <ContinuePrompt
                promptInputProps={{
                  roundedBottom: [0, null, themeConfig.radii.component],
                }}
              />
            </CContainer>
          </ContainerLayout>
        </CContainer>
      </CContainer>
    </PageContainer>
  );
}
