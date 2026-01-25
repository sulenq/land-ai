import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import Spinner from "@/components/ui/spinner";
import { UserBubbleChat } from "@/components/widget/Chatting";
import { Clipboard } from "@/components/widget/Clipboard";
import { ContinuePrompt } from "@/components/widget/PromptComposer";
import { useActiveChat } from "@/context/useActiveChat";
import useLang from "@/context/useLang";
import { formatDate } from "@/utils/formatter";
import { HStack } from "@chakra-ui/react";

export const InitialPrompted = () => {
  // Contexts
  const { l } = useLang();
  const activeChat = useActiveChat((s) => s.activeChat);

  // States
  const userInitialPrompt = activeChat.messages?.[0].content;

  return (
    <CContainer flex={1}>
      <CContainer mb={4}>
        <P fontSize={"xl"} fontWeight={"semibold"}>
          {l.new_chat}
        </P>

        <P color={"fg.subtle"}>{formatDate(activeChat.session?.createdAt)}</P>
      </CContainer>

      <CContainer gap={4}>
        <CContainer gap={2}>
          <UserBubbleChat>{userInitialPrompt}</UserBubbleChat>

          <HStack wrap={"wrap"} justify={"end"}>
            <Clipboard>{userInitialPrompt}</Clipboard>
          </HStack>

          <Spinner size={"sm"} ml={2} />
        </CContainer>
      </CContainer>

      <ContinuePrompt mt={"auto"} disabled />
    </CContainer>
  );
};
