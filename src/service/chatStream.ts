import { CHAT_API_CHAT_AI_STREAM } from "@/constants/apis";
import { useActiveChatSession } from "@/context/useActiveChatSession";
import { getAccessToken } from "@/utils/auth";

export async function startChatStream({
  sessionId,
  prompt,
}: {
  prompt: string;
  sessionId?: string;
}) {
  const controller = new AbortController();
  const signal = controller.signal;

  const { appendMessage, appendStreamingChunk, finishStreaming, setSession } =
    useActiveChatSession.getState();

  const messageId = crypto.randomUUID();

  appendMessage({
    id: messageId,
    role: "assistant",
    content: "",
    isStreaming: true,
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${CHAT_API_CHAT_AI_STREAM}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },
      body: JSON.stringify({ sessionId, prompt }),
      signal,
    },
  );

  if (!res.body) throw new Error("Stream not supported");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      const lines = text.split("\n").filter(Boolean);

      for (const line of lines) {
        const payload = JSON.parse(line);

        if (payload.type === "meta") {
          setSession({
            id: payload.sessionId,
            title: payload.title,
            createdAt: new Date().toISOString(),
            isStreaming: true,
          });

          useActiveChatSession.setState((state) => ({
            activeChat: {
              ...state.activeChat,
              messages: state.activeChat.messages.map((m) =>
                m.id === messageId ? { ...m, sources: payload.sources } : m,
              ),
            },
          }));
        }

        if (payload.type === "chunk") {
          appendStreamingChunk({
            messageId,
            chunk: payload.content,
          });
        }
      }
    }
  } finally {
    finishStreaming();
  }

  return controller;
}
