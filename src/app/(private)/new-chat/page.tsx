"use client";

import { HelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import BrandWatermark from "@/components/widget/BrandWatermark";
import { PageContainer } from "@/components/widget/Page";
import { PromptInputForm } from "@/components/widget/PromptComposer";
import { APP } from "@/constants/_meta";
import useLang from "@/context/useLang";
import { interpolateString, pluckString } from "@/utils/string";
import { VStack } from "@chakra-ui/react";

export default function Page() {
  // Contexts
  const { l } = useLang();

  // States
  // const variantNumber = Math.floor(Math.random() * 16) + 1;
  // const user = getUserData();

  return (
    <PageContainer p={4}>
      <VStack flex={1} gap={1} justify={"center"} align={"stretch"}>
        <VStack my={"auto"} align={"stretch"}>
          <P
            fontSize={"lg"}
            fontWeight={"medium"}
            textAlign={"center"}
            color={"fg.subtle"}
          >
            {interpolateString(pluckString(l, `msg_welcome_to_the_app`), {
              appName: APP.name,
            })}
          </P>

          <P
            fontSize={"xl"}
            fontWeight={"medium"}
            color={"ibody"}
            textAlign={"center"}
            mb={4}
          >
            {l.msg_welcome_context}
          </P>

          <PromptInputForm />

          <HelperText textAlign={"center"} maxW={"500px"} mx={"auto"} mt={4}>
            {l.msg_discliamer}
          </HelperText>
        </VStack>

        <VStack>
          <BrandWatermark color={"fg.subtle"} />
        </VStack>
      </VStack>
    </PageContainer>
  );
}
