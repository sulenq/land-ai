"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import { HelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIcon } from "@/components/widget/AppIcon";
import BackButton from "@/components/widget/BackButton";
import { APP } from "@/constants/_meta";
import { CHAT_API_CHAT_AI } from "@/constants/apis";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useRequest from "@/hooks/useRequest";
import { disclosureId } from "@/utils/disclosure";
import { interpolateString, pluckString } from "@/utils/string";
import {
  FieldsetRoot,
  Group,
  HStack,
  StackProps,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { ArrowUpIcon, PaperclipIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import * as yup from "yup";

export const AdditionalPrompt = () => {
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

export const PromptInputForm = () => {
  const ID = "prompt_composer";
  const MAX_CHAR = 8000;

  // Hooks
  const { sessionId } = useParams();
  const { req, loading } = useRequest({
    id: ID,
  });

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const router = useRouter();

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: { prompt: "" },
    validationSchema: yup
      .object()
      .shape({ prompt: yup.string().required(l.msg_required_form) }),
    onSubmit: (values) => {
      const payload = {
        sessionId: sessionId,
        prompt: values.prompt,
      };

      const config = {
        url: CHAT_API_CHAT_AI,
        method: "POST",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: (r) => {
            const sessionId = r?.data?.data?.id;
            router.push(`/c/${sessionId}`);
          },
        },
      });
    },
  });
  const isExceedCharLimit = formik.values.prompt.length > MAX_CHAR;
  const isEmpty = !formik.values.prompt;

  return (
    <form id={ID} onSubmit={formik.handleSubmit}>
      <FieldsetRoot>
        <CContainer
          maxW={"600px"}
          p={3}
          bg={"bg.muted"}
          rounded={themeConfig.radii.container}
          mx={"auto"}
        >
          <Textarea
            inputValue={formik.values.prompt}
            onChange={(inputValue) => {
              formik.setFieldValue("prompt", inputValue);
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
            maxChar={MAX_CHAR}
          />

          <HStack wrap={"wrap"} justify={"space-between"}>
            <HelperText
              ml={1}
              mb={-4}
              fontVariantNumeric={"tabular-nums"}
              color={
                formik.values.prompt.length > MAX_CHAR
                  ? "fg.error"
                  : "fg.subtle"
              }
            >{`${formik.values.prompt.length}/${MAX_CHAR}`}</HelperText>

            <Group>
              <Tooltip content={l.upload_file}>
                <Btn iconButton variant={"ghost"} disabled>
                  <AppIcon icon={PaperclipIcon} />
                </Btn>
              </Tooltip>

              <Tooltip
                content={
                  isEmpty
                    ? l.empty_prompt
                    : isExceedCharLimit
                      ? l.exceed_char_limit
                      : l.submit
                }
              >
                <Btn
                  type="submit"
                  form={ID}
                  iconButton
                  colorPalette={themeConfig.colorPalette}
                  loading={loading}
                  disabled={!formik.values.prompt || isExceedCharLimit}
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

export const PromptComposer = (props: StackProps) => {
  // Contexts
  const { l } = useLang();

  return (
    <VStack flex={1} gap={1} justify={"center"} align={"stretch"} {...props}>
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
          {l.msg_welcome_context}
        </P>

        <PromptInputForm />

        <HelperText textAlign={"center"} maxW={"500px"} mx={"auto"} mt={4}>
          {l.msg_discliamer}
        </HelperText>
      </VStack>
    </VStack>
  );
};

export const PromptComposerDisclosureTrigger = (props: any) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(disclosureId(`search_your_chats`), open, onOpen, onClose);

  return (
    <>
      <CContainer w={"fit"} onClick={onOpen} {...restProps}></CContainer>

      <DisclosureRoot open={open} lazyLoad size={"xl"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`${l.your_chats}`} />
          </DisclosureHeader>

          <DisclosureBody>
            <PromptComposer my={12} />
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
