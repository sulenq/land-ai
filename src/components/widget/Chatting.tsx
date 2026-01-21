import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import { Props__UserBubbleChat } from "@/constants/props";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Code, Link, StackProps } from "@chakra-ui/react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { Box, List, ListItem, Text } from "@chakra-ui/react";
import { defaultSchema } from "rehype-sanitize";

export const UserBubbleChat = (props: Props__UserBubbleChat) => {
  // Props
  const { children, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <CContainer
      justify={"space-between"}
      align={"start"}
      p={4}
      bg={`${themeConfig.colorPalette}.solid`}
      roundedTopLeft={themeConfig.radii.component}
      roundedTopRight={0}
      roundedBottomLeft={themeConfig.radii.component}
      roundedBottomRight={themeConfig.radii.component}
      w={"70%"}
      ml={"auto"}
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

export const MarkdownChat = (props: StackProps) => {
  const { children, ...restProps } = props;

  const components: Components = {
    p({ children }) {
      return <Text>{children}</Text>;
    },

    h1({ children }) {
      return (
        <Text fontSize="2xl" fontWeight="bold">
          {children}
        </Text>
      );
    },

    h2({ children }) {
      return (
        <Text fontSize="xl" fontWeight="bold">
          {children}
        </Text>
      );
    },

    h3({ children }) {
      return (
        <Text fontSize="lg" fontWeight="semibold">
          {children}
        </Text>
      );
    },

    ul({ children }) {
      return (
        <List.Root listStyleType="disc" pl={6}>
          {children}
        </List.Root>
      );
    },

    ol({ children }) {
      return (
        <List.Root as="ol" listStyleType="decimal" pl={6}>
          {children}
        </List.Root>
      );
    },

    li({ children }) {
      return <ListItem>{children}</ListItem>;
    },

    blockquote({ children }) {
      return (
        <Box
          pl={3}
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
        <Code px={1} rounded="sm">
          {children}
        </Code>
      );

      // return (
      //   <Box as="pre" p={3} rounded="md" overflowX="auto" bg="bg.subtle">
      //     <code className={className}>{children}</code>
      //   </Box>
      // );
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

  return (
    <Box fontSize="sm" lineHeight={1.7} color="fg.default" {...restProps}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, [rehypeSanitize, sanitizeSchema]]}
        components={components}
      >
        {String(children ?? "")}
      </ReactMarkdown>
    </Box>
  );
};
