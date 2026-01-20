"use client";

import { CSpinner } from "@/components/ui/c-spinner";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { PageContainer, PageLayout } from "@/components/widget/Page";
import {
  PromptHelperText,
  PromptInput,
} from "@/components/widget/PromptComposer";
import { CHAT_API_SHOW_CHAT } from "@/constants/apis";
import { DUMMY_CHAT_SESSION } from "@/constants/dummyData";
import { Interface__ChatState } from "@/constants/interfaces";
import useDataState from "@/hooks/useDataState";
import { isEmptyArray } from "@/utils/array";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  // Hooks
  const { sessionId } = useParams();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const { error, initialLoading, data, onRetry } = useDataState<any>({
    initialData: DUMMY_CHAT_SESSION,
    url: `${CHAT_API_SHOW_CHAT}/${sessionId}`,
    dataResource: false,
  });
  const [chat, setChat] = useState<Interface__ChatState>({
    session: null,
    messages: [],
    streaming: { active: false, messageId: null },
    loadingSession: true,
    sendingPrompt: false,
    error: false,
  });

  // Scroll to bottom on load
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  const render = {
    loading: <CSpinner />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: <></>,
  };

  let content = null;
  if (initialLoading) {
    content = render.loading;
  } else if (error) {
    content = render.error;
  } else if (!data || isEmptyArray(data)) {
    content = render.empty;
  } else {
    content = render.loaded;
  }

  return (
    <PageContainer ref={containerRef} p={4}>
      <PageLayout>
        {content}

        <PromptInput />

        <PromptHelperText mt={4} />
      </PageLayout>
    </PageContainer>
  );
}
