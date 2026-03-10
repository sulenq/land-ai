"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { ColorModeButton } from "@/components/ui/color-mode";
import { HStack, VStack } from "@chakra-ui/react";

export default function Page() {
  const COLOR_PALETTE = "";

  return (
    <CContainer minH={"100vh"}>
      <VStack m={"auto"}>
        <ColorModeButton />

        <HStack>
          <Btn colorPalette={COLOR_PALETTE}>Test Button</Btn>
          <Btn colorPalette={COLOR_PALETTE} variant={"outline"}>
            Test Button
          </Btn>
          <Btn colorPalette={COLOR_PALETTE} variant={"subtle"}>
            Test Button
          </Btn>
        </HStack>
      </VStack>
    </CContainer>
  );
}
