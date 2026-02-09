"use client";

import { CContainer } from "@/components/ui/c-container";
import { HelperText } from "@/components/ui/helper-text";
import { Img } from "@/components/ui/img";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip } from "@/components/ui/tooltip";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { ContainerLayout, PageContainer } from "@/components/widget/Page";
import { DA_API_SERVICE_GET_ALL } from "@/constants/apis";
import { Interface__DAService } from "@/constants/interfaces";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import useDataState from "@/hooks/useDataState";
import { isEmptyArray } from "@/utils/array";
import { getGridColumns } from "@/utils/style";
import { imgUrl } from "@/utils/url";
import { SimpleGrid, StackProps } from "@chakra-ui/react";
import { useRef } from "react";

interface Props__Services extends StackProps {
  cols?: number;
}
const Services = (props: Props__Services) => {
  // Props
  const { cols, ...restProps } = props;

  // Contexts
  const { lang } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const { initialLoading, error, data, onRetry } = useDataState<
    Interface__DAService[]
  >({
    initialData: undefined,
    url: DA_API_SERVICE_GET_ALL,
    dataResource: false,
  });

  const render = {
    loading: <Skeleton flex={1} minH={"370px"} />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <SimpleGrid columns={cols} gap={4}>
        {data?.map((service) => {
          return (
            <NavLink
              key={service.id}
              to={`/new-da/${service.id}`}
              className={"clicky"}
              flex={"1 1 200px"}
              w={"full"}
              gap={8}
              p={4}
              border={"1px solid"}
              borderColor={"border.subtle"}
              rounded={themeConfig.radii.component}
              cursor={"pointer"}
              _hover={{
                bg: "bg.muted",
              }}
              transition={"200ms"}
            >
              <Img
                src={imgUrl(service.icon)}
                w={"40px"}
                h={"40px"}
                mb={"auto"}
              />

              <CContainer gap={2}>
                <P fontSize={"lg"} fontWeight={"semibold"}>
                  {service?.title?.[lang]}
                </P>

                <Tooltip content={service?.description?.[lang]}>
                  <P color={"fg.subtle"} lineClamp={2}>
                    {service?.description?.[lang]}
                  </P>
                </Tooltip>
              </CContainer>
            </NavLink>
          );
        })}
      </SimpleGrid>
    ),
  };

  return (
    <CContainer my={"auto"} {...restProps}>
      {initialLoading && render.loading}
      {!initialLoading && (
        <>
          {error && render.error}
          {!error && (
            <>
              {data && render.loaded}
              {(!data || isEmptyArray(data)) && render.empty}
            </>
          )}
        </>
      )}
    </CContainer>
  );
};

export default function Page() {
  const GRID_COLS_BREAKPOINTS = {
    0: 1,
    350: 2,
    720: 3,
  };

  // Contexts
  const { l } = useLang();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const containerDimension = useContainerDimension(containerRef);

  // States
  const cols = getGridColumns(containerDimension.width, GRID_COLS_BREAKPOINTS);

  return (
    <PageContainer p={4}>
      <ContainerLayout ref={containerRef} flex={1}>
        <CContainer flex={1} gap={4} justify={"space-between"}>
          <P fontSize={"xl"} fontWeight={"semibold"} textAlign={"center"}>
            {l.document_analysis_service}
          </P>

          {cols > 1 && <Services cols={cols} />}

          <HelperText textAlign={"center"}>{l.msg_da_disclaimer}</HelperText>
        </CContainer>
      </ContainerLayout>
    </PageContainer>
  );
}
