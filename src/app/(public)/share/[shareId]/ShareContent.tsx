"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import { AppIcon } from "@/components/widget/AppIcon";
import { ClampText } from "@/components/widget/ClampText";
import { Logo } from "@/components/widget/Logo";
import { Messages } from "@/components/widget/Messages";
import { APP } from "@/constants/_meta";
import useLang from "@/context/useLang";

import { HStack } from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

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

        <Link href="/new-chat">
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
            <ClampText fontSize={"2xl"} fontWeight={"semibold"}>
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
          <Messages messages={messages} sharedContent />
        </CContainer>

        {messages.length === 0 && (
          <P color={"fg.subtle"} textAlign={"center"} py={12}>
            Tidak ada pesan dalam percakapan ini.
          </P>
        )}
      </CContainer>

      {/* Disclaimer */}
      <CContainer maxW={"760px"} w={"full"} mx={"auto"} px={4} pb={8}>
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
