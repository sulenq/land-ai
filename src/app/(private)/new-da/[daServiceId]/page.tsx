"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Field, FieldsetRoot } from "@/components/ui/field";
import { FileInput } from "@/components/ui/file-input";
import { HelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import { Skeleton } from "@/components/ui/skeleton";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { ContainerLayout, PageContainer } from "@/components/widget/PageShell";
import { DA_API_SERVICE_DETAIL, DA_API_SESSON_CREATE } from "@/constants/apis";
import {
  Interface__DAServiceDetail,
  Interface__DAServiceDocumentRequirement,
} from "@/constants/interfaces";
import { useActiveDA } from "@/context/useActiveDA";
import { useBreadcrumbs } from "@/context/useBreadcrumbs";
import { useDASessions } from "@/context/useDASessions";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useTimezone from "@/context/useTimezone";
import useDataState from "@/hooks/useDataState";
import useRequest from "@/hooks/useRequest";
import { isEmptyArray } from "@/utils/array";
import { formatDate } from "@/utils/formatter";
import { makeUTCISODateTime } from "@/utils/time";
import { fileValidation } from "@/utils/validationSchema";
import { SimpleGrid, StackProps, VStack } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import * as yup from "yup";

interface Props__InputForm extends StackProps {
  daService?: Interface__DAServiceDetail;
  cols?: number;
}
const InputForm = (props: Props__InputForm) => {
  const ID = "da_service_input_form";

  // Props
  const { daService, ...restProps } = props;

  // Contexts
  const { l, lang } = useLang();
  const { themeConfig } = useThemeConfig();
  const setSession = useActiveDA((s) => s.setSession);
  const prependToDASessions = useDASessions((s) => s.prependToDASessions);
  const tz = useTimezone((s) => s.timeZone);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    showLoadingToast: false,
    showSuccessToast: false,
  });
  const router = useRouter();

  // States
  const docReqs = daService?.documentRequirements;
  const buildFileSchema = (
    docs?: Interface__DAServiceDocumentRequirement[],
  ) => {
    if (docs === undefined) return yup.object().shape({});

    const shape: Record<number, any> = {};

    docs.forEach((doc) => {
      let schema = fileValidation({
        allowedExtensions: ["pdf"],
        maxFileSizeMB: 100,
        min: doc.isMandatory ? 1 : 0,
      });

      if (doc.isMandatory) {
        schema = schema.required(l.msg_required_form);
      }

      shape[doc.id] = schema;
    });

    return yup.object().shape({
      files: yup.object().shape(shape),
    });
  };
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      files: {} as Record<number, File[]>,
    },
    validationSchema: buildFileSchema(docReqs),
    onSubmit: (values) => {
      const payload = new FormData();

      const now = new Date();
      const iso = now.toISOString();
      const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

      payload.append(
        "title",
        `${daService?.title?.[lang]} - ${formatDate(
          makeUTCISODateTime(iso, time),
          {
            variant: "numeric",
            withTime: true,
          },
        )} ${tz.formattedOffset}`,
      );
      payload.append("serviceId", `${daService?.id}`);
      Object.entries(values.files).forEach(([docId, files]) => {
        if (files?.[0]) {
          payload.append(`files[${docId}]`, files[0]);
        }
      });

      const config = {
        url: DA_API_SESSON_CREATE,
        method: "POST",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: (r) => {
            const daSession = r.data.data;
            prependToDASessions(daSession);
            setSession(daSession);
            router.push(`/da/${daSession.id}`);
          },
          onError: () => {},
        },
      });
    },
  });
  const totalFiles = docReqs?.length;
  const totalUploadedFiles = Object.keys(formik.values.files).length;
  const minChildWidth = "240px";

  if (isEmptyArray(docReqs)) return <FeedbackNoData />;

  return (
    <CContainer gap={4} {...restProps}>
      <form id={ID} onSubmit={formik.handleSubmit}>
        <FieldsetRoot disabled={loading}>
          <SimpleGrid
            templateColumns={`repeat(auto-fill, minmax(${minChildWidth}, 1fr))`}
            gap={4}
          >
            {docReqs?.map((doc) => {
              return (
                <Field
                  key={doc.id}
                  label={doc.name}
                  flex={"1 1 240px"}
                  invalid={!!formik.errors.files?.[doc.id]}
                  errorText={formik.errors.files?.[doc.id] as string}
                  optional={!doc.isMandatory}
                >
                  <FileInput
                    dropzone
                    inputValue={formik.values.files?.[doc.id]}
                    onChange={(value) => {
                      formik.setFieldValue(`files.${doc.id}`, value);
                    }}
                    bg={"bg.subtle"}
                    maxFileSizeMB={100}
                  />
                </Field>
              );
            })}
          </SimpleGrid>
        </FieldsetRoot>
      </form>

      <CContainer gap={4}>
        <Btn
          type="submit"
          form={ID}
          // w={"124px"}
          w={"full"}
          size={"xl"}
          colorPalette={themeConfig.colorPalette}
          loading={loading}
          disabled={docReqs
            ?.filter((doc) => doc.isMandatory)
            .some(
              (doc) =>
                !formik.values.files?.[doc.id] ||
                formik.values.files[doc.id].length === 0,
            )}
        >
          {l.analysis} {`${totalUploadedFiles}/${totalFiles} file(s)`}
        </Btn>
      </CContainer>
    </CContainer>
  );
};

export default function Page() {
  // Contexts
  const { l, lang } = useLang();
  const setBreadcrumbs = useBreadcrumbs((s) => s.setBreadcrumbs);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { daServiceId } = useParams();

  // States
  const { initialLoading, error, data, onRetry } =
    useDataState<Interface__DAServiceDetail>({
      initialData: undefined,
      url: `${DA_API_SERVICE_DETAIL}/${daServiceId}`,
      dataResource: false,
    });

  useEffect(() => {
    // setActiveDA({
    //   session: data,
    // });
    setBreadcrumbs({
      backPath: `/new-da`,
      activeNavs: [
        {
          labelKey: "navs.new_document_analysis",
          path: `/new-da`,
        },
        {
          label: data?.title?.[lang] as string,
          path: `/new-da/${data?.id}`,
        },
      ],
    });
  }, [data]);

  const render = {
    loading: (
      <>
        <VStack gap={1}>
          <Skeleton maxW={"350px"} minH={"30px"} />
          <Skeleton minH={"21px"} />
        </VStack>

        <Skeleton minH={"370px"} />
      </>
    ),
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <CContainer gap={8}>
        <CContainer gap={1}>
          <P fontSize={"3xl"} fontWeight={"semibold"}>
            {data?.title?.[lang]}
          </P>
          <P fontSize={"lg"} color={"fg.subtle"}>
            {data?.description?.[lang]}
          </P>
        </CContainer>

        <InputForm daService={data} />
      </CContainer>
    ),
  };

  return (
    <PageContainer p={8}>
      <ContainerLayout ref={containerRef} flex={1}>
        <CContainer flex={1} gap={8} justify={"center"}>
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

          <HelperText>{l.msg_da_disclaimer}</HelperText>
        </CContainer>
      </ContainerLayout>
    </PageContainer>
  );
}
