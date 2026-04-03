"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Field, FieldsetRoot } from "@/components/ui/field";
import { P } from "@/components/ui/p";
import { StringInput } from "@/components/ui/string-input";
import {
  ConstrainedContainer,
  PageContainer,
} from "@/components/widget/PageShell";
import { TRIAL_STEPS } from "@/components/widget/trial-stepper";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useTrialSessionContext } from "@/context/useTrialSessionContext";
import useRequest from "@/hooks/useRequest";
import { Alert, HStack } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as yup from "yup";

export default function Page() {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setTrialSession = useTrialSessionContext((s) => s.setTrialSession);

  // Hooks
  const router = useRouter();
  const { req, loading } = useRequest({
    id: "create-trial-session",
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: { name: "" },
    validationSchema: yup
      .object()
      .shape({ name: yup.string().required(l.msg_required_form) }),
    onSubmit: (values) => {
      const payload = values;

      const config = {
        url: "/api/trial/create",
        method: "POST",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: (r) => {
            setTrialSession(r.data);
            router.push("/service-trial/select-da-service");
          },
          onError: () => {},
        },
      });
    },
  });

  return (
    <PageContainer p={8} pb={16}>
      <ConstrainedContainer flex={1} justify={"center"} gap={8}>
        {/* Tutorial */}
        <CContainer gap={8}>
          <CContainer gap={2}>
            <P fontSize={"2xl"} fontWeight={"semibold"}>
              {l.navs.service_trial}
            </P>

            <P color={"fg.muted"}>
              Setiap peserta mengerjakan 1 kategori secara Manual lalu
              AI-Assisted untuk membandingkan kecepatan pemeriksaan.
            </P>
          </CContainer>

          <Alert.Root status={"warning"}>
            <Alert.Content gap={4}>
              <HStack>
                <Alert.Indicator />

                <P fontWeight={"semibold"}>Langkah - Langkah Pengujian</P>
              </HStack>

              <CContainer gap={4} px={1}>
                {TRIAL_STEPS.map((step, index) => {
                  const no = index + 1;

                  return (
                    <HStack align={"start"}>
                      <P flexShrink={0}>{no}.</P>

                      <CContainer gap={1}>
                        <P fontWeight={"medium"}>{step.title}</P>
                        <P>{step.description}</P>
                      </CContainer>
                    </HStack>
                  );
                })}
              </CContainer>
            </Alert.Content>
          </Alert.Root>
        </CContainer>

        <form>
          <FieldsetRoot disabled={loading}>
            <Field
              label={"Nama"}
              invalid={!!formik.errors.name}
              errorText={formik.errors.name as string}
              helperText={
                'Input nama anda kemudian klik "Mulai Pengujian" untuk memulai ujian'
              }
            >
              <StringInput />
            </Field>
          </FieldsetRoot>
        </form>

        <Btn colorPalette={themeConfig.colorPalette} loading={loading}>
          Mulai Pengujian
        </Btn>
      </ConstrainedContainer>
    </PageContainer>
  );
}
