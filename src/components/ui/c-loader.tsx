import { CContainer } from "@/components/ui/c-container";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  SimpleGrid,
  SimpleGridProps,
  SpinnerProps,
  StackProps,
} from "@chakra-ui/react";

interface Props extends StackProps {
  spinnerProps?: SpinnerProps;
}

export const CSpinner = ({ spinnerProps, ...props }: Props) => {
  return (
    <CContainer
      minH={"300px"}
      align={"center"}
      justify={"center"}
      opacity={0.4}
      m={"auto"}
      p={4}
      {...props}
    >
      <Spinner {...spinnerProps} />
    </CContainer>
  );
};

export const ChatSessionPageSkeleton = () => {
  return (
    <CContainer flex={1} gap={4}>
      <CContainer gap={4}>
        <Skeleton w={"full"} maxW={"400px"} h={"40px"} />
        <Skeleton w={"full"} maxW={"300px"} h={"24px"} />
      </CContainer>

      <CContainer flex={1} my={"auto"} gap={4}>
        <Skeleton w={"full"} flex={1} />
        {/* <Skeleton w={"70%"} h={"85px"} ml={"auto"} />
        <Skeleton w={"full"} h={"200px"} mr={"auto"} />

        <Skeleton w={"70%"} h={"85px"} ml={"auto"} />
        <Skeleton w={"full"} h={"200px"} mr={"auto"} /> */}
      </CContainer>
    </CContainer>
  );
};

export const DASessonPageSkeleton = () => {
  return (
    <CContainer flex={1} gap={8}>
      <CContainer gap={2}>
        <Skeleton w={"full"} h={"24px"} />
        <Skeleton w={"full"} maxW={"400px"} h={"20px"} />
      </CContainer>

      <Skeleton flex={1} />
    </CContainer>
  );
};

interface DAServiceSletonProps extends SimpleGridProps {
  length?: number;
}
export const DAServiceSkeleton = (props: DAServiceSletonProps) => {
  // Props
  const { length = 7, ...restProps } = props;

  return (
    <SimpleGrid minChildWidth={"200px"} gap={4} {...restProps}>
      {Array.from({ length: length }, (_, i) => {
        return <Skeleton key={i} h={"282px"} />;
      })}
    </SimpleGrid>
  );
};
