"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { DASessonPageSkeleton } from "@/components/ui/c-loader";
import { HelperText } from "@/components/ui/helper-text";
import { Img } from "@/components/ui/img";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import Spinner from "@/components/ui/spinner";
import { AppIcon } from "@/components/widget/AppIcon";
import { ClampText } from "@/components/widget/ClampText";
import { DataTable } from "@/components/widget/DataTable";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import FeedbackState from "@/components/widget/FeedbackState";
import { HorizontalScrollbar } from "@/components/widget/HorizontalScrollbar";
import { LucideIcon } from "@/components/widget/Icon";
import { ContainerLayout, PageContainer } from "@/components/widget/PageShell";
import { DA_API_SESSION_DETAIL } from "@/constants/apis";
import {
  Interface__DASessionDetail,
  Interface__FormattedTableHeader,
  Interface__FormattedTableRow,
} from "@/constants/interfaces";
import { Props__DataTable } from "@/constants/props";
import { useActiveDA } from "@/context/useActiveDA";
import { useBreadcrumbs } from "@/context/useBreadcrumbs";
import { useDASessions } from "@/context/useDASessions";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import useDataState from "@/hooks/useDataState";
import { formatDate } from "@/utils/formatter";
import { capitalizeWords } from "@/utils/string";
import { imgUrl } from "@/utils/url";
import { HStack, StackProps } from "@chakra-ui/react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  AlertTriangleIcon,
  ArrowUpRightIcon,
  DownloadIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  SuratKuasaPDF,
  SuratPermohonanPDF,
  SuratPernyataanPDF,
} from "public/DADocTemplate/DALetterTemplate";
import { useEffect, useRef, useState } from "react";

interface Props__ResultTable extends Props__DataTable {
  containerDimension: { width: number; height: number };
  daSession?: Interface__DASessionDetail;
}
const ResultTable = (props: Props__ResultTable) => {
  // Props
  const { containerDimension, daSession, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // Refs
  const containerRefInternal = useRef<HTMLDivElement | null>(null);

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
          td: v.value === "NOT_FOUND" ? l.not_found : v.value || "-",
          dim: v.value === "NOT_FOUND" || v.value === null,
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

  return (
    <CContainer gap={2}>
      <ContainerLayout>
        <P fontWeight={"medium"}>{capitalizeWords(l.analysis_result)}</P>
      </ContainerLayout>

      <CContainer
        className="noScroll"
        ref={containerRefInternal}
        overflowX={"auto"}
      >
        <CContainer
          w={"max"}
          px={`calc((${containerDimension.width || 0}px - 720px)/2)`}
        >
          <DataTable headers={headers} rows={rows} minH={0} {...restProps} />
        </CContainer>
      </CContainer>

      <HorizontalScrollbar
        containerRef={containerRefInternal}
        maxW={"200px"}
        mx={"auto"}
        mt={2}
        mb={4}
      />
    </CContainer>
  );
};

// interface Props__LetterPreview extends StackProps {
//   id: string;
//   title: string;
//   pdf: React.ReactNode;
// }
// const LetterPreviewTrigger = (props: Props__LetterPreview) => {
//   // Props
//   const { children, id, title, pdf, ...restProps } = props;

//   // Contexts
//   const { l } = useLang();

//   // Hooks
//   const { isOpen, onOpen } = usePopDisclosure(
//     disclosureId(`generate_letter_preview_${id}`),
//   );

//   return (
//     <>
//       <CContainer w={"fit"} onClick={onOpen} {...restProps}>
//         {children}
//       </CContainer>

//       <DisclosureRoot open={isOpen} lazyLoad size={"cover"}>
//         <DisclosureContent>
//           <DisclosureHeader>
//             <DisclosureHeaderContent title={`Preview ${title}`} />
//           </DisclosureHeader>

//           <DisclosureBody>
//             <CContainer className="scrollX scrollY">
//               <Box id={`letter_preview_${id}`} m={"auto"}>
//                 <PDFViewer width="100%" height="800">
//                   {pdf}
//                 </PDFViewer>
//               </Box>
//             </CContainer>
//           </DisclosureBody>

//           <DisclosureFooter>
//             <BackButton />

//             <PDFDownloadLink document={pdf as any} fileName="Surat Kuasa.pdf">
//               <PBtn>
//                 <AppIcon icon={DownloadIcon} />
//                 <>
//                   {({ loading }: any) =>
//                     loading ? "Loading PDF..." : `${l.download} PDF`
//                   }
//                 </>
//               </PBtn>
//             </PDFDownloadLink>
//             {/* <PBtn>
//               <AppIcon icon={DownloadIcon} />
//               {l.download} PDF
//             </PBtn> */}
//           </DisclosureFooter>
//         </DisclosureContent>
//       </DisclosureRoot>
//     </>
//   );
// };
interface Props__GenerateLetterButtons extends StackProps {
  data?: Interface__DASessionDetail;
}
const GenerateLetterButtons = (props: Props__GenerateLetterButtons) => {
  // Props
  const { data, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // States
  const rawData = data?.rawData;
  const LETTERS = [
    {
      key: "suratKuasa",
      label: "Surat Kuasa",
      pdf: <SuratKuasaPDF data={rawData} />,
    },
    {
      key: "suratPermohonan",
      label: "Surat Permohonan",
      pdf: <SuratPermohonanPDF data={rawData} />,
    },
    {
      key: "suratPernyataan",
      label: "Surat Pernyataan",
      pdf: <SuratPernyataanPDF data={rawData} />,
    },
  ];

  // Utils
  // function downloadAll() {}

  return (
    <ContainerLayout {...restProps}>
      <CContainer gap={2} align={"center"}>
        <HStack wrap={"wrap"} justify={"center"}>
          {LETTERS.map((letter) => {
            return (
              <PDFDownloadLink
                key={letter.key}
                document={letter.pdf as any}
                fileName={`${letter.label}.pdf`}
              >
                {({ loading }: any) => (
                  <Btn variant={"outline"} size={"xs"}>
                    <AppIcon icon={DownloadIcon} boxSize={4} />
                    {loading
                      ? "Loading PDF..."
                      : `${l.download} ${letter.label} PDF`}
                  </Btn>
                )}
              </PDFDownloadLink>
            );
          })}
        </HStack>

        {/* <Btn w={"fit"} variant={"outline"} size={"xs"} onClick={downloadAll}>
          <AppIcon icon={DownloadIcon} />
          {l.download} {l.all}
        </Btn> */}
      </CContainer>
    </ContainerLayout>
  );
};

export default function Page() {
  // Contexts
  const { l, lang } = useLang();
  const { themeConfig } = useThemeConfig();
  const setBreadcrumbs = useBreadcrumbs((s) => s.setBreadcrumbs);
  const removeFromDASessions = useDASessions((s) => s.removeFromDASessions);
  const updateIsNewDA = useActiveDA((s) => s.updateIsNewDA);
  const updateHasLoadedHistory = useActiveDA((s) => s.updateHasLoadedHistory);
  const clearActiveDa = useActiveDA((s) => s.clearActiveDa);
  const setSession = useActiveDA((s) => s.setSession);
  const activeDA = useActiveDA((s) => s.activeDA);

  // Refs
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Hooks
  const { sessionId } = useParams();
  const router = useRouter();
  const containerDimension = useContainerDimension(containerRef);

  // States
  const activeDASession = activeDA.session;
  const activeDASessionId = activeDASession?.id;
  const [pollingTick, setPollingTick] = useState(0);
  const { initialLoading, error, status, data, onRetry } =
    useDataState<Interface__DASessionDetail>({
      // initialData: DUMMY_ACTIVE_DA_SESSION,
      url: `${DA_API_SESSION_DETAIL}/${sessionId}`,
      dataResource: false,
      dependencies: [sessionId, pollingTick],
      loadingBarInitialOnly: true,
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

  // Update has loaded history on session change
  useEffect(() => {
    updateIsNewDA(false);
    if (activeDASessionId !== sessionId) {
      updateHasLoadedHistory(false);
      clearActiveDa();
    }
  }, [sessionId]);

  // Set active DA on data load
  useEffect(() => {
    if (!activeDA.session && data) {
      setSession(data);
    }
  }, [data, activeDA.session]);

  // Handle 404 - redirect and remove session
  useEffect(() => {
    if (status === 404) {
      removeFromDASessions(sessionId as string);
      router.push("/new-da");
    }
  }, [status]);

  // Update breadcroumbs
  useEffect(() => {
    if (activeDA.session) {
      setBreadcrumbs({
        activeNavs: [
          {
            labelKey: `navs.your_da_analysis`,
            path: `/da`,
          },
          {
            label: activeDA.session?.title,
            path: `/da/${sessionId}`,
          },
        ],
      });
    } else {
      setBreadcrumbs({
        activeNavs: [
          {
            labelKey: `navs.your_da_analysis`,
            path: `/da`,
          },
          {
            label: "...",
            path: `/da/${sessionId}`,
          },
        ],
      });
    }
  }, [activeDA.session]);

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
    loading: (
      <ContainerLayout flex={1}>
        <DASessonPageSkeleton />
      </ContainerLayout>
    ),
    error: <FeedbackRetry onRetry={onRetry} m={"auto"} />,
    empty: <FeedbackNoData m={"auto"} />,
    notFound: <FeedbackNotFound m={"auto"} />,
    loaded: (
      <CContainer flex={1} gap={8}>
        <ContainerLayout gap={8}>
          {/* Header */}
          <CContainer gap={1}>
            <P fontSize={"xl"} fontWeight={"semibold"}>
              {activeDASession?.title}
            </P>

            <P color={"fg.subtle"}>
              {formatDate(activeDASession?.createdAt, {
                withTime: true,
              })}
            </P>
          </CContainer>

          {/* Meta */}
          <>
            <CContainer gap={2}>
              <P fontWeight={"medium"}>{capitalizeWords(l.service)}</P>

              <CContainer
                gap={2}
                p={4}
                rounded={themeConfig.radii.container}
                // border={"1px solid"}
                borderColor={"border.muted"}
                bg={"d0"}
              >
                <HStack gap={4} align={"start"}>
                  <P w={"140px"} flexShrink={0} color={"fg.muted"}>
                    {l.name}
                  </P>

                  <HStack
                    flexDir={["column", null, "row"]}
                    align={"start"}
                    gapY={1}
                  >
                    <Img
                      key={activeDASession?.documentService?.icon}
                      src={imgUrl(activeDASession?.documentService?.icon)}
                      fluid
                      flexShrink={0}
                      w={"20px"}
                      mt={"2px"}
                    />

                    <P>{data?.documentService.title[lang]}</P>
                  </HStack>
                </HStack>

                <HStack gap={4} align={"start"}>
                  <P w={"140px"} flexShrink={0} color={"fg.muted"}>
                    {l.description}
                  </P>

                  <P>{data?.documentService.description[lang]}</P>
                </HStack>
              </CContainer>
            </CContainer>

            <CContainer gap={2}>
              <P fontWeight={"medium"}>{capitalizeWords(l.uploaded_file)}</P>

              <CContainer
                gap={2}
                p={4}
                rounded={themeConfig.radii.container}
                // border={"1px solid"}
                borderColor={"border.muted"}
                bg={"d0"}
              >
                {formattedDocuments?.map((doc) => {
                  return (
                    <HStack
                      key={doc.documentRequirement.id}
                      align={"start"}
                      gap={4}
                    >
                      <ClampText w={"140px"} flexShrink={0} color={"fg.muted"}>
                        {doc.documentRequirement.name}
                      </ClampText>

                      {doc.uploadedFile?.metaData.fileName ? (
                        <ClampText fontWeight={"medium"}>
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
        </ContainerLayout>

        {/* Result */}
        <CContainer>
          {processing && (
            <FeedbackState
              icon={<Spinner />}
              title={l.alert_da_analyze_processing.title}
              description={l.alert_da_analyze_processing.description}
              m={"auto"}
              my={"80px"}
            />
          )}

          {failed && (
            <FeedbackState
              icon={<LucideIcon icon={AlertTriangleIcon} />}
              title={l.alert_da_analyze_failed.title}
              description={l.alert_da_analyze_failed.description}
              m={"auto"}
              my={"80px"}
            />
          )}

          {completed && (
            <>
              <ResultTable
                daSession={data}
                containerDimension={containerDimension}
              />

              <GenerateLetterButtons data={data} mt={4} />
            </>
          )}

          <HStack wrap={"wrap"} gap={1} justify={"center"} mt={4}>
            <NavLink to={"/new-da"}>
              <Btn variant={"ghost"} color={`${themeConfig.colorPalette}.fg`}>
                {l.new_da} <AppIcon icon={ArrowUpRightIcon} />
              </Btn>
            </NavLink>

            <NavLink to={`/new-da/${data?.documentService.id}`}>
              <Btn variant={"ghost"} color={`${themeConfig.colorPalette}.fg`}>
                {l.new_da_with_same_service}
                <AppIcon icon={ArrowUpRightIcon} />
              </Btn>
            </NavLink>
          </HStack>
        </CContainer>
      </CContainer>
    ),
  };

  return (
    <PageContainer ref={containerRef} px={4} py={8} pos={"relative"}>
      {/* <PDFViewer height={"800px"}>
        <SuratPermohonanPDF data={data?.rawData} />
      </PDFViewer> */}

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
    </PageContainer>
  );
}
