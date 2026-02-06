"use client";

import { CContainer } from "@/components/ui/c-container";
import { DASessonPageSkeleton } from "@/components/ui/c-loader";
import { HelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import Spinner from "@/components/ui/spinner";
import { ClampText } from "@/components/widget/ClampText";
import { DataTable } from "@/components/widget/DataTable";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import FeedbackState from "@/components/widget/FeedbackState";
import { LucideIcon } from "@/components/widget/Icon";
import { ContainerLayout, PageContainer } from "@/components/widget/Page";
import { DA_API_SESSION_DETAIL } from "@/constants/apis";
import {
  Interface__DASessionDetail,
  Interface__FormattedTableHeader,
  Interface__FormattedTableRow,
} from "@/constants/interfaces";
import { Props__DataTable } from "@/constants/props";
import { useBreadcrumbs } from "@/context/useBreadcrumbs";
import { useDASessions } from "@/context/useDASessions";
import useLang from "@/context/useLang";
import useDataState from "@/hooks/useDataState";
import { formatDate } from "@/utils/formatter";
import { capitalizeWords } from "@/utils/string";
import { HStack } from "@chakra-ui/react";
import { AlertTriangleIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props__ResultTable extends Props__DataTable {
  daSession?: Interface__DASessionDetail;
}
const ResultTable = (props: Props__ResultTable) => {
  // Props
  const { daSession, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // States
  const result = daSession?.result;
  const uploadedDocuments = daSession?.uploadedDocuments;
  const headers: Interface__FormattedTableHeader[] = [
    { th: "Item Validasi", sortable: true },
    ...(uploadedDocuments ?? []).map((doc) => ({
      th: doc.documentRequirement.name,
      sortable: true,
    })),
    { th: "Validasi", sortable: true },
  ];
  const rows: Interface__FormattedTableRow[] = (result ?? []).map((r, idx) => {
    return {
      id: `${idx}`,
      idx: idx,
      data: r,
      columns: [
        { td: r.label, value: r.label, dataType: "string" },
        ...r.values.map((v) => ({
          td: v.value || "-",
          value: v.value,
          dataType: v.renderType,
        })),
        {
          td: r.validation.status ? (
            <P color={"fg.success"}>{l.match}</P>
          ) : (
            <P color={"fg.subtle"}>{l.mismatch}</P>
          ),
          value: r.validation.status,
          dataType: "boolean",
        },
      ],
    };
  });

  return <DataTable headers={headers} rows={rows} {...restProps} />;
};

export default function Page() {
  // Contexts
  const { l, lang } = useLang();
  const setBreadcrumbs = useBreadcrumbs((s) => s.setBreadcrumbs);
  const removeFromDASessions = useDASessions((s) => s.removeFromDASessions);

  // Hooks
  const { sessionId } = useParams();
  const router = useRouter();

  // States
  const [pollingTick, setPollingTick] = useState(0);
  const { initialLoading, error, status, data, onRetry } =
    useDataState<Interface__DASessionDetail>({
      // initialData: DUMMY_ACTIVE_DA_SESSION,
      url: `${DA_API_SESSION_DETAIL}/${sessionId}`,
      dataResource: false,
      dependencies: [sessionId, pollingTick],
    });
  const formattedDocuments =
    data?.documentService?.documentRequirements.map((req) => {
      const uploaded = data?.uploadedDocuments?.find(
        (u) => u.documentRequirement.id === req.id,
      );

      return {
        documentRequirement: req,
        uploadedFile: uploaded
          ? {
              metaData: {
                fileName: uploaded.metaData.fileName,
              },
            }
          : null,
      };
    }) ?? [];

  const processing = data?.status === "PROCESSING";
  const failed = data?.status === "FAILED";
  const completed = data?.status === "COMPLETED";

  // Handle 404 - redirect and remove session
  useEffect(() => {
    if (status === 404) {
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

  // Refetch if processing
  useEffect(() => {
    if (data?.status !== "PROCESSING") return;

    const interval = setInterval(() => {
      setPollingTick((t) => t + 1);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [data?.status]);

  const render = {
    loading: <DASessonPageSkeleton />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <CContainer flex={1} gap={8}>
        {/* Header */}
        <CContainer gap={1}>
          <P fontSize={"xl"} fontWeight={"semibold"}>
            {data?.title}
          </P>

          <P color={"fg.subtle"}>
            {formatDate(data?.createdAt, {
              withTime: true,
            })}
          </P>
        </CContainer>

        {/* Meta */}
        <>
          <CContainer gap={4}>
            <P fontWeight={"medium"}>{capitalizeWords(l.service)}</P>

            <CContainer gap={2} pl={4}>
              <HStack gap={4} align={"start"}>
                <P w={"140px"} flexShrink={0} color={"fg.subtle"}>
                  {l.name}
                </P>
                <P>{data?.documentService.title[lang]}</P>
              </HStack>

              <HStack gap={4} align={"start"}>
                <P w={"140px"} flexShrink={0} color={"fg.subtle"}>
                  {l.description}
                </P>
                <P>{data?.documentService.description[lang]}</P>
              </HStack>
            </CContainer>
          </CContainer>

          <CContainer gap={4}>
            <P fontWeight={"medium"}>{capitalizeWords(l.uploaded_file)}</P>

            <CContainer gap={2} pl={4}>
              {formattedDocuments?.map((doc) => {
                return (
                  <HStack
                    key={doc.documentRequirement.id}
                    align={"start"}
                    gap={4}
                  >
                    <ClampText w={"140px"} flexShrink={0} color={"fg.subtle"}>
                      {doc.documentRequirement.name}
                    </ClampText>

                    {doc.uploadedFile?.metaData.fileName ? (
                      <ClampText>
                        {doc.uploadedFile?.metaData.fileName}
                      </ClampText>
                    ) : (
                      <P>-</P>
                    )}
                  </HStack>
                );
              })}
            </CContainer>
          </CContainer>
        </>

        {/* Result */}
        <CContainer flex={1}>
          {processing && (
            <FeedbackState
              icon={<Spinner />}
              title={l.alert_da_analyze_processing.title}
              description={l.alert_da_analyze_processing.description}
              m={"auto"}
            />
          )}

          {failed && (
            <FeedbackState
              icon={<LucideIcon icon={AlertTriangleIcon} />}
              title={l.alert_da_analyze_failed.title}
              description={l.alert_da_analyze_failed.description}
              m={"auto"}
            />
          )}

          {completed && (
            <CContainer>
              <P fontWeight={"medium"}>{capitalizeWords(l.analyze_result)}</P>

              <ResultTable daSession={data} />
            </CContainer>
          )}
        </CContainer>
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
