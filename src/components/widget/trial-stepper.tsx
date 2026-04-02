import { Btn } from "@/components/ui/btn";
import { P } from "@/components/ui/p";
import { Tooltip } from "@/components/ui/tooltip";
import { useTrialSessionContext } from "@/context/useTrialSessionContext";
import { HStack, Steps, StepsRootProps } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const TRIAL_STEPS = [
  {
    title: "Pilih Layanan",
    description:
      "Pilih jenis layanan pertanahan untuk memulai simulasi uji coba.",
  },
  {
    title: "Fase Manual",
    description:
      "Validasi 3 berkas secara mandiri (setujui/tolak) untuk menetapkan standar durasi pemeriksaan manual.",
  },
  {
    title: "Fase AI-Assisted",
    description:
      "Validasi 3 hasil analisis otomatis dari AI untuk membandingkan akurasi dan efisiensi waktu.",
  },
  {
    title: "Ringkasan",
    description:
      "Tinjau perbandingan performa antara pemeriksaan manual dan bantuan AI dari seluruh sesi simulasi.",
  },
];

export const TrialStepper = (props: StepsRootProps) => {
  // Contexts
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

  // TODO get trial session and redirect based on step
  // 1 => /service-trial
  // 2 => /service-trial/{trialId}
  // 3 => /service-trial/{trialId}
  // 4 => /service-trial/{trialId}/summary

  useEffect(() => {
    if (!trialSession || !trialId) return;

    switch (step) {
      case 2:
      case 3:
        router.push(`/service-trial/${trialId}`);
        break;
      case 4:
        router.push(`/service-trial/${trialId}/summary`);
        break;
      default:
        router.push("/service-trial");
        break;
    }
  }, [step, trialId, router]);

  return (
    <Steps.Root
      step={resolvedStep}
      onStepChange={(e) => setStep(e.step)}
      count={TRIAL_STEPS.length}
      gap={6}
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
          color={"fg.muted"}
          textAlign={"center"}
        >
          {step.description}
        </Steps.Content>
      ))}
    </Steps.Root>
  );
};
