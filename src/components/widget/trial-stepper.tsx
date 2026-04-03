import { Btn } from "@/components/ui/btn";
import { P } from "@/components/ui/p";
import { Tooltip } from "@/components/ui/tooltip";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useTrialSessionContext } from "@/context/useTrialSessionContext";
import { HStack, Steps, StepsRootProps } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const TRIAL_STEPS = [
  {
    title: "Pilih Layanan",
    description:
      "Peserta memilih satu kategori pemeriksaan dari empat pilihan yang tersedia: SKPT, Pengecekan Sertifikat, Hak Tanggungan, atau Peralihan Hak. Setiap kategori berisi 3 berkas dengan dokumen-dokumen nyata yang harus diperiksa.",
  },
  {
    title: "Fase Manual",
    description:
      "Periksa setiap dokumen satu per satu tanpa bantuan sistem. Buka setiap dokumen, tinjau isinya, lalu putuskan: Valid atau Tolak.",
  },
  {
    title: "Fase AI-Assisted",
    description:
      "Periksa berkas dengan dukungan sistem AI, tinjau hasilnya, lalu putuskan: Valid atau Tolak.",
  },
  {
    title: "Hasil",
    description:
      "Setelah kedua fase selesai, sistem menampilkan perbandingan waktu per berkas antara fase Manual dan AI-Assisted, sehingga peserta dapat melihat selisih efisiensi secara langsung.",
  },
];

export const TrialStepper = (props: StepsRootProps) => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const trialSession = useTrialSessionContext((s) => s.trialSession);
  const trialId = trialSession?.id;
  const step = trialSession?.step ?? 1;
  const setStep = useTrialSessionContext((s) => s.setStep);
  const prevStep = useTrialSessionContext((s) => s.prevStep);
  const nextStep = useTrialSessionContext((s) => s.nextStep);

  // Hooks
  const router = useRouter();

  // Derived Values
  const resolvedStep = step - 1;

  // TODO get trial session and redirect based on step, source of truth from BE
  // 1 => /service-trial/select-da-service
  // 2 => /service-trial/{trialId}
  // 3 => /service-trial/{trialId}
  // 4 => /service-trial/{trialId}/summary

  useEffect(() => {
    if (!trialSession || !trialId) return;

    switch (step) {
      case 2:
        router.push(`/service-trial/${trialId}/manual-phase`);
        break;
      case 3:
        router.push(`/service-trial/${trialId}/ai-phase`);
        break;
      case 4:
        router.push(`/service-trial/${trialId}/summary`);
        break;
      default:
        router.push(`/service-trial/select-da-service`);
        break;
    }
  }, [step, trialId, router]);

  return (
    <Steps.Root
      step={resolvedStep}
      onStepChange={(e) => setStep(e.step)}
      count={TRIAL_STEPS.length}
      gap={6}
      colorPalette={themeConfig.colorPalette}
      {...props}
    >
      <Steps.List>
        {TRIAL_STEPS.map((step, index) => (
          <Steps.Item key={index} index={index} title={step.title}>
            <Steps.Indicator />

            <Tooltip content={step.title}>
              <Steps.Title lineClamp={1}>{step.title}</Steps.Title>
            </Tooltip>

            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>

      <HStack mx={"auto"}>
        <P>Tes stepper</P>

        <Btn size={"xs"} variant={"outline"} onClick={prevStep}>
          Prev
        </Btn>
        <Btn size={"xs"} variant={"outline"} onClick={nextStep}>
          Next
        </Btn>
      </HStack>

      {TRIAL_STEPS.map((step, index) => (
        <Steps.Content
          key={index}
          index={index}
          color={"fg.subtle"}
          textAlign={"center"}
        >
          {step.description}
        </Steps.Content>
      ))}
    </Steps.Root>
  );
};
