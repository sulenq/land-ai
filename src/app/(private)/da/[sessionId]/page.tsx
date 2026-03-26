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
import { MContainer } from "@/components/widget/MContainer";
import { ContainerLayout, PageContainer } from "@/components/widget/PageShell";
import { PdfViewer } from "@/components/widget/PDFViewer";
import { DA_API_SESSION_DETAIL } from "@/constants/apis";
import { DUMMY_PDF_URL } from "@/constants/dummyData";
import {
  Interface__DASessionDetail,
  Interface__DAUploadedDocument,
  Interface__FormattedTableHeader,
  Interface__FormattedTableRow,
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
import { isEmptyArray } from "@/utils/array";
import { disclosureId } from "@/utils/disclosure";
import { formatDate } from "@/utils/formatter";
import { capitalizeWords } from "@/utils/string";
import { fileUrl, imgUrl } from "@/utils/url";
import {
  Badge,
  Box,
  HStack,
  Stack,
  StackProps,
  TextProps,
} from "@chakra-ui/react";
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

interface Props__PdfViewerUploadedDocuments extends StackProps {
  uploadedDocuments?: Interface__DAUploadedDocument[];
  activeDocs: Interface__DAUploadedDocument[];
  setActiveDocs: React.Dispatch<
    React.SetStateAction<Interface__DAUploadedDocument[]>
  >;
}
const PdfViewerUploadedDocuments = (
  props: Props__PdfViewerUploadedDocuments,
) => {
  // Props
  const { uploadedDocuments, activeDocs, setActiveDocs, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // Hooks
  const iss = useIsSmScreenWidth();

  return (
    <CContainer
      flexShrink={0}
      gap={1}
      w={["full", null, "300px"]}
      h={"full"}
      p={2}
      overflowY={"auto"}
      {...restProps}
    >
      {uploadedDocuments?.map((doc) => {
        const isActive = activeDocs.some(
          (d) => d.documentRequirement.id === doc.documentRequirement.id,
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
              setActiveDocs((ps) =>
                iss ? [doc] : ps[0] ? [ps[0], doc] : [doc],
              );
            }}
          >
            <CContainer gap={1}>
              <Tooltip content={doc.documentRequirement.name}>
                <P
                  lineClamp={1}
                  fontSize={"sm"}
                  textAlign={"left"}
                  color={"fg.subtle"}
                  mr={4}
                >
                  {doc.documentRequirement.name}
                </P>
              </Tooltip>

              <Tooltip content={doc.metaData.fileName}>
                <P
                  lineClamp={1}
                  fontSize={"sm"}
                  fontWeight={"medium"}
                  textAlign={"left"}
                  mr={4}
                >
                  {doc.metaData.fileName}
                </P>
              </Tooltip>
            </CContainer>

            {isActive && <DotIndicator ml={"auto"} mt={2} />}
          </HStack>
        );
      })}
    </CContainer>
  );
};

const PdfViewerUploadedDocumentsTrigger = (
  props: Props__PdfViewerUploadedDocuments,
) => {
  // Props
  const { uploadedDocuments, activeDocs, setActiveDocs, ...restProps } = props;
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
            <PdfViewerUploadedDocuments
              uploadedDocuments={uploadedDocuments}
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

interface Props__PdfViewerDisclosure {
  open: boolean;
  uploadedDocuments?: Interface__DASessionDetail["uploadedDocuments"];
  activeDocs: Interface__DAUploadedDocument[];
  setActiveDocs: React.Dispatch<
    React.SetStateAction<Interface__DAUploadedDocument[]>
  >;
}
const PdfViewerDisclosure = (props: Props__PdfViewerDisclosure) => {
  // Props
  const { open, uploadedDocuments, activeDocs, setActiveDocs } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const iss = useIsSmScreenWidth();

  useEffect(() => {
    if (!open) {
      setActiveDocs([]);
    }
  }, [open]);

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
                  <PdfViewerUploadedDocumentsTrigger
                    uploadedDocuments={uploadedDocuments}
                    activeDocs={activeDocs}
                    setActiveDocs={setActiveDocs}
                    w={"full"}
                  >
                    <Btn variant={"outline"} size={"sm"}>
                      <AppIcon icon={ListIcon} />

                      {l.your_files}
                    </Btn>
                  </PdfViewerUploadedDocumentsTrigger>
                </CContainer>
              )}

              <CContainer
                flex={1}
                gap={4}
                h={"full"}
                p={4}
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
                    gap={4}
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
                        <CContainer
                          key={doc.documentRequirement.id}
                          gap={2}
                          p={2}
                          bg={"bg.muted"}
                          border={"1px solid"}
                          borderColor={"border.muted"}
                          rounded={themeConfig.radii.component}
                          h={"full"}
                          overflow={"hidden"}
                          flexShrink={0}
                          w={
                            activeDocs.length === 1
                              ? "full"
                              : ["85%", null, "calc(50% - 8px)"]
                          }
                          css={{
                            scrollSnapAlign: "start",
                          }}
                        >
                          <HStack justify={"space-between"} flexShrink={0}>
                            <P fontWeight={"medium"} ml={2}>
                              {doc.metaData.fileName}
                            </P>

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
                              fileUrl(doc.metaData.filePath) || DUMMY_PDF_URL
                            }
                            fileName={doc.metaData.fileName}
                            defaultMode="continuous"
                            border={"1px solid"}
                            borderColor={"border.muted"}
                            rounded={themeConfig.radii.component}
                            flex={1}
                            minH={0}
                          />
                        </CContainer>
                      );
                    })}
                  </HStack>
                )}
              </CContainer>

              {!iss && (
                <PdfViewerUploadedDocuments
                  uploadedDocuments={uploadedDocuments}
                  activeDocs={activeDocs}
                  setActiveDocs={setActiveDocs}
                  bg={"bg.muted"}
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

const FileName = (props: TextProps) => {
  // Props
  const { children, ...restProps } = props;

  // States
  const [hover, setHover] = useState<boolean>(false);

  return (
    <Tooltip
      content={children}
      positioning={{
        placement: "right",
      }}
    >
      <HStack cursor={"pointer"}>
        <P
          lineClamp={1}
          fontWeight={"medium"}
          borderBottom={"1px solid"}
          borderColor={hover ? "fg" : "transparent"}
          transition={"200ms"}
          onMouseEnter={() => {
            setHover(true);
          }}
          onMouseLeave={() => {
            setHover(false);
          }}
          {...restProps}
        >
          {children}
        </P>

        <AppIcon
          icon={ArrowUpRightIcon}
          opacity={hover ? 1 : 0}
          transition={"200ms"}
        />
      </HStack>
    </Tooltip>
  );
};

const MetaData = () => {
  // Contexts
  const { l, lang } = useLang();
  const { themeConfig } = useThemeConfig();
  const activeDASession = useActiveDA((s) => s.activeDA.session);

  // Constants
  const documentService = activeDASession?.documentService;
  const uploadedDocuments = activeDASession?.uploadedDocuments;

  // Hooks
  const { isOpen, onOpen } = usePopDisclosure(
    disclosureId(`pdf-viewer-uploaded-files-da-session`),
  );

  // States
  const [activeDocs, setActiveDocs] = useState<Interface__DAUploadedDocument[]>(
    uploadedDocuments?.[0] ? [uploadedDocuments[0]] : [],
  );

  return (
    <>
      {/* Service */}
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

            <HStack flexDir={["column", null, "row"]} align={"start"} gapY={1}>
              <Img
                key={activeDASession?.documentService?.icon}
                src={imgUrl(activeDASession?.documentService?.icon)}
                flexShrink={0}
                w={"20px"}
                h={"20px"}
                objectFit={"contain"}
              />

              <P>{documentService?.title[lang]}</P>
            </HStack>
          </HStack>

          <HStack gap={4} align={"start"}>
            <P w={"140px"} flexShrink={0} color={"fg.muted"}>
              {l.description}
            </P>

            <P>{documentService?.description[lang]}</P>
          </HStack>
        </CContainer>
      </CContainer>

      {/* Uploaded files */}
      <CContainer gap={2}>
        <HStack h={"32px"}>
          <P fontWeight={"semibold"}>{capitalizeWords(l.uploaded_file)}</P>
        </HStack>

        <CContainer
          gap={[4, null, 2]}
          p={4}
          rounded={themeConfig.radii.container}
          // border={"1px solid"}
          borderColor={"border.muted"}
          bg={"d0"}
        >
          {uploadedDocuments?.map((doc) => {
            return (
              <HStack
                flexDir={["column", null, "row"]}
                key={doc.documentRequirement.id}
                align={"start"}
                gapX={4}
              >
                <HStack flexShrink={0} w={["full", null, "240px"]}>
                  <ClampText color={"fg.muted"}>
                    {doc.documentRequirement.name}
                  </ClampText>

                  {!doc.documentRequirement.isMandatory && (
                    <Badge bg={"d1"}>{l.optional}</Badge>
                  )}
                </HStack>

                {doc.metaData.fileName ? (
                  <FileName
                    onClick={() => {
                      setActiveDocs([doc]);
                      onOpen();
                    }}
                  >
                    {doc.metaData.fileName}
                  </FileName>
                ) : (
                  <P>-</P>
                )}
              </HStack>
            );
          })}
        </CContainer>

        <PdfViewerDisclosure
          open={isOpen}
          uploadedDocuments={uploadedDocuments}
          activeDocs={activeDocs}
          setActiveDocs={setActiveDocs}
        />
      </CContainer>
    </>
  );
};

interface Props__AccordionItemsList {
  daSession?: Interface__DASessionDetail;
  l: any;
  themeConfig: any;
}
const AccordionItemsList = memo((props: Props__AccordionItemsList) => {
  const { daSession, l, themeConfig } = props;

  const documentRequirements = daSession?.documentService?.documentRequirements;
  const result = daSession?.result;
  const uploadedDocuments = daSession?.uploadedDocuments;

  const resultByLabel = useMemo(() => {
    const map = new Map<string, any>();
    result?.forEach((item) => map.set(item.label, item));
    return map;
  }, [result]);

  const getValueResult = useCallback(
    (label: string, index: number) => {
      const field = resultByLabel.get(label);
      return field?.values?.[index]?.value ?? null;
    },
    [resultByLabel],
  );

  return (
    <>
      {uploadedDocuments?.map((doc, index) => {
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
                  const value = getValueResult(field.label, index);
                  const isNotFound = value === "NOT_FOUND";

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
                          {isNotFound ? l.not_found : value}
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
              {isEmptyArray(result) && (
                <FeedbackNotFound title={l.alert_no_data.title} mb={7} />
              )}

              {result?.map((r, index) => {
                const isLastIndex = index === result.length - 1;
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
                        {uploadedDocuments?.map((doc, docIndex) => {
                          const val = getValueResult(fieldLabel, docIndex);
                          const isNotFound = val === "NOT_FOUND";

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
                                {val ? (isNotFound ? l.not_found : val) : "-"}
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
AccordionItemsList.displayName = "AccordionItemsList";

interface Props__AccordionMode extends StackProps {
  daSession?: Interface__DASessionDetail;
  accordionValue: string[];
  setAccordionValue: React.Dispatch<React.SetStateAction<string[]>>;
}
const AccordionMode = memo((props: Props__AccordionMode) => {
  // Props
  const { daSession, accordionValue, setAccordionValue } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

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
          <AccordionItemsList
            daSession={daSession}
            l={l}
            themeConfig={themeConfig}
          />
        </CContainer>
      </AccordionRoot>
    </CContainer>
  );
});
AccordionMode.displayName = "AccordionMode";

interface Props__TableMode extends StackProps {
  daSession?: Interface__DASessionDetail;
  containerDimension?: {
    width: number;
    height: number;
  };
}
const TableMode = memo((props: Props__TableMode) => {
  // Props
  const { daSession } = props;

  // Contexts
  const { l } = useLang();

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

  const rows = useMemo<Interface__FormattedTableRow[]>(() => {
    return (result ?? []).map((r, idx) => {
      const isMatch = r.validation.status;

      return {
        id: `${idx}`,
        idx: idx,
        data: r,
        columns: [
          { td: r.label, value: r.label, dataType: "string" },
          ...r.values.map((v) => {
            // const documentRequirement = documentRequirements?.find((dr) => {
            //   return dr.id === v.documentId;
            // });
            // const isInSchema = documentRequirement?.extractionSchema?.find(
            //   (es) => {
            //     return es.label === r.label;
            //   },
            // );
            const isNotFound = v.value === "NOT_FOUND";

            return {
              td: (
                <ClampText
                  color={isNotFound ? "fg.warning" : ""}
                  maxW={"200px"}
                >
                  {isNotFound ? l.not_found : v.value || "-"}
                </ClampText>
              ),
              dim: isNotFound || v.value === null,
              value: v.value,
              dataType: v.renderType,
            };
          }),
          {
            td: (
              <P color={isMatch ? "fg.success" : "fg.error"}>
                {isMatch ? l.match : l.mismatch}
              </P>
            ),
            value: r.validation.status,
            dataType: "boolean",
          },
        ],
      };
    });
  }, [result, l]);

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
TableMode.displayName = "TableMode";

interface Props__ResultSection extends StackProps {
  daSession?: Interface__DASessionDetail;
  containerDimension?: {
    width: number;
    height: number;
  };
}
const ResultSection = (props: Props__ResultSection) => {
  // Props
  const { daSession, containerDimension, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const [viewMode, setViewMode] = useState<"accordion" | "table">("accordion");
  const [accordionValue, setAccordionValue] = useState<string[]>([]);
  const uploadedDocuments = daSession?.uploadedDocuments;

  return (
    <CContainer pos={"relative"} {...restProps}>
      <CContainer
        px={4}
        pos={"sticky"}
        top={"-32px"}
        mb={[2, null, 0]}
        zIndex={"sticky"}
      >
        <ContainerLayout>
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
        </ContainerLayout>
      </CContainer>

      {/* Accordion View */}
      <Box display={viewMode === "accordion" ? "block" : "none"}>
        <CContainer px={4}>
          <ContainerLayout>
            <AccordionMode
              daSession={daSession}
              accordionValue={accordionValue}
              setAccordionValue={setAccordionValue}
            />
          </ContainerLayout>
        </CContainer>
      </Box>

      <Box display={viewMode === "table" ? "block" : "none"}>
        <CContainer px={4}>
          <TableMode
            daSession={daSession}
            containerDimension={containerDimension}
          />
        </CContainer>
      </Box>
    </CContainer>
  );
};

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
                  <Btn variant={"outline"} size={"sm"}>
                    <AppIcon icon={DownloadIcon} boxSize={4} />

                    {loading ? "Loading PDF..." : `${letter.label} PDF`}
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
  const { sessionId } = useParams();
  const router = useRouter();
  const containerDimension = useContainerDimension(containerRef);

  // States
  const activeDASession = activeDA.session;
  const activeDASessionId = activeDASession?.id;
  const [pollingTick, setPollingTick] = useState(0);
  // const initialLoading = true;
  const { initialLoading, error, status, data, onRetry } =
    useDataState<Interface__DASessionDetail>({
      url: `${DA_API_SESSION_DETAIL}/${sessionId}`,
      dataResource: false,
      dependencies: [sessionId, pollingTick],
      loadingBarInitialOnly: true,
    });

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
    if (data && data.id === sessionId) {
      setSession(data);
    }
  }, [data, sessionId, setSession]);

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
    loading: <DASessonPageSkeleton />,
    error: <FeedbackRetry onRetry={onRetry} m={"auto"} />,
    empty: <FeedbackNoData m={"auto"} />,
    notFound: <FeedbackNotFound m={"auto"} />,
    loaded: (
      <CContainer flex={1} gap={8}>
        <CContainer px={4}>
          <ContainerLayout gap={8}>
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

            {/* Meta */}
            <MetaData />
          </ContainerLayout>
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
              <ResultSection
                daSession={data}
                containerDimension={containerDimension}
              />

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
      {/* <PdfViewer height={"800px"}>
        <SuratPermohonanPDF data={data?.rawData} />
      </PdfViewer> */}

      <CContainer flex={1} gap={4} justify={"space-between"}>
        <FadingSkeletonContainer loading={initialLoading}>
          <ContainerLayout flex={1} px={4} pb={8} mt={8}>
            {render.loading}
          </ContainerLayout>
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
