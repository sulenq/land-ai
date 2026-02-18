"use client";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import { Avatar } from "@/components/ui/avatar";
import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Divider } from "@/components/ui/divider";
import {
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIcon } from "@/components/widget/AppIcon";
import {
  ChatSessions,
  ChatSessionsDisclosureTrigger,
} from "@/components/widget/ChatSessions";
import { ClampText } from "@/components/widget/ClampText";
import Clock from "@/components/widget/Clock";
import {
  DASessions,
  DASessionssDisclosureTrigger,
} from "@/components/widget/DASessions";
import HScroll from "@/components/widget/HScroll";
import { BottomIndicator, LeftIndicator } from "@/components/widget/Indicator";
import { Logo } from "@/components/widget/Logo";
import { MiniMyProfile } from "@/components/widget/MiniMyProfile";
import { DesktopNavTooltip, MobileNavLink } from "@/components/widget/Navs";
import {
  NavBreadcrumb,
  RESOLVED_NAVS,
  TopBar,
} from "@/components/widget/PageShell";
import { Today } from "@/components/widget/Today";
import { VerifyingScreen } from "@/components/widget/VerifyingScreen";
import { APP } from "@/constants/_meta";
import { AUTH_API_USER_PROFILE } from "@/constants/apis";
import { PRIVATE_NAV_GROUPS } from "@/constants/navs";
import { Props__Layout } from "@/constants/props";
import {
  BASE_ICON_BOX_SIZE,
  FIREFOX_SCROLL_Y_CLASS_PR_PREFIX,
} from "@/constants/sizes";
import {
  DESKTOP_CONTENT_CONTAINER_BG,
  DESKTOP_NAVS_BG,
  DESKTOP_NAVS_COLOR,
  DESKTOP_NAVS_POPOVER_MAIN_AXIS,
  DESKTOP_NAVS_TOOLTIP_MAIN_AXIS,
  MOBILE_CONTENT_CONTAINER_BG,
  MOBILE_NAV_LABEL_FONT_SIZE,
  MOBILE_NAVS_COLOR,
  MOBILE_POPOVER_MAIN_AXIS,
  NAVS_COLOR_PALETTE,
} from "@/constants/styles";
import useAuthMiddleware from "@/context/useAuthMiddleware";
import { useChatSessions } from "@/context/useChatSessions";
import useLang from "@/context/useLang";
import useNavs from "@/context/useNavs";
import { useNavsTabs } from "@/context/useNavsTabs";
import { useThemeConfig } from "@/context/useThemeConfig";
import useClickOutside from "@/hooks/useClickOutside";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import useRequest from "@/hooks/useRequest";
import useScreen from "@/hooks/useScreen";
import { last } from "@/utils/array";
import {
  getAccessToken,
  getUserData,
  setAccessToken,
  setUserData,
} from "@/utils/auth";
import { buildPrivateNavs } from "@/utils/formatter";
import { pluckString } from "@/utils/string";
import { getActiveNavs, imgUrl } from "@/utils/url";
import {
  Box,
  Center,
  HStack,
  Icon,
  StackProps,
  Tabs,
  TabsRootProps,
  VStack,
} from "@chakra-ui/react";
import { IconCircleFilled } from "@tabler/icons-react";
import {
  ChevronsUpDownIcon,
  FileScanIcon,
  FileTextIcon,
  MessageSquareIcon,
  SidebarCloseIcon,
  SidebarOpenIcon,
  UserIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useRef, useState } from "react";

const MiniMyProfilePopoverTrigger = (props: StackProps) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  useClickOutside(containerRef, onClose);

  // States
  const [open, setOpen] = useState<boolean>(false);

  // Utils
  function onOpen() {
    setOpen(true);
  }
  function onClose() {
    setOpen(false);
  }

  return (
    <PopoverRoot
      open={open}
      positioning={{
        placement: "right-end",
        offset: {
          mainAxis: DESKTOP_NAVS_POPOVER_MAIN_AXIS,
          crossAxis: 4,
        },
      }}
    >
      <PopoverTrigger asChild>
        <CContainer w={"fit"} onClick={onOpen} {...props} />
      </PopoverTrigger>

      <PopoverContent ref={containerRef} w={"235px"} zIndex={10}>
        <MiniMyProfile onClose={onClose} />
      </PopoverContent>
    </PopoverRoot>
  );
};

const MobileLayout = (props: Props__Layout) => {
  // Props
  const { children, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // Hooks
  const pathname = usePathname();
  const { sw } = useScreen();

  // States
  const user = getUserData();
  const activeNavs = getActiveNavs(pathname, RESOLVED_NAVS);
  const resolvedActiveNavs =
    sw < 360 ? [activeNavs[activeNavs.length - 1]] : activeNavs;
  const backPath = last(activeNavs)?.backPath;
  const isInProfileRoute = pathname.includes(`/profile`);

  return (
    <CContainer flex={1} overflowY={"auto"} {...restProps}>
      {/* Content */}
      <CContainer flex={1} bg={MOBILE_CONTENT_CONTAINER_BG} overflowY={"auto"}>
        {/* Content header */}
        <CContainer gap={2}>
          <HStack w={"full"} justify={"space-between"} pt={2} px={4}>
            <HStack>
              <Logo size={15} ml={"-4px"} />
            </HStack>

            <HStack>
              <Clock fontSize={"sm"} showTimezone={sw > 320} />

              <Today fontSize={"sm"} />
            </HStack>
          </HStack>

          <HStack
            gap={4}
            px={4}
            pb={2}
            borderBottom={"1px solid"}
            borderColor={"border.muted"}
            justify={"space-between"}
          >
            <NavBreadcrumb
              backPath={backPath}
              resolvedActiveNavs={resolvedActiveNavs}
              ml={backPath ? -2 : -1}
            />
          </HStack>
        </CContainer>

        {children}
      </CContainer>

      {/* Navs */}
      <HScroll borderTop={"1px solid"} borderColor={"border.subtle"}>
        <HStack w={"max"} gap={4} px={4} pt={3} pb={5} mx={"auto"}>
          {PRIVATE_NAV_GROUPS.map((group, idx) => {
            return (
              <Fragment key={idx}>
                {group.navs.map((nav) => {
                  const isMainNavActive = pathname.includes(nav.path);

                  return (
                    <Fragment key={nav.path}>
                      {!nav.children && (
                        <MobileNavLink
                          key={nav.path}
                          to={nav.children ? "" : nav.path}
                          color={isMainNavActive ? "" : "fg.muted"}
                          flex={1}
                        >
                          <AppIcon icon={nav.icon} boxSize={5} />

                          <P
                            textAlign={"center"}
                            lineClamp={1}
                            fontSize={MOBILE_NAV_LABEL_FONT_SIZE}
                          >
                            {nav.label || pluckString(l, nav.labelKey) || "-"}
                          </P>

                          {isMainNavActive && <BottomIndicator />}
                        </MobileNavLink>
                      )}

                      {nav.children && (
                        <>
                          <MenuRoot
                            positioning={{
                              placement: "top",
                              offset: {
                                mainAxis: MOBILE_POPOVER_MAIN_AXIS,
                              },
                            }}
                          >
                            <MenuTrigger asChild>
                              <CContainer
                                key={nav.path}
                                minW={"50px"}
                                align={"center"}
                                gap={1}
                                color={isMainNavActive ? "" : "fg.muted"}
                                pos={"relative"}
                                cursor={"pointer"}
                                flex={1}
                              >
                                <AppIcon icon={nav.icon} boxSize={5} />

                                <P
                                  fontSize={MOBILE_NAV_LABEL_FONT_SIZE}
                                  textAlign={"center"}
                                  lineClamp={1}
                                >
                                  {nav.label ||
                                    pluckString(l, nav.labelKey) ||
                                    "-"}
                                </P>

                                {isMainNavActive && <BottomIndicator />}
                              </CContainer>
                            </MenuTrigger>

                            <MenuContent>
                              {nav.children.map((subGroup, subGroupIndex) => {
                                return (
                                  <MenuItemGroup
                                    key={subGroupIndex}
                                    title={
                                      subGroup.labelKey
                                        ? pluckString(l, subGroup.labelKey)
                                        : ""
                                    }
                                  >
                                    {subGroup.navs.map((subNav) => {
                                      const isSubNavsActive =
                                        pathname === subNav.path;

                                      return (
                                        <NavLink
                                          key={subNav.path}
                                          w={"full"}
                                          to={subNav.path}
                                        >
                                          <MenuItem
                                            value={subNav.path}
                                            h={"44px"}
                                            px={3}
                                          >
                                            {isSubNavsActive && (
                                              <LeftIndicator />
                                            )}

                                            <P lineClamp={1}>
                                              {subNav.label ||
                                                pluckString(
                                                  l,
                                                  subNav.labelKey,
                                                ) ||
                                                "-"}
                                            </P>
                                          </MenuItem>
                                        </NavLink>
                                      );
                                    })}
                                  </MenuItemGroup>
                                );
                              })}
                            </MenuContent>
                          </MenuRoot>
                        </>
                      )}
                    </Fragment>
                  );
                })}
              </Fragment>
            );
          })}

          <ChatSessionsDisclosureTrigger flex={1}>
            <MobileNavLink
              color={pathname.includes("/c/") ? "" : MOBILE_NAVS_COLOR}
            >
              <AppIcon icon={MessageSquareIcon} boxSize={5} />

              <P
                textAlign={"center"}
                lineClamp={1}
                fontSize={MOBILE_NAV_LABEL_FONT_SIZE}
              >
                {l.navs.your_chats}
              </P>
            </MobileNavLink>
          </ChatSessionsDisclosureTrigger>

          <DASessionssDisclosureTrigger flex={1}>
            <MobileNavLink
              color={pathname.includes("/c/") ? "" : MOBILE_NAVS_COLOR}
            >
              <AppIcon icon={FileScanIcon} boxSize={5} />

              <P
                textAlign={"center"}
                lineClamp={1}
                fontSize={MOBILE_NAV_LABEL_FONT_SIZE}
              >
                {l.navs.your_da_analysis}
              </P>
            </MobileNavLink>
          </DASessionssDisclosureTrigger>

          <MiniMyProfilePopoverTrigger flex={1}>
            <VStack
              flex={1}
              color={MOBILE_NAVS_COLOR}
              cursor={"pointer"}
              gap={1}
            >
              {!user?.avatar?.filePath && (
                <AppIcon icon={UserIcon} boxSize={5} />
              )}

              {user?.avatar?.filePath && (
                <Avatar
                  src={imgUrl(user?.avatar?.filePath)}
                  name={user?.name}
                  size={"2xs"}
                />
              )}

              <P
                fontSize={MOBILE_NAV_LABEL_FONT_SIZE}
                textAlign={"center"}
                color={isInProfileRoute ? "" : MOBILE_NAVS_COLOR}
                lineClamp={1}
              >
                {l.profile}
              </P>
            </VStack>
          </MiniMyProfilePopoverTrigger>
        </HStack>
      </HScroll>
    </CContainer>
  );
};

interface Props__DesktopTabs extends TabsRootProps {}
const DesktopTabs = (props: Props__DesktopTabs) => {
  const TABS = [
    {
      value: "your_chats",
      labelKey: "navs.your_chats",
      icon: MessageSquareIcon,
      content: <ChatSessions />,
    },
    {
      value: "your_da",
      labelKey: "navs.your_da_analysis",
      icon: FileTextIcon,
      content: <DASessions />,
    },
  ];

  // Props
  const { ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const navsTabs = useNavsTabs((s) => s.navsTabs);
  const setNavsTabs = useNavsTabs((s) => s.setNavsTabs);

  return (
    <Tabs.Root defaultValue={navsTabs.current} w={"full"} mt={4} {...restProps}>
      <Tabs.List w={"full"}>
        {TABS.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            w={"full"}
            onClick={() => {
              setNavsTabs({
                current: tab.value,
              });
            }}
          >
            <Tooltip content={pluckString(l, tab.labelKey)}>
              <HStack w={"full"} justify={"center"}>
                <AppIcon icon={tab.icon} />

                <P lineClamp={1} textAlign={"left"}>
                  {pluckString(l, tab.labelKey)}
                </P>
              </HStack>
            </Tooltip>
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <CContainer minH={"200px"} pos={"relative"}>
        {TABS.map((tab, index) => (
          <Tabs.Content
            key={index}
            value={tab.value}
            position="absolute"
            inset="0"
            _open={{
              animationName: "fade-in, scale-in",
              animationDuration: "300ms",
            }}
            _closed={{
              animationName: "fade-out, scale-out",
              animationDuration: "120ms",
            }}
          >
            {tab.content}
          </Tabs.Content>
        ))}
      </CContainer>
    </Tabs.Root>
  );
};
const DesktopLayout = (props: Props__Layout) => {
  // Props
  const {
    children,
    //? navs, unused
    ...restProps
  } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const navsExpanded = useNavs((s) => s.navsExpanded);
  const toggleNavsExpanded = useNavs((s) => s.toggleNavsExpanded);

  // Hooks
  const pathname = usePathname();

  // States
  const user = getUserData();
  const roleId = user?.role;
  const isAllowed = (allowedRoles?: string[] | undefined) =>
    !allowedRoles ||
    allowedRoles.length === 0 ||
    (roleId && allowedRoles.includes(roleId));

  return (
    <HStack
      align={"stretch"}
      gap={0}
      h={"100dvh"}
      overflowY={"auto"}
      {...restProps}
    >
      {/* Sidebar */}
      <CContainer
        flexShrink={0}
        w={navsExpanded ? "250px" : "60px"}
        bg={navsExpanded ? "bgContent" : DESKTOP_NAVS_BG}
        borderColor={"border.muted"}
        transition={"200ms"}
      >
        {/* Logo & Sidebar Toggle */}
        <CContainer
          h={navsExpanded ? "52px" : ""}
          gap={1}
          px={3}
          pt={navsExpanded ? 0 : "6px"}
          justify={"center"}
        >
          {!navsExpanded && (
            <NavLink to="/">
              <Center w={"36px"} h={"40px"} mr={"auto"}>
                <Logo size={15} />
              </Center>
            </NavLink>
          )}

          <HStack justify={"space-between"} h={"40px"}>
            {navsExpanded && (
              <NavLink to="/">
                <HStack ml={"6px"} gap={3}>
                  <Logo size={15} />

                  <P
                    w={"full"}
                    fontSize={16}
                    fontWeight={"semibold"}
                    lineClamp={1}
                  >
                    {APP.name}
                  </P>
                </HStack>
              </NavLink>
            )}

            {/* Toggle Side Navs */}
            <Tooltip
              content={navsExpanded ? l.minimize : l.maximize}
              positioning={{
                placement: "right",
                offset: {
                  mainAxis: DESKTOP_NAVS_TOOLTIP_MAIN_AXIS,
                },
              }}
            >
              <Btn
                order={navsExpanded ? 2 : 1}
                iconButton
                clicky={false}
                w={"36px"}
                variant={"ghost"}
                colorPalette={NAVS_COLOR_PALETTE}
                onClick={toggleNavsExpanded}
                color={DESKTOP_NAVS_COLOR}
              >
                <AppIcon
                  icon={navsExpanded ? SidebarCloseIcon : SidebarOpenIcon}
                  boxSize={BASE_ICON_BOX_SIZE}
                />
              </Btn>
            </Tooltip>
          </HStack>
        </CContainer>

        {/* Navs */}
        <CContainer
          className="scrollY"
          overflowX={"clip"}
          flex={1}
          gap={1}
          p={3}
          pr={`calc(12px - ${FIREFOX_SCROLL_Y_CLASS_PR_PREFIX})`}
          mt={navsExpanded ? "12px" : 0}
        >
          {/* Private Navs */}
          <CContainer gap={1}>
            {PRIVATE_NAV_GROUPS.map((group, groupIndex) => {
              return (
                <CContainer key={groupIndex} gap={1}>
                  {navsExpanded && group.labelKey && (
                    <ClampText
                      fontSize={"sm"}
                      fontWeight={"semibold"}
                      letterSpacing={"wide"}
                      color={"fg.subtle"}
                      ml={1}
                      mb={1}
                    >
                      {pluckString(l, group.labelKey)}
                    </ClampText>
                  )}

                  {group.navs.map((nav) => {
                    if (!isAllowed(nav.allowedRoles)) return null;

                    const hasSubMenus = nav.children && !nav.invisibleChildren;
                    const isMainNavsActive = pathname.includes(nav.path);

                    return (
                      <Fragment key={nav.path}>
                        {!hasSubMenus && (
                          <NavLink key={nav.path} to={nav.path} w={"full"}>
                            <DesktopNavTooltip
                              content={
                                nav.label || pluckString(l, nav.labelKey) || "-"
                              }
                            >
                              <Btn
                                iconButton={navsExpanded ? false : true}
                                clicky={false}
                                gap={4}
                                px={2}
                                justifyContent={"start"}
                                variant={"ghost"}
                                color={
                                  isMainNavsActive ? "" : DESKTOP_NAVS_COLOR
                                }
                              >
                                {isMainNavsActive && nav.icon && (
                                  <LeftIndicator />
                                )}

                                {nav.icon && (
                                  <AppIcon
                                    icon={nav.icon}
                                    boxSize={BASE_ICON_BOX_SIZE}
                                  />
                                )}

                                {!nav.icon && (
                                  <Icon
                                    boxSize={2}
                                    color={
                                      isMainNavsActive
                                        ? themeConfig.primaryColor
                                        : "d2"
                                    }
                                  >
                                    <IconCircleFilled />
                                  </Icon>
                                )}

                                {navsExpanded && (
                                  <P lineClamp={1} textAlign={"left"}>
                                    {nav.label ||
                                      pluckString(l, nav.labelKey) ||
                                      "-"}
                                  </P>
                                )}
                              </Btn>
                            </DesktopNavTooltip>
                          </NavLink>
                        )}

                        {hasSubMenus && (
                          <>
                            {!navsExpanded && (
                              <MenuRoot
                                positioning={{
                                  placement: "right-start",
                                  offset: {
                                    mainAxis: DESKTOP_NAVS_POPOVER_MAIN_AXIS,
                                  },
                                }}
                              >
                                <DesktopNavTooltip
                                  content={
                                    nav.label ||
                                    pluckString(l, nav.labelKey) ||
                                    "-"
                                  }
                                >
                                  <CContainer>
                                    <MenuTrigger asChild>
                                      <Btn
                                        iconButton
                                        clicky={false}
                                        px={2}
                                        justifyContent="start"
                                        variant="ghost"
                                        colorPalette={NAVS_COLOR_PALETTE}
                                        pos="relative"
                                        color={
                                          isMainNavsActive
                                            ? ""
                                            : DESKTOP_NAVS_COLOR
                                        }
                                      >
                                        {isMainNavsActive && <LeftIndicator />}
                                        <AppIcon
                                          icon={nav.icon}
                                          boxSize={BASE_ICON_BOX_SIZE}
                                        />
                                      </Btn>
                                    </MenuTrigger>
                                  </CContainer>
                                </DesktopNavTooltip>

                                <MenuContent>
                                  {nav.children?.map(
                                    (subGroup, subGroupIndex) => (
                                      <MenuItemGroup
                                        key={subGroupIndex}
                                        gap={1}
                                        title={
                                          subGroup.labelKey
                                            ? pluckString(l, subGroup.labelKey)
                                            : ""
                                        }
                                      >
                                        {subGroup.navs.map((subNav) => {
                                          const isSubNavsActive =
                                            pathname === subNav.path;

                                          return (
                                            <NavLink
                                              key={subNav.path}
                                              to={subNav.path}
                                              w="full"
                                            >
                                              <Tooltip
                                                content={
                                                  subNav.label ||
                                                  pluckString(
                                                    l,
                                                    subNav.labelKey,
                                                  ) ||
                                                  "-"
                                                }
                                                positioning={{
                                                  placement: "right",
                                                  offset: { mainAxis: 12 },
                                                }}
                                              >
                                                <MenuItem
                                                  value={subNav.path}
                                                  px={3}
                                                  color={
                                                    isSubNavsActive
                                                      ? ""
                                                      : DESKTOP_NAVS_COLOR
                                                  }
                                                >
                                                  {isSubNavsActive && (
                                                    <LeftIndicator />
                                                  )}
                                                  <P lineClamp={1}>
                                                    {subNav.label ||
                                                      pluckString(
                                                        l,
                                                        subNav.labelKey,
                                                      ) ||
                                                      "-"}
                                                  </P>
                                                </MenuItem>
                                              </Tooltip>
                                            </NavLink>
                                          );
                                        })}
                                      </MenuItemGroup>
                                    ),
                                  )}
                                </MenuContent>
                              </MenuRoot>
                            )}

                            {navsExpanded && (
                              <AccordionRoot multiple>
                                <AccordionItem
                                  value={nav.path}
                                  border="none"
                                  rounded={themeConfig.radii.component}
                                  _open={{ bg: "transparent" }}
                                >
                                  <DesktopNavTooltip
                                    content={pluckString(l, nav.labelKey)}
                                  >
                                    <Btn
                                      as={AccordionItemTrigger}
                                      clicky={false}
                                      variant="ghost"
                                      px={2}
                                      justifyContent="start"
                                      pr="10px"
                                      pos="relative"
                                      bg="transparent"
                                      color={
                                        isMainNavsActive
                                          ? ""
                                          : DESKTOP_NAVS_COLOR
                                      }
                                      _hover={{ bg: "bg.muted" }}
                                    >
                                      {isMainNavsActive && <LeftIndicator />}
                                      <HStack gap={4}>
                                        <AppIcon
                                          icon={nav.icon}
                                          boxSize={BASE_ICON_BOX_SIZE}
                                        />
                                        <P lineClamp={1} textAlign="left">
                                          {nav.label ||
                                            pluckString(l, nav.labelKey) ||
                                            "-"}
                                        </P>
                                      </HStack>
                                    </Btn>
                                  </DesktopNavTooltip>

                                  <AccordionItemContent p={0}>
                                    <CContainer gap={1} pt={1}>
                                      {nav.children?.map(
                                        (subGroup, subGroupIndex) => (
                                          <CContainer
                                            key={subGroupIndex}
                                            gap={1}
                                          >
                                            {subGroup.labelKey && (
                                              <ClampText
                                                fontSize="sm"
                                                fontWeight="semibold"
                                                color="fg.subtle"
                                                ml={9}
                                                mt={1}
                                              >
                                                {pluckString(
                                                  l,
                                                  subGroup.labelKey,
                                                )}
                                              </ClampText>
                                            )}

                                            {subGroup.navs.map(
                                              (subNav, subNavIndex) => {
                                                const isFirstIdx =
                                                  subNavIndex === 0;
                                                const isLastIdx =
                                                  subNavIndex ===
                                                  subGroup.navs.length - 1;
                                                const isSubNavsActive =
                                                  pathname === subNav.path;

                                                return (
                                                  <NavLink
                                                    key={subNav.path}
                                                    to={subNav.path}
                                                    w="full"
                                                  >
                                                    <Tooltip
                                                      content={
                                                        subNav.label ||
                                                        pluckString(
                                                          l,
                                                          subNav.labelKey,
                                                        ) ||
                                                        "-"
                                                      }
                                                      positioning={{
                                                        placement: "right",
                                                        offset: {
                                                          mainAxis:
                                                            DESKTOP_NAVS_TOOLTIP_MAIN_AXIS +
                                                            2,
                                                        },
                                                      }}
                                                    >
                                                      <HStack
                                                        pos="relative"
                                                        pl="8.5px"
                                                        gap={1}
                                                      >
                                                        {!isFirstIdx && (
                                                          <Box
                                                            w="1px"
                                                            h="calc(50% + 2px)"
                                                            pos="absolute"
                                                            top="-2px"
                                                            left="18px"
                                                            bg="d3"
                                                          />
                                                        )}
                                                        {!isLastIdx && (
                                                          <Box
                                                            w="1px"
                                                            h="calc(50% + 2px)"
                                                            pos="absolute"
                                                            bottom="-2px"
                                                            left="18px"
                                                            bg="d3"
                                                          />
                                                        )}

                                                        <Center
                                                          boxSize={
                                                            BASE_ICON_BOX_SIZE
                                                          }
                                                          zIndex={2}
                                                          ml="1.5px"
                                                        >
                                                          <Icon
                                                            boxSize={2}
                                                            color={
                                                              isSubNavsActive
                                                                ? themeConfig.primaryColor
                                                                : "bg.emphasized"
                                                            }
                                                          >
                                                            <IconCircleFilled
                                                              stroke={1.5}
                                                            />
                                                          </Icon>
                                                        </Center>

                                                        <Btn
                                                          clicky={false}
                                                          flex={1}
                                                          gap={3}
                                                          px={3}
                                                          rounded={`calc(${themeConfig.radii.component})`}
                                                          justifyContent="start"
                                                          variant="ghost"
                                                          colorPalette={
                                                            NAVS_COLOR_PALETTE
                                                          }
                                                          color={
                                                            isSubNavsActive
                                                              ? ""
                                                              : DESKTOP_NAVS_COLOR
                                                          }
                                                        >
                                                          <P
                                                            lineClamp={1}
                                                            textAlign="left"
                                                          >
                                                            {subNav.label ||
                                                              pluckString(
                                                                l,
                                                                subNav.labelKey,
                                                              ) ||
                                                              "-"}
                                                          </P>
                                                        </Btn>
                                                      </HStack>
                                                    </Tooltip>
                                                  </NavLink>
                                                );
                                              },
                                            )}
                                          </CContainer>
                                        ),
                                      )}
                                    </CContainer>
                                  </AccordionItemContent>
                                </AccordionItem>
                              </AccordionRoot>
                            )}
                          </>
                        )}
                      </Fragment>
                    );
                  })}
                </CContainer>
              );
            })}
          </CContainer>

          {navsExpanded ? (
            <DesktopTabs />
          ) : (
            <>
              <ChatSessionsDisclosureTrigger mr={"auto"}>
                <DesktopNavTooltip content={l.navs.your_chats}>
                  <Btn iconButton clicky={false} variant={"ghost"}>
                    {pathname.includes("/c/") && <LeftIndicator />}

                    <AppIcon icon={MessageSquareIcon} />
                  </Btn>
                </DesktopNavTooltip>
              </ChatSessionsDisclosureTrigger>

              <DASessionssDisclosureTrigger mr={"auto"}>
                <DesktopNavTooltip content={l.navs.your_da_analysis}>
                  <Btn iconButton clicky={false} variant={"ghost"}>
                    {pathname.includes("/da/") && <LeftIndicator />}

                    <AppIcon icon={FileTextIcon} />
                  </Btn>
                </DesktopNavTooltip>
              </DASessionssDisclosureTrigger>
            </>
          )}
        </CContainer>

        <Divider />

        <CContainer p={3}>
          <MiniMyProfilePopoverTrigger w={"full"}>
            <HStack
              gap={4}
              w={navsExpanded ? "full" : "36px"}
              px={"6px"}
              py={2}
              rounded={themeConfig.radii.component}
              cursor={"pointer"}
              _hover={{
                bg: "gray.subtle",
              }}
              justify={navsExpanded ? "" : "center"}
              transition={"200ms"}
              pos={"relative"}
            >
              <Avatar
                src={imgUrl(user?.avatar?.filePath)}
                name={user?.name}
                size={navsExpanded ? "md" : "2xs"}
                mr={"auto"}
              />

              {navsExpanded && (
                <>
                  <CContainer>
                    <P lineClamp={1} fontWeight={"semibold"}>
                      {user?.name || user?.email || "Signed out"}
                    </P>
                    <P lineClamp={1} color={"fg.subtle"}>
                      {user?.name ? user?.email || user?.username : "-"}
                    </P>
                  </CContainer>

                  <AppIcon
                    icon={ChevronsUpDownIcon}
                    boxSize={BASE_ICON_BOX_SIZE}
                    color={"fg.subtle"}
                    mr={1}
                  />
                </>
              )}
            </HStack>
          </MiniMyProfilePopoverTrigger>
        </CContainer>
      </CContainer>

      {/* Content */}
      <CContainer
        // p={3}
        pl={0}
        bg={DESKTOP_CONTENT_CONTAINER_BG}
        overflowY={"auto"}
        color={"text"}
      >
        <CContainer
          flex={1}
          bg={"body"}
          // rounded={themeConfig.radii.container}
          // borderLeft={"1px solid"}
          borderColor={"border.muted"}
          overflow={"auto"}
        >
          <TopBar />

          {children}
        </CContainer>
      </CContainer>
    </HStack>
  );
};

const TheApp = (props: Props__Layout) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const chatSessions = useChatSessions((s) => s.chatSessions);

  // Hooks
  const iss = useIsSmScreenWidth();

  // States
  const NAVS = buildPrivateNavs({ chats: chatSessions, daSessions: [] });

  return (
    <CContainer id="app_layout" h={"100dvh"} {...restProps}>
      {iss ? (
        <MobileLayout navs={NAVS} {...props} />
      ) : (
        <DesktopLayout navs={NAVS} {...props} />
      )}
    </CContainer>
  );
};
export default function Layout(props: Props__Layout) {
  // Toggle auth guard
  const ENABLE_AUTH_GUARD = process.env.NEXT_PUBLIC_ENV !== "development";

  // Context / stores
  const authToken = getAccessToken();
  const verifiedAuthToken = useAuthMiddleware((s) => s.verifiedAuthToken);
  const setRole = useAuthMiddleware((s) => s.setRole);
  const setPermissions = useAuthMiddleware((s) => s.setPermissions);
  const setVerifiedAuthToken = useAuthMiddleware((s) => s.setVerifiedAuthToken);

  // Refs
  const verificationStartedRef = useRef(false);

  // Hooks
  const router = useRouter();
  const { req, loading } = useRequest({
    id: "user-profile",
    showLoadingToast: false,
    showSuccessToast: false,
    showErrorToast: false,
  });

  // If guard disabled -> render directly
  if (!ENABLE_AUTH_GUARD) {
    return <TheApp {...props} />;
  }

  // If there's no token at all -> redirect immediately
  if (!authToken) {
    router.replace("/");
    return <VerifyingScreen />;
  }

  // If token exists but not verified yet
  if (authToken && !verifiedAuthToken) {
    if (!verificationStartedRef.current) {
      verificationStartedRef.current = true;

      const config = { method: "GET", url: AUTH_API_USER_PROFILE };

      req({
        config,
        onResolve: {
          onSuccess: (r: any) => {
            const user = r.data.data;
            setAccessToken(authToken);
            setUserData(user);
            setVerifiedAuthToken(authToken);
            setRole(user?.role);
            setPermissions(user?.role?.permissions);
          },
          onError: () => {
            setVerifiedAuthToken(null);
          },
        },
      });
    }

    return <VerifyingScreen />;
  }

  // If request hook return loading
  if (loading) {
    return <VerifyingScreen />;
  }

  // After verification, if still invalid -> redirect
  if (!verifiedAuthToken) {
    router.replace("/");
    return <VerifyingScreen />;
  }

  return <TheApp {...props} />;
}
