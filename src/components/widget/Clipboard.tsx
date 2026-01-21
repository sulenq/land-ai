"use client";

import { Btn } from "@/components/ui/btn";
import { ButtonProps, Clipboard as ChakraClipboard } from "@chakra-ui/react";

interface Props extends ButtonProps {
  children?: string;
}

export const Clipboard = (props: Props) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <ChakraClipboard.Root value={children}>
      <ChakraClipboard.Trigger asChild>
        <Btn
          iconButton
          variant={"ghost"}
          size={"xs"}
          {...restProps}
          // rounded={`calc(${themeConfig.radii.component} - 2px)`}
        >
          <ChakraClipboard.Indicator />
        </Btn>
      </ChakraClipboard.Trigger>
    </ChakraClipboard.Root>
  );
};
