"use client";

import { PageContainer, PageLayout } from "@/components/widget/Page";
import { NewPrompt } from "@/components/widget/PromptComposer";

export default function Page() {
  return (
    <PageContainer p={4}>
      <PageLayout justify={"center"}>
        <NewPrompt />
      </PageLayout>
    </PageContainer>
  );
}
