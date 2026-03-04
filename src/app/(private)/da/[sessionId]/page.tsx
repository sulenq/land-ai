"use client";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { DASessonPageSkeleton } from "@/components/ui/c-loader";
import { HelperText } from "@/components/ui/helper-text";
import { Img } from "@/components/ui/img";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { Spinner } from "@/components/ui/spinner";
import { AppIcon } from "@/components/widget/AppIcon";
import { ClampText } from "@/components/widget/ClampText";
import {
  SuratKuasaPDF,
  SuratPermohonanPDF,
  SuratPernyataanPDF,
} from "@/components/widget/DALetterTemplate";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import FeedbackState from "@/components/widget/FeedbackState";
import { LucideIcon } from "@/components/widget/Icon";
import { DotIndicator } from "@/components/widget/Indicator";
import { ContainerLayout, PageContainer } from "@/components/widget/PageShell";
import { DA_API_SESSION_DETAIL } from "@/constants/apis";
import { Interface__DASessionDetail } from "@/constants/interfaces";
import { useActiveDA } from "@/context/useActiveDA";
import { useBreadcrumbs } from "@/context/useBreadcrumbs";
import { useDASessions } from "@/context/useDASessions";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useDataState from "@/hooks/useDataState";
import { formatDate } from "@/utils/formatter";
import { capitalizeWords } from "@/utils/string";
import { imgUrl } from "@/utils/url";
import { Badge, HStack, StackProps } from "@chakra-ui/react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  AlertTriangleIcon,
  ArrowUpRightIcon,
  DownloadIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Props__ResultSection extends StackProps {
  daSession?: Interface__DASessionDetail;
}
const ResultSection = (props: Props__ResultSection) => {
  // Props
  const { daSession, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const result = daSession?.result;
  const [accordionValue, setAccordionValue] = useState<string[]>([]);
  const uploadedDocuments = daSession?.uploadedDocuments;
  const documentRequirements = daSession?.documentService?.documentRequirements;

  // Utils
  const getValueResult = (label: string, index: number) => {
    const field = result?.find((item) => item.label === label);
    return field?.values?.[index]?.value ?? null;
  };

  return (
    <ContainerLayout pos={"relative"} {...restProps}>
      <HStack
        justify={"space-between"}
        pb={2}
        bg="linear-gradient(
              to bottom,
              var(--chakra-colors-body) 80%,
              transparent 100%
            )"
        pos={"sticky"}
        top={"-32px"}
        zIndex={"sticky"}
      >
        <P fontWeight="semibold">{capitalizeWords(l.analysis_result)}</P>

        <HStack rounded={themeConfig.radii.component}>
          <Btn
            variant="outline"
            size="xs"
            onClick={() => {
              if (uploadedDocuments) {
                setAccordionValue(
                  uploadedDocuments.map((doc) => {
                    return `${doc.documentRequirement.id}`;
                  }),
                );
              }
            }}
          >
            {l.open_all}
          </Btn>

          <Btn
            variant="outline"
            size="xs"
            onClick={() => {
              setAccordionValue([]);
            }}
          >
            {l.close_all}
          </Btn>
        </HStack>
      </HStack>

      <CContainer bg={"bg.muted"} rounded={themeConfig.radii.container}>
        <AccordionRoot
          collapsible
          multiple
          value={accordionValue}
          onValueChange={(e) => setAccordionValue(e.value)}
        >
          {uploadedDocuments?.map((doc, index) => {
            const documentRequirement = documentRequirements?.find((dr) => {
              return dr.id === doc.documentRequirement.id;
            });

            return (
              <AccordionItem
                key={doc.documentRequirement.id}
                value={`${doc.documentRequirement.id}`}
                borderColor={"d1"}
                px={4}
              >
                <AccordionItemTrigger cursor={"pointer"}>
                  <P>{doc.documentRequirement.name}</P>
                </AccordionItemTrigger>

                <AccordionItemContent>
                  <CContainer gap={2}>
                    {documentRequirement?.extractionSchema?.map((field) => {
                      const value = getValueResult(field.label, index);

                      return (
                        <HStack key={field.key} gap={4}>
                          <ClampText w={"200px"} color={"fg.muted"}>
                            {field.label}
                          </ClampText>

                          {value === "NOT_FOUND" ? null : (
                            <ClampText>{value || "-"}</ClampText>
                          )}
                        </HStack>
                      );
                    })}
                  </CContainer>
                </AccordionItemContent>
              </AccordionItem>
            );
          })}

          <AccordionItem
            value={`validation`}
            borderBottom={"none"}
            borderColor={"d1"}
            px={4}
          >
            <AccordionItemTrigger cursor={"pointer"}>
              <DotIndicator />
              <P>{l.validation}</P>
            </AccordionItemTrigger>

            <AccordionItemContent>
              <CContainer gap={2}>
                {result?.map((r) => {
                  const fieldLabel = r.label;
                  const isMatch = r.validation.status;

                  return (
                    <HStack key={r.label} gap={4}>
                      <ClampText w={"200px"} color={"fg.muted"}>
                        {fieldLabel}
                      </ClampText>

                      <P color={isMatch ? "fg.success" : "fg.muted"}>
                        {isMatch ? l.match : l.mismatch}
                      </P>
                    </HStack>
                  );
                })}
              </CContainer>
            </AccordionItemContent>
          </AccordionItem>
        </AccordionRoot>
      </CContainer>
    </ContainerLayout>
  );
};

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
  const uploadedDocuments = data?.uploadedDocuments;

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
              <HStack h={"32px"}>
                <P fontWeight={"semibold"}>{capitalizeWords(l.service)}</P>
              </HStack>

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
                      flexShrink={0}
                      w={"20px"}
                      h={"20px"}
                      objectFit={"contain"}
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
              <HStack h={"32px"}>
                <P fontWeight={"semibold"}>
                  {capitalizeWords(l.uploaded_file)}
                </P>
              </HStack>

              <CContainer
                gap={2}
                p={4}
                rounded={themeConfig.radii.container}
                // border={"1px solid"}
                borderColor={"border.muted"}
                bg={"d0"}
              >
                {uploadedDocuments?.map((doc) => {
                  return (
                    <HStack
                      key={doc.documentRequirement.id}
                      align={"start"}
                      gap={4}
                    >
                      <HStack flexShrink={0} w={"200px"}>
                        <ClampText color={"fg.muted"}>
                          {doc.documentRequirement.name}
                        </ClampText>

                        {!doc.documentRequirement.isMandatory && (
                          <Badge bg={"d1"}>{l.optional}</Badge>
                        )}
                      </HStack>

                      {doc.metaData.fileName ? (
                        <ClampText fontWeight={"medium"}>
                          {doc.metaData.fileName}
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
              <ResultSection daSession={data} />

              <GenerateLetterButtons data={data} mt={8} />
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
      {/* <PdfViewer height={"800px"}>
        <SuratPermohonanPDF data={data?.rawData} />
      </PdfViewer> */}

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
