"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "@/components/ui/tooltip";
import BrandWatermark from "@/components/widget/BrandWatermark";
import { AppIcon } from "@/components/widget/AppIcon";
import { PageContainer } from "@/components/widget/Page";
import { APP } from "@/constants/_meta";
import { CHAT_API_CREATE } from "@/constants/apis";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useRequest from "@/hooks/useRequest";
import { interpolateString, pluckString } from "@/utils/string";
import { FieldsetRoot, Group, HStack, VStack } from "@chakra-ui/react";
import { useFormik } from "formik";
import { ArrowUpIcon, PaperclipIcon } from "lucide-react";
import * as yup from "yup";
import { useState } from "react";

const Additional = () => {
  // States
  const [addition, setAddition] = useState<string[]>([]);
  const isActive = (value: string) => addition.includes(value);

  // Utils
  function toggleAddition(addition: string) {
    if (isActive(addition)) {
      setAddition((prev) => prev.filter((item) => item !== addition));
    } else {
      setAddition((prev) => [...prev, addition]);
    }
  }

  return (
    <Group>
      <Btn
        variant={isActive("law") ? "subtle" : "outline"}
        borderColor={"d2"}
        onClick={() => {
          toggleAddition("law");
        }}
      >
        Law
      </Btn>
      <Btn
        variant={isActive("pajak") ? "subtle" : "outline"}
        borderColor={"d2"}
        onClick={() => {
          toggleAddition("pajak");
        }}
      >
        Pajak
      </Btn>
      <Btn
        variant={isActive("perizinan") ? "subtle" : "outline"}
        borderColor={"d2"}
        onClick={() => {
          toggleAddition("perizinan");
        }}
      >
        Perizinan
      </Btn>
    </Group>
  );
};
const ChatForm = () => {
  // Hooks
  const { req, loading } = useRequest({
    id: CHAT_API_CREATE,
  });

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: { msg: "" },
    validationSchema: yup
      .object()
      .shape({ msg: yup.string().required(l.msg_required_form) }),
    onSubmit: (values) => {
      console.debug({ msg: values });

      const payload = {
        msg: values.msg,
      };

      const config = {
        url: CHAT_API_CREATE,
        method: "POST",
        data: payload,
      };

      req({
        config,
      });
    },
  });

  return (
    <form id="chat_form" onSubmit={formik.handleSubmit}>
      <FieldsetRoot>
        <CContainer
          maxW={"500px"}
          p={3}
          bg={"bg.muted"}
          rounded={themeConfig.radii.container}
          mx={"auto"}
        >
          <Textarea
            inputValue={formik.values.msg}
            onChange={(inputValue) => {
              formik.setFieldValue("msg", inputValue);
            }}
            p={0}
            px={"1 !important"}
            border={"none"}
            placeholder={l.ask_land_ai}
            mb={4}
            onKeyUp={(e) => {
              if (e.ctrlKey && e.key === "Enter") {
                formik.handleSubmit();
              }
            }}
          />

          <HStack justify={"space-between"}>
            <Additional />

            <Group>
              <Tooltip content={l.upload_file}>
                <Btn
                  iconButton
                  colorPalette={themeConfig.colorPalette}
                  variant={"ghost"}
                  disabled
                >
                  <AppIcon icon={PaperclipIcon} />
                </Btn>
              </Tooltip>

              <Tooltip content={l.submit}>
                <Btn
                  iconButton
                  colorPalette={themeConfig.colorPalette}
                  loading={loading}
                  disabled={!formik.values.msg}
                >
                  <AppIcon icon={ArrowUpIcon} />
                </Btn>
              </Tooltip>
            </Group>
          </HStack>
        </CContainer>
      </FieldsetRoot>
    </form>
  );
};

export default function Page() {
  // Contexts
  const { l } = useLang();

  // States
  const variantNumber = Math.floor(Math.random() * 16) + 1;
  // const user = getUserData();

  return (
    <PageContainer p={4}>
      <VStack flex={1} gap={1} justify={"center"} align={"stretch"}>
        <VStack my={"auto"} align={"stretch"}>
          <P
            fontSize={"lg"}
            fontWeight={"medium"}
            textAlign={"center"}
            color={"fg.subtle"}
          >
            {interpolateString(pluckString(l, `msg_welcome_to_the_app`), {
              appName: APP.name,
            })}
          </P>

          <P
            fontSize={"xl"}
            fontWeight={"medium"}
            color={"ibody"}
            textAlign={"center"}
            mb={4}
          >
            {pluckString(l, `msg_welcome_${variantNumber}`)}
          </P>

          <ChatForm />
        </VStack>

        <VStack>
          <BrandWatermark />
        </VStack>
      </VStack>
    </PageContainer>
  );
}
