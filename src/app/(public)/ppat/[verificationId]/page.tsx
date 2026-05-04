"use client";

import { CContainer } from "@/components/ui/c-container";
import { ColorModeButton } from "@/components/ui/color-mode";
import { LangMenu } from "@/components/ui/lang-menu";
import { P } from "@/components/ui/p";
import { Skeleton } from "@/components/ui/skeleton";
import { ClampText } from "@/components/widget/ClampText";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { Interface__VerificationResponse } from "@/constants/interfaces";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useDataState from "@/hooks/useDataState";
import { isEmptyArray } from "@/utils/array";
import { isEmptyObject } from "@/utils/object";
import {
  Badge,
  Circle,
  HStack,
  SimpleGrid,
  Stack,
  StackProps,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useState } from "react";

// -----------------------------------------------------------------

interface Interface__ActiveDoc {
  index: number;
  data: Interface__VerificationResponse["documents"][number];
}

const STATUS_COLOR_PALETTE = {
  FAIL: "red",
  NEEDS_REVIEW: "orange",
  PASS: "green",
};

// -----------------------------------------------------------------

interface Props__Detail extends StackProps {
  activeDoc: Interface__ActiveDoc | null;
}

const Detail = (props: Props__Detail) => {
  // Props
  const { activeDoc, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // Derived Values
  const activeDocCriticalIssues = activeDoc?.data?.checks?.filter(
    (check) => check.status !== "PASS",
  );
  const activeDocsPassed = activeDoc?.data?.checks?.filter(
    (check) => check.status === "PASS",
  );

  return (
    <CContainer {...restProps}>
      {!activeDoc && (
        <P m={"auto"} color={"fg.muted"}>
          {"Select document"}
        </P>
      )}

      {activeDoc && (
        <CContainer gap={4} p={4} overflowY={"auto"}>
          {/* Critical issues */}
          <CContainer
            bg={"body"}
            // border={"1px solid"}
            borderColor={"border.subtle"}
            rounded={themeConfig.radii.component}
          >
            <HStack
              justify={"space-between"}
              p={4}
              borderBottom={"1px solid"}
              borderColor={"border.muted"}
            >
              <P fontWeight={"semibold"}>Critical Issues</P>

              <Circle p={1} w={"32px"} h={"32px"} bg={"bg.error"}>
                <P fontWeight={"medium"} color={"fg.error"}>
                  {activeDocCriticalIssues?.length}
                </P>
              </Circle>
            </HStack>

            <CContainer gap={2} p={4}>
              {isEmptyArray(activeDocCriticalIssues) && (
                <CContainer>
                  <P color={"fg.muted"}>No Critical Issues</P>
                </CContainer>
              )}

              {activeDocCriticalIssues?.map((check, index) => {
                return (
                  <CContainer
                    key={index}
                    gap={2}
                    p={3}
                    border={"1px solid"}
                    borderColor={"border.muted"}
                    rounded={themeConfig.radii.component}
                  >
                    <Badge
                      w={"fit"}
                      colorPalette={
                        STATUS_COLOR_PALETTE[
                          check.status as keyof typeof STATUS_COLOR_PALETTE
                        ]
                      }
                    >
                      {check.status}
                    </Badge>

                    <HStack align={"start"}>
                      <ClampText
                        flexShrink={0}
                        w={"150px"}
                        color={"fg.muted"}
                        // fontWeight={"medium"}
                      >
                        Check Code
                      </ClampText>

                      <P>{check.check_code}</P>
                    </HStack>

                    <HStack align={"start"}>
                      <ClampText
                        flexShrink={0}
                        w={"150px"}
                        color={"fg.muted"}
                        // fontWeight={"medium"}
                      >
                        Check Type
                      </ClampText>

                      <P>{check.check_type}</P>
                    </HStack>

                    <HStack align={"start"}>
                      <ClampText
                        flexShrink={0}
                        w={"150px"}
                        color={"fg.muted"}
                        // fontWeight={"medium"}
                      >
                        Notes
                      </ClampText>

                      <P>{check.notes}</P>
                    </HStack>
                  </CContainer>
                );
              })}
            </CContainer>
          </CContainer>

          {/* Extracted */}
          <CContainer
            bg={"body"}
            // border={"1px solid"}
            borderColor={"border.subtle"}
            rounded={themeConfig.radii.component}
          >
            <HStack
              justify={"space-between"}
              p={4}
              borderBottom={"1px solid"}
              borderColor={"border.muted"}
            >
              <P fontWeight={"semibold"}>Extracted Data</P>
            </HStack>

            <CContainer gap={2} p={4}>
              {isEmptyObject(activeDoc.data.extracted_data) && (
                <CContainer>
                  <P color={"fg.muted"}>No extracted data</P>
                </CContainer>
              )}

              {!isEmptyObject(activeDoc.data.extracted_data) && (
                <CContainer>
                  <HStack
                    align={"start"}
                    pb={3}
                    borderBottom={"1px solid"}
                    borderColor={"border.muted"}
                  >
                    <P
                      flexShrink={0}
                      w={"150px"}
                      color={"fg.muted"}
                      fontWeight={"medium"}
                    >
                      Field
                    </P>

                    <P color={"fg.muted"} fontWeight={"medium"}>
                      Value
                    </P>
                  </HStack>

                  {Object.keys(activeDoc.data.extracted_data)?.map(
                    (key, index) => {
                      const extracted = activeDoc.data.extracted_data;

                      return (
                        <CContainer
                          key={index}
                          gap={4}
                          py={3}
                          borderBottom={"1px solid"}
                          borderColor={"border.muted"}
                        >
                          <HStack align={"start"}>
                            <ClampText
                              flexShrink={0}
                              w={"150px"}
                              color={"fg.muted"}
                            >
                              {key}
                            </ClampText>

                            <P>{extracted[key]}</P>
                          </HStack>
                        </CContainer>
                      );
                    },
                  )}
                </CContainer>
              )}
            </CContainer>
          </CContainer>

          {/* Passed */}
          <CContainer
            bg={"body"}
            // border={"1px solid"}
            borderColor={"border.subtle"}
            rounded={themeConfig.radii.component}
          >
            <HStack
              justify={"space-between"}
              p={4}
              borderBottom={"1px solid"}
              borderColor={"border.muted"}
            >
              <P fontWeight={"semibold"}>Passed</P>

              <Circle p={1} w={"32px"} h={"32px"} bg={"bg.success"}>
                <P fontWeight={"medium"} color={"fg.success"}>
                  {activeDocsPassed?.length}
                </P>
              </Circle>
            </HStack>

            <CContainer gap={2} p={4}>
              {isEmptyArray(activeDocsPassed) && (
                <CContainer>
                  <P color={"fg.muted"}>No Passed</P>
                </CContainer>
              )}

              {activeDocsPassed?.map((check, index) => {
                return (
                  <CContainer
                    key={index}
                    gap={2}
                    p={3}
                    border={"1px solid"}
                    borderColor={"border.muted"}
                    rounded={themeConfig.radii.component}
                  >
                    <Badge
                      w={"fit"}
                      colorPalette={
                        STATUS_COLOR_PALETTE[
                          check.status as keyof typeof STATUS_COLOR_PALETTE
                        ]
                      }
                    >
                      {check.status}
                    </Badge>

                    <HStack align={"start"}>
                      <ClampText
                        flexShrink={0}
                        w={"150px"}
                        color={"fg.muted"}
                        // fontWeight={"medium"}
                      >
                        Check Code
                      </ClampText>

                      <P>{check.check_code}</P>
                    </HStack>

                    <HStack align={"start"}>
                      <ClampText
                        flexShrink={0}
                        w={"150px"}
                        color={"fg.muted"}
                        // fontWeight={"medium"}
                      >
                        Check Type
                      </ClampText>

                      <P>{check.check_type}</P>
                    </HStack>

                    <HStack align={"start"}>
                      <ClampText
                        flexShrink={0}
                        w={"150px"}
                        color={"fg.muted"}
                        // fontWeight={"medium"}
                      >
                        Notes
                      </ClampText>

                      <P>{check.notes}</P>
                    </HStack>
                  </CContainer>
                );
              })}
            </CContainer>
          </CContainer>
        </CContainer>
      )}
    </CContainer>
  );
};

// -----------------------------------------------------------------

interface Props__StatItem extends StackProps {
  label: string;
  value: string;
}

const StatItem = (props: Props__StatItem) => {
  // Props
  const { label, value, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <CContainer
      p={4}
      bg={"bg.muted"}
      border={"1px solid"}
      borderColor={"border.muted"}
      rounded={themeConfig.radii.component}
      {...restProps}
    >
      <P fontSize={"2xl"} fontWeight={"semibold"}>
        {value}
      </P>

      <P color={"fg.muted"}>{label}</P>
    </CContainer>
  );
};

// -----------------------------------------------------------------

export default function Page() {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const params = useParams();
  const verificationId = params.verificationId;

  // States
  const { initialLoading, error, onRetry, response } =
    useDataState<Interface__VerificationResponse>({
      url: `/api/integrations/verifications/${verificationId}`,
      dataResource: false,
      headers: {
        "X-API-Key": process.env.NEXT_PUBLIC_PPAT_API_KEY,
      },
    });
  const [activeDoc, setActiveDoc] = useState<Interface__ActiveDoc | null>(null);

  // Constants
  // const data = DUMMY_PPAT_RESPONSE as Interface__VerificationResponse;
  const data = response as Interface__VerificationResponse | null;

  // Derived Values
  const totalPassedDocs = data?.documents?.filter(
    (d) => d.document_status === "PASS",
  )?.length;
  const totalFailedDocs = data?.documents?.filter(
    (d) => d.document_status === "FAIL",
  )?.length;
  const totalNeedsReviewDocs = data?.documents?.filter(
    (d) => d.document_status === "NEEDS_REVIEW",
  )?.length;

  // Render State Map
  const render = {
    loading: <Skeleton />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <Stack
        flex={1}
        flexDir={["column", null, "row"]}
        gap={0}
        h={"100dvh"}
        bg={"bgContent"}
        overflowY={"auto"}
      >
        {/* Doc list */}
        <CContainer
          className={"scrollY"}
          gap={6}
          w={["full", null, "450px"]}
          minH={"fit"}
          p={4}
          bg={"body"}
          overflowY={"auto"}
        >
          <HStack>
            <ColorModeButton />
            <LangMenu />
          </HStack>

          {/* Stats */}
          <SimpleGrid columns={2} gap={2}>
            <StatItem
              label={"Documents"}
              value={`${data?.documents?.length}`}
            />
            <StatItem label={l.passed} value={`${totalPassedDocs}`} />
            <StatItem label={l.failed} value={`${totalFailedDocs}`} />
            <StatItem
              label={l.needs_review}
              value={`${totalNeedsReviewDocs}`}
            />
          </SimpleGrid>

          {/* List */}
          <CContainer gap={4}>
            <P fontWeight={"semibold"}>Documents List</P>

            <CContainer gap={2}>
              {data?.documents?.map((doc, index) => {
                const isActive = activeDoc?.index === index;

                return (
                  <HStack
                    key={index}
                    p={3}
                    border={"1px solid"}
                    borderColor={
                      isActive
                        ? `${themeConfig.colorPalette}.solid`
                        : "border.muted"
                    }
                    rounded={themeConfig.radii.component}
                    cursor={"pointer"}
                    _hover={{
                      bg: "bg.muted",
                    }}
                    transition={"200ms"}
                    onClick={() => {
                      setActiveDoc({
                        index,
                        data: doc,
                      });
                    }}
                  >
                    <CContainer>
                      <P fontWeight={"medium"}>{doc.document_type}</P>
                    </CContainer>

                    <Badge
                      colorPalette={
                        STATUS_COLOR_PALETTE[
                          doc.document_status as keyof typeof STATUS_COLOR_PALETTE
                        ]
                      }
                    >
                      {doc.document_status}
                    </Badge>
                  </HStack>
                );
              })}
            </CContainer>
          </CContainer>
        </CContainer>

        {/* Detail doc */}
        <Detail activeDoc={activeDoc} />
      </Stack>
    ),
  };

  return (
    <CContainer minH={"100dvh"}>
      {initialLoading && render.loading}
      {!initialLoading && (
        <>
          {error && (
            <>{response?.status == 404 ? render.notFound : render.error}</>
          )}
          {!error && (
            <>
              {data && !isEmptyObject(data) && render.loaded}
              {(!data || isEmptyObject(data)) && render.empty}
            </>
          )}
        </>
      )}
    </CContainer>
  );
}
