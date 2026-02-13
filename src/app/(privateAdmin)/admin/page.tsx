"use client";

import { CContainer } from "@/components/ui/c-container";
import useLang from "@/context/useLang";

export default function Page() {
  // Contexts
  const { l } = useLang();

  return <CContainer>{l.admin_navs.dashboard}</CContainer>;
}
