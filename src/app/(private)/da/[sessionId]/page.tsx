"use client";

import { FraudAlertsPanel } from "@/components/fraud/FraudAlertsPanel";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { DASessonPageSkeleton } from "@/components/ui/c-loader";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import { HelperText } from "@/components/ui/helper-text";
import { Img } from "@/components/ui/img";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { Segmented } from "@/components/ui/segment-group";
import { FadingSkeletonContainer } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIcon } from "@/components/widget/AppIcon";
import BackButton from "@/components/widget/BackButton";
import { ClampText } from "@/components/widget/ClampText";
import {
  SuratKuasaPDF,
  SuratPermohonanPDF,
  SuratPernyataanPDF,
} from "@/components/widget/DALetterTemplate";
import { DataTable } from "@/components/widget/DataTable";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import FeedbackState from "@/components/widget/FeedbackState";
import { LucideIcon } from "@/components/widget/Icon";
import { DotIndicator } from "@/components/widget/Indicator";
import { InfoPopover } from "@/components/widget/InfoPopover";
import { MContainer } from "@/components/widget/MContainer";
import {
  ConstrainedContainer,
  PageContainer,
} from "@/components/widget/PageShell";
import { PdfViewer } from "@/components/widget/PDFViewer";
import { DA_API_SESSION_DETAIL } from "@/constants/apis";
import { DUMMY_PDF_URL, DUMMY_UPLOADED_DOCS } from "@/constants/dummyData";
import {
  Interface__DASessionDetail,
  Interface__DAUploadedDocument,
  Interface__ExtractedParameter,
  Interface__FormattedTableHeader,
  Interface__FormattedTableRow,
  Interface__ParameterValidation,
} from "@/constants/interfaces";
import { R_SPACING_MD, R_SUBTITLE, R_TITLE } from "@/constants/styles";
import { useActiveDA } from "@/context/useActiveDA";
import { useBreadcrumbs } from "@/context/useBreadcrumbs";
import { useDASessions } from "@/context/useDASessions";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import useDataState from "@/hooks/useDataState";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import usePopDisclosure from "@/hooks/usePopDisclosure";
import { formatAnalysisValue, isNotFoundAnalysisValue } from "@/utils/analysis";
import { isEmptyArray } from "@/utils/array";
import { disclosureId } from "@/utils/disclosure";
import { formatDate } from "@/utils/formatter";
import { capitalizeWords } from "@/utils/string";
import { fileUrl, imgUrl } from "@/utils/url";
import { Badge, Box, HStack, Stack, StackProps } from "@chakra-ui/react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  AlertTriangleIcon,
  ArrowUpRightIcon,
  CheckCheckIcon,
  DownloadIcon,
  LayoutListIcon,
  ListIcon,
  ShieldAlertIcon,
  TableIcon,
  XIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Type__ActiveDoc =
  | {
      id: string;
      type: "doc";
      value: Interface__DAUploadedDocument;
    }
  | {
      id: string;
      type: "extractedDoc";
      value: any;
    };

// -----------------------------------------------------------------

interface Props__ViewerUploadedDocuments extends StackProps {
  activeDocs: Type__ActiveDoc[];
  setActiveDocs: React.Dispatch<React.SetStateAction<Type__ActiveDoc[]>>;
}

// -----------------------------------------------------------------

interface Props__ViewerDisclosure {
  open: boolean;
  uploadedDocuments?: Interface__DASessionDetail["uploadedDocuments"];
  activeDocs: Type__ActiveDoc[];
  setActiveDocs: React.Dispatch<React.SetStateAction<Type__ActiveDoc[]>>;
}

const ViewerDisclosure = (props: Props__ViewerDisclosure) => {
  // Props
  const { open, activeDocs, setActiveDocs } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const iss = useIsSmScreenWidth();

  // Utils
  function getParameterValidation(
    parameterLabel: string,
    validations: Interface__ParameterValidation[] | null | undefined,
    currentRequirementDocumentId: string,
  ) {
    if (!validations) return null;

    const pairedDoc = activeDocs.find(
      (d) =>
        d.type === "extractedDoc" &&
        d.value.documentRequirement.id !== currentRequirementDocumentId,
    );

    if (!pairedDoc) return null;

    const targetId = pairedDoc.value.documentRequirement.id;

    const match = validations.find(
      (v) =>
        v.withDocumentRequirementId === targetId &&
        v.withParameterLabel === parameterLabel,
    );

    return match ? match.valid : null;
  }

  useEffect(() => {
    if (!open) {
      setActiveDocs([]);
    }
  }, [open]);

  // console.debug(activeDocs);

  return (
    <>
      <DisclosureRoot open={open} lazyLoad size={"cover"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={capitalizeWords(l.uploaded_file)} />
          </DisclosureHeader>

          <DisclosureBody p={0} bg={["body", null, "transparent"]}>
            <Stack
              flexDir={["column", null, "row"]}
              align={"stretch"}
              gap={0}
              h={"full"}
              // roundedBottom={[0, null, themeConfig.radii.container]}
              overflow={"clip"}
            >
              {iss && (
                <CContainer px={R_SPACING_MD}>
                  <ViewerUploadedDocumentsTrigger
                    activeDocs={activeDocs}
                    setActiveDocs={setActiveDocs}
                    w={"full"}
                  >
                    <Btn variant={"outline"} size={"sm"}>
                      <AppIcon icon={ListIcon} />

                      {l.your_files}
                    </Btn>
                  </ViewerUploadedDocumentsTrigger>
                </CContainer>
              )}

              <CContainer
                flex={1}
                gap={2}
                h={"full"}
                p={[4, null, 2]}
                borderRight={"1px solid"}
                borderColor={"border.muted"}
                overflow={"hidden"}
              >
                {isEmptyArray(activeDocs) && (
                  <FeedbackNotFound title={`${l.select} file`} />
                )}

                {!isEmptyArray(activeDocs) && (
                  <HStack
                    flex={1}
                    gap={2}
                    h={"full"}
                    overflowX={"auto"}
                    overflowY={"hidden"}
                    css={{
                      scrollSnapType: "x mandatory",
                      WebkitOverflowScrolling: "touch",
                      scrollbarWidth: "thin",
                      "&::-webkit-scrollbar": {
                        height: "6px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "var(--chakra-colors-border-muted)",
                        borderRadius: "3px",
                      },
                    }}
                    onMouseDown={(e) => {
                      const container = e.currentTarget;
                      const startX = e.clientX;
                      const scrollLeft = container.scrollLeft;

                      const onMouseMove = (ev: MouseEvent) => {
                        const dx = ev.clientX - startX;
                        container.scrollLeft = scrollLeft - dx;
                      };
                      const onMouseUp = () => {
                        window.removeEventListener("mousemove", onMouseMove);
                        window.removeEventListener("mouseup", onMouseUp);
                      };
                      window.addEventListener("mousemove", onMouseMove);
                      window.addEventListener("mouseup", onMouseUp);
                    }}
                  >
                    {activeDocs?.map((doc, index) => {
                      return (
                        <>
                          {doc.type === "doc" && (
                            <CContainer
                              key={doc.id}
                              border={"1px solid"}
                              borderColor={"border.muted"}
                              rounded={themeConfig.radii.component}
                              h={"full"}
                              overflow={"hidden"}
                              flexShrink={0}
                              w={
                                activeDocs.length === 1
                                  ? "full"
                                  : ["85%", null, "calc(50% - 4px)"]
                              }
                              css={{
                                scrollSnapAlign: "start",
                              }}
                            >
                              <HStack
                                align={"start"}
                                justify={"space-between"}
                                flexShrink={0}
                                pl={3}
                                pr={2}
                                py={2}
                              >
                                <HStack wrap={"wrap"}>
                                  <P>{doc.value.documentRequirement.name}</P>
                                </HStack>

                                <Btn
                                  iconButton
                                  variant={"subtle"}
                                  rounded={"full"}
                                  size={"2xs"}
                                  onClick={() => {
                                    setActiveDocs((ps) =>
                                      ps.filter((_, i) => i !== index),
                                    );
                                  }}
                                >
                                  <AppIcon icon={XIcon} boxSize={4} />
                                </Btn>
                              </HStack>

                              <PdfViewer
                                fileUrl={
                                  fileUrl(doc.value.metaData.filePath) ||
                                  DUMMY_PDF_URL
                                }
                                fileName={doc.value.metaData.fileName}
                                defaultMode="continuous"
                                border={"1px solid"}
                                borderColor={"border.muted"}
                                rounded={themeConfig.radii.component}
                                flex={1}
                                minH={0}
                                roundedTop={0}
                              />
                            </CContainer>
                          )}

                          {doc.type === "extractedDoc" && (
                            <CContainer
                              key={doc.id}
                              border={"1px solid"}
                              borderColor={"border.muted"}
                              rounded={themeConfig.radii.component}
                              h={"full"}
                              overflow={"hidden"}
                              flexShrink={0}
                              w={
                                activeDocs.length === 1
                                  ? "full"
                                  : ["85%", null, "calc(50% - 4px)"]
                              }
                              css={{
                                scrollSnapAlign: "start",
                              }}
                            >
                              {/* Header */}
                              <HStack
                                align={"start"}
                                justify={"space-between"}
                                flexShrink={0}
                                pl={4}
                                pr={2}
                                py={2}
                              >
                                <HStack wrap={"wrap"}>
                                  <P>{doc.value.documentRequirement.name}</P>

                                  <Badge>{l.extracted_result}</Badge>
                                </HStack>

                                <Btn
                                  iconButton
                                  variant={"subtle"}
                                  rounded={"full"}
                                  size={"2xs"}
                                  onClick={() => {
                                    setActiveDocs((ps) =>
                                      ps.filter((_, i) => i !== index),
                                    );
                                  }}
                                >
                                  <AppIcon icon={XIcon} boxSize={4} />
                                </Btn>
                              </HStack>

                              {/* Body */}
                              {doc.value.extracted && (
                                <CContainer overflowY={"auto"}>
                                  <CContainer overflowY={"auto"}>
                                    {doc.value.extracted.map(
                                      (
                                        item: Interface__ExtractedParameter,
                                        index: number,
                                      ) => {
                                        const result = getParameterValidation(
                                          item.label,
                                          item.validationSchema,
                                          doc.value.documentRequirement.id,
                                        );

                                        // console.debug(result);

                                        return (
                                          <HStack
                                            key={index}
                                            wrap={"wrap"}
                                            align={"start"}
                                            px={4}
                                            pt={2.5}
                                            pb={3}
                                            bg={
                                              result === null
                                                ? "transparent"
                                                : result
                                                  ? "bg.success"
                                                  : "bg.error"
                                            }
                                            borderBottom={"1px solid"}
                                            borderColor={
                                              result === null
                                                ? "border.subtle"
                                                : result
                                                  ? "#4ade8040"
                                                  : "#f8717140"
                                            }
                                            pos={"relative"}
                                          >
                                            {result !== null && (
                                              <Box
                                                w={"4px"}
                                                h={"full"}
                                                bg={
                                                  result
                                                    ? "border.success"
                                                    : "border.error"
                                                }
                                                pos={"absolute"}
                                                left={0}
                                                top={0}
                                              />
                                            )}

                                            <P w={"200px"} color={"fg.muted"}>
                                              {item.label}
                                            </P>

                                            <CContainer
                                              flex={1}
                                              w={"fit"}
                                              gap={1}
                                            >
                                              <P>{item.value}</P>

                                              <P
                                                fontSize={"sm"}
                                                color={"fg.subtle"}
                                              >
                                                Keterangan tambahan disini
                                              </P>
                                            </CContainer>
                                          </HStack>
                                        );
                                      },
                                    )}
                                  </CContainer>
                                </CContainer>
                              )}
                            </CContainer>
                          )}
                        </>
                      );
                    })}
                  </HStack>
                )}
              </CContainer>

              {!iss && (
                <ViewerUploadedDocuments
                  activeDocs={activeDocs}
                  setActiveDocs={setActiveDocs}
                />
              )}
            </Stack>
          </DisclosureBody>

          {iss && (
            <DisclosureFooter>
              <BackButton />
            </DisclosureFooter>
          )}
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};

// -----------------------------------------------------------------

const ApplicationInformation = () => {
  // Contexts
  const { l, lang } = useLang();
  const { themeConfig } = useThemeConfig();
  const daSession = useActiveDA((s) => s.activeDA.session);

  // Constants
  const documentService = daSession?.documentService;
  const result = (daSession as any)?.result as
    | { label: string; values: { value: any }[] }[]
    | undefined;
  const normalizedServiceName = String(
    documentService?.title?.id || documentService?.title?.en || "",
  ).toLowerCase();

  const normalizeLabel = (value: string) =>
    String(value || "")
      .toLowerCase()
      .replace(/[:*().,/\\-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  // Extract resume fields from sertifikat extraction result
  const getFieldValue = (keywords: string[]) => {
    if (!result) return null;
    const item = result.find((r) =>
      keywords.some((kw) => r.label?.toLowerCase().includes(kw.toLowerCase())),
    );
    if (!item) return null;
    const val = item.values?.find((v) => v.value && v.value !== "NOT_FOUND");
    return val?.value ? String(val.value) : null;
  };

  const getBestFieldValue = (candidateLabels: string[]) => {
    if (!result?.length) return null;

    for (const candidateLabel of candidateLabels) {
      const normalizedCandidate = normalizeLabel(candidateLabel);
      const item = result.find(
        (r) => normalizeLabel(String(r.label || "")) === normalizedCandidate,
      );

      if (!item) continue;

      const val = item.values?.find((v) => {
        const value = String(v?.value ?? "").trim();
        return value && value !== "NOT_FOUND";
      });

      if (val?.value) return String(val.value);
    }

    for (const candidateLabel of candidateLabels) {
      const normalizedCandidate = normalizeLabel(candidateLabel);
      const item = result.find((r) =>
        normalizeLabel(String(r.label || "")).includes(normalizedCandidate),
      );

      if (!item) continue;

      const val = item.values?.find((v) => {
        const value = String(v?.value ?? "").trim();
        return value && value !== "NOT_FOUND";
      });

      if (val?.value) return String(val.value);
    }

    return null;
  };

  const pemohonCandidateLabels = normalizedServiceName.includes(
    "hak tanggungan",
  )
    ? [
        "Nama Pihak 2 (Pembeli)",
        "Nama Pihak 2 Pembeli",
        "Nama Pihak 2",
        "Nama Pembeli",
        "Nama Pihak 1 (Penjual)",
        "Nama Pihak 1 Penjual",
        "Nama Pihak 1",
        "Nama Badan Hukum",
        "Nama Pemilik Kuasa Badan Hukum",
        "Nama Penjual",
        "Nama pemegang HAK",
        "Nama Pemohon",
        "Pemohon",
      ]
    : normalizedServiceName.includes("surat keterangan pendaftaran tanah")
      ? [
          "Nama pemegang HAK",
          "Nama Badan Hukum",
          "Nama Pemilik Kuasa Badan Hukum",
          "Nama Pemohon",
          "Pemohon",
          "Nama Pembeli",
          "Nama Penjual",
        ]
      : normalizedServiceName.includes("pengecekan")
        ? [
            "Nama pemegang HAK",
            "Nama Badan Hukum",
            "Nama Pemilik Kuasa Badan Hukum",
            "Nama Pemohon",
            "Pemohon",
            "Nama Pembeli",
            "Nama Penjual",
          ]
        : normalizedServiceName.includes("peralihan")
          ? [
              "Nama Pembeli",
              "Nama Penjual",
              "Nama Persetujuan",
              "Nama Pemohon",
              "Pemohon",
            ]
          : [
              "Nama Pemohon",
              "Pemohon",
              "Nama pemegang HAK",
              "Nama Badan Hukum",
              "Nama Pembeli",
              "Nama Penjual",
            ];

  const noBerkas =
    daSession?.noBerkas ||
    getFieldValue(["no berkas", "nomor berkas", "no. berkas"]);
  const summaryPemohon = String(daSession?.summary?.pemohon || "").trim();
  const summaryLetak = String(daSession?.summary?.letak || "").trim();
  const pemohon =
    summaryPemohon ||
    getBestFieldValue(pemohonCandidateLabels) ||
    getFieldValue(["pemohon", "nama pemohon", "pemegang hak", "nama pemilik"]);
  const letak =
    summaryLetak ||
    getFieldValue(["letak", "alamat", "lokasi tanah", "letak tanah"]);

  const resumeRows = [
    { label: "No. Berkas", value: noBerkas || "-" },
    { label: "Pemohon", value: pemohon || "-" },
    { label: "Letak", value: letak || "-" },
  ];

  return (
    <CContainer gap={2}>
      <HStack h={"32px"}>
        <P fontWeight={"semibold"}>{capitalizeWords(l.file_information)}</P>
      </HStack>

      <CContainer
        gap={2}
        p={4}
        rounded={themeConfig.radii.container}
        borderColor={"border.muted"}
        bg={"d0"}
      >
        {resumeRows.map((row) => (
          <HStack key={row.label} gap={4} align={"start"}>
            <P w={"140px"} flexShrink={0} color={"fg.muted"}>
              {row.label}
            </P>
            <P>{row.value}</P>
          </HStack>
        ))}

        <Box
          borderTop={"1px solid"}
          borderColor={"border.muted"}
          mt={1}
          mb={1}
        />

        <HStack gap={4} align={"start"}>
          <P w={"140px"} flexShrink={0} color={"fg.muted"}>
            {l.service}
          </P>

          <HStack flexDir={["column", null, "row"]} align={"start"} gapY={1}>
            <Img
              key={daSession?.documentService?.icon}
              src={imgUrl(daSession?.documentService?.icon)}
              flexShrink={0}
              w={"20px"}
              h={"20px"}
              objectFit={"contain"}
            />

            <P>{documentService?.title[lang]}</P>

            <InfoPopover popoverContent={documentService?.description[lang]} />
          </HStack>
        </HStack>

        <HStack gap={4} align={"start"}>
          <P w={"140px"} flexShrink={0} color={"fg.muted"}>
            {l.category}
          </P>

          <P>{daSession?.kategori}</P>
        </HStack>
      </CContainer>
    </CContainer>
  );
};

// -----------------------------------------------------------------

const UploadedDocuments = () => {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const activeDASession = useActiveDA((s) => s.activeDA.session);
  const uploadedDocuments = activeDASession?.uploadedDocuments;

  // Hooks
  const { isOpen, onOpen } = usePopDisclosure(
    disclosureId(`pdf-viewer-uploaded-files-da-session`),
  );

  // States
  const [activeDocs, setActiveDocs] = useState<Type__ActiveDoc[]>([]);

  return (
    <CContainer gap={2}>
      <HStack h={"32px"}>
        <P fontWeight={"semibold"}>{capitalizeWords(l.uploaded_file)}</P>
      </HStack>

      <CContainer
        pl={4}
        pr={2}
        py={1}
        rounded={themeConfig.radii.container}
        // border={"1px solid"}
        borderColor={"border.muted"}
        bg={"d0"}
      >
        {uploadedDocuments?.map((doc, index) => {
          const firstIndex = index === 0;

          return (
            <HStack
              key={doc.documentRequirement.id}
              flexDir={["column", null, "row"]}
              justify={"space-between"}
              gapX={4}
              py={1}
              borderTop={firstIndex ? "" : "1px solid"}
              borderColor={"border.muted"}
            >
              <P>{doc.documentRequirement.name}</P>

              <HStack>
                <Btn
                  size={"xs"}
                  variant={"ghost"}
                  colorPalette={themeConfig.colorPalette}
                  onClick={() => {
                    setActiveDocs([
                      {
                        id: `${doc.documentRequirement.id}-doc`,
                        type: "doc",
                        value: doc,
                      },
                    ]);
                    onOpen();
                  }}
                >
                  {l.view} file
                </Btn>

                <Btn
                  size={"xs"}
                  variant={"ghost"}
                  colorPalette={themeConfig.colorPalette}
                  onClick={() => {
                    setActiveDocs([
                      {
                        id: `${doc.documentRequirement.id}-extracted-doc`,
                        type: "extractedDoc",
                        value: doc,
                      },
                    ]);
                    onOpen();
                  }}
                >
                  {l.extracted_result}
                </Btn>
              </HStack>
            </HStack>
          );
        })}
      </CContainer>

      <ViewerDisclosure
        open={isOpen}
        uploadedDocuments={uploadedDocuments}
        activeDocs={activeDocs}
        setActiveDocs={setActiveDocs}
      />
    </CContainer>
  );
};

// -----------------------------------------------------------------

// -----------------------------------------------------------------

const ViewerUploadedDocuments = (props: Props__ViewerUploadedDocuments) => {
  // Props
  const { activeDocs, setActiveDocs, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const activeDaSession = useActiveDA((s) => s.activeDA.session);
  const uploadedDocuments = activeDaSession?.uploadedDocuments;

  // Hooks
  const iss = useIsSmScreenWidth();

  return (
    <CContainer
      flexShrink={0}
      gap={1}
      w={["full", null, "300px"]}
      h={"full"}
      overflowY={"auto"}
      {...restProps}
    >
      {/* Docs */}
      <CContainer overflowY={"auto"}>
        <CContainer px={4} py={3}>
          <P color={"fg.subtle"}>{l.uploaded_file}</P>
        </CContainer>

        <CContainer px={2} pb={2} overflowY={"auto"}>
          {uploadedDocuments?.map((doc) => {
            const isActive = activeDocs.some(
              (d) => d.id === `${doc.documentRequirement.id}-doc`,
            );

            return (
              <HStack
                key={doc.documentRequirement.id}
                align={"start"}
                px={3}
                py={2}
                rounded={themeConfig.radii.component}
                cursor={"pointer"}
                _hover={{
                  bg: "d1",
                }}
                onClick={() => {
                  const docItem: Type__ActiveDoc = {
                    id: `${doc.documentRequirement.id}-doc`,
                    type: "doc",
                    value: doc,
                  };
                  setActiveDocs((ps) =>
                    iss ? [docItem] : ps[0] ? [ps[0], docItem] : [docItem],
                  );
                }}
              >
                <P fontSize={"sm"} mr={4}>
                  {doc.documentRequirement.name}
                </P>

                {isActive && <DotIndicator ml={"auto"} mt={2} />}
              </HStack>
            );
          })}
        </CContainer>
      </CContainer>

      {/* Extracted Doc */}
      <CContainer
        borderTop={"1px solid"}
        borderColor={"border.muted"}
        overflowY={"auto"}
      >
        <CContainer px={4} py={3}>
          <P color={"fg.subtle"}>{l.extracted_result}</P>
        </CContainer>

        <CContainer px={2} pb={2} overflowY={"auto"}>
          {DUMMY_UPLOADED_DOCS?.map((doc) => {
            const isActive = activeDocs.some(
              (d) => d.id === `${doc.documentRequirement.id}-extracted-doc`,
            );

            return (
              <HStack
                key={doc.documentRequirement.id}
                align={"start"}
                px={3}
                py={2}
                rounded={themeConfig.radii.component}
                cursor={"pointer"}
                _hover={{
                  bg: "d1",
                }}
                onClick={() => {
                  const docItem: Type__ActiveDoc = {
                    id: `${doc.documentRequirement.id}-extracted-doc`,
                    type: "extractedDoc",
                    value: doc,
                  };
                  setActiveDocs((ps) =>
                    iss ? [docItem] : ps[0] ? [ps[0], docItem] : [docItem],
                  );
                }}
              >
                <P fontSize={"sm"} mr={4}>
                  {doc.documentRequirement.name}
                </P>

                {isActive && <DotIndicator ml={"auto"} mt={2} />}
              </HStack>
            );
          })}
        </CContainer>
      </CContainer>
    </CContainer>
  );
};

// -----------------------------------------------------------------

const ViewerUploadedDocumentsTrigger = (
  props: Props__ViewerUploadedDocuments,
) => {
  // Props
  const { activeDocs, setActiveDocs, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // Hooks
  const { isOpen, onOpen } = usePopDisclosure(
    disclosureId(`pdf-viewer-uploaded-documents-list`),
  );

  return (
    <>
      <CContainer w={"fit"} onClick={onOpen} {...restProps} />

      <DisclosureRoot open={isOpen} lazyLoad>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={l.your_files} />
          </DisclosureHeader>

          <DisclosureBody>
            <ViewerUploadedDocuments
              activeDocs={activeDocs}
              setActiveDocs={setActiveDocs}
              p={0}
            />
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};

// -----------------------------------------------------------------

const AccordionItemsList = memo(function AccordionItemsList() {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const daSession = useActiveDA((s) => s.activeDA.session);

  const documentRequirements = daSession?.documentService?.documentRequirements;
  const result = daSession?.result;
  const uploadedDocuments = daSession?.uploadedDocuments;

  const resultByLabel = useMemo(() => {
    const map = new Map<string, any>();
    result?.forEach((item) => map.set(item.label, item));
    return map;
  }, [result]);

  const getValueResult = useCallback(
    (label: string, uploadedDocument: any) => {
      const field = resultByLabel.get(label);
      const candidateIds = [
        uploadedDocument?.id,
        uploadedDocument?.jobId,
        uploadedDocument?.documentRequirement?.id,
      ].filter((value) => value != null);
      const matchedValue = field?.values?.find(
        (value: { documentId: number }) =>
          candidateIds.includes(value.documentId),
      );

      return matchedValue?.value ?? null;
    },
    [resultByLabel],
  );

  const visibleValidationResults = useMemo(() => {
    return (result ?? []).filter((item) => {
      const filledCount = (uploadedDocuments ?? []).reduce((count, doc) => {
        const value = getValueResult(item.label, doc);
        const hasValue =
          value !== null &&
          value !== undefined &&
          value !== "" &&
          value !== "NOT_FOUND";

        return count + (hasValue ? 1 : 0);
      }, 0);

      return filledCount > 1;
    });
  }, [result, uploadedDocuments, getValueResult]);

  return (
    <>
      {uploadedDocuments?.map((doc) => {
        const documentRequirement = documentRequirements?.find((dr) => {
          return dr.id === doc.documentRequirement.id;
        });

        return (
          <AccordionItem
            key={doc.documentRequirement.id}
            value={`${doc.documentRequirement.id}`}
            px={4}
            border={"1px solid"}
            borderColor={"border.muted"}
            rounded={themeConfig.radii.container}
            _open={{
              bg: "d0",
            }}
          >
            <AccordionItemTrigger cursor={"pointer"}>
              <P>{doc.documentRequirement.name}</P>
            </AccordionItemTrigger>

            <AccordionItemContent>
              <CContainer gap={2}>
                {isEmptyArray(documentRequirement?.extractionSchema) && (
                  <FeedbackNotFound title={l.alert_no_data.title} mb={7} />
                )}

                {documentRequirement?.extractionSchema?.map((field) => {
                  const value = getValueResult(field.label, doc);
                  const isNotFound = isNotFoundAnalysisValue(value);
                  const displayValue = formatAnalysisValue(field.label, value);

                  return (
                    value && (
                      <HStack key={field.key}>
                        <ClampText
                          flexShrink={0}
                          w={"240px"}
                          color={"fg.muted"}
                        >
                          {field.label}
                        </ClampText>

                        <ClampText color={value ? "" : "fg.muted"}>
                          {isNotFound ? l.not_found : displayValue}
                        </ClampText>
                      </HStack>
                    )
                  );
                })}
              </CContainer>
            </AccordionItemContent>
          </AccordionItem>
        );
      })}

      {/* Validation Panel */}
      <AccordionItem
        value={`validation`}
        borderBottom={"none"}
        px={0}
        border={"1px solid"}
        borderColor={"border.muted"}
        rounded={themeConfig.radii.container}
        _open={{
          bg: "d0",
        }}
      >
        <AccordionItemTrigger cursor={"pointer"} px={4}>
          <HStack>
            <AppIcon icon={CheckCheckIcon} />

            <P>{l.validation}</P>
          </HStack>
        </AccordionItemTrigger>

        <AccordionItemContent p={0}>
          <CContainer gap={1}>
            <AccordionRoot collapsible multiple>
              {isEmptyArray(visibleValidationResults) && (
                <FeedbackNotFound title={l.alert_no_data.title} mb={7} />
              )}

              {visibleValidationResults?.map((r, index) => {
                const isLastIndex =
                  index === visibleValidationResults.length - 1;
                const fieldLabel = r.label;
                const isMatch = r.validation.status;

                return (
                  <AccordionItem
                    key={r.label}
                    value={r.label}
                    borderBottom={isLastIndex ? "none" : "1px solid"}
                    borderColor={"d1"}
                    px={4}
                    _open={{
                      bg: "d0",
                    }}
                  >
                    <AccordionItemTrigger cursor={"pointer"}>
                      <HStack>
                        <Tooltip content={r.label}>
                          <P
                            flexShrink={0}
                            lineClamp={1}
                            w={"240px"}
                            // color={"fg.muted"}
                          >
                            {r.label}
                          </P>
                        </Tooltip>

                        <P color={isMatch ? "fg.success" : "fg.error"}>
                          {isMatch ? l.match : l.mismatch}
                        </P>
                      </HStack>
                    </AccordionItemTrigger>

                    <AccordionItemContent px={0} py={2}>
                      <CContainer rounded={"md"} gap={2}>
                        {uploadedDocuments?.map((doc) => {
                          const val = getValueResult(fieldLabel, doc);
                          const isNotFound = isNotFoundAnalysisValue(val);
                          const displayValue = formatAnalysisValue(
                            fieldLabel,
                            val,
                          );

                          return (
                            <HStack key={doc.documentRequirement.id}>
                              <ClampText
                                flexShrink={0}
                                w={"240px"}
                                color={"fg.muted"}
                              >
                                {doc.documentRequirement.name}
                              </ClampText>

                              <ClampText>
                                {val
                                  ? isNotFound
                                    ? l.not_found
                                    : displayValue
                                  : "-"}
                              </ClampText>
                            </HStack>
                          );
                        })}
                      </CContainer>
                    </AccordionItemContent>
                  </AccordionItem>
                );
              })}
            </AccordionRoot>
          </CContainer>
        </AccordionItemContent>
      </AccordionItem>

      {/* Fraud Detection Panel */}
      <AccordionItem
        value={`fraud-detection`}
        borderBottom={"none"}
        px={0}
        border={"1px solid"}
        borderColor={"border.muted"}
        rounded={themeConfig.radii.container}
        _open={{
          bg: "d0",
        }}
      >
        <AccordionItemTrigger cursor={"pointer"} px={4}>
          <HStack>
            <AppIcon icon={ShieldAlertIcon} />

            <P>{l.fraud_detector}</P>
          </HStack>
        </AccordionItemTrigger>

        <AccordionItemContent p={0}>
          <FraudAlertsPanel daSession={daSession} />
        </AccordionItemContent>
      </AccordionItem>
    </>
  );
});

// -----------------------------------------------------------------

interface Props__AccordionMode extends StackProps {
  accordionValue: string[];
  setAccordionValue: React.Dispatch<React.SetStateAction<string[]>>;
}

const AccordionMode = memo(function AccordionMode(props: Props__AccordionMode) {
  // Props
  const { accordionValue, setAccordionValue } = props;

  return (
    <CContainer gap={4}>
      <AccordionRoot
        collapsible
        multiple
        value={accordionValue}
        onValueChange={(e) => setAccordionValue(e.value)}
        overflow={"clip"}
      >
        <CContainer gap={2}>
          <AccordionItemsList />
        </CContainer>
      </AccordionRoot>
    </CContainer>
  );
});

// -----------------------------------------------------------------

interface Props__TableMode extends StackProps {
  daSession?: Interface__DASessionDetail;
  containerDimension?: {
    width: number;
    height: number;
  };
}

const TableMode = memo(function TableMode(props: Props__TableMode) {
  // Props
  const {} = props;

  // Contexts
  const { l } = useLang();
  const daSession = useActiveDA((s) => s.activeDA.session);

  // Refs
  const containerRef = useRef<HTMLDivElement | null>(null);

  // States
  // const documentRequirements = daSession?.documentService?.documentRequirements;
  const uploadedDocuments = daSession?.uploadedDocuments;
  const result = daSession?.result;
  const headers = useMemo<Interface__FormattedTableHeader[]>(
    () => [
      { th: "Item Validasi", sortable: true },
      ...(uploadedDocuments ?? []).map((doc) => ({
        th: doc.documentRequirement.name,
        sortable: true,
      })),
      { th: "Validasi", sortable: true },
    ],
    [uploadedDocuments],
  );

  const visibleResult = useMemo(() => {
    return (result ?? []).filter((item) => {
      const filledCount = (uploadedDocuments ?? []).reduce((count, doc) => {
        const candidateIds = [
          (doc as any)?.id,
          (doc as any)?.jobId,
          doc.documentRequirement.id,
        ].filter((value) => value != null);
        const matchedValue = item.values.find((value) =>
          candidateIds.includes(value.documentId),
        );
        const currentValue = matchedValue?.value ?? null;
        const hasValue =
          currentValue !== null &&
          currentValue !== undefined &&
          currentValue !== "" &&
          currentValue !== "NOT_FOUND";

        return count + (hasValue ? 1 : 0);
      }, 0);

      return filledCount > 0;
    });
  }, [result, uploadedDocuments]);
  const rows = useMemo<Interface__FormattedTableRow[]>(() => {
    return visibleResult.map((r, idx) => {
      const isMatch = r.validation.status;
      const wrappingCellProps = {
        whiteSpace: "normal",
      } as const;
      const wrappingWrapperProps = {
        h: "auto",
        minH: "46px",
        align: "start",
      } as const;

      return {
        id: `${idx}`,
        idx: idx,
        data: r,
        columns: [
          {
            td: <P whiteSpace={"normal"}>{r.label}</P>,
            value: r.label,
            dataType: "string",
            tableCellProps: wrappingCellProps,
            wrapperProps: wrappingWrapperProps,
          },
          ...(uploadedDocuments ?? []).map((doc) => {
            const candidateIds = [
              (doc as any)?.id,
              (doc as any)?.jobId,
              doc.documentRequirement.id,
            ].filter((value) => value != null);
            const matchedValue = r.values.find((value) =>
              candidateIds.includes(value.documentId),
            );
            const value = matchedValue?.value ?? null;
            const isNotFound = isNotFoundAnalysisValue(value);
            const displayValue = formatAnalysisValue(r.label, value);

            return {
              td: (
                <P
                  color={isNotFound ? "fg.warning" : ""}
                  maxW={"200px"}
                  whiteSpace={"normal"}
                  wordBreak={"break-word"}
                >
                  {isNotFound ? l.not_found : displayValue || "-"}
                </P>
              ),
              dim: isNotFound || value === null,
              value,
              dataType: matchedValue?.renderType || "string",
              tableCellProps: wrappingCellProps,
              wrapperProps: wrappingWrapperProps,
            };
          }),
          {
            td: (
              <P
                color={isMatch ? "fg.success" : "fg.error"}
                whiteSpace={"normal"}
                wordBreak={"break-word"}
              >
                {isMatch ? l.match : l.mismatch}
              </P>
            ),
            value: r.validation.status,
            dataType: "boolean",
            tableCellProps: wrappingCellProps,
            wrapperProps: wrappingWrapperProps,
          },
        ],
      };
    });
  }, [visibleResult, uploadedDocuments, l]);

  // SX
  // SX
  // const px = useMemo(() => {
  //   return containerDimension &&
  //     containerDimension?.width < CONSTRAINED_MAX_W_NUMBER
  //     ? 4
  //     : `calc((${containerDimension?.width}px - ${CONSTRAINED_MAX_W} - 32px)/2)`;
  // }, [containerDimension]);

  return (
    <>
      <MContainer
        ref={containerRef}
        className={"noScroll"}
        maskingTop={0}
        maskingBottom={0}
        maskingLeft={"100px"}
        maskingRight={"100px"}
        overflowX={"auto"}
        cursor={"grab"}
        css={{
          "&:active": { cursor: "grabbing" },
          userSelect: "none",
        }}
        onMouseDown={(e) => {
          const target = e.target as HTMLElement;
          if (
            target.closest(
              '[data-part="content"], [role="dialog"], [data-scope="popover"], button, a, input',
            )
          )
            return;

          e.preventDefault();
          const container = containerRef.current;
          if (!container) return;

          const startX = e.clientX;
          const scrollLeft = container.scrollLeft;

          const onMouseMove = (ev: MouseEvent) => {
            ev.preventDefault();
            container.scrollLeft = scrollLeft - (ev.clientX - startX);
          };
          const onMouseUp = () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
          };
          window.addEventListener("mousemove", onMouseMove);
          window.addEventListener("mouseup", onMouseUp);
        }}
      >
        <CContainer w={"max"}>
          <DataTable
            headers={headers}
            rows={rows}
            minH={0}
            borderColor={"border.muted"}
          />
        </CContainer>
      </MContainer>

      {/* Fraud Detection Section */}
      <FraudAlertsPanel daSession={daSession} />
    </>
  );
});

// -----------------------------------------------------------------

interface Props__ResultSection extends StackProps {
  daSession?: Interface__DASessionDetail;
  containerDimension?: {
    width: number;
    height: number;
  };
}

const ResultSection = (props: Props__ResultSection) => {
  // Props
  const { containerDimension, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const daSession = useActiveDA((s) => s.activeDA.session);
  const uploadedDocuments = daSession?.uploadedDocuments;

  // States
  const [viewMode, setViewMode] = useState<"accordion" | "table">("accordion");
  const [accordionValue, setAccordionValue] = useState<string[]>([]);

  return (
    <CContainer pos={"relative"} {...restProps}>
      <CContainer
        px={4}
        pos={"sticky"}
        top={"-32px"}
        mb={[2, null, 0]}
        zIndex={"sticky"}
      >
        <ConstrainedContainer>
          <HStack
            wrap={"wrap"}
            justify={"space-between"}
            pb={2}
            bg="linear-gradient(
              to bottom,
              var(--chakra-colors-body) 80%,
              transparent 100%
            )"
          >
            <P fontWeight="semibold">{capitalizeWords(l.analysis_result)}</P>

            <HStack flex={[1, null, 0]} gap={2}>
              {/* Accordion controls - only in accordion mode */}
              {viewMode === "accordion" && (
                <HStack flex={1} rounded={themeConfig.radii.component}>
                  <Btn
                    flex={1}
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      if (uploadedDocuments) {
                        setAccordionValue([
                          ...uploadedDocuments.map((doc) => {
                            return `${doc.documentRequirement.id}`;
                          }),
                          "validation",
                        ]);
                      }
                    }}
                  >
                    {l.open_all}
                  </Btn>

                  <Btn
                    flex={1}
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      setAccordionValue([]);
                    }}
                  >
                    {l.close_all}
                  </Btn>
                </HStack>
              )}

              {/* View mode toggle */}
              <Tooltip content={l.change_view_mode}>
                <Box>
                  <Segmented
                    items={[
                      {
                        value: "accordion",
                        label: <AppIcon icon={LayoutListIcon} />,
                      },
                      {
                        value: "table",
                        label: <AppIcon icon={TableIcon} />,
                      },
                    ]}
                    inputValue={viewMode}
                    onChange={(value) =>
                      setViewMode(value as "table" | "accordion")
                    }
                    size={"xs"}
                  />
                </Box>
              </Tooltip>
            </HStack>
          </HStack>
        </ConstrainedContainer>
      </CContainer>

      {/* Accordion View */}
      <Box display={viewMode === "accordion" ? "block" : "none"}>
        <CContainer px={4}>
          <ConstrainedContainer>
            <AccordionMode
              accordionValue={accordionValue}
              setAccordionValue={setAccordionValue}
            />
          </ConstrainedContainer>
        </CContainer>
      </Box>

      <Box display={viewMode === "table" ? "block" : "none"}>
        <CContainer px={4}>
          <TableMode containerDimension={containerDimension} />
        </CContainer>
      </Box>
    </CContainer>
  );
};

// -----------------------------------------------------------------

interface Props__GenerateLetterButtons extends StackProps {
  data?: Interface__DASessionDetail;
}

const GenerateLetterButtons = (props: Props__GenerateLetterButtons) => {
  // Props
  const { data, ...restProps } = props;

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

  return (
    <ConstrainedContainer {...restProps}>
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
                  <Btn variant={"outline"} size={"sm"} disabled={loading}>
                    <AppIcon icon={DownloadIcon} boxSize={4} />
                    {letter.label} PDF
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
    </ConstrainedContainer>
  );
};

// -----------------------------------------------------------------

export default function Page() {
  // Contexts
  const { l } = useLang();
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
  const params = useParams<{ sessionId: string }>();
  const sessionId = params?.sessionId;
  const router = useRouter();
  const containerDimension = useContainerDimension(containerRef);

  // States
  const activeDASession = activeDA.session;
  const activeDASessionId = activeDASession?.id;
  const [pollingTick, setPollingTick] = useState(0);
  // const initialLoading = true;
  const { initialLoading, error, status, data, onRetry } =
    useDataState<Interface__DASessionDetail>({
      url: sessionId ? `${DA_API_SESSION_DETAIL}/${sessionId}` : "",
      dataResource: false,
      dependencies: [sessionId, pollingTick],
      loadingBarInitialOnly: true,
    });

  // Derived Values
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
    if (data && sessionId && data.id === sessionId) {
      setSession(data);
    }
  }, [data, sessionId, setSession]);

  // Handle 404 - redirect and remove session
  useEffect(() => {
    if (status === 404 && sessionId) {
      removeFromDASessions(sessionId);
      router.push("/new-da");
    }
  }, [status, sessionId]);

  // Update breadcroumbs
  useEffect(() => {
    if (activeDA.session) {
      setBreadcrumbs({
        activeNavs: [
          {
            labelKey: `navs.your_da`,
            path: `/da`,
          },
          {
            label: activeDA.session?.title,
            path: sessionId ? `/da/${sessionId}` : "/da",
          },
        ],
      });
    } else {
      setBreadcrumbs({
        activeNavs: [
          {
            labelKey: `navs.your_da`,
            path: `/da`,
          },
          {
            label: "...",
            path: sessionId ? `/da/${sessionId}` : "/da",
          },
        ],
      });
    }
  }, [activeDA.session, sessionId]);

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
    error: <FeedbackRetry onRetry={onRetry} m={"auto"} />,
    empty: <FeedbackNoData m={"auto"} />,
    notFound: <FeedbackNotFound m={"auto"} />,
    loaded: (
      <CContainer flex={1} gap={8}>
        <CContainer px={4}>
          <ConstrainedContainer gap={8}>
            {/* Header */}
            <CContainer gap={1}>
              <ClampText fontSize={R_TITLE} fontWeight={"semibold"}>
                {activeDASession?.title}
              </ClampText>

              <P fontSize={R_SUBTITLE} color={"fg.subtle"}>
                {formatDate(activeDASession?.createdAt, {
                  withTime: true,
                })}
              </P>
            </CContainer>

            {/* File Information */}
            <ApplicationInformation />

            {/* Uploaded files */}
            <UploadedDocuments />
          </ConstrainedContainer>
        </CContainer>

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
              <ResultSection containerDimension={containerDimension} />

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

        <HelperText textAlign={"center"}>{l.msg_da_disclaimer}</HelperText>
      </CContainer>
    ),
  };

  return (
    <PageContainer ref={containerRef} py={8} pos={"relative"}>
      {/* <Viewer height={"800px"}>
        <SuratPermohonanPDF data={data?.rawData} />
      </Viewer> */}

      <CContainer flex={1} gap={4} justify={"space-between"}>
        <FadingSkeletonContainer loading={initialLoading}>
          <ConstrainedContainer flex={1} pb={8} mt={8}>
            {render.loading}
          </ConstrainedContainer>
        </FadingSkeletonContainer>

        {!initialLoading && (
          <>
            {error && render.error}
            {!error && (
              <>
                {activeDASession && render.loaded}
                {!activeDASession && !data && render.empty}
              </>
            )}
          </>
        )}
      </CContainer>
    </PageContainer>
  );
}
