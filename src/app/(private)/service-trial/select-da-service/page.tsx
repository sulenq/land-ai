"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { DAServiceSkeleton } from "@/components/ui/c-loader";
import { Img } from "@/components/ui/img";
import { P } from "@/components/ui/p";
import { FadingSkeletonContainer } from "@/components/ui/skeleton";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIcon } from "@/components/widget/AppIcon";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import {
  ConstrainedContainer,
  PageContainer,
} from "@/components/widget/PageShell";
import { TrialStepper } from "@/components/widget/trial-stepper";
import { DA_API_SERVICE_GET_ALL } from "@/constants/apis";
import { Interface__DAService } from "@/constants/interfaces";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useTrialSessionContext } from "@/context/useTrialSessionContext";
import useDataState from "@/hooks/useDataState";
import useRequest from "@/hooks/useRequest";
import { isEmptyArray } from "@/utils/array";
import { getStorage, setStorage } from "@/utils/client";
import { imgUrl } from "@/utils/url";
import { SimpleGrid, StackProps } from "@chakra-ui/react";
import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Interface__ServiceItem extends StackProps {
  index: number;
  service: Interface__DAService;
}

const ServiceItem = (props: Interface__ServiceItem) => {
  // Props
  const {
    // index,
    service,
    ...restProps
  } = props;

  // Contexts
  const { l, lang } = useLang();
  const { themeConfig } = useThemeConfig();
  // const setTrialSession = useTrialSessionContext((s) => s.setTrialSession);
  const setStep = useTrialSessionContext((s) => s.setStep);

  // Hooks
  const {
    // req,
    loading,
  } = useRequest({
    id: "create-trial-session",
  });
  const router = useRouter();

  // Constants
  const path = `/service-trial`; // + trial session id

  // Utils
  const handleCeateTrialSession = () => {
    // const payload = {
    //   daServiceId: service.id,
    // };

    // const config = {
    //   url: "/api/trial/create",
    //   method: "POST",
    //   data: payload,
    // };

    // req({
    //   config,
    //   onResolve: {
    //     onSuccess: (r) => {
    //       setTrialSession(r.data);
    //       setStep(2);
    //       router.push(`${path}/${r.data.id}`);
    //     },
    //     onError: () => {},
    //   },
    // });

    // TODO remove below
    setStep(2);
    router.push(`${path}/1/manual-phase`);
  };

  useEffect(() => {
    setStep(1);
  }, []);

  return (
    <CContainer
      className={"clicky group"}
      flex={"1 1 200px"}
      w={"full"}
      h={"282px"}
      gap={8}
      p={4}
      border={"1px solid"}
      borderColor={"border.subtle"}
      rounded={themeConfig.radii.component}
      cursor={"pointer"}
      transition={"200ms"}
      _hover={{
        bg: "bg.muted",
      }}
      onClick={handleCeateTrialSession}
      {...restProps}
    >
      <Img src={imgUrl(service.icon)} w={"40px"} h={"40px"} mb={"auto"} />

      <CContainer gap={2}>
        <Tooltip content={service?.title?.[lang]}>
          <P fontSize={"lg"} fontWeight={"semibold"} lineClamp={2}>
            {service?.title?.[lang]}
          </P>
        </Tooltip>

        <Tooltip content={service?.description?.[lang]}>
          <P color={"fg.muted"} lineClamp={2}>
            {service?.description?.[lang]}
          </P>
        </Tooltip>
      </CContainer>

      <Btn
        variant={"subtle"}
        loading={loading}
        _groupHover={{
          bg: "bg.emphasized",
        }}
      >
        {l.select}
        <AppIcon icon={ArrowRightIcon} />
      </Btn>
    </CContainer>
  );
};

const Services = (props: StackProps) => {
  // Props
  const { ...restProps } = props;

  // States
  // const initialLoading = true;
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
        {data?.map((service, index) => {
          return (
            <ServiceItem key={service.id} index={index} service={service} />
          );
        })}
      </SimpleGrid>
    ),
  };

  return (
    <CContainer position="relative" {...restProps}>
      <FadingSkeletonContainer loading={initialLoading} useDummyElement>
        {render.loading}
      </FadingSkeletonContainer>

      <CContainer>
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
    </CContainer>
  );
};

export default function Page() {
  return (
    <PageContainer p={8}>
      <ConstrainedContainer flex={1} justify={"center"} gap={8}>
        <TrialStepper />

        <Services my={"auto"} />
      </ConstrainedContainer>
    </PageContainer>
  );
}
