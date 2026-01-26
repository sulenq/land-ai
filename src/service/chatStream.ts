import { CHAT_API_CHAT_AI_STREAM } from "@/constants/apis";
import { Type__ChatStreamEvent } from "@/constants/types";
import { useActiveChat } from "@/context/useActiveChat";
import { useChatSessions } from "@/context/useChatSessions";
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
    useActiveChat.getState();
  const { prependToChatSessions } = useChatSessions.getState();

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
      // Divide NDJSON
      const lines = text.split("\n").filter(Boolean);

      for (const line of lines) {
        const payload: Type__ChatStreamEvent = JSON.parse(line);

        if (payload.type === "meta") {
          // Update active chat session
          setSession({
            id: payload?.session?.id || payload.sessionId,
            title: payload?.session?.title || payload.title,
            isProtected: payload?.session?.isProtected,
            isStreaming: true,
            controller: controller,
            createdAt: payload?.session?.createdAt,
          });

          // Add new chat to active sessions - prepend
          prependToChatSessions({
            id: payload?.session?.id || payload.sessionId,
            title: payload?.session?.title || payload.title,
            isProtected: payload?.session?.isProtected,
            isStreaming: true,
            createdAt: payload?.session?.createdAt,
          });

          // Update first assistant message
          useActiveChat.setState((state) => ({
            activeChat: {
              ...state.activeChat,
              messages: state.activeChat.messages.map((m) =>
                m.id === messageId ? { ...m, sources: payload.sources } : m,
              ),
            },
          }));
        }

        // Append assistant message
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
