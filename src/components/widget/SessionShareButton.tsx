import { Btn } from "@/components/ui/btn";
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
import BackButton from "@/components/widget/BackButton";
import { Clipboard } from "@/components/widget/Clipboard";
import { useActiveChat } from "@/context/useActiveChat";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import usePopDisclosure from "@/hooks/usePopDisclosure";
import { createShare } from "@/service/share";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import { HStack, Icon, Link, VStack } from "@chakra-ui/react";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { GlobeIcon, Link2Icon, Share2Icon } from "lucide-react";
import { useState } from "react";

interface Props {
  sessionId: string;
  sessionTitle?: string;
}

export const SessionShareButton = ({ sessionId, sessionTitle }: Props) => {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const messages = useActiveChat((s) => s.activeChat.messages);

  // Hooks
  const { isOpen, onOpen } = usePopDisclosure(disclosureId(`share_chat`));

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Functions
  const handleCreateShare = async () => {
    if (!sessionId) {
      setError(
        "Session ID tidak ditemukan. Silakan refresh halaman dan coba lagi.",
      );
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const result = await createShare({
        sessionId,
        title: sessionTitle,
      });

      const normalizedShareUrl = result.shareUrl
        ? result.shareUrl.startsWith("http")
          ? result.shareUrl
          : `${window.location.origin}${result.shareUrl.startsWith("/") ? "" : "/"}${result.shareUrl}`
        : result.shareId
          ? `${window.location.origin}/share/${result.shareId}`
          : "";

      if (!normalizedShareUrl) {
        throw new Error("Share link tidak mengandung URL atau ID yang valid");
      }

      setShareUrl(normalizedShareUrl);
    } catch (err: any) {
      setError(err.message || "Gagal membuat share link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    back();
    setShareUrl("");
    setError("");
  };

  const handleShareWhatsApp = () => {
    const firstUserMsg = messages?.find((m) => m.role === "user");
    const question =
      firstUserMsg?.content || sessionTitle || "Percakapan Land AI";
    const text = `${question}\n\nBaca selengkapnya di\n${shareUrl}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <>
      <Btn iconButton size={"xs"} variant={"ghost"} w={"fit"} onClick={onOpen}>
        <AppIcon icon={Share2Icon} />
      </Btn>

      <DisclosureRoot open={isOpen} onClose={handleClose} size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={l.share || "Share Publik"} />
          </DisclosureHeader>

          <DisclosureBody>
            <VStack gap={4} align={"start"}>
              {!shareUrl ? (
                <>
                  <P fontSize={"sm"} color={"fg.subtle"}>
                    {l.share_chat.description}
                  </P>

                  {error && (
                    <P fontSize={"sm"} color={"fg.error"}>
                      {error}
                    </P>
                  )}

                  <Btn
                    w={"full"}
                    onClick={handleCreateShare}
                    loading={isLoading}
                    colorPalette={themeConfig.colorPalette}
                  >
                    <AppIcon icon={Share2Icon} />

                    {l.create_share_link}
                  </Btn>
                </>
              ) : (
                <>
                  <P fontSize={"sm"} color={"fg.muted"}>
                    {l.share_chat.disclaimer}
                  </P>

                  <HStack
                    w={"full"}
                    gap={2}
                    px={3}
                    py={2}
                    bg={"bg.muted"}
                    rounded={themeConfig.radii.component}
                    border={"1px solid"}
                    borderColor={"border.subtle"}
                  >
                    <AppIcon icon={Link2Icon} />

                    <P
                      fontSize={"sm"}
                      flex={1}
                      overflow={"hidden"}
                      textOverflow={"ellipsis"}
                      whiteSpace={"nowrap"}
                    >
                      {shareUrl}
                    </P>

                    <Clipboard>{shareUrl}</Clipboard>
                  </HStack>

                  <HStack w={"full"} gap={2}>
                    <Link
                      href={shareUrl}
                      target="_blank"
                      textDecoration={"none"}
                    >
                      <Btn
                        variant={"ghost"}
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(shareUrl, "_blank");
                        }}
                      >
                        <HStack gap={2} justify={"center"}>
                          <AppIcon icon={GlobeIcon} />

                          {l.open_link}
                        </HStack>
                      </Btn>
                    </Link>

                    <Btn variant={"ghost"} onClick={handleShareWhatsApp}>
                      <HStack gap={2} justify={"center"} color={"fg.success"}>
                        <Icon boxSize={5}>
                          <IconBrandWhatsapp stroke={1.5} />
                        </Icon>

                        {l.share_chat.share_to_whatsapp}
                      </HStack>
                    </Btn>
                  </HStack>
                </>
              )}
            </VStack>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton onClick={handleClose} />
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
