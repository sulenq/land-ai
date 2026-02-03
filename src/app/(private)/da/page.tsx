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
import { DA_API_SERVICES_INDEX } from "@/constants/apis";
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
  // const SERVICES = [
  //   {
  //     id: 1,
  //     iconPath: `${IMAGES_PATH}/da/services/service1.png`,
  //     titleKey: "service_1_title",
  //     descriptionKey: "service_1_description",
  //     path: `/da/service1`,
  //   },
  //   {
  //     id: 2,
  //     iconPath: `${IMAGES_PATH}/da/services/service2.png`,
  //     titleKey: "service_2_title",
  //     descriptionKey: "service_2_description",
  //     path: `/da/service2`,
  //   },
  //   {
  //     id: 3,
  //     iconPath: `${IMAGES_PATH}/da/services/service3.png`,
  //     titleKey: "service_3_title",
  //     descriptionKey: "service_3_description",
  //     path: `/da/service3`,
  //   },
  //   {
  //     id: 4,
  //     iconPath: `${IMAGES_PATH}/da/services/service4.png`,
  //     titleKey: "service_4_title",
  //     descriptionKey: "service_4_description",
  //     path: `/da/service4`,
  //   },
  //   {
  //     id: 5,
  //     iconPath: `${IMAGES_PATH}/da/services/service5.png`,
  //     titleKey: "service_5_title",
  //     descriptionKey: "service_5_description",
  //     path: `/da/service5`,
  //   },
  //   {
  //     id: 6,
  //     iconPath: `${IMAGES_PATH}/da/services/service6.png`,
  //     titleKey: "service_6_title",
  //     descriptionKey: "service_6_description",
  //     path: `/da/service6`,
  //   },
  //   {
  //     id: 7,
  //     iconPath: `${IMAGES_PATH}/da/services/service7.png`,
  //     titleKey: "service_7_title",
  //     descriptionKey: "service_7_description",
  //     path: `/da/service7`,
  //   },
  // ];

  // Props
  const { cols, ...restProps } = props;

  // Contexts
  const { lang } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const { error, initialLoading, data, onRetry } = useDataState<
    Interface__DAService[]
  >({
    initialData: undefined,
    url: DA_API_SERVICES_INDEX,
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
              to={`/da/${service.id}`}
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
                  {service.title[lang]}
                </P>

                <Tooltip content={service.description[lang]}>
                  <P color={"fg.subtle"} lineClamp={2}>
                    {service.description[lang]}
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

      {/* <SimpleGrid gap={4} {...props}>
        {SERVICES.map((service) => {
          return (
            <NavLink
              key={service.id}
              to={service.path}
              className="clicky"
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
              <Img src={service.iconPath} w={"40px"} h={"40px"} mb={"auto"} />

              <CContainer gap={2}>
                <P fontSize={"lg"} fontWeight={"semibold"}>
                  {pluckString(l, service.titleKey)}
                </P>

                <Tooltip content={pluckString(l, service.descriptionKey)}>
                  <P color={"fg.subtle"} lineClamp={2}>
                    {pluckString(l, service.descriptionKey)}
                  </P>
                </Tooltip>
              </CContainer>
            </NavLink>
          );
        })}
      </SimpleGrid> */}
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
      <ContainerLayout ref={containerRef}>
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
