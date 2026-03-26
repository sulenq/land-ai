import {
  RAG_SHARE_CREATE,
  RAG_SHARE_PUBLIC,
  RAG_SHARE_GET_USER,
  RAG_SHARE_TOGGLE,
  RAG_SHARE_DELETE,
} from "@/constants/apis";
import { getAccessToken } from "@/utils/auth";

// Interface untuk Share
export interface RagShare {
  id: number;
  shareId: string;
  messageId: string | null;
  sessionId: string;
  userId: number;
  title: string;
  isActive: boolean;
  viewCount: number;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  createdAt: string;
}

export interface RagShareContent {
  title: string;
  messages: ChatMessage[];
  viewCount: number;
  createdAt: string;
}

export interface CreateShareResponse {
  shareId: string;
  shareUrl: string;
  expiresAt: string | null;
}

type RawCreateShareResponse = Partial<CreateShareResponse> & {
  id?: string;
  url?: string;
  share_url?: string;
  expires_at?: string | null;
  data?: Partial<CreateShareResponse> & {
    id?: string;
    url?: string;
    share_url?: string;
    expires_at?: string | null;
  };
};

// Create Share Link - untuk share seluruh session
export async function createShare({
  sessionId,
  title,
}: {
  sessionId: string;
  title?: string;
}): Promise<CreateShareResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${RAG_SHARE_CREATE}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },
      body: JSON.stringify({ sessionId, title }),
    },
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal membuat share link");
  }

  const payload: RawCreateShareResponse = await res.json();
  const data = payload.data ?? payload;
  const shareId = data.shareId ?? data.id;
  const shareUrl = data.shareUrl ?? data.share_url ?? data.url;

  if (!shareId && !shareUrl) {
    throw new Error("Response share link tidak valid");
  }

  return {
    shareId: shareId ?? shareUrl?.split("/").filter(Boolean).pop() ?? "",
    shareUrl: shareUrl ?? "",
    expiresAt: data.expiresAt ?? data.expires_at ?? null,
  };
}

// Get Shared Content (PUBLIC - no auth required)
export async function getSharedContent(
  shareId: string,
): Promise<RagShareContent> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${RAG_SHARE_PUBLIC}/${shareId}`,
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Share tidak ditemukan atau kadaluarsa");
  }

  const payload = await res.json();
  return payload.data ?? payload;
}

// Get User's Shares
export async function getUserShares({
  limit = 20,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
} = {}): Promise<{ shares: RagShare[]; total: number }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${RAG_SHARE_GET_USER}?limit=${limit}&offset=${offset}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    },
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal mengambil daftar share");
  }

  return res.json();
}

// Toggle Share Active Status
export async function toggleShareActive(shareId: string): Promise<RagShare> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${RAG_SHARE_TOGGLE}/${shareId}/toggle`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    },
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal mengubah status share");
  }

  return res.json();
}

// Delete Share
export async function deleteShare(shareId: string): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${RAG_SHARE_DELETE}/${shareId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    },
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal menghapus share");
  }
}
