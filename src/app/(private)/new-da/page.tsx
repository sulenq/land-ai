"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { DAServiceSkeleton } from "@/components/ui/c-loader";
import { HelperText } from "@/components/ui/helper-text";
import { Img } from "@/components/ui/img";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIcon } from "@/components/widget/AppIcon";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { ContainerLayout, PageContainer } from "@/components/widget/PageShell";
import { DA_API_SERVICE_GET_ALL } from "@/constants/apis";
import { Interface__DAService } from "@/constants/interfaces";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useDataState from "@/hooks/useDataState";
import { isEmptyArray } from "@/utils/array";
import { getStorage, setStorage } from "@/utils/client";
import { imgUrl } from "@/utils/url";
import { SimpleGrid, StackProps } from "@chakra-ui/react";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useRef } from "react";

const Services = (props: StackProps) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { l, lang } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const { initialLoading, error, data, onRetry } = useDataState<
    Interface__DAService[]
  >({
    initialData: undefined,
    url: DA_API_SERVICE_GET_ALL,
    dataResource: false,
  });
  // Constants
  const DA_SERVICES_LENGTH_STORAGE_KEY = "da-services-length";
  const daServicesLength = getStorage(DA_SERVICES_LENGTH_STORAGE_KEY) || "7";

  useEffect(() => {
    if (data) {
      setStorage(DA_SERVICES_LENGTH_STORAGE_KEY, String(data.length));
    }
  }, [data]);

  const render = {
    loading: <DAServiceSkeleton length={parseInt(daServicesLength)} />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <SimpleGrid
        templateColumns={`repeat(auto-fill, minmax(200px, 1fr))`}
        gap={4}
      >
        {data?.map((service) => {
          return (
            <NavLink
              key={service.id}
              to={`/new-da/${service.id}`}
              className={"clicky"}
              flex={"1 1 200px"}
              w={"full"}
              minH={"200px"}
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
                  <P color={"fg.muted"} lineClamp={2}>
                    {service?.description?.[lang]}
                  </P>
                </Tooltip>
              </CContainer>

              <Btn variant={"subtle"}>
                {l.select}
                <AppIcon icon={ArrowRightIcon} />
              </Btn>
            </NavLink>
          );
        })}
      </SimpleGrid>
    ),
  };

  return (
    <CContainer {...restProps}>
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
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <PageContainer p={8}>
      <ContainerLayout ref={containerRef} flex={1}>
        <CContainer flex={1} gap={8} justify={"center"}>
          <CContainer gap={1} px={themeConfig.radii.component}>
            <P fontSize={"3xl"} fontWeight={"semibold"}>
              {l.document_analysis_service}
            </P>

            <P fontSize={"lg"} color={"fg.subtle"}>
              {l.msg_da_select_service_helper}
            </P>
          </CContainer>

          <Services />

          <HelperText px={themeConfig.radii.component}>
            {l.msg_da_disclaimer}
          </HelperText>
        </CContainer>
      </ContainerLayout>
    </PageContainer>
  );
}
