"use client";

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
import { AppIcon } from "@/components/widget/AppIcon";
import { MarkdownChat, UserBubbleChat } from "@/components/widget/Chatting";
import { ClampText } from "@/components/widget/ClampText";
import { Logo } from "@/components/widget/Logo";
import { APP } from "@/constants/_meta";
import useLang from "@/context/useLang";

import { HStack, List } from "@chakra-ui/react";
import { ArrowRight, ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  createdAt?: string;
}

interface Props {
  title?: string;
  messages: ChatMessage[];
  viewCount?: number;
  createdAt?: string;
}

// Replicate the same reference disclosure trigger as Messages.tsx
function ReferenceButton({ sources }: { sources: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Btn
        size={"xs"}
        variant={"ghost"}
        w={"fit"}
        pr={"6px"}
        onClick={() => setIsOpen(true)}
      >
        Referensi <AppIcon icon={ChevronDownIcon} />
      </Btn>

      <DisclosureRoot
        open={isOpen}
        onClose={() => setIsOpen(false)}
        size={"xs"}
      >
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={"Referensi"} />
          </DisclosureHeader>

          <DisclosureBody>
            <List.Root gap={2} pl={4}>
              {sources.map((source, index) => (
                <List.Item key={index}>{source}</List.Item>
              ))}
            </List.Root>
          </DisclosureBody>

          <DisclosureFooter>
            <Btn
              variant={"outline"}
              size={"sm"}
              onClick={() => setIsOpen(false)}
            >
              Close
            </Btn>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
}

export function ShareContent(props: Props) {
  // Props
  const { title, messages, viewCount, createdAt } = props;

  // Contexts
  const { l } = useLang();

  // Derived Values
  const createdDate = createdAt
    ? new Date(createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <CContainer minH={"100dvh"} bg={"body"}>
      {/* Header */}
      <HStack
        as="header"
        px={4}
        py={3}
        borderBottom={"1px solid"}
        borderColor={"border.muted"}
        justify={"space-between"}
        flexShrink={0}
        position={"sticky"}
        top={0}
        bg={"body"}
        zIndex={10}
      >
        <HStack gap={2}>
          <Logo size={15} />
          <P fontWeight={"semibold"}>{APP.name}</P>
        </HStack>

        <Link href="/">
          <Btn size={"sm"} variant={"ghost"} pr={2.5}>
            {l.new_chat}
            <AppIcon icon={ArrowRight} />
          </Btn>
        </Link>
      </HStack>

      {/* Content */}
      <CContainer
        flex={1}
        maxW={"760px"}
        w={"full"}
        mx={"auto"}
        px={4}
        py={8}
        gap={6}
      >
        {/* Title & Meta */}
        <CContainer gap={1} mb={2}>
          {title && (
            <ClampText fontSize={"3xl"} fontWeight={"semibold"}>
              {title}
            </ClampText>
          )}

          <HStack gap={3} flexWrap={"wrap"}>
            {createdDate && (
              <P fontSize={"sm"} color={"fg.subtle"}>
                {createdDate}
              </P>
            )}
            {viewCount !== undefined && (
              <P fontSize={"sm"} color={"fg.subtle"}>
                · Dilihat {viewCount} kali
              </P>
            )}
          </HStack>
        </CContainer>

        {/* Messages */}
        <CContainer gap={4}>
          {messages.map((message, index) => {
            if (message.role === "user") {
              return (
                <CContainer key={message.id || index} gap={2}>
                  <UserBubbleChat ml={"auto"}>{message.content}</UserBubbleChat>
                </CContainer>
              );
            }

            if (message.role === "assistant") {
              const hasSources = message.sources && message.sources.length > 0;

              return (
                <CContainer key={message.id || index} gap={2}>
                  <HStack align={"start"} gap={4}>
                    <Logo size={15} />

                    <CContainer gap={2}>
                      <MarkdownChat>{message.content}</MarkdownChat>

                      {/* Action row - same layout as Messages.tsx */}
                      <HStack wrap={"wrap"} gap={1} w={"fit"}>
                        {hasSources && (
                          <ReferenceButton sources={message.sources!} />
                        )}
                      </HStack>
                    </CContainer>
                  </HStack>
                </CContainer>
              );
            }

            return null;
          })}
        </CContainer>

        {messages.length === 0 && (
          <P color={"fg.subtle"} textAlign={"center"} py={12}>
            Tidak ada pesan dalam percakapan ini.
          </P>
        )}
      </CContainer>

      {/* Disclaimer */}
      <CContainer maxW={"760px"} w={"full"} mx={"auto"} px={4} pb={4}>
        <CContainer gap={1}>
          <P fontSize={"xs"} color={"fg.subtle"}>
            *Jawaban berdasarkan dokumen resmi
          </P>
          <P fontSize={"xs"} color={"fg.subtle"}>
            *Jawaban akan menyertakan dasar hukum (pasal / peraturan) jika
            tersedia. Pertanyaan tanpa referensi relevan dapat ditolak.
          </P>
        </CContainer>
      </CContainer>

      {/* Footer */}
      <HStack
        as="footer"
        justify={"center"}
        py={4}
        borderTop={"1px solid"}
        borderColor={"border.muted"}
      >
        <P fontSize={"xs"} color={"fg.subtle"}>
          © {new Date().getFullYear()} Land AI · Asisten Agraria Indonesia
        </P>
      </HStack>
    </CContainer>
  );
}
