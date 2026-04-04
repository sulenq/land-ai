"use client";

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
import { Divider } from "@/components/ui/divider";
import { Field, FieldsetRoot } from "@/components/ui/field";
import { Img } from "@/components/ui/img";
import { P } from "@/components/ui/p";
import { Textarea } from "@/components/ui/textarea";
import { AppIcon } from "@/components/widget/AppIcon";
import BackButton from "@/components/widget/BackButton";
import { ClampText } from "@/components/widget/ClampText";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { InfoPopover } from "@/components/widget/InfoPopover";
import {
  ConstrainedContainer,
  PageContainer,
} from "@/components/widget/PageShell";
import { PdfViewer } from "@/components/widget/PDFViewer";
import { TrialStepper } from "@/components/widget/trial-stepper";
import {
  DUMMY_PDF_URL,
  DUMMY_TRIAL_DA_SESSION_DETAIL,
} from "@/constants/dummyData";
import {
  Interface__DASessionDetail,
  Interface__DAUploadedDocument,
  Interface__TrialDASessionDetail,
  Interface__TrialSession,
} from "@/constants/interfaces";
import { useActiveTrialDaSessionContext } from "@/context/useActiveTrialDaSessionContext";
import { useBreadcrumbs } from "@/context/useBreadcrumbs";
import useLang from "@/context/useLang";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useTrialSessionContext } from "@/context/useTrialSessionContext";
import useDataState from "@/hooks/useDataState";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import usePopDisclosure from "@/hooks/usePopDisclosure";
import useRequest from "@/hooks/useRequest";
import { isEmptyArray } from "@/utils/array";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import { capitalizeWords } from "@/utils/string";
import { fileUrl, imgUrl } from "@/utils/url";
import { Box, Group, HStack, Stack, StackProps } from "@chakra-ui/react";
import { useFormik } from "formik";
import { CheckCheckIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import * as yup from "yup";

// -----------------------------------------------------------------

const Header = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const daSessionStep = useTrialSessionContext(
    (s) => s.trialSession?.daSessionStep,
  );
  const activeTrialDaSession = useActiveTrialDaSessionContext(
    (s) => s.activeTrialDaSession,
  );

  return (
    <CContainer gap={8}>
      {/* DA Session progress indicator */}
      <CContainer gap={2}>
        <HStack justify={"space-between"}>
          <P>
            Berkas saat ini (debug) : {activeTrialDaSession?.id}
            {" - "}
            {activeTrialDaSession?.daSession?.id}
          </P>

          <P textAlign={"center"}>Berkas ke-{daSessionStep || 1} / 3</P>
        </HStack>

        <HStack>
          {Array.from({ length: 3 }, (_, index) => {
            const isDone = daSessionStep ? index + 1 <= daSessionStep : false;

            return (
              <Box
                key={index}
                flex={1}
                h={"8px"}
                bg={isDone ? `${themeConfig.colorPalette}.solid` : "bg.muted"}
                rounded={themeConfig.radii.component}
              />
            );
          })}
        </HStack>
      </CContainer>
    </CContainer>
  );
};

// -----------------------------------------------------------------

// const FileName = (props: TextProps) => {
//   // Props
//   const { children, ...restProps } = props;

//   // States
//   const [hover, setHover] = useState<boolean>(false);

//   return (
//     <Tooltip
//       content={children}
//       positioning={{
//         placement: "right",
//       }}
//     >
//       <HStack w={"fit"} cursor={"pointer"}>
//         <P
//           lineClamp={1}
//           fontWeight={"medium"}
//           borderBottom={"1px solid"}
//           borderColor={hover ? "fg" : "transparent"}
//           transition={"200ms"}
//           onMouseEnter={() => {
//             setHover(true);
//           }}
//           onMouseLeave={() => {
//             setHover(false);
//           }}
//           {...restProps}
//         >
//           {children}
//         </P>

//         <AppIcon
//           icon={ArrowUpRightIcon}
//           opacity={hover ? 1 : 0}
//           transition={"200ms"}
//         />
//       </HStack>
//     </Tooltip>
//   );
// };

// -----------------------------------------------------------------

const FileInformation = () => {
  // Contexts
  const { l, lang } = useLang();
  const { themeConfig } = useThemeConfig();
  const activeTrialDaSession = useActiveTrialDaSessionContext(
    (s) => s.activeTrialDaSession,
  );
  const activeDaSession = activeTrialDaSession?.daSession;

  // Constants
  const documentService = activeDaSession?.documentService;

  return (
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
              key={activeDaSession?.documentService?.icon}
              src={imgUrl(activeDaSession?.documentService?.icon)}
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

          <P>{activeDaSession?.kategori}</P>
        </HStack>
      </CContainer>
    </CContainer>
  );
};

// -----------------------------------------------------------------

// interface Props__PdfViewerUploadedDocuments extends StackProps {
//   uploadedDocuments?: Interface__DAUploadedDocument[];
//   activeDocs: Interface__DAUploadedDocument[];
//   setActiveDocs: React.Dispatch<
//     React.SetStateAction<Interface__DAUploadedDocument[]>
//   >;
// }

// const PdfViewerUploadedDocuments = (
//   props: Props__PdfViewerUploadedDocuments,
// ) => {
//   // Props
//   const { uploadedDocuments, activeDocs, setActiveDocs, ...restProps } = props;

//   // Contexts
//   const { themeConfig } = useThemeConfig();

//   return (
//     <CContainer
//       flexShrink={0}
//       gap={1}
//       w={["full", null, "300px"]}
//       h={"full"}
//       p={2}
//       overflowY={"auto"}
//       {...restProps}
//     >
//       {uploadedDocuments?.map((doc) => {
//         const isActive = activeDocs.some(
//           (d) => d.documentRequirement.id === doc.documentRequirement.id,
//         );

//         return (
//           <HStack
//             key={doc.documentRequirement.id}
//             px={3}
//             py={2}
//             rounded={themeConfig.radii.component}
//             cursor={"pointer"}
//             _hover={{
//               bg: "d1",
//             }}
//             onClick={() => {
//               setActiveDocs(() => [doc]);
//             }}
//           >
//             <CContainer gap={1}>
//               <Tooltip content={doc.documentRequirement.name}>
//                 <P
//                   lineClamp={1}
//                   fontSize={"sm"}
//                   textAlign={"left"}
//                   color={"fg.subtle"}
//                   mr={4}
//                 >
//                   {doc.documentRequirement.name}
//                 </P>
//               </Tooltip>

//               <Tooltip content={doc.metaData.fileName}>
//                 <P
//                   lineClamp={1}
//                   fontSize={"sm"}
//                   fontWeight={"medium"}
//                   textAlign={"left"}
//                   mr={4}
//                 >
//                   {doc.metaData.fileName}
//                 </P>
//               </Tooltip>
//             </CContainer>

//             {isActive && <DotIndicator ml={"auto"} />}
//           </HStack>
//         );
//       })}
//     </CContainer>
//   );
// };

// -----------------------------------------------------------------

// const PdfViewerUploadedDocumentsTrigger = (
//   props: Props__PdfViewerUploadedDocuments,
// ) => {
//   // Props
//   const { uploadedDocuments, activeDocs, setActiveDocs, ...restProps } = props;
//   // Contexts
//   const { l } = useLang();

//   // Hooks
//   const { isOpen, onOpen } = usePopDisclosure(
//     disclosureId(`pdf-viewer-uploaded-documents-list`),
//   );

//   return (
//     <>
//       <CContainer w={"fit"} onClick={onOpen} {...restProps} />

//       <DisclosureRoot open={isOpen} lazyLoad>
//         <DisclosureContent>
//           <DisclosureHeader>
//             <DisclosureHeaderContent title={l.your_files} />
//           </DisclosureHeader>

//           <DisclosureBody>
//             <PdfViewerUploadedDocuments
//               uploadedDocuments={uploadedDocuments}
//               activeDocs={activeDocs}
//               setActiveDocs={setActiveDocs}
//               p={0}
//             />
//           </DisclosureBody>

//           <DisclosureFooter>
//             <BackButton />
//           </DisclosureFooter>
//         </DisclosureContent>
//       </DisclosureRoot>
//     </>
//   );
// };

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
  const {
    open,
    // uploadedDocuments,
    activeDocs,
    setActiveDocs,
  } = props;

  // Contexts
  const { l } = useLang();
  // const { themeConfig } = useThemeConfig();

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
            <DisclosureHeaderContent
              title={
                activeDocs[0]?.metaData?.fileName ||
                capitalizeWords(l.uploaded_file)
              }
            />
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
              {/* {iss && (
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
              )} */}

              {/* PDF Viewer */}
              <CContainer
                flex={1}
                gap={4}
                h={"full"}
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
                    {activeDocs?.map(
                      (
                        doc,
                        // index
                      ) => {
                        return (
                          <CContainer
                            key={doc.documentRequirement.id}
                            // bg={"bg.muted"}
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
                            <PdfViewer
                              fileUrl={
                                fileUrl(doc.metaData.filePath) || DUMMY_PDF_URL
                              }
                              fileName={doc.metaData.fileName}
                              defaultMode="continuous"
                              flex={1}
                              minH={0}
                            />

                            <CContainer my={4}>
                              <Group mx={"auto"}>
                                <ValidationConfirmation
                                  id={doc.documentRequirement.id.toString()}
                                  validationType={"uploadedFile"}
                                  metaType={doc.documentRequirement.name}
                                  validationStatus={"valid"}
                                >
                                  <Btn colorPalette={"teal"}>
                                    Valid dan siap disahkan
                                  </Btn>
                                </ValidationConfirmation>
                              </Group>
                            </CContainer>
                          </CContainer>
                        );
                      },
                    )}
                  </HStack>
                )}
              </CContainer>

              {/* {!iss && (
                <PdfViewerUploadedDocuments
                  uploadedDocuments={uploadedDocuments}
                  activeDocs={activeDocs}
                  setActiveDocs={setActiveDocs}
                />
              )} */}
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

interface Props__ValidationConfirmation extends StackProps {
  id: string;
  validationType: "uploadedFile" | "trialDaSession";
  metaType?: string;
  validationStatus: "valid" | "rejected";
}

const ValidationConfirmation = (props: Props__ValidationConfirmation) => {
  // Props
  const {
    children,
    id,
    validationType,
    metaType,
    validationStatus,
    ...restProps
  } = props;
  const ID = `${disclosureId(id)}-${validationType}-${validationStatus}`;

  // Contexts
  const { l } = useLang();
  const trialSession = useTrialSessionContext((s) => s.trialSession);
  const updateUploadedFilesValidationStatus = useActiveTrialDaSessionContext(
    (s) => s.updateUploadedFilesValidationStatus,
  );
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const router = useRouter();
  const { isOpen, onOpen } = usePopDisclosure(ID);
  const { req, loading } = useRequest({
    id: "validation-confirmation",
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: { notes: "" },
    validationSchema: yup.object().shape({
      notes:
        validationStatus === "rejected"
          ? yup.string().required(l.msg_required_form)
          : yup.string().notRequired(),
    }),
    onSubmit: (values, { resetForm }) => {
      if (!trialSession?.id) return;

      const url = {
        uploadedFile: `/api/trial/step-2/uploaded-file/validation/${trialSession?.id}`,
        trialDaSession: `/api/trial/da-session/validation/${trialSession?.id}`,
      };

      const payload = {
        validationStatus: validationStatus,
        notes: values.notes,
      };

      const config = {
        url: url[validationType] as string,
        method: "POST",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: (r) => {
            resetForm();

            if (isOpen) {
              back();
            }

            if (validationType === "uploadedFile") {
              const trialDaSessionDetail: Interface__TrialDASessionDetail =
                r.data.data;

              updateUploadedFilesValidationStatus(
                trialDaSessionDetail.manualDetails,
              );
            }

            if (validationType === "trialDaSession") {
              const trialSession: Interface__TrialSession = r.data.data;

              if (trialSession.daSessionStep === 3) {
                router.push(`/service-trial/${trialSession.id}/ai-phase`);
              } else {
                setRt((ps) => !ps);
              }
            }
          },
        },
      });
    },
  });

  // Derived Values
  const label = `${validationType === "uploadedFile" ? "file yang diunggah" : "berkas"} ${metaType ? `(${metaType})` : ""}`;

  return (
    <>
      <CContainer w={"fit"} onClick={onOpen} {...restProps}>
        {children}
      </CContainer>

      <DisclosureRoot open={isOpen} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`Validasi Data`} />
          </DisclosureHeader>

          <DisclosureBody>
            <CContainer>
              <P>
                {validationStatus === "rejected"
                  ? `Tolak ${label} ini?`
                  : `Validasi ${label} ini?`}
              </P>

              <form id={ID} onSubmit={formik.handleSubmit}>
                <FieldsetRoot disabled={loading}>
                  {validationStatus === "rejected" && (
                    <Field
                      invalid={!!formik.errors.notes}
                      errorText={formik.errors.notes as string}
                      mt={4}
                    >
                      <Textarea
                        inputValue={formik.values.notes}
                        onChange={(inputValue) => {
                          formik.setFieldValue("notes", inputValue);
                        }}
                        placeholder={"Catatan"}
                      />
                    </Field>
                  )}
                </FieldsetRoot>
              </form>
            </CContainer>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />

            <Btn
              type={"submit"}
              form={ID}
              colorPalette={validationStatus === "rejected" ? "red" : "teal"}
              loading={loading}
            >
              {validationStatus === "rejected" ? "Tolak" : "Validasi"}
            </Btn>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};

// -----------------------------------------------------------------

const UploadedFiles = () => {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const activeDaSession = useActiveTrialDaSessionContext(
    (s) => s.activeTrialDaSession?.daSession,
  );

  // console.debug(activeTrialDaSession);

  // Constants
  const uploadedDocuments = activeDaSession?.uploadedDocuments;

  // Hooks
  const { isOpen, onOpen } = usePopDisclosure(
    disclosureId(`pdf-viewer-uploaded-files-da-session`),
  );

  // States
  const [activeDocs, setActiveDocs] = useState<Interface__DAUploadedDocument[]>(
    uploadedDocuments?.[0] ? [uploadedDocuments[0]] : [],
  );

  return (
    <CContainer gap={2}>
      <HStack h={"32px"}>
        <P fontWeight={"semibold"}>{capitalizeWords(l.uploaded_file)}</P>
      </HStack>

      <CContainer
        gap={2}
        rounded={themeConfig.radii.container}
        borderColor={"border.muted"}
      >
        {uploadedDocuments?.map((doc) => {
          return (
            <HStack
              key={doc.documentRequirement.id}
              flexDir={["column", null, "row"]}
              justify={"space-between"}
              gapX={4}
              bg={"d0"}
              pl={4}
              pr={3}
              py={3}
              rounded={themeConfig.radii.container}
            >
              <ClampText fontWeight={"medium"}>
                {doc.documentRequirement.name}
              </ClampText>

              {/* Action buttons */}
              <HStack>
                {/* TODO: hit api da session timestamp (START) + hit api da
                session uploaded file timestamp (START) */}
                <Btn
                  clicky={false}
                  h={"fit"}
                  px={0}
                  border={"none"}
                  borderBottom={"1px solid"}
                  borderColor={"fg.success"}
                  rounded={0}
                  variant={"plain"}
                  colorPalette={"teal"}
                  ml={"auto"}
                  onClick={() => {
                    setActiveDocs([doc]);
                    onOpen();
                  }}
                >
                  {l.view}
                </Btn>
                <Divider w={"1px"} h={"20px"} />
                <ValidationConfirmation
                  id={doc.documentRequirement.id.toString()}
                  validationType={"uploadedFile"}
                  metaType={doc.documentRequirement.name}
                  validationStatus={"rejected"}
                >
                  <Btn
                    clicky={false}
                    h={"fit"}
                    px={0}
                    border={"none"}
                    borderBottom={"1px solid"}
                    borderColor={"fg.error"}
                    rounded={0}
                    variant={"plain"}
                    colorPalette={"red"}
                    ml={"auto"}
                  >
                    Tolak
                  </Btn>
                </ValidationConfirmation>
              </HStack>
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
  );
};

// -----------------------------------------------------------------

// interface Props__AccordionItemsList {
//   daSession?: Interface__DASessionDetail;
//   l: any;
//   themeConfig: any;
// }

// const AccordionItemsList = memo(function AccordionItemsList(
//   props: Props__AccordionItemsList,
// ) {
//   const { daSession, l, themeConfig } = props;

//   const documentRequirements = daSession?.documentService?.documentRequirements;
//   const result = daSession?.result;
//   const uploadedDocuments = daSession?.uploadedDocuments;

//   const resultByLabel = useMemo(() => {
//     const map = new Map<string, any>();
//     result?.forEach((item) => map.set(item.label, item));
//     return map;
//   }, [result]);

//   const getValueResult = useCallback(
//     (label: string, index: number) => {
//       const field = resultByLabel.get(label);
//       return field?.values?.[index]?.value ?? null;
//     },
//     [resultByLabel],
//   );

//   return (
//     <>
//       {uploadedDocuments?.map((doc, index) => {
//         const documentRequirement = documentRequirements?.find((dr) => {
//           return dr.id === doc.documentRequirement.id;
//         });

//         return (
//           <AccordionItem
//             key={doc.documentRequirement.id}
//             value={`${doc.documentRequirement.id}`}
//             px={4}
//             border={"1px solid"}
//             borderColor={"border.muted"}
//             rounded={themeConfig.radii.container}
//             _open={{
//               bg: "d0",
//             }}
//           >
//             <AccordionItemTrigger cursor={"pointer"}>
//               <P>{doc.documentRequirement.name}</P>
//             </AccordionItemTrigger>

//             <AccordionItemContent>
//               <CContainer gap={2}>
//                 {isEmptyArray(documentRequirement?.extractionSchema) && (
//                   <FeedbackNotFound title={l.alert_no_data.title} mb={7} />
//                 )}

//                 {documentRequirement?.extractionSchema?.map((field) => {
//                   const value = getValueResult(field.label, index);
//                   const isNotFound = value === "NOT_FOUND";

//                   return (
//                     value && (
//                       <HStack key={field.key}>
//                         <ClampText
//                           flexShrink={0}
//                           w={"240px"}
//                           color={"fg.muted"}
//                         >
//                           {field.label}
//                         </ClampText>

//                         <ClampText color={value ? "" : "fg.muted"}>
//                           {isNotFound ? l.not_found : value}
//                         </ClampText>
//                       </HStack>
//                     )
//                   );
//                 })}
//               </CContainer>
//             </AccordionItemContent>
//           </AccordionItem>
//         );
//       })}

//       {/* Validation Panel */}
//       <AccordionItem
//         value={`validation`}
//         borderBottom={"none"}
//         px={0}
//         border={"1px solid"}
//         borderColor={"border.muted"}
//         rounded={themeConfig.radii.container}
//         _open={{
//           bg: "d0",
//         }}
//       >
//         <AccordionItemTrigger cursor={"pointer"} px={4}>
//           <HStack>
//             <AppIcon icon={CheckCheckIcon} />

//             <P>{l.validation}</P>
//           </HStack>
//         </AccordionItemTrigger>

//         <AccordionItemContent p={0}>
//           <CContainer gap={1}>
//             <AccordionRoot collapsible multiple>
//               {isEmptyArray(result) && (
//                 <FeedbackNotFound title={l.alert_no_data.title} mb={7} />
//               )}

//               {result?.map((r, index) => {
//                 const isLastIndex = index === result.length - 1;
//                 const fieldLabel = r.label;
//                 const isMatch = r.validation.status;

//                 return (
//                   <AccordionItem
//                     key={r.label}
//                     value={r.label}
//                     borderBottom={isLastIndex ? "none" : "1px solid"}
//                     borderColor={"d1"}
//                     px={4}
//                     _open={{
//                       bg: "d0",
//                     }}
//                   >
//                     <AccordionItemTrigger cursor={"pointer"}>
//                       <HStack>
//                         <Tooltip content={r.label}>
//                           <P
//                             flexShrink={0}
//                             lineClamp={1}
//                             w={"240px"}
//                             // color={"fg.muted"}
//                           >
//                             {r.label}
//                           </P>
//                         </Tooltip>

//                         <P color={isMatch ? "fg.success" : "fg.error"}>
//                           {isMatch ? l.match : l.mismatch}
//                         </P>
//                       </HStack>
//                     </AccordionItemTrigger>

//                     <AccordionItemContent px={0} py={2}>
//                       <CContainer rounded={"md"} gap={2}>
//                         {uploadedDocuments?.map((doc, docIndex) => {
//                           const val = getValueResult(fieldLabel, docIndex);
//                           const isNotFound = val === "NOT_FOUND";

//                           return (
//                             <HStack key={doc.documentRequirement.id}>
//                               <ClampText
//                                 flexShrink={0}
//                                 w={"240px"}
//                                 color={"fg.muted"}
//                               >
//                                 {doc.documentRequirement.name}
//                               </ClampText>

//                               <ClampText>
//                                 {val ? (isNotFound ? l.not_found : val) : "-"}
//                               </ClampText>
//                             </HStack>
//                           );
//                         })}
//                       </CContainer>
//                     </AccordionItemContent>
//                   </AccordionItem>
//                 );
//               })}
//             </AccordionRoot>
//           </CContainer>
//         </AccordionItemContent>
//       </AccordionItem>

//       {/* Fraud Detection Panel */}
//       <AccordionItem
//         value={`fraud-detection`}
//         borderBottom={"none"}
//         px={0}
//         border={"1px solid"}
//         borderColor={"border.muted"}
//         rounded={themeConfig.radii.container}
//         _open={{
//           bg: "d0",
//         }}
//       >
//         <AccordionItemTrigger cursor={"pointer"} px={4}>
//           <HStack>
//             <AppIcon icon={ShieldAlertIcon} />

//             <P>{l.fraud_detector}</P>
//           </HStack>
//         </AccordionItemTrigger>

//         <AccordionItemContent p={0}>
//           <FraudAlertsPanel daSession={daSession} />
//         </AccordionItemContent>
//       </AccordionItem>
//     </>
//   );
// });

// -----------------------------------------------------------------

// interface Props__AccordionMode extends StackProps {
//   daSession?: Interface__DASessionDetail;
//   accordionValue: string[];
//   setAccordionValue: React.Dispatch<React.SetStateAction<string[]>>;
// }

// const AccordionMode = memo(function AccordionMode(props: Props__AccordionMode) {
//   // Props
//   const { daSession, accordionValue, setAccordionValue } = props;

//   // Contexts
//   const { l } = useLang();
//   const { themeConfig } = useThemeConfig();

//   return (
//     <CContainer gap={4}>
//       <AccordionRoot
//         collapsible
//         multiple
//         value={accordionValue}
//         onValueChange={(e) => setAccordionValue(e.value)}
//         overflow={"clip"}
//       >
//         <CContainer gap={2}>
//           <AccordionItemsList
//             daSession={daSession}
//             l={l}
//             themeConfig={themeConfig}
//           />
//         </CContainer>
//       </AccordionRoot>
//     </CContainer>
//   );
// });

// // -----------------------------------------------------------------

// interface Props__TableMode extends StackProps {
//   daSession?: Interface__DASessionDetail;
//   containerDimension?: {
//     width: number;
//     height: number;
//   };
// }

// const TableMode = memo(function TableMode(props: Props__TableMode) {
//   // Props
//   const { daSession } = props;

//   // Contexts
//   const { l } = useLang();

//   // Refs
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   // States
//   // const documentRequirements = daSession?.documentService?.documentRequirements;
//   const uploadedDocuments = daSession?.uploadedDocuments;
//   const result = daSession?.result;
//   const headers = useMemo<Interface__FormattedTableHeader[]>(
//     () => [
//       {
//         th: "Item Validasi",
//         sortable: true,
//         headerProps: {
//           position: "sticky",
//           left: 0,
//           zIndex: 4,
//           bg: "body",
//         },
//       },
//       ...(uploadedDocuments ?? []).map((doc) => ({
//         th: doc.documentRequirement.name,
//         sortable: true,
//       })),
//       {
//         th: "Valid",
//         sortable: true,
//         headerProps: {
//           position: "sticky",
//           right: 0,
//           zIndex: 4,
//           bg: "body",
//         },
//       },
//     ],
//     [uploadedDocuments],
//   );

//   // Derived Values
//   const rows = useMemo<Interface__FormattedTableRow[]>(() => {
//     return (result ?? []).map((r, idx) => {
//       const isMatch = r.validation.status;

//       return {
//         id: `${idx}`,
//         idx: idx,
//         data: r,
//         columns: [
//           {
//             td: r.label,
//             value: r.label,
//             dataType: "string",
//             tableCellProps: {
//               position: "sticky",
//               left: 0,
//               zIndex: 2,
//               bg: "body",
//             },
//           },
//           ...r.values.map((v) => {
//             // const documentRequirement = documentRequirements?.find((dr) => {
//             //   return dr.id === v.documentId;
//             // });
//             // const isInSchema = documentRequirement?.extractionSchema?.find(
//             //   (es) => {
//             //     return es.label === r.label;
//             //   },
//             // );
//             const isNotFound = v.value === "NOT_FOUND";

//             return {
//               td: (
//                 <P
//                   color={isNotFound ? "fg.warning" : ""}
//                   maxW={"200px"}
//                   whiteSpace={"wrap"}
//                 >
//                   {isNotFound ? l.not_found : v.value || "-"}
//                 </P>
//               ),
//               dim: isNotFound || v.value === null,
//               value: v.value,
//               dataType: v.renderType,
//             };
//           }),
//           {
//             td: (
//               <Tooltip content={isMatch ? l.match : l.mismatch}>
//                 <Center>
//                   <AppIcon
//                     icon={isMatch ? CheckIcon : XIcon}
//                     color={isMatch ? "fg.success" : "fg.error"}
//                     mx={"auto"}
//                   />
//                 </Center>
//               </Tooltip>
//             ),
//             value: r.validation.status,
//             dataType: "boolean",
//             tableCellProps: {
//               position: "sticky",
//               right: 0,
//               zIndex: 2,
//               bg: "body",
//             },
//           },
//         ],
//       };
//     });
//   }, [result, l]);

//   // SX
//   // const px = useMemo(() => {
//   //   return containerDimension &&
//   //     containerDimension?.width < CONSTRAINED_MAX_W_NUMBER
//   //     ? 4
//   //     : `calc((${containerDimension?.width}px - ${CONSTRAINED_MAX_W} - 32px)/2)`;
//   // }, [containerDimension]);

//   return (
//     <>
//       <MContainer
//         ref={containerRef}
//         className={"noScroll"}
//         maskingTop={0}
//         maskingBottom={0}
//         maskingLeft={"100px"}
//         maskingRight={"100px"}
//         overflowX={"auto"}
//         cursor={"grab"}
//         css={{
//           "&:active": { cursor: "grabbing" },
//           userSelect: "none",
//         }}
//         onMouseDown={(e) => {
//           const target = e.target as HTMLElement;

//           if (target.closest("button, a, input")) return;

//           e.preventDefault();
//           const container = containerRef.current;
//           if (!container) return;

//           const startX = e.clientX;
//           const startY = e.clientY;
//           const scrollLeft = container.scrollLeft;
//           const scrollTop = container.scrollTop;

//           const onMouseMove = (ev: MouseEvent) => {
//             ev.preventDefault();
//             container.scrollLeft = scrollLeft - (ev.clientX - startX);
//             container.scrollTop = scrollTop - (ev.clientY - startY);
//           };
//           const onMouseUp = () => {
//             window.removeEventListener("mousemove", onMouseMove);
//             window.removeEventListener("mouseup", onMouseUp);
//           };
//           window.addEventListener("mousemove", onMouseMove);
//           window.addEventListener("mouseup", onMouseUp);
//         }}
//       >
//         <CContainer w={"max"}>
//           <DataTable
//             headers={headers}
//             rows={rows}
//             minH={0}
//             borderColor={"border.muted"}
//             overflow={"visible"}
//             contentContainerProps={{ overflow: "visible" }}
//           />
//         </CContainer>
//       </MContainer>

//       {/* Fraud Detection Section */}
//       <CContainer>
//         <FraudAlertsPanel daSession={daSession} />
//       </CContainer>
//     </>
//   );
// });

// -----------------------------------------------------------------

// interface Props__ResultSection extends StackProps {
//   daSession?: Interface__DASessionDetail;
//   containerDimension?: {
//     width: number;
//     height: number;
//   };
// }

// const ResultSection = (props: Props__ResultSection) => {
//   // Props
//   const { daSession, containerDimension, ...restProps } = props;

//   // Contexts
//   const { l } = useLang();
//   const { themeConfig } = useThemeConfig();

//   // States
//   const [show, setShow] = useState<boolean>(false);
//   const [viewMode, setViewMode] = useState<"accordion" | "table">("accordion");
//   const [accordionValue, setAccordionValue] = useState<string[]>([]);
//   const uploadedDocuments = daSession?.uploadedDocuments;

//   return (
//     <CContainer pos={"relative"} {...restProps}>
//       {!show && <Btn onClick={() => setShow(true)}>Lihat Hasil AI</Btn>}

//       <CContainer display={show ? "flex" : "none"}>
//         <CContainer
//           pos={"sticky"}
//           top={"-32px"}
//           mb={[2, null, 0]}
//           zIndex={"sticky"}
//         >
//           <CContainer>
//             <HStack
//               wrap={"wrap"}
//               justify={"space-between"}
//               pb={2}
//               bg={
//                 "linear-gradient(to bottom, var(--chakra-colors-body) 80%, transparent 100%)"
//               }
//             >
//               <P fontWeight="semibold">{capitalizeWords(l.analysis_result)}</P>

//               <HStack flex={[1, null, 0]} gap={2}>
//                 {/* Accordion controls - only in accordion mode */}
//                 {viewMode === "accordion" && (
//                   <HStack flex={1} rounded={themeConfig.radii.component}>
//                     <Btn
//                       flex={1}
//                       variant="outline"
//                       size="xs"
//                       onClick={() => {
//                         if (uploadedDocuments) {
//                           setAccordionValue([
//                             ...uploadedDocuments.map((doc) => {
//                               return `${doc.documentRequirement.id}`;
//                             }),
//                             "validation",
//                           ]);
//                         }
//                       }}
//                     >
//                       {l.open_all}
//                     </Btn>

//                     <Btn
//                       flex={1}
//                       variant="outline"
//                       size="xs"
//                       onClick={() => {
//                         setAccordionValue([]);
//                       }}
//                     >
//                       {l.close_all}
//                     </Btn>
//                   </HStack>
//                 )}

//                 {/* View mode toggle */}
//                 <Tooltip content={l.change_view_mode}>
//                   <Box>
//                     <Segmented
//                       items={[
//                         {
//                           value: "accordion",
//                           label: <AppIcon icon={LayoutListIcon} />,
//                         },
//                         {
//                           value: "table",
//                           label: <AppIcon icon={TableIcon} />,
//                         },
//                       ]}
//                       inputValue={viewMode}
//                       onChange={(value) =>
//                         setViewMode(value as "table" | "accordion")
//                       }
//                       size={"xs"}
//                     />
//                   </Box>
//                 </Tooltip>
//               </HStack>
//             </HStack>
//           </CContainer>
//         </CContainer>

//         {/* Accordion View */}
//         <Box display={viewMode === "accordion" ? "block" : "none"}>
//           <CContainer>
//             <CContainer>
//               <AccordionMode
//                 daSession={daSession}
//                 accordionValue={accordionValue}
//                 setAccordionValue={setAccordionValue}
//               />
//             </CContainer>
//           </CContainer>
//         </Box>

//         {/* Table View */}
//         <Box display={viewMode === "table" ? "block" : "none"}>
//           <CContainer>
//             <TableMode
//               daSession={daSession}
//               containerDimension={containerDimension}
//             />
//           </CContainer>
//         </Box>
//       </CContainer>
//     </CContainer>
//   );
// };

// -----------------------------------------------------------------

interface Props__TrialDaSessionFinalValidations extends StackProps {
  disabled?: boolean;
}

const TrialDaSessionFinalValidations = (
  props: Props__TrialDaSessionFinalValidations,
) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();
  const activeTrialDaSession = useActiveTrialDaSessionContext(
    (s) => s.activeTrialDaSession,
  );
  const activeDaSession = activeTrialDaSession?.daSession;

  // Constants
  const totalUploadedDocuments = activeDaSession?.uploadedDocuments?.length;

  // Derived Values
  const disabled =
    activeDaSession?.uploadedDocuments?.length !==
    activeTrialDaSession?.manualDetails?.length;

  return (
    <CContainer
      gap={4}
      p={4}
      bg={"d0"}
      border={"1px solid"}
      borderColor={"border.emphasized"}
      rounded={themeConfig.radii.container}
      {...restProps}
    >
      <CContainer gap={1}>
        <HStack>
          <AppIcon icon={CheckCheckIcon} />

          <P fontSize={"lg"} fontWeight={"semibold"}>
            Validasi Akhir Berkas
          </P>
        </HStack>

        <P color={"fg.muted"}>
          Semua {totalUploadedDocuments} dokumen telah diperiksa. Berikan
          keupusan final untuk berkas ini.
        </P>
      </CContainer>

      <HStack>
        <ValidationConfirmation
          id={"active-da-session"}
          validationType={"trialDaSession"}
          validationStatus={"rejected"}
          flex={1}
        >
          <Btn variant={"outline"} colorPalette={"red"} disabled={disabled}>
            <AppIcon icon={XCircleIcon} />
            Tolak berkas
          </Btn>
        </ValidationConfirmation>

        <ValidationConfirmation
          id={"active-da-session"}
          validationType={"trialDaSession"}
          validationStatus={"valid"}
          flex={1}
        >
          <Btn colorPalette={"teal"} disabled={disabled}>
            <AppIcon icon={CheckCircleIcon} />
            Valid & siap disahkan
          </Btn>
        </ValidationConfirmation>
      </HStack>
    </CContainer>
  );
};

// -----------------------------------------------------------------

export default function Page() {
  // Contexts
  const setBreadcrumbs = useBreadcrumbs((s) => s.setBreadcrumbs);
  const trialSession = useTrialSessionContext((s) => s.trialSession);
  const setActiveTrialDaSession = useActiveTrialDaSessionContext(
    (s) => s.setActiveTrialDaSession,
  );
  const trialDaSessions = trialSession?.trialDaSessions;
  const currentDaSessionId =
    trialDaSessions?.[(trialSession?.daSessionStep || 1) - 1]?.daSession?.id;

  // Refs
  const containerRef = useRef<HTMLDivElement | null>(null);

  // States
  const {
    initialLoading,
    error,
    data: activeTrialDaSession,
    onRetry,
  } = useDataState<Interface__TrialDASessionDetail>({
    initialData: DUMMY_TRIAL_DA_SESSION_DETAIL as any,
    // url: `${DA_API_SESSION_DETAIL}/${currentDaSessionId}`,
    dataResource: false,
    dependencies: [currentDaSessionId],
    loadingBarInitialOnly: true,
  });

  // Update breadcrumbs
  useEffect(() => {
    if (activeTrialDaSession) {
      setBreadcrumbs({
        backPath: `/service-trial`,
        activeNavs: [
          {
            labelKey: `navs.service_trial`,
            path: `/service-trial`,
          },
          {
            label: activeTrialDaSession?.daSession?.title,
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
  }, [activeTrialDaSession]);

  // Set active trial DA session on data load
  useEffect(() => {
    if (
      activeTrialDaSession &&
      activeTrialDaSession?.daSession?.id === currentDaSessionId
    ) {
      setActiveTrialDaSession(activeTrialDaSession);
    }
  }, [activeTrialDaSession, currentDaSessionId, setActiveTrialDaSession]);

  const render = {
    loading: <DASessonPageSkeleton />,
    error: <FeedbackRetry onRetry={onRetry} m={"auto"} />,
    empty: <FeedbackNoData m={"auto"} />,
    notFound: <FeedbackNotFound m={"auto"} />,
    loaded: (
      <CContainer flex={1} gap={8}>
        {/* Header */}
        <Header />

        <FileInformation />

        <UploadedFiles />

        {/* Verification */}
        <TrialDaSessionFinalValidations mx={"auto"} />
      </CContainer>
    ),
  };

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
                {activeTrialDaSession && render.loaded}
                {!activeTrialDaSession && render.empty}
              </>
            )}
          </>
        )}
      </ConstrainedContainer>
    </PageContainer>
  );
}
