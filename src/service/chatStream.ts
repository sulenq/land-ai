import { CHAT_API_CHAT_AI_STREAM } from "@/constants/apis";
import { useActiveChatSession } from "@/context/useActiveChatSession";

export async function startChatStream({
  sessionId,
  prompt,
}: {
  sessionId: string;
  prompt: string;
}) {
  const controller = new AbortController();
  const signal = controller.signal;

  const messageId = useActiveChatSession.getState().startAssistantStreaming();

  const res = await fetch(CHAT_API_CHAT_AI_STREAM, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, prompt }),
    signal,
  });

  if (!res.body) throw new Error("Stream not supported");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      useActiveChatSession
        .getState()
        .appendStreamingChunk({ messageId, chunk });
    }
  } finally {
    useActiveChatSession.getState().finishStreaming();
  }

  return controller;
}
