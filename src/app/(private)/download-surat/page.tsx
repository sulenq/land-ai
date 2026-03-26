"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { DAServiceSkeleton } from "@/components/ui/c-loader";
import { Img } from "@/components/ui/img";
import { P } from "@/components/ui/p";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIcon } from "@/components/widget/AppIcon";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { ContainerLayout, PageContainer } from "@/components/widget/PageShell";
import { DA_API_SERVICE_GET_ALL } from "@/constants/apis";
import {
  Interface__DAService,
  Interface__DAServiceDocumentRequirement,
} from "@/constants/interfaces";
import { useBreadcrumbs } from "@/context/useBreadcrumbs";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useDataState from "@/hooks/useDataState";
import useExtractSertipikat from "@/hooks/useExtractSertipikat";
import {
  Box,
  HStack,
  Input,
  SimpleGrid,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import {
  createSuratKuasaFillable,
  createSuratPermohonanFillable,
  createSuratPernyataanFillable,
  type FillableData,
} from "@/components/widget/DAFillableTemplate";
import {
  ArrowLeftIcon,
  DownloadIcon,
  FileIcon,
  UploadCloudIcon,
} from "lucide-react";
import { imgUrl } from "@/utils/url";
import { DUMMY_SURAT_KUASA_DATA } from "@/constants/dummyData";
import JSZip from "jszip";
import { useEffect, useRef, useState } from "react";

const isCertificateRequirement = (
  requirement: Interface__DAServiceDocumentRequirement,
) => {
  const name = requirement.name.trim().toLowerCase();
  const isCertificate = /sertipikat|sertifikat/.test(name);
  const isDraft = /draft/.test(name);
  return isCertificate && !isDraft;
};

const isKtpRequirement = (
  requirement: Interface__DAServiceDocumentRequirement,
) => /\bktp\b/i.test(requirement.name);

export default function Page() {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { lang } = useLang();
  const setBreadcrumbs = useBreadcrumbs((s) => s.setBreadcrumbs);

  // Hooks
  const {
    uploadDocuments,
    isLoading,
    extractedData,
    setExtractedData,
    reset,
  } = useExtractSertipikat();

  // Fetch DA services
  const {
    initialLoading: servicesLoading,
    error: servicesError,
    data: services,
    onRetry: onRetryServices,
  } = useDataState<Interface__DAService[]>({
    initialData: undefined,
    url: DA_API_SERVICE_GET_ALL,
    dataResource: false,
  });

  // States
  const [selectedService, setSelectedService] =
    useState<Interface__DAService | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeRequirementId, setActiveRequirementId] = useState<string | null>(
    null,
  );
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});

  // Set breadcrumbs on mount
  useEffect(() => {
    setBreadcrumbs({
      activeNavs: [
        {
          label: "Buat Surat",
          path: "/download-surat",
        },
      ],
    });
  }, [setBreadcrumbs]);

  // Handlers
  const handleSelectService = (service: Interface__DAService) => {
    setSelectedService(service);
  };

  const handleBackToServices = () => {
    setSelectedService(null);
    setActiveRequirementId(null);
    setSelectedFiles({});
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const normalizedRequirements: Interface__DAServiceDocumentRequirement[] =
    selectedService?.documentRequirements || [];
  const visibleRequirements = normalizedRequirements.filter(
    (requirement) =>
      isCertificateRequirement(requirement) || isKtpRequirement(requirement),
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeRequirementId) return;

    if (file.type !== "application/pdf") {
      toaster.error({
        title: "Format tidak didukung",
        description: "Harap unggah file PDF.",
      });
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toaster.error({
        title: "File Terlalu Besar",
        description: "Ukuran maksimal file adalah 100MB.",
      });
      return;
    }

    setSelectedFiles((prev) => ({
      ...prev,
      [activeRequirementId]: file,
    }));
    reset();
    setActiveRequirementId(null);
    e.target.value = "";
  };

  const handleUploadClick = (requirementId: string) => {
    setActiveRequirementId(requirementId);
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (!selectedService) return;

    const missingMandatory = visibleRequirements.filter((requirement) => {
      const requirementId = String(requirement.id);
      const isMandatory = isCertificateRequirement(requirement);
      return isMandatory && !selectedFiles[requirementId];
    });

    if (missingMandatory.length > 0) {
      toaster.error({
        title: "Dokumen belum lengkap",
        description: `Harap unggah: ${missingMandatory.map((item) => item.name).join(", ")}`,
      });
      return;
    }

    if (Object.keys(selectedFiles).length === 0) {
      toaster.error({
        title: "Belum ada dokumen",
        description: "Unggah minimal Sertipikat atau KTP sesuai kebutuhan.",
      });
      return;
    }

    uploadDocuments(
      selectedFiles,
      selectedService.id,
      `Generate Surat - ${selectedService.title?.id || selectedService.id}`,
    );
  };

  const handleClear = () => {
    setActiveRequirementId(null);
    setSelectedFiles({});
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClearFile = (requirementId: string) => {
    setSelectedFiles((prev) => {
      const next = { ...prev };
      delete next[requirementId];
      return next;
    });
    reset();
  };

  // Date
  const dateNowStr = new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const sharedData: FillableData = {
    dateStamp: extractedData?.dateStamp || dateNowStr,
    city: extractedData?.city || extractedData?.kabupatenKota || "",
    grantorName: extractedData?.grantorName || extractedData?.namaPemilik || "",
    grantorNik: extractedData?.grantorNik || extractedData?.nikPemberi || "",
    grantorBirthPlaceDate:
      extractedData?.grantorBirthPlaceDate || extractedData?.ttlPemberi || "",
    grantorOccupation:
      extractedData?.grantorOccupation || extractedData?.pekerjaanPenjual || "",
    grantorAddress:
      extractedData?.grantorAddress || extractedData?.alamatPemberi || "",
    granteeName:
      extractedData?.granteeName || extractedData?.namaPenerima || "",
    granteeNIK:
      extractedData?.granteeNIK ||
      extractedData?.granteeNik ||
      extractedData?.nikPenerima ||
      "",
    granteeBirthPlaceDate:
      extractedData?.granteeBirthPlaceDate || extractedData?.ttlPenerima || "",
    granteeOccupation:
      extractedData?.granteeOccupation || extractedData?.pekerjaanPembeli || "",
    granteeAddress:
      extractedData?.granteeAddress || extractedData?.alamatPenerima || "",
    road: extractedData?.road || extractedData?.jalan || "",
    village: extractedData?.village || extractedData?.desaKelurahan || "",
    district: extractedData?.district || extractedData?.kecamatan || "",
    province: extractedData?.province || "",
    titleNumber:
      extractedData?.titleNumber || extractedData?.nomorHakSertipikat || "",
    area: extractedData?.area
      ? extractedData.area
      : extractedData?.luasTanahM2
        ? `${extractedData.luasTanahM2} m²`
        : "",
    nib: extractedData?.nib || "",
    imgDate: extractedData?.imgDate || "",
    imgNumber: extractedData?.imgNumber || "",
    titleType:
      extractedData?.titleType || extractedData?.jenisHak || "Hak Milik",
    certificateSerialNumber:
      extractedData?.certificateSerialNumber ||
      extractedData?.nomorSeriMaterai ||
      "",
    subject: extractedData?.subject || "SURAT KETERANGAN PENDAFTARAN TANAH",
    address: extractedData?.address || "",
    noSuratKuasa: extractedData?.noSuratKuasa || "",
    suratKuasaDate: extractedData?.suratKuasaDate || "",
  };

  const [isZipping, setIsZipping] = useState(false);

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const [kuasa, permohonan, pernyataan] = await Promise.all([
        createSuratKuasaFillable(sharedData),
        createSuratPermohonanFillable(sharedData),
        createSuratPernyataanFillable(sharedData),
      ]);
      zip.file("Surat Kuasa.pdf", kuasa);
      zip.file("Surat Permohonan.pdf", permohonan);
      zip.file("Surat Pernyataan.pdf", pernyataan);
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Surat-Surat.zip";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("ZIP generation failed", e);
      toaster.error({
        title: "Gagal membuat ZIP",
        description: "Terjadi kesalahan saat membuat file ZIP.",
      });
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <PageContainer p={4} pos={"relative"}>
      <CContainer flex={1} gap={4}>
        {/* Step 1: Select Service */}
        {!selectedService && (
          <ContainerLayout gap={6} flex={1}>
            <CContainer gap={1}>
              <P fontSize={"xl"} fontWeight={"semibold"} textAlign={"center"}>
                Buat Surat dari Dokumen Pendukung
              </P>
              <P color={"fg.subtle"} textAlign={"center"}>
                Pilih layanan lalu unggah Sertipikat dan KTP agar isi PDF lebih lengkap
              </P>
            </CContainer>

            {servicesLoading && <DAServiceSkeleton />}

            {!servicesLoading && servicesError && (
              <FeedbackRetry onRetry={onRetryServices} />
            )}

            {!servicesLoading && !servicesError && services && (
              <SimpleGrid minChildWidth={"200px"} gap={4}>
                {services.map((service) => (
                  <Box
                    key={service.id}
                    className={"clicky"}
                    flex={"1 1 200px"}
                    w={"full"}
                    minH={"200px"}
                    gap={8}
                    p={4}
                    border={"1px solid"}
                    borderColor={"border.subtle"}
                    rounded={themeConfig.radii.component}
                    cursor={"pointer"}
                    _hover={{
                      bg: "bg.muted",
                    }}
                    transition={"200ms"}
                    onClick={() => handleSelectService(service)}
                  >
                    <Img
                      src={imgUrl(service.icon)}
                      w={"40px"}
                      h={"40px"}
                      mb={"auto"}
                    />

                    <CContainer gap={2} mt={4}>
                      <P fontSize={"lg"} fontWeight={"semibold"}>
                        {service?.title?.[lang]}
                      </P>

                      <Tooltip content={service?.description?.[lang]}>
                        <P color={"fg.subtle"} lineClamp={2}>
                          {service?.description?.[lang]}
                        </P>
                      </Tooltip>
                    </CContainer>
                  </Box>
                ))}
              </SimpleGrid>
            )}

            {!servicesLoading &&
              !servicesError &&
              (!services || services.length === 0) && <FeedbackNoData />}
          </ContainerLayout>
        )}

        {/* Step 2: Upload & Extract */}
        {selectedService && (
          <>
            <ContainerLayout gap={6}>
              {/* Header with back button */}
              <HStack gap={4}>
                <Btn
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToServices}
                  p={0}
                >
                  <AppIcon icon={ArrowLeftIcon} />
                </Btn>

                <CContainer gap={0} flex={1}>
                  <P fontSize={"xl"} fontWeight={"semibold"}>
                    Buat Surat dari Dokumen Pendukung
                  </P>
                  <P color={"fg.subtle"} fontSize={"sm"}>
                    Layanan: {selectedService.title?.[lang]}
                  </P>
                </CContainer>
                <Btn
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setExtractedData(DUMMY_SURAT_KUASA_DATA as any)
                  }
                >
                  Bypass Test
                </Btn>
              </HStack>

              {/* File upload area */}
              <CContainer gap={4}>
                {visibleRequirements.length > 0 ? (
                  <CContainer gap={3}>
                    {visibleRequirements.map((requirement) => {
                      const requirementId = String(requirement.id);
                      const file = selectedFiles[requirementId];
                      const isMandatory = isCertificateRequirement(requirement);

                      return (
                        <Box
                          key={requirementId}
                          p={4}
                          border={"1px solid"}
                          borderColor={"border.muted"}
                          rounded={themeConfig.radii.container}
                          bg={"d0"}
                        >
                          <HStack
                            justify="space-between"
                            align="start"
                            gap={4}
                            flexWrap="wrap"
                          >
                            <VStack align="start" gap={1}>
                              <P fontWeight={"semibold"}>
                                {requirement.name}
                                {isMandatory ? " *" : ""}
                              </P>
                              <P color="fg.subtle" fontSize="sm">
                                {file
                                  ? `${file.name} - ${(file.size / 1024 / 1024).toFixed(2)} MB`
                                  : "Belum ada file terunggah"}
                              </P>
                              {!file && (
                                <P color="fg.subtle" fontSize="xs">
                                  Format .pdf, maksimal 100MB
                                </P>
                              )}
                            </VStack>

                            <HStack gap={2}>
                              <Btn
                                variant={file ? "outline" : "solid"}
                                colorPalette={themeConfig.colorPalette}
                                size="sm"
                                onClick={() => handleUploadClick(requirementId)}
                                disabled={isLoading}
                              >
                                <AppIcon
                                  icon={file ? FileIcon : UploadCloudIcon}
                                />
                                {file ? "Ganti File" : "Unggah PDF"}
                              </Btn>
                              {file && !isLoading && !extractedData && (
                                <Btn
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleClearFile(requirementId)}
                                  color={"fg.error"}
                                >
                                  Hapus
                                </Btn>
                              )}
                            </HStack>
                          </HStack>
                        </Box>
                      );
                    })}
                  </CContainer>
                ) : (
                  <Box
                    border={"1px solid"}
                    borderColor={"border.muted"}
                    rounded={themeConfig.radii.container}
                    p={4}
                  >
                    <P color="fg.subtle">
                      Requirement Sertipikat/KTP untuk layanan ini belum tersedia.
                    </P>
                  </Box>
                )}

                <Input
                  type="file"
                  accept=".pdf"
                  display="none"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />

                {Object.keys(selectedFiles).length > 0 && !extractedData && (
                  <Btn
                    colorPalette={themeConfig.colorPalette}
                    onClick={handleSubmit}
                    loading={isLoading}
                    w={["full", null, "auto"]}
                  >
                    {isLoading ? "Mengekstrak Data..." : "Mulai Ekstraksi Dokumen"}
                  </Btn>
                )}
              </CContainer>
            </ContainerLayout>

            {/* Loading indicator */}
            {isLoading && (
              <ContainerLayout flex={1} align="center" justify="center" p={10}>
                <VStack gap={4}>
                  <Spinner color={`${themeConfig.colorPalette}.fg`} />
                  <P>Sedang diproses AI, harap tunggu sebentar...</P>
                </VStack>
              </ContainerLayout>
            )}

            {/* Download results */}
            {extractedData && (
              <ContainerLayout gap={6}>
                <CContainer gap={2}>
                  <P fontSize="lg" fontWeight="semibold">
                    Hasil Ekstraksi Dokumen
                  </P>
                  <P color="fg.success">
                    Selesai! Anda dapat mengunduh surat-surat di bawah ini.
                  </P>
                </CContainer>

                <CContainer gap={4} align={"start"}>
                  <Btn
                    colorPalette={themeConfig.colorPalette}
                    onClick={handleDownloadZip}
                    loading={isZipping}
                    size={"lg"}
                  >
                    <AppIcon icon={DownloadIcon} />
                    {isZipping
                      ? "Menyiapkan ZIP..."
                      : "Unduh Semua Surat (ZIP)"}
                  </Btn>
                  <Btn
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    color="fg.subtle"
                    w="max"
                  >
                    <AppIcon icon={UploadCloudIcon} />
                    Unggah Dokumen Lainnya
                  </Btn>
                </CContainer>
              </ContainerLayout>
            )}
          </>
        )}
      </CContainer>
    </PageContainer>
  );
}
