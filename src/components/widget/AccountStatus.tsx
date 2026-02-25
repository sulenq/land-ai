"use client";

import { Type__AccountStatus } from "@/constants/types";
import useLang from "@/context/useLang";
import { Status, StatusRootProps } from "@chakra-ui/react";

interface Props extends StatusRootProps {
  accountStatus: Type__AccountStatus;
}

export const AccountStatus = (props: Props) => {
  // Props
  const { accountStatus, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // States
  const accountStatuses: Record<
    string,
    { label: string; colorPalette: string }
  > = {
    INACTIVE: {
      label: l.inactive,
      colorPalette: "gray",
    },
    ACTIVE: {
      label: l.active,
      colorPalette: "green",
    },
    SUSPENDED: {
      label: l.suspended,
      colorPalette: "red",
    },
  };

  return (
    <Status.Root
      colorPalette={accountStatuses[accountStatus].colorPalette}
      {...restProps}
    >
      <Status.Indicator boxSize={"6px"} />

      {accountStatuses[accountStatus].label}
    </Status.Root>
  );
};
