"use client";

import dynamic from "next/dynamic";

// Dynamic import with ssr:false to prevent server-side rendering
// This page uses browser APIs (navigator) that are not available during SSR
const AppPermissionsContent = dynamic(() => import("./AppPermissionsContent"), {
  ssr: false,
});

export default function Page() {
  return <AppPermissionsContent />;
}
