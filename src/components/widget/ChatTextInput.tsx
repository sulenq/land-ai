import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxChar?: number;
}

export const ChatTextInput = ({
  value,
  onChange,
  placeholder = "",
  maxChar,
}: Props) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const { themeConfig } = useThemeConfig();

  useEffect(() => {
    if (!ref.current) return;

    ref.current.style.height = "0px";
    const scrollHeight = ref.current.scrollHeight;

    ref.current.style.height = Math.min(scrollHeight, 180) + "px";
  }, [value]);

  return (
    <Box
      w="full"
      bg="bg.default"
      border="1px solid"
      borderColor="border.muted"
      rounded={`calc(${themeConfig.radii.component} * 1.5)`}
      px={1}
      py={1}
    >
      <Textarea
        ref={ref}
        inputValue={value}
        onChange={onChange}
        placeholder={placeholder}
        maxChar={maxChar}
        resize="none"
        minH="40px"
        maxH="180px"
        variant="subtle"
      />
    </Box>
  );
};

ChatTextInput.displayName = "ChatTextInput";
