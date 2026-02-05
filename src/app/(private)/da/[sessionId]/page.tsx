"use client";

import { CContainer } from "@/components/ui/c-container";
import { DASessonPageSkeleton } from "@/components/ui/c-loader";
import { HelperText } from "@/components/ui/helper-text";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { ContainerLayout, PageContainer } from "@/components/widget/Page";
import { DUMMY_ACTIVE_DA_SESSION } from "@/constants/dummyData";
import { Interface__DASessionDetail } from "@/constants/interfaces";
import { useBreadcrumbs } from "@/context/useBreadcrumbs";
import { useDASessions } from "@/context/useDASessions";
import useLang from "@/context/useLang";
import useDataState from "@/hooks/useDataState";
import { SimpleGrid } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  // Contexts
  const { l } = useLang();
  const setBreadcrumbs = useBreadcrumbs((s) => s.setBreadcrumbs);
  const removeFromDASessions = useDASessions((s) => s.removeFromDASessions);

  // Hooks
  const { sessionId } = useParams();
  const router = useRouter();

  // States
  // const initialLoading = true;
  const { error, initialLoading, status, data, onRetry } =
    useDataState<Interface__DASessionDetail>({
      initialData: DUMMY_ACTIVE_DA_SESSION,
      // TODO enable below when api ready
      // url: `${DA_API_SESSION_DETAIL}/${sessionId}`,
      dataResource: false,
      dependencies: [sessionId],
    });

  // Handle 404 - redirect and remove session
  useEffect(() => {
    // TODO: remove below disabled condition when api ready
    const disabled = true;
    if (status === 404 && !disabled) {
      removeFromDASessions(sessionId as string);
      router.push("/new-da");
    }
  }, [status]);

  // Update breadcroumbs
  useEffect(() => {
    setBreadcrumbs({
      activeNavs: [
        {
          labelKey: `navs.your_da_analysis`,
          path: `/da/${data?.id}`,
        },
        {
          label: data?.title,
          path: `/da/${data?.id}`,
        },
      ],
    });
  }, []);

  console.debug(data);

  const render = {
    loading: <DASessonPageSkeleton />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <CContainer>
        <SimpleGrid columns={[2, null, 4]}></SimpleGrid>
      </CContainer>
    ),
  };

  return (
    <PageContainer p={4} pos={"relative"}>
      <ContainerLayout>
        <CContainer flex={1} gap={4} justify={"space-between"}>
          {initialLoading && render.loading}
          {!initialLoading && (
            <>
              {error && render.error}
              {!error && (
                <>
                  {data && render.loaded}
                  {!data && render.empty}
                </>
              )}
            </>
          )}

          <HelperText textAlign={"center"}>{l.msg_da_disclaimer}</HelperText>
        </CContainer>
      </ContainerLayout>
    </PageContainer>
  );
}
