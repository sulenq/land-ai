"use client";

import { PageContainer, ContainerLayout } from "@/components/widget/Page";
import { NewPrompt } from "@/components/widget/PromptComposer";

export default function Page() {
  return (
    <PageContainer p={4}>
      <ContainerLayout justify={"center"}>
        <NewPrompt />
      </ContainerLayout>
    </PageContainer>
  );
}
