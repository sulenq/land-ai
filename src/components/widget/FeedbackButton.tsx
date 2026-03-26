"use client";

import { Btn, Props__Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import { Field } from "@/components/ui/field";
import { SelectInput } from "@/components/ui/select-input";
import { Textarea } from "@/components/ui/textarea";
import { toaster } from "@/components/ui/toaster";
import { AppIcon } from "@/components/widget/AppIcon";
import BackButton from "@/components/widget/BackButton";
import { CHAT_API_FEEDBACK } from "@/constants/apis";
import {
  Interface__ChatMessage,
  Interface__ChatSession,
  Interface__SelectOption,
  Type__FeedbackCategory,
} from "@/constants/interfaces";
import { useActiveChat } from "@/context/useActiveChat";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import usePopDisclosure from "@/hooks/usePopDisclosure";
import useRequest from "@/hooks/useRequest";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import { capitalizeWords } from "@/utils/string";
import { FieldsetRoot, HStack, StackProps } from "@chakra-ui/react";
import { useFormik } from "formik";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import * as yup from "yup";

interface FeedbackData {
  rating: 1 | -1;
  category?: Type__FeedbackCategory;
  userComment?: string;
}

interface FeedbackReasonTriggerProps extends StackProps {
  session: Interface__ChatSession;
  messageId: string;
  onConfirmFeedback: (data: FeedbackData) => void;
}
const FeedbackReasonTrigger = (props: FeedbackReasonTriggerProps) => {
  // Props
  const { children, session, messageId, onConfirmFeedback, ...restProps } =
    props;
  const ID = `feedback-${messageId}`;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const { isOpen, onOpen } = usePopDisclosure(
    disclosureId(`feedback-reason-${ID}`),
  );

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      category: null as Interface__SelectOption[] | null,
      userComment: "",
    },
    validationSchema: yup.object().shape({
      category: yup
        .array()
        .min(1, l.msg_required_form)
        .required(l.msg_required_form),
      userComment: yup.string(),
    }),
    onSubmit: (values, { resetForm }) => {
      back();

      const payload: FeedbackData = {
        rating: -1,
        category: values.category?.[0].id,
        userComment: values.userComment,
      };

      onConfirmFeedback(payload);

      resetForm();
    },
  });

  // Constants
  const FEEDBACK_CATEGORIES: Interface__SelectOption[] = [
    { id: "NOT_RELEVANT", label: l.feedback.categories.NOT_RELEVANT },
    {
      id: "WRONG_INFORMATION",
      label: l.feedback.categories.WRONG_INFORMATION,
    },
    { id: "HALLUCINATION", label: l.feedback.categories.HALLUCINATION },
    { id: "INCOMPLETE", label: l.feedback.categories.INCOMPLETE },
    { id: "OTHER", label: l.feedback.categories.OTHER },
  ];

  return (
    <>
      <CContainer w={"fit"} onClick={onOpen} {...restProps}>
        {children}
      </CContainer>

      <DisclosureRoot open={isOpen} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent
              title={capitalizeWords(l.feedback.disclosure_title)}
            />
          </DisclosureHeader>

          <DisclosureBody>
            <form id="feedback" onSubmit={formik.handleSubmit}>
              <FieldsetRoot>
                <Field label={l.category}>
                  <SelectInput
                    id={`select-category-feedback-${ID}`}
                    title={l.category}
                    selectOptions={FEEDBACK_CATEGORIES}
                    inputValue={formik.values.category}
                    onChange={(inputValue) => {
                      formik.setFieldValue("category", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.feedback.comment_placeholder}
                  invalid={!!formik.errors.userComment}
                  errorText={formik.errors.userComment as string}
                  optional
                >
                  <Textarea
                    inputValue={formik.values.userComment}
                    onChange={(inputValue) => {
                      formik.setFieldValue("userComment", inputValue);
                    }}
                  />
                </Field>
              </FieldsetRoot>
            </form>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />

            <Btn
              type={"submit"}
              form={"feedback"}
              colorPalette={themeConfig.colorPalette}
              disabled={!formik.values.category}
            >
              {l.submit}
            </Btn>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};

interface Props__ThumsbUpButton extends Props__Btn {
  onConfirmFeedback: (data: FeedbackData) => void;
  isThumbsUp: boolean;
  hasFeedbackRating: boolean;
}
const ThumbsUpButton = (props: Props__ThumsbUpButton) => {
  // Props
  const { onConfirmFeedback, isThumbsUp, hasFeedbackRating, ...restProps } =
    props;

  return (
    <Btn
      iconButton
      size={"xs"}
      variant={"ghost"}
      onClick={() => {
        onConfirmFeedback({
          rating: 1,
        });
      }}
      disabled={hasFeedbackRating}
      {...restProps}
    >
      <AppIcon
        icon={ThumbsUpIcon}
        boxSize={isThumbsUp ? 5 : ""}
        color={isThumbsUp ? "body" : "fg"}
        fill={isThumbsUp ? "fg" : undefined}
      />
    </Btn>
  );
};

interface Props__ThumbsDownButton extends Props__Btn {
  onConfirmFeedback: (data: FeedbackData) => void;
  isThumbsDown: boolean;
  hasFeedbackRating: boolean;
  message: Interface__ChatMessage;
}
const ThumbsDownButton = (props: Props__ThumbsDownButton) => {
  // Props
  const {
    onConfirmFeedback,
    isThumbsDown,
    hasFeedbackRating,
    message,
    ...restProps
  } = props;

  // Contexts
  const activeChat = useActiveChat((s) => s.activeChat);

  // Constants
  const activeChatSession = activeChat.session as Interface__ChatSession;

  return (
    activeChatSession && (
      <FeedbackReasonTrigger
        session={activeChatSession}
        messageId={message.id}
        onConfirmFeedback={onConfirmFeedback}
      >
        <Btn
          iconButton
          size={"xs"}
          variant={"ghost"}
          disabled={hasFeedbackRating}
          {...restProps}
        >
          <AppIcon
            icon={ThumbsDownIcon}
            boxSize={isThumbsDown ? 5 : ""}
            color={isThumbsDown ? "body" : "fg"}
            fill={isThumbsDown ? "fg" : undefined}
          />
        </Btn>
      </FeedbackReasonTrigger>
    )
  );
};

interface Props__FeedbackButtons extends StackProps {
  message: Interface__ChatMessage;
  index: number;
}
export const FeedbackButtons = (props: Props__FeedbackButtons) => {
  // Props
  const { message, index, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const activeChat = useActiveChat((s) => s.activeChat);
  const updateMessageFeedback = useActiveChat((s) => s.updateMessageFeedback);

  // Hooks
  const { req } = useRequest({
    id: `confirm-feedback-${message.id}`,
    showLoadingToast: false,
    showSuccessToast: false,
  });

  // Derived Values
  const hasFeedbackRating = message.feedback !== undefined;
  const isThumbsUp = message.feedback?.rating === 1;
  const isThumbsDown = message.feedback?.rating === -1;

  // Utils
  function handleConfirmFeedback({
    rating,
    category,
    userComment,
  }: FeedbackData) {
    if (hasFeedbackRating) return;

    const config = {
      url: CHAT_API_FEEDBACK,
      method: "POST",
      data: {
        sessionId: activeChat?.session?.id,
        messageId: message.id,
        userQuery: activeChat.messages[index - 1].content,
        aiResponse: message.content,
        rating: rating,
        category: category,
        userComment: userComment,
      },
    };

    req({
      config,
      onResolve: {
        onError: () => {
          // Rollback state if error
          updateMessageFeedback?.(message.id, undefined);
        },
      },
    });

    updateMessageFeedback?.(message.id, {
      rating: rating,
      category: category,
      userComment: userComment,
      createdAt: new Date().toISOString(),
    });

    toaster.create({
      type: "success",
      title: l.thankyou,
      description: l.feedback.success_message,
    });
  }

  return (
    <HStack gap={2} alignItems="center" {...(restProps as any)}>
      <HStack gap={1}>
        {(!hasFeedbackRating || isThumbsUp) && (
          <ThumbsUpButton
            onConfirmFeedback={handleConfirmFeedback}
            isThumbsUp={isThumbsUp}
            hasFeedbackRating={hasFeedbackRating}
          />
        )}

        {(!hasFeedbackRating || isThumbsDown) && (
          <ThumbsDownButton
            onConfirmFeedback={handleConfirmFeedback}
            isThumbsDown={isThumbsDown}
            hasFeedbackRating={hasFeedbackRating}
            message={message}
          />
        )}
      </HStack>
    </HStack>
  );
};
