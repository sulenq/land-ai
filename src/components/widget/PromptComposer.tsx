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
import { Props__PromptInput } from "@/constants/props";
import { useActiveChatSession } from "@/context/useActiveChatSession";
import { useActiveChatSessions } from "@/context/useActiveChatSessions";
import useLang from "@/context/useLang";
import usePromptInput from "@/context/usePromptInput";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import { disclosureId } from "@/utils/disclosure";
import { streamChat } from "@/utils/streamChat";
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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const setStyle = usePromptInput((s) => s.setStyle);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const inputLength = inputValue?.length;
  const isExceedCharLimit = inputLength > maxChar;
  const isEmpty = !inputValue;

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;

    const updateHeight = () => {
      setStyle({ h: `${el.clientHeight}px` });
    };

    updateHeight();

    // Observe changes in size
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, [setStyle]);

  return (
    <CContainer
      ref={containerRef}
      p={3}
      bg={"bg.muted"}
      rounded={themeConfig.radii.container}
      mx={"auto"}
      maxH={"300px"}
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
  // Contexts
  const { l } = useLang();
  const prependActiveChatSession = useActiveChatSessions(
    (s) => s.prependActiveChatSession,
  );
  const resetChat = useActiveChatSession((s) => s.resetChat);
  const initSession = useActiveChatSession((s) => s.initSession);
  const setSession = useActiveChatSession((s) => s.setSession);
  const appendMessage = useActiveChatSession((s) => s.appendMessage);
  const startAssistantStreaming = useActiveChatSession(
    (s) => s.startAssistantStreaming,
  );

  // Hooks
  const router = useRouter();

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: { prompt: "" },
    validationSchema: yup
      .object()
      .shape({ prompt: yup.string().required(l.msg_required_form) }),
    onSubmit: async (values) => {
      const sessionIdPlaceholder = crypto.randomUUID();
      const sessionPlaceholder = {
        id: sessionIdPlaceholder,
        title: l.new_chat,
        createdAt: new Date().toISOString(),
      };

      prependActiveChatSession(sessionPlaceholder);

      resetChat();

      initSession();

      setSession({ ...sessionPlaceholder });

      appendMessage({
        id: crypto.randomUUID(),
        role: "user",
        content: values.prompt,
      });

      startAssistantStreaming();

      router.push(`/c/${sessionIdPlaceholder}`);
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
      />

      <PromptHelperText mt={4} />
    </CContainer>
  );
};

export const ContinuePrompt = (props: StackProps) => {
  // Contexts
  const { l } = useLang();

  // Hooks
  const { sessionId } = useParams();

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: { prompt: "" },
    validationSchema: yup
      .object()
      .shape({ prompt: yup.string().required(l.msg_required_form) }),
    onSubmit: async (values, { resetForm }) => {
      await streamChat({
        sessionId: sessionId as string,
        prompt: values.prompt,
      });

      resetForm();
    },
  });

  return (
    <CContainer gap={4} {...props}>
      <PromptInput
        inputValue={formik.values.prompt}
        onChange={(inputValue) => {
          formik.setFieldValue("prompt", inputValue);
        }}
        onSubmit={() => {
          formik.handleSubmit();
        }}
      />

      <PromptHelperText />
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
