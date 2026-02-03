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
import {
  DA_API_SERVICE_CREATE_SESSION,
  DA_API_SERVICE_DETAIL,
} from "@/constants/apis";
import { Interface__DAServiceDetail } from "@/constants/interfaces";
import { useActiveDA } from "@/context/useActiveDA";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import useDataState from "@/hooks/useDataState";
import useRequest from "@/hooks/useRequest";
import { formatDate } from "@/utils/formatter";
import { getGridColumns } from "@/utils/style";
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
  const { daService, cols, ...restProps } = props;

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
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      coverLetter: [],
      certificate: [],
      auctionSchedule: [],
      powerOfAttonery: [],
    },
    validationSchema: yup.object().shape({
      coverLetter: fileValidation({
        allowedExtensions: ["pdf"],
        maxSizeMB: 10,
        min: 1,
      }).required(l.msg_required_form),
      // certificate: fileValidation({
      //   allowedExtensions: ["pdf"],
      //   maxSizeMB: 10,
      //   min: 1,
      // }).required(l.msg_required_form),
      // auctionSchedule: fileValidation({
      //   allowedExtensions: ["pdf"],
      //   maxSizeMB: 10,
      // }),
      // powerOfAttonery: fileValidation({
      //   allowedExtensions: ["pdf"],
      //   maxSizeMB: 10,
      // }),
    }),
    onSubmit: (values) => {
      setActiveDA({
        daDocs: values,
      });
      const payload = new FormData();

      payload.append(
        "title",
        `${daService?.title[lang]} - ${formatDate(new Date(), {
          variant: "dayShortMonthYear",
        })}`,
      );
      payload.append("serviceId", `${daService?.id}`);

      // payload.append("coverLetter", values.coverLetter[0]);
      // payload.append("certificate", values.certificate[0]);
      // payload.append("auctionSchedule", values.auctionSchedule[0]);
      // payload.append("powerOfAttonery", values.powerOfAttonery[0]);

      // Demo payload
      // payload.append("file", values.coverLetter[0]);

      const config = {
        url: DA_API_SERVICE_CREATE_SESSION,
        method: "POST",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: (r) => {
            const daSession = r.data.data;
            setActiveDA({
              daSession: daSession,
            });
            router.push(`/da/${daService?.id}/${daSession.id}`);
          },
          onError: () => {},
        },
      });
    },
  });
  const totalFiles = Object.keys(formik.values).length;
  const totalUploadedFiles = Object.values(formik.values).reduce(
    (count, files) => count + (files.length > 0 ? 1 : 0),
    0,
  );

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
          <SimpleGrid columns={cols} gap={2}>
            <Field
              label={l.cover_letter}
              flex={"1 1 200px"}
              invalid={!!formik.errors.coverLetter}
              errorText={formik.errors.coverLetter as string}
            >
              <FileInput
                dropzone
                inputValue={formik.values.coverLetter}
                onChange={(inputValue) => {
                  formik.setFieldValue("coverLetter", inputValue);
                }}
                bg={"bg.subtle"}
              />
            </Field>

            <Field
              label={l.certificate}
              flex={"1 1 200px"}
              invalid={!!formik.errors.certificate}
              errorText={formik.errors.certificate as string}
            >
              <FileInput
                dropzone
                inputValue={formik.values.certificate}
                onChange={(inputValue) => {
                  formik.setFieldValue("certificate", inputValue);
                }}
              />
            </Field>

            <Field
              label={l.auction_schedule}
              flex={"1 1 200px"}
              optional
              invalid={!!formik.errors.auctionSchedule}
              errorText={formik.errors.auctionSchedule as string}
            >
              <FileInput
                dropzone
                inputValue={formik.values.auctionSchedule}
                onChange={(inputValue) => {
                  formik.setFieldValue("auctionSchedule", inputValue);
                }}
              />
            </Field>

            <Field
              label={l.power_of_attorney}
              flex={"1 1 200px"}
              optional
              invalid={!!formik.errors.powerOfAttonery}
              errorText={formik.errors.powerOfAttonery as string}
            >
              <FileInput
                dropzone
                inputValue={formik.values.powerOfAttonery}
                onChange={(inputValue) => {
                  formik.setFieldValue("powerOfAttonery", inputValue);
                }}
              />
            </Field>
          </SimpleGrid>
        </FieldsetRoot>
      </form>

      <CContainer align={"center"} gap={4}>
        <P
          color={"fg.subtle"}
        >{`${totalUploadedFiles}/${totalFiles} file(s)`}</P>

        <Btn type="submit" form={ID} loading={loading} w={"150px"} size={"lg"}>
          {l.analyze}
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
  const setActiveDA = useActiveDA((s) => s.setActiveDA);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const containerDimension = useContainerDimension(containerRef);
  const { daServiceId } = useParams();

  // States
  const { error, initialLoading, data, onRetry } =
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
            {data?.title[lang]}
          </P>
          <P color={"fg.subtle"} textAlign={"center"}>
            {data?.description[lang]}
          </P>
        </VStack>

        {cols > 1 && <InputForm daService={data} cols={cols} />}
      </>
    ),
  };

  useEffect(() => {
    setActiveDA({
      daService: data,
    });
  }, [data]);

  return (
    <PageContainer className={"scrollY"} p={4}>
      <ContainerLayout ref={containerRef}>
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
