import { CHAT_API_CHAT_AI_STREAM } from "@/constants/apis";
import { useActiveChatSession } from "@/context/useActiveChatSession";
import { getAccessToken } from "@/utils/auth";

export const streamChat = async (payload: {
  sessionId?: string;
  prompt: string;
}) => {
  const {
    setActiveChat,
    startAssistantStreaming,
    appendStreamingChunk,
    finishStreaming,
  } = useActiveChatSession.getState();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${CHAT_API_CHAT_AI_STREAM}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        Authorization: `Bearer ${getAccessToken() || ""}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.body) throw new Error("Stream not supported");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  let assistantMessageId: string | null = null;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.trim()) continue;

      const data = JSON.parse(line);

      if (data.type === "meta") {
        setActiveChat({
          session: data.session,
          messages: [],
          totalMessages: data.totalMessages,
        });

        assistantMessageId = startAssistantStreaming();
      }

      if (data.type === "chunk" && assistantMessageId) {
        appendStreamingChunk({
          messageId: assistantMessageId,
          chunk: data.content,
        });
      }
    }
  }

  if (assistantMessageId) {
    finishStreaming(assistantMessageId);
  }
};
