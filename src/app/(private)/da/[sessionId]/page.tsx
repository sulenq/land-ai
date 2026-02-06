"use client";

import { CContainer } from "@/components/ui/c-container";
import { DASessonPageSkeleton } from "@/components/ui/c-loader";
import { HelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import { DataTable } from "@/components/widget/DataTable";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { ContainerLayout, PageContainer } from "@/components/widget/Page";
import { DUMMY_ACTIVE_DA_SESSION } from "@/constants/dummyData";
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
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

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
      th: doc.name,
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
          td: v.value,
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

  console.debug(result);

  return <DataTable headers={headers} rows={rows} {...restProps} />;
};

export default function Page() {
  // Contexts
  const { l } = useLang();
  const setBreadcrumbs = useBreadcrumbs((s) => s.setBreadcrumbs);
  const removeFromDASessions = useDASessions((s) => s.removeFromDASessions);

  // Hooks
  const { sessionId } = useParams();
  const router = useRouter();

  // States
  // const initialLoading = false;
  const { initialLoading, error, status, data, onRetry } =
    useDataState<Interface__DASessionDetail>({
      initialData: DUMMY_ACTIVE_DA_SESSION,
      // TODO enable below when api ready
      // url: `${DA_API_SESSION_DETAIL}/${sessionId}`,
      dataResource: false,
      dependencies: [sessionId],
    });

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

  const render = {
    loading: <DASessonPageSkeleton />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <CContainer flex={1} gap={4}>
        <CContainer gap={1} mb={4}>
          <P fontSize={"xl"} fontWeight={"semibold"}>
            {data?.title}
          </P>

          <P color={"fg.subtle"}>
            {formatDate(data?.createdAt, {
              withTime: true,
            })}
          </P>
        </CContainer>

        <CContainer flex={1}>
          <ResultTable daSession={data} />
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
