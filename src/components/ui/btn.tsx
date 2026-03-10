"use client";

import { MAIN_BUTTON_SIZE } from "@/constants/styles";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Button, ButtonProps, IconButton } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface Props__Btn extends ButtonProps {
  children?: React.ReactNode;
  clicky?: boolean;
  iconButton?: boolean;
  focusStyle?: boolean;
}

export const Btn = forwardRef<HTMLButtonElement, Props__Btn>((props, ref) => {
  // Props
  const {
    children,
    className = "",
    clicky = true,
    iconButton = false,
    colorPalette = "gray",
    size,
    focusStyle = true,
    ...restProps
  } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();
  // const { colorMode } = useColorMode();
  // const graySolidActiveBg = useColorModeValue("gray.600", "gray.300");

  // Derived Values
  // const isSubtle = props?.variant === "subtle";
  // const isColorPaletteGray = colorPalette === "gray";
  const resolvedClassName = `${clicky ? "clicky" : ""} ${className}`.trim();

  // Memoized Active Style
  // const muteColor1 = useColorModeValue(
  //   `${colorPalette}.100 !important`,
  //   `${colorPalette}.900 !important`,
  // );
  // const [paletteHex] = useToken("colors", [`gray.500`]);
  // const muteColor1 = hexWithOpacity(paletteHex, 0.1);
  // const activeBg = useMemo(() => {
  //   if (colorPalette) {
  //     switch (props?.variant) {
  //       default:
  //         return isColorPaletteGray ? graySolidActiveBg : `${colorPalette}.600`;
  //       case "ghost":
  //       case "outline":
  //         return `${colorPalette}.subtle`;
  //       case "subtle":
  //       case "surface":
  //         return `${colorPalette}.muted`;
  //       case "plain":
  //         return "";
  //     }
  //   } else {
  //     switch (props?.variant) {
  //       default:
  //         return "";
  //       case "subtle":
  //       case "surface":
  //         return "gray.muted";
  //     }
  //   }
  // }, [props.variant, colorPalette, colorMode]);

  return iconButton ? (
    <IconButton
      ref={ref}
      className={resolvedClassName}
      colorPalette={colorPalette}
      size={size || (MAIN_BUTTON_SIZE as any)}
      rounded={themeConfig.radii.component}
      fontSize={"md"}
      // _hover={{ bg: activeBg }}
      // _active={{ bg: activeBg }}
      _focusVisible={
        focusStyle
          ? {
              outline: "2px solid {colors.gray.500}",
            }
          : {}
      }
      transition={"200ms"}
      {...restProps}
    >
      {children}
    </IconButton>
  ) : (
    <Button
      ref={ref}
      className={resolvedClassName}
      colorPalette={colorPalette}
      size={size || (MAIN_BUTTON_SIZE as any)}
      fontSize={"md"}
      fontWeight="medium"
      rounded={themeConfig.radii.component}
      // _hover={{ bg: activeBg }}
      // _active={{ bg: activeBg }}
      _focusVisible={
        focusStyle
          ? {
              outline: "2px solid {colors.gray.500}",
            }
          : {}
      }
      transition={"200ms"}
      {...restProps}
    >
      {children}
    </Button>
  );
});

export const PBtn = forwardRef<HTMLButtonElement, Props__Btn>((props, ref) => {
  // Contexts
  const { themeConfig } = useThemeConfig();

  return <Btn ref={ref} colorPalette={themeConfig.colorPalette} {...props} />;
});

Btn.displayName = "Btn";
PBtn.displayName = "PBtn";
