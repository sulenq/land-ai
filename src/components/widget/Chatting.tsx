import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import { Props__MarkdownChat, Props__UserBubbleChat } from "@/constants/props";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Box, Code, Link, List, ListItem, Text } from "@chakra-ui/react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";

export const UserBubbleChat = (props: Props__UserBubbleChat) => {
  // Props
  const { children, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <CContainer
      justify={"space-between"}
      align={"start"}
      px={4}
      py={3}
      bg={`${themeConfig.colorPalette}.solid`}
      roundedTopLeft={themeConfig.radii.component}
      roundedTopRight={0}
      roundedBottomLeft={themeConfig.radii.component}
      roundedBottomRight={themeConfig.radii.component}
      w={"fit"}
      maxW={"70%"}
      {...restProps}
    >
      <P fontWeight={"medium"} color={`${themeConfig.colorPalette}.contrast`}>
        {children}
      </P>
    </CContainer>
  );
};

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), ["className"]],
  },
};

export const MarkdownChat = (props: Props__MarkdownChat) => {
  // Props
  const { children, ...restProps } = props;

  // Constants
  const components: Components = {
    p({ children }) {
      return <Text mb={4}>{children}</Text>;
    },

    h1({ children }) {
      return (
        <Text fontSize="2xl" fontWeight="bold" mb={4} mt={6}>
          {children}
        </Text>
      );
    },

    h2({ children }) {
      return (
        <Text fontSize="xl" fontWeight="bold" mb={3} mt={5}>
          {children}
        </Text>
      );
    },

    h3({ children }) {
      return (
        <Text fontSize="lg" fontWeight="semibold" mb={3} mt={4}>
          {children}
        </Text>
      );
    },

    ul({ children }) {
      return (
        <List.Root listStyleType="disc" pl={6} mb={4}>
          {children}
        </List.Root>
      );
    },

    ol({ children }) {
      return (
        <List.Root as="ol" listStyleType="decimal" pl={6} mb={4}>
          {children}
        </List.Root>
      );
    },

    li({ children }) {
      return <ListItem mb={1}>{children}</ListItem>;
    },

    blockquote({ children }) {
      return (
        <Box
          pl={3}
          py={1}
          mb={4}
          borderLeftWidth="2px"
          borderColor="border.muted"
          color="fg.subtle"
        >
          {children}
        </Box>
      );
    },

    code({ children }) {
      return (
        <Code px={1.5} py={0.5} rounded="sm">
          {children}
        </Code>
      );
    },

    a({ href, children }) {
      return (
        <Link
          href={href}
          color="fg.accent"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </Link>
      );
    },
  };

  // Remove used sources block
  const rawText = String(children ?? "");
  const processedText = rawText.replace(
    /<<USED_SOURCES>>[\s\S]*?<<END_SOURCES>>/g,
    "",
  );

  return (
    <Box
      className="markdown"
      fontSize="sm"
      lineHeight={1.8}
      color="fg.default"
      // css={{
      //   "& p:last-of-type": { marginBottom: 0 },
      //   "& ul:last-of-type": { marginBottom: 0 },
      //   "& ol:last-of-type": { marginBottom: 0 },
      // }}
      {...restProps}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, [rehypeSanitize, sanitizeSchema]]}
        components={components}
      >
        {processedText}
      </ReactMarkdown>
    </Box>
  );
};
