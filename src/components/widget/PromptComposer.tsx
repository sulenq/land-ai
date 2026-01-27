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
import {
  Props__ContinueChat,
  Props__NewChat,
  Props__PromptInput,
} from "@/constants/props";
import { BASE_ICON_BOX_SIZE } from "@/constants/sizes";
import { useActiveChat } from "@/context/useActiveChat";
import useLang from "@/context/useLang";
import useMessageContainer from "@/context/useMessageContainer";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import { startChatStream } from "@/service/chatStream";
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
import { ArrowUpIcon, SquareIcon } from "lucide-react";
import { useParams } from "next/navigation";
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
    disabled,
    abortMode,
    ...restProps
  } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setMessageContainerStyle = useMessageContainer((s) => s.setStyle);
  const finishStreaming = useActiveChat((s) => s.finishStreaming);

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
      setMessageContainerStyle({ pb: `calc(${el.clientHeight}px + 64px)` });
    };

    updateHeight();

    // Observe changes in size
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, [setMessageContainerStyle]);

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
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit?.();
          }
        }}
        maxChar={maxChar}
        disabled={loading || disabled}
      />

      <HStack wrap={"wrap"} justify={"space-between"}>
        <HelperText
          ml={1}
          mb={-4}
          fontVariantNumeric={"tabular-nums"}
          color={inputLength > maxChar ? "fg.error" : "fg.subtle"}
        >{`${inputLength}/${maxChar}`}</HelperText>

        <Group>
          {/* <Tooltip content={l.upload_file}>
            <Btn iconButton variant={"ghost"} disabled>
              <AppIcon icon={PaperclipIcon} />
            </Btn>
          </Tooltip> */}

          <Tooltip
            content={
              abortMode
                ? l.abort
                : isEmpty
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
              disabled={abortMode ? false : !inputValue || isExceedCharLimit}
              onClick={() => {
                if (abortMode) {
                  finishStreaming();
                } else {
                  onSubmit?.();
                }
              }}
            >
              <AppIcon
                icon={abortMode ? SquareIcon : ArrowUpIcon}
                boxSize={abortMode ? 4 : BASE_ICON_BOX_SIZE}
              />
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

export const NewPrompt = (props: Props__NewChat) => {
  // Props
  const { disabled, loading, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const resetActiveChat = useActiveChat((s) => s.resetActiveChat);
  const initSession = useActiveChat((s) => s.initSession);
  const appendMessage = useActiveChat((s) => s.appendMessage);

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: { prompt: "" },
    validationSchema: yup
      .object()
      .shape({ prompt: yup.string().required(l.msg_required_form) }),
    onSubmit: async (values) => {
      // Init active Chat
      resetActiveChat();
      initSession();

      // Append initial prompt
      appendMessage({
        id: crypto.randomUUID(),
        role: "user",
        content: values.prompt,
      });

      // Call startStream
      startChatStream({
        prompt: values.prompt,
      });
    },
  });

  return (
    <CContainer {...restProps}>
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
        disabled={disabled}
        loading={loading}
      />

      <PromptHelperText mt={4} />
    </CContainer>
  );
};

export const ContinuePrompt = (props: Props__ContinueChat) => {
  // Props
  const { disabled, loading, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const activeChat = useActiveChat((s) => s.activeChat);
  // const setMessageContainerStyle = useMessageContainer((s) => s.setStyle);
  const messageContainerRef = useMessageContainer((s) => s.containerRef);

  // Hooks
  const { sessionId } = useParams();
  const appendMessage = useActiveChat((s) => s.appendMessage);

  console.debug(messageContainerRef?.current?.offsetHeight);

  // States
  // const messageContainerCurrentH = messageContainerRef?.current?.offsetHeight;
  const formik = useFormik({
    validateOnChange: false,
    initialValues: { prompt: "" },
    validationSchema: yup
      .object()
      .shape({ prompt: yup.string().required(l.msg_required_form) }),
    onSubmit: async (values, { resetForm }) => {
      resetForm();

      appendMessage({
        id: crypto.randomUUID(),
        role: "user",
        content: values.prompt,
      });

      startChatStream({
        prompt: values.prompt,
        sessionId: sessionId as string,
      });

      // setTimeout(() => {
      //   setMessageContainerStyle({
      //     h: `calc(${messageContainerCurrentH}px + 70dvh)`,
      //   });
      // }, 50);
    },
  });

  return (
    <CContainer gap={4} {...restProps}>
      <PromptInput
        inputValue={formik.values.prompt}
        onChange={(inputValue) => {
          formik.setFieldValue("prompt", inputValue);
        }}
        onSubmit={() => {
          formik.handleSubmit();
        }}
        disabled={disabled || activeChat.session?.isStreaming}
        abortMode={activeChat.isStreaming}
        loading={loading}
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
