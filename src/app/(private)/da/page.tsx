"use client";

import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import { ContainerLayout, PageContainer } from "@/components/widget/Page";
import { HStack, StackProps } from "@chakra-ui/react";

const SERVICES = [
  { id: 1, label: "Service 1", url: "" },
  { id: 2, label: "Service 2", url: "" },
  { id: 3, label: "Service 3", url: "" },
  { id: 4, label: "Service 4", url: "" },
  { id: 5, label: "Service 5", url: "" },
  { id: 6, label: "Service 6", url: "" },
  { id: 7, label: "Service 7", url: "" },
  { id: 8, label: "Service 8", url: "" },
];

const SegmentOptions = (props: StackProps) => {
  // Props
  const { ...restProps } = props;

  return (
    <HStack wrap={"wrap"} {...restProps}>
      {SERVICES.map((option) => {
        return (
          <CContainer key={option.id} flex={"1 1 200px"}>
            {option.label}
          </CContainer>
        );
      })}
    </HStack>
  );
};

export default function Page() {
  return (
    <PageContainer p={4} pos={"relative"}>
      <ContainerLayout className="scrollY" justify={"center"}>
        <P fontSize={"2xl"} fontWeight={"bold"} textAlign={"center"}>
          Pilih Layanan
        </P>
        <SegmentOptions id="feature_select" />
      </ContainerLayout>
    </PageContainer>
  );
}
