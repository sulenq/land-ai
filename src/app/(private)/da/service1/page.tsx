"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Field, FieldsetRoot } from "@/components/ui/field";
import { FileInput } from "@/components/ui/file-input";
import { P } from "@/components/ui/p";
import { PageContainer, PageTitle } from "@/components/widget/Page";
import { DA_API_SERVICE1 } from "@/constants/apis";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useRequest from "@/hooks/useRequest";
import { fileValidation } from "@/utils/validationSchema";
import { HStack } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";

export default function Page() {
  const ID = "da_service1";

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
  });

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
      }).required(l.msg_required_form),
      certificate: fileValidation({
        allowedExtensions: ["pdf"],
        maxSizeMB: 10,
      }),
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

            console.debug(result);
          },
        },
      });
    },
  });

  return (
    <PageContainer className="scrollY" p={4}>
      <PageTitle p={0} m={0} />
      <P color={"fg.subtle"} mb={4}>
        {l.service_1_description}
      </P>

      <CContainer
        gap={4}
        p={4}
        // bg={"bg.subtle"}
        rounded={themeConfig.radii.container}
        border={"1px solid"}
        borderColor={"border.muted"}
        mb={8}
      >
        <form id={ID} onSubmit={formik.handleSubmit}>
          <FieldsetRoot>
            <HStack wrap={"wrap"} gap={4}>
              <Field label={l.cover_letter} flex={"1 1 200px"}>
                <FileInput
                  dropzone
                  inputValue={formik.values.certificate}
                  onChange={(inputValue) => {
                    formik.setFieldValue("certificate", inputValue);
                  }}
                  bg={"bg.subtle"}
                />
              </Field>

              <Field label={l.certificate} flex={"1 1 200px"} optional>
                <FileInput dropzone disabled />
              </Field>

              <Field label={l.auction_schedule} flex={"1 1 200px"} optional>
                <FileInput dropzone disabled />
              </Field>

              <Field label={l.power_of_attorney} flex={"1 1 200px"} optional>
                <FileInput dropzone disabled />
              </Field>
            </HStack>
          </FieldsetRoot>
        </form>

        <Btn type="submit" form={ID} loading={loading} w={"fit"} ml={"auto"}>
          {l.analyze}
        </Btn>
      </CContainer>

      <CContainer minH={"100px"}>
        <P fontSize={"xl"}>{l.result}</P>
      </CContainer>
    </PageContainer>
  );
}
