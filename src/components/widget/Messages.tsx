import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import Spinner from "@/components/ui/spinner";
import { AppIcon } from "@/components/widget/AppIcon";
import { MarkdownChat, UserBubbleChat } from "@/components/widget/Chatting";
import { Clipboard } from "@/components/widget/Clipboard";
import { Interface__ChatMessage } from "@/constants/interfaces";
import { useActiveChatSession } from "@/context/useActiveChatSession";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { formatDate } from "@/utils/formatter";
import { Alert, Badge, HStack, StackProps } from "@chakra-ui/react";
import { RefreshCwIcon } from "lucide-react";

interface Props__Messages extends StackProps {
  messages: Interface__ChatMessage[];
}
export const Messages = (props: Props__Messages) => {
  // Props
  const { messages, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const activeChat = useActiveChatSession((s) => s.activeChat);

  // States
  const lastMessage = messages[messages.length - 1];
  const canRegenerate = lastMessage && lastMessage.role === "assistant";

  return (
    <CContainer flex={1} {...restProps}>
      <CContainer flex={1} gap={4} px={2}>
        <CContainer mb={4}>
          <P fontSize={"xl"} fontWeight={"semibold"}>
            {activeChat.session?.title}
          </P>

          <P color={"fg.subtle"}>{formatDate(activeChat.session?.createdAt)}</P>
        </CContainer>

        <CContainer gap={4}>
          {activeChat.messages.map((message: Interface__ChatMessage) => {
            const emptyMessage = !message.content;
            const isStreaming = message.isStreaming;

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

                      <HStack>
                        {message?.sources?.map((source, index) => {
                          return <Badge key={index}>{source}</Badge>;
                        })}
                      </HStack>

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
                          <Btn iconButton size={"xs"} variant={"ghost"}>
                            <AppIcon icon={RefreshCwIcon} />
                          </Btn>
                        )}
                      </HStack>
                    </>
                  )}
                </CContainer>
              );
            }
          })}
        </CContainer>
      </CContainer>
    </CContainer>
  );
};
