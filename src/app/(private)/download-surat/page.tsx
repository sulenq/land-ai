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
import { Interface__DAService } from "@/constants/interfaces";
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
} from "public/DADocTemplate/DAFillableTemplate";
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

export default function Page() {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { lang } = useLang();
  const setBreadcrumbs = useBreadcrumbs((s) => s.setBreadcrumbs);

  // Hooks
  const {
    uploadSertipikat,
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
    setSelectedFile(null);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toaster.error({
        title: "Format tidak didukung",
        description: "Harap unggah file PDF Sertipikat.",
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

    setSelectedFile(file);
    reset();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (!selectedFile || !selectedService) return;
    uploadSertipikat(selectedFile, selectedService.id);
  };

  const handleClear = () => {
    setSelectedFile(null);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Date
  const dateNowStr = new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const sharedData: FillableData = {
    dateStamp: dateNowStr,
    city: extractedData?.kabupatenKota || "",
    grantorName: extractedData?.namaPemilik || "",
    grantorNik: extractedData?.nikPemberi || "",
    grantorBirthPlaceDate: extractedData?.ttlPemberi || "",
    grantorOccupation: "",
    grantorAddress: extractedData?.alamatPemberi || "",
    granteeName: extractedData?.namaPenerima || "",
    granteeNIK: extractedData?.nikPenerima || "",
    granteeBirthPlaceDate: extractedData?.ttlPenerima || "",
    granteeOccupation: "",
    granteeAddress: extractedData?.alamatPenerima || "",
    road: extractedData?.jalan || "",
    village: extractedData?.desaKelurahan || "",
    district: extractedData?.kecamatan || "",
    province: "",
    titleNumber: extractedData?.nomorHakSertipikat || "",
    area: extractedData?.luasTanahM2 ? `${extractedData.luasTanahM2} m²` : "",
    nib: "",
    imgDate: "",
    imgNumber: "",
    titleType: extractedData?.jenisHak || "Hak Milik",
    certificateSerialNumber: extractedData?.nomorSeriMaterai || "",
    subject: "SURAT KETERANGAN PENDAFTARAN TANAH",
    address: "",
    noSuratKuasa: "",
    suratKuasaDate: "",
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
                Buat Surat dari Sertipikat
              </P>
              <P color={"fg.subtle"} textAlign={"center"}>
                Pilih layanan dokumen terlebih dahulu
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
                    Buat Surat dari Sertipikat
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
                {!selectedFile ? (
                  <Box
                    border={"2px dashed"}
                    borderColor={"border.muted"}
                    rounded={themeConfig.radii.container}
                    p={10}
                    textAlign="center"
                    cursor="pointer"
                    bg={"d0"}
                    _hover={{ bg: "whiteAlpha.50" }}
                    onClick={handleUploadClick}
                  >
                    <AppIcon
                      icon={UploadCloudIcon}
                      boxSize={8}
                      color="fg.subtle"
                      mb={4}
                    />
                    <P fontWeight={"medium"}>
                      Klik untuk mengunggah PDF Sertipikat
                    </P>
                    <P color="fg.subtle" fontSize="sm">
                      Format .pdf (Maks. 100MB)
                    </P>
                  </Box>
                ) : (
                  <HStack
                    p={4}
                    border={"1px solid"}
                    borderColor={"border.muted"}
                    rounded={themeConfig.radii.container}
                    bg={"d0"}
                    justify="space-between"
                  >
                    <HStack gap={4}>
                      <AppIcon
                        icon={FileIcon}
                        color={`${themeConfig.colorPalette}.fg`}
                      />
                      <VStack align="start" gap={0}>
                        <P fontWeight="medium" lineClamp={1}>
                          {selectedFile.name}
                        </P>
                        <P fontSize="sm" color="fg.subtle">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </P>
                      </VStack>
                    </HStack>
                    {!isLoading && !extractedData && (
                      <Btn
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        color={"fg.error"}
                      >
                        Batal
                      </Btn>
                    )}
                  </HStack>
                )}

                <Input
                  type="file"
                  accept=".pdf"
                  display="none"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />

                {selectedFile && !extractedData && (
                  <Btn
                    colorPalette={themeConfig.colorPalette}
                    onClick={handleSubmit}
                    loading={isLoading}
                    w={["full", null, "auto"]}
                  >
                    {isLoading ? "Mengekstrak Data..." : "Mulai Ekstraksi"}
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
                    Unggah Sertipikat Lainnya
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
