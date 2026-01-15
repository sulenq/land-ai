import { Tooltip, TooltipProps } from "@/components/ui/tooltip";
import { DESKTOP_TOOLTIP_MAIN_AXIS } from "@/constants/sizes";

export const DesktopNavTooltip = (props: TooltipProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <Tooltip
      positioning={{
        placement: "right",
        offset: {
          mainAxis: DESKTOP_TOOLTIP_MAIN_AXIS,
        },
      }}
      {...restProps}
    >
      {children}
    </Tooltip>
  );
};
