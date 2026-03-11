import { CHAT_API_FEEDBACK } from "@/constants/apis";
import {
  Interface__ChatMessage,
  Interface__SubmitFeedbackRequest,
  Type__FeedbackCategory,
} from "@/constants/interfaces";
import { request } from "@/utils/request";

export interface SubmitFeedbackParams {
  message: Interface__ChatMessage;
  sessionId: string | undefined;
  userQuery?: string;
  retrievedContexts?: string[];
  rating: 1 | -1;
  category?: Type__FeedbackCategory;
  userComment?: string;
}

export const submitFeedback = async ({
  message,
  sessionId,
  userQuery,
  retrievedContexts,
  rating,
  category,
  userComment,
}: SubmitFeedbackParams): Promise<void> => {
  const payload: Interface__SubmitFeedbackRequest = {
    messageId: message.id,
    sessionId: sessionId ?? "",
    userQuery: userQuery ?? "",
    aiResponse: message.content,
    retrievedContexts,
    rating,
    category,
    userComment,
  };

  await request.post(CHAT_API_FEEDBACK, payload);
};
