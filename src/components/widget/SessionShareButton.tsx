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
import { createShare } from "@/service/share";
import useLang from "@/context/useLang";
import { HStack, VStack, Link } from "@chakra-ui/react";
import {
  CheckIcon,
  CopyIcon,
  GlobeIcon,
  Link2Icon,
  Share2Icon,
  XIcon,
} from "lucide-react";
import { useState } from "react";

interface Props {
  sessionId: string;
  sessionTitle?: string;
}

export const SessionShareButton = ({ sessionId, sessionTitle }: Props) => {
  // Contexts
  const { l } = useLang();

  // States
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string>("");

  // Functions
  const handleCreateShare = async () => {
    if (!sessionId) {
      setError("Session ID tidak ditemukan. Silakan refresh halaman dan coba lagi.");
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

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setIsOpen(false);
    setShareUrl("");
    setError("");
  };

  return (
    <>
      <Btn
        iconButton
        size={"xs"}
        variant={"ghost"}
        w={"fit"}
        onClick={() => setIsOpen(true)}
      >
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
                    Buat link publik untuk membagikan percakapan ini ke orang lain.
                    Orang lain bisa melihat seluruh percakapan tanpa perlu login.
                  </P>

                  {error && (
                    <P fontSize={"sm"} color={"fg.error"}>
                      {error}
                    </P>
                  )}

                  <HStack w={"full"} gap={2}>
                    <Btn
                      flex={1}
                      size={"sm"}
                      variant={"solid"}
                      onClick={handleCreateShare}
                      loading={isLoading}
                    >
                      <HStack gap={2} justify={"center"}>
                        <AppIcon icon={Share2Icon} />
                        <span>Buat Share Link</span>
                      </HStack>
                    </Btn>
                  </HStack>
                </>
              ) : (
                <>
                  <P fontSize={"sm"} color={"fg.muted"}>
                    Share link berhasil dibuat! Link ini bersifat publik dan bisa
                    diakses oleh siapa saja.
                  </P>

                  <HStack
                    w={"full"}
                    gap={2}
                    p={3}
                    bg={"bg.muted"}
                    rounded={"md"}
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
                    <Btn
                      iconButton
                      size={"xs"}
                      variant={"ghost"}
                      onClick={handleCopy}
                    >
                      <AppIcon icon={copied ? CheckIcon : CopyIcon} />
                    </Btn>
                  </HStack>

                  <HStack w={"full"} gap={2}>
                    <Link
                      href={shareUrl}
                      target="_blank"
                      textDecoration={"none"}
                      w={"full"}
                    >
                      <Btn
                        w={"full"}
                        size={"sm"}
                        variant={"outline"}
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(shareUrl, "_blank");
                        }}
                      >
                        <HStack gap={2} justify={"center"}>
                          <AppIcon icon={GlobeIcon} />
                          <span>Buka Link</span>
                        </HStack>
                      </Btn>
                    </Link>
                  </HStack>
                </>
              )}
            </VStack>
          </DisclosureBody>

          <DisclosureFooter>
            <HStack justify={"space-between"} w={"full"}>
              <Btn
                size={"xs"}
                variant={"ghost"}
                onClick={handleClose}
              >
                <HStack gap={2}>
                  <AppIcon icon={XIcon} />
                  <span>Tutup</span>
                </HStack>
              </Btn>
              {shareUrl && <Btn size={"xs"} variant={"ghost"} onClick={handleCopy}>
                <HStack gap={2}>
                  <AppIcon icon={copied ? CheckIcon : CopyIcon} />
                  <span>Salin</span>
                </HStack>
              </Btn>}
            </HStack>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
