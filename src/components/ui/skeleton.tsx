"use client";

import { CContainer } from "@/components/ui/c-container";
import { useThemeConfig } from "@/context/useThemeConfig";
import {
  Skeleton as ChakraSkeleton,
  SkeletonProps,
  StackProps,
} from "@chakra-ui/react";

interface Props extends SkeletonProps {}

export const Skeleton = (props: Props) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <ChakraSkeleton
      w={"full"}
      rounded={themeConfig.radii.component}
      variant={"shine"}
      {...restProps}
    />
  );
};

interface FadingSkeletonContainerProps extends StackProps {
  loading: boolean;
  useDummyElement?: boolean;
}
export const FadingSkeletonContainer = (
  props: FadingSkeletonContainerProps,
) => {
  // Props
  const { children, useDummyElement = true, loading, ...restProps } = props;

  return (
    <>
      <CContainer
        className={"fading-skeleton-container"}
        position={"absolute"}
        inset={"0"}
        pointerEvents={"none"}
        zIndex={2}
        animation={!loading ? "fade-out 200ms ease-in forwards" : undefined}
        {...restProps}
      >
        {children}
      </CContainer>

      {useDummyElement && loading && (
        <CContainer flex={1} zIndex={-1} {...restProps}>
          {children}
        </CContainer>
      )}
    </>
  );
};
