"use client";

import { forwardRef } from "react";
import { StackProps, VStack as ChakraVStack } from "@chakra-ui/react";

interface Props extends StackProps {
  children?: React.ReactNode;
}
export const CContainer = forwardRef<HTMLDivElement, Props>((props, ref) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <ChakraVStack
      ref={ref}
      className={"CContainer"}
      gap={0}
      align={"stretch"}
      w={"full"}
      {...restProps}
    >
      {children}
    </ChakraVStack>
  );
});

export const StackV = forwardRef<HTMLDivElement, Props>((props, ref) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <ChakraVStack
      ref={ref}
      className={"StackV"}
      align={"stretch"}
      gap={0}
      w={"full"}
      {...restProps}
    >
      {children}
    </ChakraVStack>
  );
});

CContainer.displayName = "CContainer";
StackV.displayName = "StackV";
