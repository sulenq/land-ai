"use client";

import { P } from "@/components/ui/p";
import {
  ConstrainedContainer,
  PageContainer,
} from "@/components/widget/PageShell";
import { TrialStepper } from "@/components/widget/trial-stepper";

export default function Page() {
  return (
    <PageContainer p={8}>
      <ConstrainedContainer flex={1}>
        <TrialStepper />

        <P fontSize={"100px"} m={"auto"}>
          Soon
        </P>
      </ConstrainedContainer>
    </PageContainer>
  );
}
