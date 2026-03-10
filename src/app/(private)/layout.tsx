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
import { Tooltip } from "@/components/ui/tooltip";
import { AppIcon } from "@/components/widget/AppIcon";
import { AuthGuard } from "@/components/widget/AuthGuard";
import {
  ChatSessions,
  ChatSessionsDisclosureTrigger,
} from "@/components/widget/ChatSessions";
import { ClampText } from "@/components/widget/ClampText";
import { Clock } from "@/components/widget/Clock";
import {
  DASessions,
  DASessionssDisclosureTrigger,
} from "@/components/widget/DASessions";
import { HScroll } from "@/components/widget/HScroll";

import { BottomIndicator, LeftIndicator } from "@/components/widget/Indicator";
import { Logo } from "@/components/widget/Logo";
import { MContainer } from "@/components/widget/MContainer";
import { DesktopNavTooltip, MobileNavLink } from "@/components/widget/Navs";
import { NavBreadcrumb, TopBar } from "@/components/widget/PageShell";
import { ProfileMenuTrigger } from "@/components/widget/ProfileMenu";
import { Today } from "@/components/widget/Today";
import { APP } from "@/constants/_meta";
import { PRIVATE_NAV_GROUPS } from "@/constants/navs";
import { Props__Layout } from "@/constants/props";
import {
  BASE_ICON_BOX_SIZE,
  DESKTOP_CONTENT_CONTAINER_BG,
  DESKTOP_NAVS_BG,
  DESKTOP_NAVS_COLOR,
  DESKTOP_NAVS_POPOVER_MAIN_AXIS,
  DESKTOP_NAVS_TOOLTIP_MAIN_AXIS,
  FIREFOX_SCROLL_Y_CLASS_PR_PREFIX,
  MOBILE_CONTENT_CONTAINER_BG,
  MOBILE_NAV_LABEL_FONT_SIZE,
  MOBILE_NAVS_COLOR,
  MOBILE_POPOVER_MAIN_AXIS,
  NAVS_COLOR_PALETTE,
} from "@/constants/styles";
import useLang from "@/context/useLang";
import useNavs from "@/context/useNavs";
import { useNavsTabs } from "@/context/useNavsTabs";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import useScreen from "@/hooks/useScreen";
import { last } from "@/utils/array";
import { getUserData } from "@/utils/auth";
import { pluckString } from "@/utils/string";
import { getActiveNavs, imgUrl } from "@/utils/url";
import {
  Box,
  Center,
  HStack,
  Icon,
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
import { usePathname } from "next/navigation";
import { Fragment } from "react";

const DesktopTabs = (props: TabsRootProps) => {
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
  const { themeConfig } = useThemeConfig();
  const navsTabs = useNavsTabs((s) => s.navsTabs);
  const setNavsTabs = useNavsTabs((s) => s.setNavsTabs);

  return (
    <Tabs.Root
      defaultValue={navsTabs.current}
      fitted
      variant={"subtle"}
      {...restProps}
    >
      <Tabs.List>
        {TABS.map((tab) => {
          const isActive = navsTabs.current === tab.value;

          return (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              // color={isActive ? `${themeConfig.colorPalette}.fg` : ""}
              bg={isActive ? "d1" : ""}
              rounded={themeConfig.radii.component}
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
          );
        })}
      </Tabs.List>

      <CContainer minH={"200px"} pos={"relative"} mt={-2}>
        {TABS.map((tab, index) => (
          <Tabs.Content
            key={index}
            value={tab.value}
            position="absolute"
            inset="0"
            _open={{
              animationName: "fade-in",
              animationDuration: "300ms",
            }}
            _closed={{
              animationName: "fade-out",
              animationDuration: "200ms",
            }}
          >
            <CContainer pb={3}>{tab.content}</CContainer>
          </Tabs.Content>
        ))}
      </CContainer>
    </Tabs.Root>
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
  const activeNavs = getActiveNavs(pathname);
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
        <HStack w={"max"} gap={2} px={4} pt={3} pb={5} mx={"auto"}>
          {PRIVATE_NAV_GROUPS.map((group, index) => {
            return (
              <Fragment key={index}>
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
                            {nav?.label || pluckString(l, nav.labelKey) || "-"}
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
                                  {nav?.label ||
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

          <ChatSessionsDisclosureTrigger flex={1} align={"center"}>
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

          <DASessionssDisclosureTrigger flex={1} align={"center"}>
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

          <ProfileMenuTrigger flex={1}>
            <VStack
              flex={1}
              color={MOBILE_NAVS_COLOR}
              cursor={"pointer"}
              gap={1}
            >
              {!user?.avatar?.[0]?.filePath && (
                <AppIcon icon={UserIcon} boxSize={5} />
              )}

              {user?.avatar?.[0]?.filePath && (
                <Avatar
                  src={imgUrl(user?.avatar?.[0]?.filePath)}
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
          </ProfileMenuTrigger>
        </HStack>
      </HScroll>
    </CContainer>
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
  const isNavsExpanded = useNavs((s) => s.isNavsExpanded);
  const toggleNavsExpanded = useNavs((s) => s.toggleNavsExpanded);

  // Hooks
  const pathname = usePathname();

  // States
  const user = getUserData();
  const roleId = user?.role;
  const isAllowed = (allowedRoles?: number[] | undefined) =>
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
        w={isNavsExpanded ? "250px" : "60px"}
        bg={isNavsExpanded ? "bgContent" : DESKTOP_NAVS_BG}
        // bg={"body"}
        // border={isNavsExpanded ? "1px solid" : ""}
        borderColor={"border.muted"}
        transition={"200ms"}
      >
        {/* Logo & Sidebar Toggle */}
        <CContainer
          h={isNavsExpanded ? "52px" : ""}
          gap={1}
          px={3}
          pt={isNavsExpanded ? 0 : "6px"}
          justify={"center"}
        >
          {!isNavsExpanded && (
            <NavLink to="/">
              <Center w={"36px"} h={"40px"} ml={"-1px"} mr={"auto"}>
                <Logo size={15} />
              </Center>
            </NavLink>
          )}

          <HStack justify={"space-between"} h={"40px"}>
            {isNavsExpanded && (
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
              content={isNavsExpanded ? l.minimize : l.maximize}
              positioning={{
                placement: "right",
                offset: {
                  mainAxis: DESKTOP_NAVS_TOOLTIP_MAIN_AXIS,
                },
              }}
            >
              <Btn
                order={isNavsExpanded ? 2 : 1}
                iconButton
                clicky={false}
                w={"36px"}
                variant={"ghost"}
                colorPalette={NAVS_COLOR_PALETTE}
                onClick={toggleNavsExpanded}
                color={DESKTOP_NAVS_COLOR}
              >
                <AppIcon
                  icon={isNavsExpanded ? SidebarCloseIcon : SidebarOpenIcon}
                  boxSize={BASE_ICON_BOX_SIZE}
                />
              </Btn>
            </Tooltip>
          </HStack>
        </CContainer>

        {/* Navs */}
        <MContainer
          className="scrollY"
          overflowX={"clip"}
          flex={1}
          gap={1}
          p={3}
          pr={`calc(12px - ${FIREFOX_SCROLL_Y_CLASS_PR_PREFIX})`}
          mt={isNavsExpanded ? "12px" : 0}
        >
          {/* Private Navs */}
          <CContainer gap={1}>
            {PRIVATE_NAV_GROUPS.map((group, groupIndex) => {
              return (
                <CContainer key={groupIndex} gap={1}>
                  {isNavsExpanded && group.labelKey && (
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

                    const hasSub = nav.children && !nav.invisibleChildren;
                    const isMainNavsActive = pathname.includes(nav.path);

                    return (
                      <Fragment key={nav.path}>
                        {!hasSub && (
                          <NavLink key={nav.path} to={nav.path} w={"full"}>
                            <DesktopNavTooltip
                              content={
                                nav?.label ||
                                pluckString(l, nav.labelKey) ||
                                "-"
                              }
                            >
                              <Btn
                                iconButton={isNavsExpanded ? false : true}
                                clicky={false}
                                gap={4}
                                px={2}
                                justifyContent={"start"}
                                variant={isMainNavsActive ? "subtle" : "ghost"}
                                colorPalette={
                                  isMainNavsActive
                                    ? themeConfig.colorPalette
                                    : ""
                                }
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

                                {isNavsExpanded && (
                                  <P lineClamp={1} textAlign={"left"}>
                                    {nav?.label ||
                                      pluckString(l, nav.labelKey) ||
                                      "-"}
                                  </P>
                                )}
                              </Btn>
                            </DesktopNavTooltip>
                          </NavLink>
                        )}

                        {hasSub && (
                          <>
                            {!isNavsExpanded && (
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
                                    nav?.label ||
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
                                        variant={
                                          isMainNavsActive ? "subtle" : "ghost"
                                        }
                                        colorPalette={
                                          isMainNavsActive
                                            ? themeConfig.colorPalette
                                            : ""
                                        }
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

                            {isNavsExpanded && (
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
                                      variant={
                                        isMainNavsActive ? "subtle" : "ghost"
                                      }
                                      colorPalette={
                                        isMainNavsActive
                                          ? themeConfig.colorPalette
                                          : ""
                                      }
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
                                          {nav?.label ||
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

          {isNavsExpanded ? (
            <DesktopTabs mt={4} />
          ) : (
            <>
              <ChatSessionsDisclosureTrigger mr={"auto"}>
                <DesktopNavTooltip content={l.navs.your_chats}>
                  <Btn
                    iconButton
                    clicky={false}
                    variant={pathname.includes("/c/") ? "subtle" : "ghost"}
                    colorPalette={
                      pathname.includes("/c/") ? themeConfig.colorPalette : ""
                    }
                  >
                    {pathname.includes("/c/") && <LeftIndicator />}

                    <AppIcon icon={MessageSquareIcon} />
                  </Btn>
                </DesktopNavTooltip>
              </ChatSessionsDisclosureTrigger>

              <DASessionssDisclosureTrigger mr={"auto"}>
                <DesktopNavTooltip content={l.navs.your_da_analysis}>
                  <Btn
                    iconButton
                    clicky={false}
                    variant={pathname.includes("/da/") ? "subtle" : "ghost"}
                    colorPalette={
                      pathname.includes("/da/") ? themeConfig.colorPalette : ""
                    }
                  >
                    {pathname.includes("/da/") && <LeftIndicator />}

                    <AppIcon icon={FileTextIcon} />
                  </Btn>
                </DesktopNavTooltip>
              </DASessionssDisclosureTrigger>
            </>
          )}
        </MContainer>

        {isNavsExpanded && (
          <CContainer px={3}>
            <Divider />
          </CContainer>
        )}

        <CContainer p={3} pt={isNavsExpanded ? 3 : 0}>
          <ProfileMenuTrigger
            w={"full"}
            popoverRootProps={{
              positioning: {
                placement: "right-end",
                offset: {
                  mainAxis: DESKTOP_NAVS_POPOVER_MAIN_AXIS,
                  crossAxis: 4,
                },
              },
            }}
          >
            <HStack
              gap={4}
              w={isNavsExpanded ? "full" : "36px"}
              px={"6px"}
              py={2}
              rounded={themeConfig.radii.component}
              cursor={"pointer"}
              _hover={{
                bg: "gray.subtle",
              }}
              justify={isNavsExpanded ? "" : "center"}
              transition={"200ms"}
              pos={"relative"}
            >
              <Avatar
                src={imgUrl(user?.avatar?.[0]?.filePath)}
                name={user?.name}
                size={isNavsExpanded ? "md" : "2xs"}
                mr={"auto"}
              />

              {isNavsExpanded && (
                <>
                  <CContainer>
                    <P lineClamp={1} fontWeight={"semibold"}>
                      {user?.name || user?.email || "Signed out"}
                    </P>
                    <P lineClamp={1} color={"fg.subtle"}>
                      {user?.name ? user?.email : "-"}
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
          </ProfileMenuTrigger>
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

export default function Layout(props: Props__Layout) {
  const { ...restProps } = props;

  const iss = useIsSmScreenWidth();

  return (
    <AuthGuard>
      <CContainer id="app_layout" h={"100dvh"} {...restProps}>
        {iss ? <MobileLayout {...props} /> : <DesktopLayout {...props} />}
      </CContainer>
    </AuthGuard>
  );
}
