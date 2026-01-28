"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Divider } from "@/components/ui/divider";
import { Img } from "@/components/ui/img";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { AppIcon } from "@/components/widget/AppIcon";
import { ConfirmationDisclosureTrigger } from "@/components/widget/ConfirmationDisclosure";
import { LucideIcon } from "@/components/widget/Icon";
import { AUTH_API_SIGNOUT } from "@/constants/apis";
import { OTHER_PRIVATE_NAVS } from "@/constants/navs";
import { SVGS_PATH } from "@/constants/paths";
import { BASE_ICON_BOX_SIZE } from "@/constants/sizes";
import useAuthMiddleware from "@/context/useAuthMiddleware";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useRequest from "@/hooks/useRequest";
import { clearAccessToken, clearUserData, getUserData } from "@/utils/auth";
import { back } from "@/utils/client";
import { pluckString } from "@/utils/string";
import { Icon, StackProps } from "@chakra-ui/react";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props__MiniMyProfile extends StackProps {
  onClose?: () => void;
}
export const MiniMyProfile = (props: Props__MiniMyProfile) => {
  // Props
  const { onClose, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const removeAuth = useAuthMiddleware((s) => s.removeAuth);

  // Hooks
  const { req } = useRequest({
    id: "signout",
    loadingMessage: { ...l.loading_signout },
    successMessage: { ...l.success_signout },
  });
  const router = useRouter();
  router.prefetch("/");
  // const pathname = usePathname();

  // States
  const user = getUserData();

  // Utils
  function onSignout() {
    back();

    const url = AUTH_API_SIGNOUT;
    const config = {
      url,
      method: "POST",
    };

    req({
      config,
      onResolve: {
        onSuccess: () => {
          clearAccessToken();
          clearUserData();
          removeAuth();
          router.push("/");
        },
        onError: () => {
          removeAuth();
          router.push("/");
        },
      },
    });
  }

  return (
    <CContainer
      rounded={themeConfig.radii.container}
      overflow={"clip"}
      color={"ibody"}
      {...restProps}
    >
      <CContainer>
        <Img
          src={user?.avatar || `${SVGS_PATH}/no-avatar.svg`}
          alt="avatar"
          aspectRatio={1}
        />

        <CContainer
          bg={"body"}
          p={4}
          // borderTop={"1px solid"}
          borderColor={"border.muted"}
        >
          <P fontWeight={"semibold"}>{user?.name || "Signed out"}</P>
          <P color={"fg.subtle"}>{user?.email || user?.username || "-"}</P>
        </CContainer>
      </CContainer>

      <Divider />

      <CContainer gap={1} p={"6px"}>
        {OTHER_PRIVATE_NAVS[0].list.map((nav) => {
          return (
            <NavLink key={nav.path} to={nav.path} w={"full"}>
              <Btn
                clicky={false}
                px={2}
                variant={"ghost"}
                justifyContent={"start"}
                pos={"relative"}
                onClick={() => {
                  onClose?.();
                }}
              >
                <AppIcon icon={nav.icon} />

                {nav.label || pluckString(l, nav.labelKey)}

                {/* {pathname.includes(nav.path) && (
                  <DotIndicator ml={"auto"} mr={1} />
                )} */}
              </Btn>
            </NavLink>
          );
        })}

        <ConfirmationDisclosureTrigger
          id="signout"
          title="Sign out"
          description={l.msg_signout}
          confirmLabel="Sign out"
          onConfirm={onSignout}
          confirmButtonProps={{
            color: "fg.error",
            colorPalette: "gray",
            variant: "outline",
          }}
          w={"full"}
          onClick={onClose}
        >
          <Btn
            clicky={false}
            px={2}
            variant={"ghost"}
            color={"fg.error"}
            justifyContent={"start"}
          >
            <Icon boxSize={BASE_ICON_BOX_SIZE}>
              <LucideIcon icon={LogOutIcon} />
            </Icon>
            Sign Out
          </Btn>
        </ConfirmationDisclosureTrigger>
      </CContainer>
    </CContainer>
  );
};
