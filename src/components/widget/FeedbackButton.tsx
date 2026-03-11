"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { StackProps, HStack } from "@chakra-ui/react";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { P } from "@/components/ui/p";
import { Textarea } from "@/components/ui/textarea";
import { AppIcon } from "@/components/widget/AppIcon";
import {
  Interface__ChatMessage,
  Type__FeedbackCategory,
} from "@/constants/interfaces";
import { useThemeConfig } from "@/context/useThemeConfig";
import useLang from "@/context/useLang";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface FeedbackData {
  rating: 1 | -1;
  category?: Type__FeedbackCategory;
  userComment?: string;
}

interface Props extends StackProps {
  message: Interface__ChatMessage;
  onSubmitFeedback?: (data: FeedbackData) => Promise<void>;
}

export const FeedbackButton = (props: Props) => {
  // Props
  const { message, onSubmitFeedback, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<1 | -1 | null>(null);
  const [category, setCategory] = useState<Type__FeedbackCategory | undefined>();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Sync with message feedback
  useEffect(() => {
    if (message.feedback) {
      setSelectedRating(message.feedback.rating);
      setCategory(message.feedback.category);
      setComment(message.feedback.userComment ?? "");
    } else {
      setSelectedRating(null);
      setCategory(undefined);
      setComment("");
    }
  }, [message.feedback]);

  const feedbackCategories: { value: Type__FeedbackCategory; label: string }[] =
    [
      { value: "NOT_RELEVANT", label: l.feedback.categories.NOT_RELEVANT },
      { value: "WRONG_INFORMATION", label: l.feedback.categories.WRONG_INFORMATION },
      { value: "HALLUCINATION", label: l.feedback.categories.HALLUCINATION },
      { value: "INCOMPLETE", label: l.feedback.categories.INCOMPLETE },
      { value: "OTHER", label: l.feedback.categories.OTHER },
    ];

  const handleRatingClick = async (rating: 1 | -1) => {
    // If already rated, don't allow change
    if (message.feedback) return;

    if (selectedRating === rating) {
      // Toggle off if clicking the same rating
      setSelectedRating(null);
      return;
    }

    setSelectedRating(rating);

    if (rating === 1) {
      // For thumbs up, submit immediately without dialog
      setIsSubmitting(true);
      try {
        await onSubmitFeedback?.({ rating: 1 });
        setShowThankYou(true);
        setTimeout(() => setShowThankYou(false), 3000);
      } catch (error) {
        console.error("Failed to submit feedback:", error);
        setSelectedRating(null); // Reset on error
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // For thumbs down, open dialog
      setFeedbackDialogOpen(true);
    }
  };

  const handleSubmitFeedback = async () => {
    setIsSubmitting(true);
    try {
      await onSubmitFeedback?.({
        rating: -1,
        category,
        userComment: comment,
      });
      setFeedbackDialogOpen(false);
      setShowThankYou(true);
      setTimeout(() => setShowThankYou(false), 3000);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasFeedback = message.feedback !== undefined;
  const isThumbsUp = selectedRating === 1;
  const isThumbsDown = selectedRating === -1;

  return (
    <HStack gap={2} alignItems="center" {...(restProps as any)}>
      <HStack gap={1}>
        <Btn
          iconButton
          size="xs"
          variant={isThumbsUp ? "solid" : "ghost"}
          aria-label={l.feedback.thumbs_up}
          bg={isThumbsUp ? `${themeConfig.colorPalette}.solid` : undefined}
          color={isThumbsUp ? `${themeConfig.colorPalette}.contrast` : undefined}
          onClick={() => handleRatingClick(1)}
          disabled={isSubmitting || hasFeedback}
        >
          <AppIcon
            icon={ThumbsUpIcon}
            fill={isThumbsUp ? "currentColor" : undefined}
          />
        </Btn>

        <Btn
          iconButton
          size="xs"
          variant={isThumbsDown ? "solid" : "ghost"}
          aria-label={l.feedback.thumbs_down}
          bg={isThumbsDown ? "danger.solid" : undefined}
          color={isThumbsDown ? "danger.contrast" : undefined}
          onClick={() => handleRatingClick(-1)}
          disabled={isSubmitting || hasFeedback}
        >
          <AppIcon
            icon={ThumbsDownIcon}
            fill={isThumbsDown ? "currentColor" : undefined}
          />
        </Btn>
      </HStack>

      {showThankYou && (
        <CContainer
          px={3}
          py={1.5}
          bg="success.subtle"
          color="success.fg"
          rounded="md"
          fontSize="xs"
          fontWeight="medium"
          whiteSpace="nowrap"
          animation="fade-in 0.2s ease-out"
        >
          {l.feedback.thank_you}
        </CContainer>
      )}

      <DialogRoot
        open={feedbackDialogOpen}
        onOpenChange={({ open }) => {
          setFeedbackDialogOpen(open);
          if (!open && !isSubmitting) {
            // Reset form when dialog closes without submitting
            setSelectedRating(null);
            setCategory(undefined);
            setComment("");
          }
        }}
        size="sm"
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{l.feedback.dialog_title}</DialogTitle>
          </DialogHeader>

          <DialogBody>
            <P color="fg.subtle" mb={4}>
              {l.feedback.dialog_description}
            </P>

            <CContainer gap={3}>
              <Field label={l.category}>
                <select
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", borderWidth: "1px", borderColor: "var(--chakra-colors-border)", backgroundColor: "var(--chakra-colors-bg)", color: "var(--chakra-colors-fg)" }}
                  value={category ?? ""}
                  onChange={(e) =>
                    setCategory(
                      (e.target.value as Type__FeedbackCategory) || undefined
                    )
                  }
                >
                  <option value="" disabled>
                    {l.select || "Select"}
                  </option>
                  {feedbackCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={l.feedback.comment_placeholder}>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment((e as any).target ? (e as any).target.value : e)}
                  placeholder={l.feedback.comment_placeholder}
                  rows={3}
                />
              </Field>
            </CContainer>
          </DialogBody>

          <DialogFooter>
            <HStack gap={2} w="full">
              <Btn
                variant="ghost"
                flex={1}
                onClick={() => setFeedbackDialogOpen(false)}
                disabled={isSubmitting}
              >
                {l.feedback.cancel}
              </Btn>
              <Btn
                bg="danger.solid"
                color="danger.contrast"
                flex={1}
                onClick={handleSubmitFeedback}
                disabled={isSubmitting || !category}
              >
                {isSubmitting ? l.feedback.submit : l.feedback.submit}
              </Btn>
            </HStack>
          </DialogFooter>

          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </HStack>
  );
};
