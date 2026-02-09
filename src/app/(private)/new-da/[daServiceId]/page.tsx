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
import { ContainerLayout, PageContainer } from "@/components/widget/Page";
import { DA_API_SERVICE_DETAIL, DA_API_SESSON_CREATE } from "@/constants/apis";
import {
  Interface__DAServiceDetail,
  Interface__DAServiceDocumentRequirement,
} from "@/constants/interfaces";
import { useActiveDA } from "@/context/useActiveDA";
import { useBreadcrumbs } from "@/context/useBreadcrumbs";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import useDataState from "@/hooks/useDataState";
import useRequest from "@/hooks/useRequest";
import { isEmptyArray } from "@/utils/array";
import { formatDate } from "@/utils/formatter";
import { getGridColumns } from "@/utils/style";
import { fileValidation } from "@/utils/validationSchema";
import { HStack, StackProps, VStack } from "@chakra-ui/react";
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
  const setActiveDA = useActiveDA((s) => s.setActiveDA);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
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
        maxSizeMB: 100,
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
      // setActiveDA({
      //   daDocs: values.files,
      // });
      const payload = new FormData();

      payload.append(
        "title",
        `${daService?.title?.[lang]} - ${formatDate(new Date(), {
          variant: "numeric",
          withTime: true,
        })}`,
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
            setActiveDA({
              session: daSession,
            });
            router.push(`/da/${daSession.id}`);
          },
          onError: () => {},
        },
      });
    },
  });

  const totalFiles = docReqs?.length;
  const totalUploadedFiles = Object.keys(formik.values.files).length;

  if (isEmptyArray(docReqs)) return <FeedbackNoData />;

  return (
    <CContainer
      gap={4}
      // p={4}
      // border={"1px solid"}
      borderColor={"border.muted"}
      rounded={themeConfig.radii.container}
      my={"auto"}
      {...restProps}
    >
      <form id={ID} onSubmit={formik.handleSubmit}>
        <FieldsetRoot disabled={loading}>
          <HStack wrap={"wrap"} gap={4} align={"end"} justify={"center"}>
            {docReqs?.map((doc) => {
              return (
                <Field
                  key={doc.id}
                  label={doc.name}
                  flex={"1 1 200px"}
                  invalid={!!formik.errors.files?.[doc.id]}
                  errorText={formik.errors.files?.[doc.id] as string}
                  optional={!doc.isMandatory}
                  maxW={"220px"}
                >
                  <FileInput
                    dropzone
                    inputValue={formik.values.files?.[doc.id]}
                    onChange={(value) => {
                      formik.setFieldValue(`files.${doc.id}`, value);
                    }}
                    bg={"bg.subtle"}
                    maxFileSize={100}
                  />
                </Field>
              );
            })}
          </HStack>
        </FieldsetRoot>
      </form>

      <CContainer align={"center"} gap={4}>
        <P
          color={"fg.subtle"}
        >{`${totalUploadedFiles}/${totalFiles} file(s)`}</P>

        <Btn
          type="submit"
          form={ID}
          loading={loading}
          w={"124px"}
          size={"md"}
          disabled={docReqs
            ?.filter((doc) => doc.isMandatory)
            .some(
              (doc) =>
                !formik.values.files?.[doc.id] ||
                formik.values.files[doc.id].length === 0,
            )}
        >
          {l.analysis}
        </Btn>
      </CContainer>
    </CContainer>
  );
};

export default function Page() {
  const GRID_COLS_BREAKPOINTS = {
    0: 1,
    350: 2,
    720: 4,
  };

  // Contexts
  const { l, lang } = useLang();
  const setBreadcrumbs = useBreadcrumbs((s) => s.setBreadcrumbs);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const containerDimension = useContainerDimension(containerRef);
  const { daServiceId } = useParams();

  // States
  const { initialLoading, error, data, onRetry } =
    useDataState<Interface__DAServiceDetail>({
      initialData: undefined,
      url: `${DA_API_SERVICE_DETAIL}/${daServiceId}`,
      dataResource: false,
    });
  const cols = getGridColumns(containerDimension.width, GRID_COLS_BREAKPOINTS);

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
      <>
        <VStack gap={1}>
          <P fontSize={"xl"} fontWeight={"semibold"} textAlign={"center"}>
            {data?.title?.[lang]}
          </P>
          <P color={"fg.subtle"} textAlign={"center"}>
            {data?.description?.[lang]}
          </P>
        </VStack>

        {cols > 1 && <InputForm daService={data} cols={cols} />}
      </>
    ),
  };

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

  return (
    <PageContainer p={4}>
      <ContainerLayout ref={containerRef}>
        <CContainer flex={1} gap={8} justify={"space-between"}>
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
