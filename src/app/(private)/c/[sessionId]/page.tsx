"use client";

import { CContainer } from "@/components/ui/c-container";
import { ChatSkeleton } from "@/components/ui/c-loader";
import { MarkdownChat, UserBubbleChat } from "@/components/widget/Chatting";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { PageContainer, PageLayout } from "@/components/widget/Page";
import {
  PromptHelperText,
  PromptInput,
} from "@/components/widget/PromptComposer";
import { Interface__ChatMessage } from "@/constants/interfaces";
import useActiveChatSession from "@/context/useActiveChatSession";
import useDataState from "@/hooks/useDataState";
import { isEmptyArray } from "@/utils/array";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Page() {
  // Hooks
  const { sessionId } = useParams();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  // const initialLoading = true;
  const { error, initialLoading, data, onRetry } = useDataState<any>({
    // url: `${CHAT_API_SHOW_CHAT}/${sessionId}`,
    dataResource: false,
  });
  const { activeChat, setActiveChat } = useActiveChatSession();

  // Scroll to bottom on load
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  // console.debug(activeChat);

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
              <UserBubbleChat key={message.id}>
                {message.content}
              </UserBubbleChat>
            );
          }

          if (message.role === "assistant") {
            return (
              <MarkdownChat key={message.id}>{message.content}</MarkdownChat>
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
    <PageContainer ref={containerRef} p={4}>
      <PageLayout justify={"space-between"} gap={4}>
        {content}

        <PromptInput />

        <PromptHelperText />
      </PageLayout>
    </PageContainer>
  );
}
