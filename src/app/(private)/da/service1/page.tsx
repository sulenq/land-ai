"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Field, FieldsetRoot } from "@/components/ui/field";
import { FileInput } from "@/components/ui/file-input";
import { HelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import { Skeleton } from "@/components/ui/skeleton";
import { ContainerLayout, PageContainer } from "@/components/widget/Page";
import { DA_API_SERVICE1 } from "@/constants/apis";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import useRequest from "@/hooks/useRequest";
import { getGridColumns } from "@/utils/style";
import { fileValidation } from "@/utils/validationSchema";
import { HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRef } from "react";
import * as yup from "yup";

export default function Page() {
  const ID = "da_service1";
  const GRID_COLS_BREAKPOINTS = {
    0: 1,
    350: 2,
    720: 4,
  };

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
  });
  const containerDimension = useContainerDimension(containerRef);

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
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }

      const payload = new FormData();

      // payload.append("coverLetter", values.coverLetter[0]);
      // payload.append("certificate", values.certificate[0]);
      // payload.append("auctionSchedule", values.auctionSchedule[0]);
      // payload.append("powerOfAttonery", values.powerOfAttonery[0]);

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
          onSuccess: (r) => {},
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

  // SX
  const cols = getGridColumns(containerDimension.width, GRID_COLS_BREAKPOINTS);

  return (
    <PageContainer className={"scrollY"} p={4}>
      <ContainerLayout ref={containerRef}>
        <CContainer gap={4} my={"auto"}>
          <VStack gap={1}>
            <P fontSize={"xl"} fontWeight={"semibold"} textAlign={"center"}>
              {l.navs.da_service_1}
            </P>
            <P color={"fg.subtle"}>{l.service_1_description}</P>
          </VStack>

          {containerDimension.width > 0 ? (
            <CContainer
              gap={4}
              p={4}
              rounded={themeConfig.radii.container}
              border={"1px solid"}
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

              <HStack wrap={"wrap"} justify={"space-between"}>
                <P
                  color={"fg.subtle"}
                  ml={2}
                >{`${totalUploadedFiles}/${totalFiles} file(s)`}</P>

                <Btn type="submit" form={ID} loading={loading}>
                  {l.analyze}
                </Btn>
              </HStack>
            </CContainer>
          ) : (
            <Skeleton minH={"370px"} />
          )}

          <HelperText textAlign={"center"}>{l.msg_da_disclaimer}</HelperText>
        </CContainer>
      </ContainerLayout>
    </PageContainer>
  );
}
