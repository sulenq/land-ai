"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Field, FieldsetRoot } from "@/components/ui/field";
import { FileInput } from "@/components/ui/file-input";
import { P } from "@/components/ui/p";
import { Skeleton } from "@/components/ui/skeleton";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { PageContainer, PageTitle } from "@/components/widget/Page";
import { DA_API_SERVICE1 } from "@/constants/apis";
import useLang from "@/context/useLang";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import useRequest from "@/hooks/useRequest";
import { isEmptyArray } from "@/utils/array";
import { getGridColumns } from "@/utils/style";
import { fileValidation } from "@/utils/validationSchema";
import { SimpleGrid } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import * as yup from "yup";

interface Props__Result {
  result: any;
  loading: boolean;
  onRetry: () => void;
}
const Result = (props: Props__Result) => {
  // Props
  const { loading, onRetry, result, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  // const { themeConfig } = useThemeConfig();

  // States
  const error = result === "error";
  const render = {
    loading: <Skeleton minH={"350px"} />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: (
      <FeedbackNoData
        title={l.alert_no_result_yet.title}
        description={l.alert_no_result_yet.description}
      />
    ),
    loaded: <>Loaded</>,
  };

  // console.debug({ result });

  return (
    <CContainer
      gap={4}
      pt={4}
      // rounded={themeConfig.radii.container}
      borderTop={"1px solid"}
      borderColor={"border.muted"}
      {...restProps}
    >
      <P fontWeight={"medium"}>{l.result}</P>

      {loading && render.loading}
      {!loading && (
        <>
          {error && render.error}
          {!error && (
            <>
              {result && render.loaded}
              {(!result || isEmptyArray(result)) && render.empty}
            </>
          )}
        </>
      )}
    </CContainer>
  );
};

export default function Page() {
  const ID = "da_service1";
  const GRID_COLS_BREAKPOINTS = {
    0: 1,
    350: 2,
    720: 4,
  };

  // Contexts
  const { l } = useLang();
  // const { themeConfig } = useThemeConfig();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
  });
  const containerDimension = useContainerDimension(containerRef);

  // States
  const [result, setResult] = useState<any>(null);
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
      certificate: fileValidation({
        allowedExtensions: ["pdf"],
        maxSizeMB: 10,
        min: 1,
      }).required(l.msg_required_form),
      auctionSchedule: fileValidation({
        allowedExtensions: ["pdf"],
        maxSizeMB: 10,
      }),
      powerOfAttonery: fileValidation({
        allowedExtensions: ["pdf"],
        maxSizeMB: 10,
      }),
    }),
    onSubmit: (values) => {
      const payload = new FormData();

      payload.append("coverLetter", values.coverLetter[0]);
      payload.append("certificate", values.certificate[0]);
      payload.append("auctionSchedule", values.auctionSchedule[0]);
      payload.append("powerOfAttonery", values.powerOfAttonery[0]);

      // Demo payload
      payload.append("file", values.coverLetter[0]);

      const config = {
        url: DA_API_SERVICE1,
        method: "POST",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: (r) => {
            const result = r.data?.data?.result;

            setResult(result);
          },
          onError: () => {
            setResult("error");
          },
        },
      });
    },
  });
  const cols = getGridColumns(containerDimension.width, GRID_COLS_BREAKPOINTS);

  return (
    <PageContainer ref={containerRef} className={"scrollY"} gap={4} p={4}>
      <CContainer>
        <PageTitle p={0} m={0} />
        <P color={"fg.subtle"}>{l.service_1_description}</P>
      </CContainer>

      {containerDimension.width > 0 ? (
        <CContainer
          gap={4}
          // p={4}
          pt={4}
          // bg={"bg.subtle"}
          // rounded={themeConfig.radii.container}
          borderTop={"1px solid"}
          borderColor={"border.muted"}
        >
          <form id={ID} onSubmit={formik.handleSubmit}>
            <FieldsetRoot disabled={loading}>
              <SimpleGrid columns={cols} gap={4}>
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

          <Btn type="submit" form={ID} loading={loading} w={"fit"} ml={"auto"}>
            {l.analyze}
          </Btn>
        </CContainer>
      ) : (
        <Skeleton minH={"350px"} />
      )}

      <Result loading={loading} onRetry={formik.handleSubmit} result={result} />
    </PageContainer>
  );
}
