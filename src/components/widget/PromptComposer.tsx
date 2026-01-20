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
import { CHAT_API_CHAT_AI_STREAM } from "@/constants/apis";
import { Props__PromptInput } from "@/constants/props";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useRequest from "@/hooks/useRequest";
import { disclosureId } from "@/utils/disclosure";
import { interpolateString, pluckString } from "@/utils/string";
import {
  Group,
  HStack,
  StackProps,
  TextProps,
  useDisclosure,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { ArrowUpIcon, PaperclipIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as yup from "yup";

// Unused but exported for consistency
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

export const PromptInput = (props: Props__PromptInput) => {
  const MAX_CHAR = 8000;

  // Props
  const {
    inputValue = "",
    onChange,
    onSubmit,
    loading = false,
    maxChar = MAX_CHAR,
    ...restProps
  } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const inputLength = inputValue?.length;
  const isExceedCharLimit = inputLength > maxChar;
  const isEmpty = !inputValue;

  return (
    <CContainer
      p={3}
      bg={"bg.muted"}
      rounded={themeConfig.radii.container}
      mx={"auto"}
      {...restProps}
    >
      <Textarea
        inputValue={inputValue}
        onChange={(inputValue) => {
          onChange?.(inputValue);
        }}
        p={0}
        px={"1 !important"}
        border={"none"}
        placeholder={l.ask_land_ai}
        mb={4}
        onKeyUp={(e) => {
          if (e.ctrlKey && e.key === "Enter") {
            onSubmit?.();
          }
        }}
        maxChar={maxChar}
      />

      <HStack wrap={"wrap"} justify={"space-between"}>
        <HelperText
          ml={1}
          mb={-4}
          fontVariantNumeric={"tabular-nums"}
          color={inputLength > maxChar ? "fg.error" : "fg.subtle"}
        >{`${inputLength}/${maxChar}`}</HelperText>

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
              iconButton
              colorPalette={themeConfig.colorPalette}
              loading={loading}
              disabled={!inputValue || isExceedCharLimit}
              onClick={() => {
                onSubmit?.();
              }}
            >
              <AppIcon icon={ArrowUpIcon} />
            </Btn>
          </Tooltip>
        </Group>
      </HStack>
    </CContainer>
  );
};

export const PromptHelperText = (props: TextProps) => {
  // Contexts
  const { l } = useLang();

  return (
    <HelperText textAlign={"center"} mx={"auto"} {...props}>
      {l.msg_discliamer}
    </HelperText>
  );
};

export const NewPrompt = (props: StackProps) => {
  const ID = "prompt_composer";

  // Contexts
  const { l } = useLang();
  const router = useRouter();

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    showLoadingToast: false,
    showSuccessToast: false,
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: { prompt: "" },
    validationSchema: yup
      .object()
      .shape({ prompt: yup.string().required(l.msg_required_form) }),
    onSubmit: (values) => {
      const payload = {
        prompt: values.prompt,
      };

      const config = {
        url: CHAT_API_CHAT_AI_STREAM,
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

  return (
    <CContainer {...props}>
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

      <PromptInput
        inputValue={formik.values.prompt}
        onChange={(inputValue) => {
          formik.setFieldValue("prompt", inputValue);
        }}
        onSubmit={() => {
          formik.handleSubmit();
        }}
        loading={loading}
      />

      <PromptHelperText mt={4} />
    </CContainer>
  );
};

export const NewPromptDisclosureTrigger = (props: StackProps) => {
  // Contexts
  const { l } = useLang();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(disclosureId(`search_your_chats`), open, onOpen, onClose);

  return (
    <>
      <CContainer w={"fit"} onClick={onOpen} {...props}></CContainer>

      <DisclosureRoot open={open} lazyLoad size={"xl"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`${l.your_chats}`} />
          </DisclosureHeader>

          <DisclosureBody>
            <NewPrompt my={12} />
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
