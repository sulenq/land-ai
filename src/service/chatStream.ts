import { CHAT_API_CHAT_AI_STREAM } from "@/constants/apis";
import { useActiveChatSession } from "@/context/useActiveChatSession";

export function startChatStream({
  sessionId,
  prompt,
}: {
  prompt: string;
  sessionId?: string;
}) {
  const controller = new AbortController();
  const signal = controller.signal;

  const store = useActiveChatSession.getState();
  const messageId = store.startAssistantStreaming();

  fetch(CHAT_API_CHAT_AI_STREAM, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, prompt }),
    signal,
  })
    .then(async (res) => {
      if (!res.body) throw new Error("Stream not supported");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          let payload;
          try {
            payload = JSON.parse(trimmed);
          } catch {
            continue;
          }

          if (payload.type === "meta") {
            store.setSession({
              id: payload.sessionId,
              title: payload.title,
              createdAt: new Date().toISOString(),
              isStreaming: true,
            });

            const messages = store.activeChat.messages;
            const lastIndex = messages.length - 1;

            if (lastIndex >= 0 && payload.sources) {
              store.setMessages(
                messages.map((m, idx) =>
                  idx === lastIndex ? { ...m, sources: payload.sources } : m,
                ),
              );
            }
          }

          if (payload.type === "chunk" && payload.content) {
            store.appendStreamingChunk({
              messageId,
              chunk: payload.content,
            });
          }
        }
      }
    })
    .catch((err) => {
      if (err.name !== "AbortError") {
        throw err;
      }
    })
    .finally(() => {
      store.finishStreaming();
    });

  return controller;
}
