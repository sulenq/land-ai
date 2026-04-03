"use client";

// TODO ubah activeDA => context trial session

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
import { Img } from "@/components/ui/img";
import { P } from "@/components/ui/p";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIcon } from "@/components/widget/AppIcon";
import BackButton from "@/components/widget/BackButton";
import { ClampText } from "@/components/widget/ClampText";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { DotIndicator } from "@/components/widget/Indicator";
import { InfoPopover } from "@/components/widget/InfoPopover";
import {
  ConstrainedContainer,
  PageContainer,
} from "@/components/widget/PageShell";
import { PdfViewer } from "@/components/widget/PDFViewer";
import { TrialStepper } from "@/components/widget/trial-stepper";
import { DA_API_SESSION_DETAIL } from "@/constants/apis";
import { DUMMY_PDF_URL } from "@/constants/dummyData";
import {
  Interface__DASessionDetail,
  Interface__DAUploadedDocument,
} from "@/constants/interfaces";
import { R_SPACING_MD } from "@/constants/styles";
import { useActiveDA } from "@/context/useActiveDA";
import { useBreadcrumbs } from "@/context/useBreadcrumbs";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useTrialSessionContext } from "@/context/useTrialSessionContext";
import useDataState from "@/hooks/useDataState";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import usePopDisclosure from "@/hooks/usePopDisclosure";
import { isEmptyArray } from "@/utils/array";
import { disclosureId } from "@/utils/disclosure";
import { capitalizeWords } from "@/utils/string";
import { fileUrl, imgUrl } from "@/utils/url";
import {
  Badge,
  Group,
  GroupProps,
  HStack,
  Stack,
  StackProps,
  TextProps,
} from "@chakra-ui/react";
import { ArrowUpRightIcon, ListIcon, XIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// -----------------------------------------------------------------

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

            {isActive && <DotIndicator ml={"auto"} />}
          </HStack>
        );
      })}
    </CContainer>
  );
};

// -----------------------------------------------------------------

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

// -----------------------------------------------------------------

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

  // Reset activeDocs on close
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

              {/* PDF Viewer */}
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
                          // bg={"bg.muted"}
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
                          <HStack
                            justify={"space-between"}
                            flexShrink={0}
                            p={2}
                          >
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
                            borderTop={"1px solid"}
                            borderColor={"border.muted"}
                            rounded={themeConfig.radii.component}
                            flex={1}
                            minH={0}
                          />

                          <CContainer my={4}>
                            <Group mx={"auto"}>
                              <Btn variant={"outline"} colorPalette={"red"}>
                                Tolak
                              </Btn>

                              <Btn variant={"outline"} colorPalette={"green"}>
                                Valid dan siap disahkan
                              </Btn>
                            </Group>
                          </CContainer>
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

const Header = () => {
  // Contexts
  const activeDASession = useActiveDA((s) => s.activeDA.session);

  return (
    <CContainer gap={1}>
      <ClampText fontSize={"xl"} fontWeight={"semibold"}>
        {activeDASession?.title}
      </ClampText>

      <P color={"fg.subtle"}>{activeDASession?.id}</P>
    </CContainer>
  );
};

// -----------------------------------------------------------------

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
      <HStack w={"fit"} cursor={"pointer"}>
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

// -----------------------------------------------------------------

const MetaData = () => {
  // Contexts
  const { l, lang } = useLang();
  const { themeConfig } = useThemeConfig();
  const activeDASession = useActiveDA((s) => s.activeDA.session);

  // Constants
  const documentService = activeDASession?.documentService;
  const uploadedDocuments = activeDASession?.uploadedDocuments;
  const trialSession = useTrialSessionContext((s) => s.trialSession);
  const step = trialSession?.step;

  // Hooks
  const { isOpen, onOpen } = usePopDisclosure(
    disclosureId(`pdf-viewer-uploaded-files-da-session`),
  );

  // States
  const [activeDocs, setActiveDocs] = useState<Interface__DAUploadedDocument[]>(
    uploadedDocuments?.[0] ? [uploadedDocuments[0]] : [],
  );

  // Derived Values
  const isManualPhase = step === 2;

  return (
    <>
      {/* File Information */}
      <CContainer gap={2}>
        <HStack h={"32px"}>
          <P fontWeight={"semibold"}>{capitalizeWords(l.file_information)}</P>
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
              {l.service}
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

              <InfoPopover
                popoverContent={documentService?.description[lang]}
              />
            </HStack>
          </HStack>

          <HStack gap={4} align={"start"}>
            <P w={"140px"} flexShrink={0} color={"fg.muted"}>
              {l.category}
            </P>

            <P>{activeDASession?.kategori}</P>
          </HStack>
        </CContainer>
      </CContainer>

      {/* Uploaded files */}
      {isManualPhase && (
        <CContainer gap={2}>
          <HStack h={"32px"}>
            <P fontWeight={"semibold"}>{capitalizeWords(l.uploaded_file)}</P>
          </HStack>

          <CContainer
            gap={2}
            rounded={themeConfig.radii.container}
            // border={"1px solid"}
            borderColor={"border.muted"}
          >
            {uploadedDocuments?.map((doc) => {
              return (
                <HStack
                  flexDir={["column", null, "row"]}
                  key={doc.documentRequirement.id}
                  gapX={4}
                  bg={"d0"}
                  pl={4}
                  pr={3}
                  py={3}
                  rounded={themeConfig.radii.component}
                >
                  <CContainer gap={1}>
                    <HStack flexShrink={0}>
                      <ClampText fontWeight={"medium"}>
                        {doc.documentRequirement.name}
                      </ClampText>

                      {!doc.documentRequirement.isMandatory && (
                        <Badge bg={"d1"} colorPalette={"gray"}>
                          {l.optional}
                        </Badge>
                      )}
                    </HStack>

                    {doc.metaData.fileName ? (
                      <FileName
                        color={"fg.muted"}
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
                  </CContainer>

                  <Btn
                    variant={"subtle"}
                    ml={"auto"}
                    onClick={() => {
                      setActiveDocs([doc]);
                      onOpen();
                    }}
                  >
                    {l.open}
                    <AppIcon icon={ArrowUpRightIcon} />
                  </Btn>
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
      )}
    </>
  );
};

// -----------------------------------------------------------------

interface Props__TrialDaSessionVerificationButtons extends GroupProps {
  disabled?: boolean;
}

const TrialDaSessionVerificationButtons = (
  props: Props__TrialDaSessionVerificationButtons,
) => {
  // Props
  const { disabled, ...restProps } = props;

  return (
    <Group {...restProps}>
      <Btn variant={"outline"} colorPalette={"red"} disabled={disabled}>
        Tolak
      </Btn>

      <Btn variant={"outline"} colorPalette={"green"} disabled={disabled}>
        Valid dan siap disahkan
      </Btn>
    </Group>
  );
};

// -----------------------------------------------------------------

export default function Page() {
  // Contexts
  const setBreadcrumbs = useBreadcrumbs((s) => s.setBreadcrumbs);
  const trialSession = useTrialSessionContext((s) => s.trialSession);
  const setActiveDaSession = useActiveDA((s) => s.setSession);
  const trialDaSessions = trialSession?.trialDaSessions;
  const currentDaSessionId = trialDaSessions?.[0].daSession?.id;

  // Refs
  const containerRef = useRef<HTMLDivElement | null>(null);

  // States
  const {
    initialLoading,
    error,
    data: currentDaSession,
    onRetry,
  } = useDataState<Interface__DASessionDetail>({
    // initialData: DUMMY_ACTIVE_DA_SESSION as any,
    url: `${DA_API_SESSION_DETAIL}/${currentDaSessionId}`,
    dataResource: false,
    dependencies: [currentDaSessionId],
    loadingBarInitialOnly: true,
  });

  // Derived Values
  // TODO make disabled condition for trial verification buttons
  const isDisabled = true;

  // Update breadcrumbs
  useEffect(() => {
    if (currentDaSession) {
      setBreadcrumbs({
        backPath: `/service-trial`,
        activeNavs: [
          {
            labelKey: `navs.service_trial`,
            path: `/service-trial`,
          },
          {
            label: currentDaSession?.title,
            path: `/service-trial/${currentDaSessionId}`,
          },
        ],
      });
    } else {
      setBreadcrumbs({
        backPath: `/your-da/${currentDaSessionId}`,
        activeNavs: [
          {
            labelKey: `navs.service_trial`,
            path: `/service-trial`,
          },
          {
            label: "...",
            path: `/service-trial/${currentDaSessionId}`,
          },
        ],
      });
    }
  }, [currentDaSession]);

  // Set active DA on data load
  useEffect(() => {
    if (currentDaSession && currentDaSession.id === currentDaSessionId) {
      setActiveDaSession(currentDaSession);
    }
  }, [currentDaSession, currentDaSessionId, setActiveDaSession]);

  const render = {
    loading: <DASessonPageSkeleton />,
    error: <FeedbackRetry onRetry={onRetry} m={"auto"} />,
    empty: <FeedbackNoData m={"auto"} />,
    notFound: <FeedbackNotFound m={"auto"} />,
    loaded: (
      <CContainer flex={1} gap={8}>
        {/* Header */}
        <Header />

        {/* Meta */}
        <MetaData />

        {/* Verification */}
        <TrialDaSessionVerificationButtons disabled={isDisabled} mx={"auto"} />
      </CContainer>
    ),
  };

  // console.debug(trialSession);

  return (
    <PageContainer ref={containerRef} p={8} pos={"relative"}>
      <ConstrainedContainer flex={1} justify={"space-between"} gap={8}>
        <CContainer>
          <TrialStepper />
        </CContainer>

        {initialLoading && render.loading}

        {!initialLoading && (
          <>
            {error && render.error}
            {!error && (
              <>
                {currentDaSession && render.loaded}
                {!currentDaSession && render.empty}
              </>
            )}
          </>
        )}
      </ConstrainedContainer>
    </PageContainer>
  );
}
