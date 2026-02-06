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
import { P } from "@/components/ui/p";
import Spinner from "@/components/ui/spinner";
import { AppIcon } from "@/components/widget/AppIcon";
import BackButton from "@/components/widget/BackButton";
import { MarkdownChat, UserBubbleChat } from "@/components/widget/Chatting";
import { Clipboard } from "@/components/widget/Clipboard";
import { Interface__ChatMessage } from "@/constants/interfaces";
import { useActiveChat } from "@/context/useActiveChat";
import useLang from "@/context/useLang";
import useMessageContainer from "@/context/useMessageContainer";
import { useThemeConfig } from "@/context/useThemeConfig";
import usePopDisclosure from "@/hooks/usePopDisclosure";
import { startChatStream } from "@/service/chatStream";
import { isEmptyArray } from "@/utils/array";
import { disclosureId } from "@/utils/disclosure";
import { formatDate } from "@/utils/formatter";
import { Alert, HStack, List, StackProps } from "@chakra-ui/react";
import { ChevronDownIcon, RefreshCwIcon } from "lucide-react";
import { useEffect, useRef } from "react";

interface Props__ReferenceDisclosureTrigger extends StackProps {
  message: Interface__ChatMessage;
}
const ReferenceDisclosureTrigger = (
  props: Props__ReferenceDisclosureTrigger,
) => {
  // Props
  const { message, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // Hooks
  const { isOpen, onOpen } = usePopDisclosure(disclosureId(`reference`));

  return (
    <>
      <CContainer w={"fit"} onClick={onOpen} {...restProps} />

      <DisclosureRoot open={isOpen} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={l.reference} />
          </DisclosureHeader>

          <DisclosureBody>
            <List.Root gap={2} pl={4}>
              {message?.sources?.map((source, index) => {
                return <List.Item key={index}>{source}</List.Item>;
              })}
            </List.Root>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};

interface Props__Messages extends StackProps {
  messages: Interface__ChatMessage[];
}
export const Messages = (props: Props__Messages) => {
  // Props
  const { messages, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const activeChat = useActiveChat((s) => s.activeChat);
  const setMessageContainerRef = useMessageContainer((s) => s.setRef);
  const removeMessage = useActiveChat((s) => s.removeMessage);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessageContainerRef(containerRef);
  }, []);

  return (
    <CContainer ref={containerRef} flex={1} gap={4} px={2} {...restProps}>
      <CContainer gap={1} mb={4}>
        <P fontSize={"xl"} fontWeight={"semibold"}>
          {activeChat.session?.title}
        </P>

        <P color={"fg.subtle"}>{formatDate(activeChat.session?.createdAt)}</P>
      </CContainer>

      <CContainer gap={4}>
        {activeChat.messages.map(
          (message: Interface__ChatMessage, index: number) => {
            const emptyMessage = !message.content;
            const isStreaming = message.isStreaming;
            const lastMessage = messages[messages.length - 1];
            const isLastMessage = index === messages.length - 1;
            const canRegenerate =
              isLastMessage && lastMessage && lastMessage.role === "assistant";

            // User Message
            if (message.role === "user") {
              return (
                <CContainer key={message.id} gap={2}>
                  <UserBubbleChat>{message.content}</UserBubbleChat>

                  <HStack wrap={"wrap"} justify={"end"}>
                    <Clipboard>{message.content}</Clipboard>
                  </HStack>
                </CContainer>
              );
            }

            // Assistant Message
            if (message.role === "assistant") {
              return (
                <CContainer key={message.id} gap={2}>
                  {isStreaming && emptyMessage ? (
                    <Spinner size={"sm"} ml={2} />
                  ) : (
                    <>
                      <MarkdownChat error={true}>
                        {message.content}
                      </MarkdownChat>

                      {message.error && (
                        <CContainer key={message.id} gap={2}>
                          <Alert.Root
                            status="error"
                            maxW={"70%"}
                            rounded={themeConfig.radii.component}
                          >
                            <Alert.Indicator />
                            <Alert.Title>
                              {l.msg_assistant_response_error}
                            </Alert.Title>
                          </Alert.Root>
                        </CContainer>
                      )}

                      <HStack wrap={"wrap"} gap={1}>
                        <Clipboard>{message.content}</Clipboard>

                        {canRegenerate && (
                          <Btn
                            iconButton
                            size={"xs"}
                            variant={"ghost"}
                            onClick={() => {
                              removeMessage(message.id);
                              startChatStream({
                                prompt: messages[index - 1].content,
                                sessionId: activeChat?.session?.id,
                                isRegenerate: true,
                              });
                            }}
                          >
                            <AppIcon icon={RefreshCwIcon} />
                          </Btn>
                        )}

                        {!isEmptyArray(message.sources) && (
                          <ReferenceDisclosureTrigger message={message}>
                            <Btn
                              size={"xs"}
                              variant={"ghost"}
                              w={"fit"}
                              pr={"6px"}
                            >
                              {l.reference} <AppIcon icon={ChevronDownIcon} />
                            </Btn>
                          </ReferenceDisclosureTrigger>
                        )}
                      </HStack>
                    </>
                  )}
                </CContainer>
              );
            }
          },
        )}
      </CContainer>
    </CContainer>
  );
};
