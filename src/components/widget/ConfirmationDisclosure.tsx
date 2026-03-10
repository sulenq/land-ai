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
import { P } from "@/components/ui/p";
import { Tooltip } from "@/components/ui/tooltip";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useCountdown } from "@/hooks/useCountdown";
import usePopDisclosure from "@/hooks/usePopDisclosure";
import { disclosureId } from "@/utils/disclosure";
import { Box, StackProps } from "@chakra-ui/react";
import { useEffect } from "react";
import BackButton from "./BackButton";

interface Props__Disclosure {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmCountdown?: string;
  isCountdownFinished?: boolean;
  onConfirm: () => void;
  confirmButtonProps?: Props__Btn;
  loading?: boolean;
  addonElement?: any;
}
export const ConfirmationDisclosure = (props: Props__Disclosure) => {
  // Props
  const {
    isOpen,
    title,
    description,
    confirmLabel,
    confirmCountdown,
    isCountdownFinished,
    onConfirm,
    confirmButtonProps,
    loading = false,
    addonElement,
  } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <DisclosureRoot open={isOpen} lazyLoad size={"xs"}>
      <DisclosureContent>
        <DisclosureHeader>
          <DisclosureHeaderContent title={`${title}`} />
        </DisclosureHeader>

        <DisclosureBody>
          <P>{description}</P>

          {addonElement}
        </DisclosureBody>

        <DisclosureFooter>
          <BackButton disabled={loading} />

          <Box pos={"relative"}>
            <Btn
              w={"120px"}
              onClick={onConfirm}
              loading={loading}
              colorPalette={themeConfig.colorPalette}
              fontVariantNumeric={"tabular-nums"}
              disabled={!isCountdownFinished}
              {...confirmButtonProps}
            >
              <Tooltip content={confirmLabel}>
                <P lineClamp={1} opacity={isCountdownFinished ? 1 : 0.25}>
                  {confirmLabel}
                </P>
              </Tooltip>
            </Btn>

            <P
              pos={"absolute"}
              top={"50%"}
              left={"50%"}
              transform={"translate(-50%, -50%)"}
              fontVariantNumeric={"tabular-nums"}
              pointerEvents={"none"}
              opacity={isCountdownFinished ? 0 : 1}
              lineClamp={1}
            >
              {`${confirmCountdown}`}
            </P>
          </Box>
        </DisclosureFooter>
      </DisclosureContent>
    </DisclosureRoot>
  );
};

interface Props__Trigger extends StackProps {
  children?: any;
  id: string;
  title: string;
  description: string;
  confirmLabel: any;
  confirmCountdownDuration?: number;
  confirmButtonProps?: Props__Btn;
  loading?: boolean;
  disabled?: any;
  addonElement?: any;
  onConfirm: () => void;
  onOpen?: () => void;
  onClose?: () => void;
}
export const ConfirmationDisclosureTrigger = (props: Props__Trigger) => {
  // Props
  const {
    children,
    id,
    title,
    description,
    confirmLabel,
    confirmCountdownDuration = 0,
    confirmButtonProps,
    loading,
    disabled,
    addonElement,
    onConfirm,
    onOpen,
    onClose,
    ...restProps
  } = props;

  // Hooks
  const { isOpen, onOpen: openDisclosure } = usePopDisclosure(
    disclosureId(`${id}`),
  );
  const {
    formattedCountdown,
    startCountdown,
    stopCountdown,
    resetCountdown,
    isCountdownFinished,
  } = useCountdown({
    duration: confirmCountdownDuration,
  });

  useEffect(() => {
    if (isOpen) {
      onOpen?.();

      if (confirmCountdownDuration) {
        startCountdown();
      }
    } else {
      onClose?.();

      if (confirmCountdownDuration) {
        stopCountdown();
        resetCountdown();
      }
    }
  }, [isOpen, onClose]);

  return (
    <>
      <CContainer
        w={"fit"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          if (disabled) return;

          openDisclosure();
          onOpen?.();
        }}
        cursor={disabled ? "disabled" : "pointer"}
        {...restProps}
      >
        {children}
      </CContainer>

      <ConfirmationDisclosure
        isOpen={isOpen}
        title={title}
        description={description}
        confirmLabel={confirmLabel}
        confirmCountdown={`${formattedCountdown}s`}
        isCountdownFinished={isCountdownFinished}
        onConfirm={onConfirm}
        confirmButtonProps={confirmButtonProps}
        loading={loading}
        addonElement={addonElement}
      />
    </>
  );
};
