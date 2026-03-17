import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShareContent } from "./ShareContent";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function getSharedContent(shareId: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/ai/share/${shareId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const payload = await res.json();
    return payload.data || payload;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shareId: string }>;
}): Promise<Metadata> {
  const { shareId } = await params;
  const content = await getSharedContent(shareId);

  if (!content) {
    return { title: "Share Tidak Ditemukan" };
  }

  const firstUserMessage = content.messages?.find((m: any) => m.role === "user");
  const description =
    firstUserMessage?.content?.slice(0, 160) || "Percakapan dengan Land AI";

  return {
    title: content.title || "Percakapan AI",
    description,
  };
}

export default async function SharedContentPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  const content = await getSharedContent(shareId);

  if (!content) {
    notFound();
  }

  return (
    <ShareContent
      title={content.title}
      messages={content.messages || []}
      viewCount={content.viewCount}
      createdAt={content.createdAt}
    />
  );
}
