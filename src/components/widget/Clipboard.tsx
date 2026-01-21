"use client";

import {
  ButtonProps,
  Clipboard as ChakraClipboard,
  IconButton,
} from "@chakra-ui/react";

interface Props extends ButtonProps {
  children?: string;
}

export const Clipboard = (props: Props) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <ChakraClipboard.Root value={children}>
      <ChakraClipboard.Trigger asChild>
        <IconButton
          variant={"ghost"}
          size={"xs"}
          {...restProps}
          // rounded={`calc(${themeConfig.radii.component} - 2px)`}
        >
          <ChakraClipboard.Indicator />
        </IconButton>
      </ChakraClipboard.Trigger>
    </ChakraClipboard.Root>
  );
};
