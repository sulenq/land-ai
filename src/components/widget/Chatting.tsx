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
      <P color={`${themeConfig.colorPalette}.contrast`}>{children}</P>
    </CContainer>
  );
};

export const MarkdownChat = (props: StackProps) => {
  const { children, ...restProps } = props;

  const components: Components = {
    p({ children }) {
      return <P>{children}</P>;
    },

    h1({ children }) {
      return (
        <P fontSize="xl" fontWeight="bold">
          {children}
        </P>
      );
    },

    h2({ children }) {
      return (
        <P fontSize="lg" fontWeight="semibold">
          {children}
        </P>
      );
    },

    h3({ children }) {
      return (
        <P fontSize="md" fontWeight="semibold">
          {children}
        </P>
      );
    },

    ul({ children }) {
      return (
        <CContainer as="ul" pl={4}>
          {children}
        </CContainer>
      );
    },

    ol({ children }) {
      return (
        <CContainer as="ol" pl={4}>
          {children}
        </CContainer>
      );
    },

    li({ children }) {
      return <li>{children}</li>;
    },

    blockquote({ children }) {
      return (
        <CContainer
          pl={3}
          borderLeftWidth="2px"
          borderColor="border.muted"
          color="fg.subtle"
        >
          {children}
        </CContainer>
      );
    },

    code({ children }) {
      return (
        <Code px={1} rounded="sm">
          {children}
        </Code>
      );
    },

    pre({ children }) {
      return (
        <CContainer as="pre" p={3} rounded="md" overflowX="auto" bg="bg.subtle">
          {children}
        </CContainer>
      );
    },

    a({ href, children }) {
      return (
        <Link href={href} color="fg.accent" target="_blank">
          {children}
        </Link>
      );
    },
  };

  return (
    <CContainer
      gap={3}
      fontSize="sm"
      lineHeight={1.7}
      color="fg.default"
      {...restProps}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSanitize]}
        components={components}
      >
        {String(children ?? "")}
      </ReactMarkdown>
    </CContainer>
  );
};
