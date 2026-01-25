import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import SearchInput from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { AppIcon } from "@/components/widget/AppIcon";
import BackButton from "@/components/widget/BackButton";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { LeftIndicator } from "@/components/widget/Indicator";
import { DesktopNavTooltip } from "@/components/widget/NavTooltip";
import { CHAT_API_CHAT_AI_INDEX } from "@/constants/apis";
import { Interface__ChatSession } from "@/constants/interfaces";
import { useChatSessions } from "@/context/useChatSessions";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useDataState from "@/hooks/useDataState";
import usePopDisclosure from "@/hooks/usePopDisclosure";
import { isEmptyArray } from "@/utils/array";
import { disclosureId } from "@/utils/disclosure";
import { HStack, StackProps } from "@chakra-ui/react";
import { EllipsisIcon, PenIcon, ShieldIcon, TrashIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export const ChatSessions = (props: any) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const activeChatSessions = useChatSessions((s) => s.activeChatSessions);
  const setActiveChatSessions = useChatSessions((s) => s.setActiveChatSessions);

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  // States
  const { error, initialLoading, data, onRetry } = useDataState<
    Interface__ChatSession[]
  >({
    // initialData: DUMMY_CHAT_SESSIONS,
    url: CHAT_API_CHAT_AI_INDEX,
    dataResource: false,
    loadingBar: false,
    conditions: !activeChatSessions,
  });
  const [search, setSearch] = useState<string>("");
  const q = (search ?? "").toLowerCase();
  const qNormalized = q?.toLowerCase().trim();
  const resolvedData = useMemo(() => {
    if (qNormalized === "") return activeChatSessions;
    return activeChatSessions?.filter((chat) =>
      chat.title.toLowerCase().includes(qNormalized),
    );
  }, [activeChatSessions, qNormalized]);

  // Render
  let loadedContent = null;
  if (isEmptyArray(resolvedData)) {
    loadedContent = <FeedbackNotFound />;
  } else {
    loadedContent = resolvedData?.map((chat) => {
      const isActive = pathname === `/c/${chat.id}`;

      return (
        <DesktopNavTooltip key={chat.id} content={chat.title}>
          <NavLink to={`/c/${chat.id}`} w={"full"}>
            <HStack
              h={["44px", null, "36px"]}
              pl={"10px"}
              pr={"2px"}
              justifyContent={"space-between"}
              rounded={themeConfig.radii.component}
              _hover={{ bg: "bg.muted" }}
              transition={"200ms"}
              pos={"relative"}
            >
              {isActive && <LeftIndicator />}

              <P lineClamp={1} textAlign={"left"}>
                {chat.title}
              </P>

              {/* Options */}
              <MenuRoot>
                <MenuTrigger
                  asChild
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Btn iconButton size={"xs"} variant={"plain"}>
                    <AppIcon icon={EllipsisIcon} />
                  </Btn>
                </MenuTrigger>

                <MenuContent zIndex={"modal"}>
                  <MenuItem value="rename">
                    <AppIcon icon={PenIcon} /> {l.rename}
                  </MenuItem>

                  <MenuItem value="protect">
                    <AppIcon icon={ShieldIcon} /> {l.protect}
                  </MenuItem>

                  <MenuItem value="delete" _hover={{ color: "fg.error" }}>
                    <AppIcon icon={TrashIcon} /> {l.delete_}
                  </MenuItem>
                </MenuContent>
              </MenuRoot>
            </HStack>
          </NavLink>
        </DesktopNavTooltip>
      );
    });
  }
  const render = {
    loading: (
      <CContainer gap={4} mt={2}>
        {Array.from({ length: 5 }).map((_, idx) => {
          return <Skeleton key={idx} h={"24px"} />;
        })}
      </CContainer>
    ),
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: loadedContent,
  };

  useEffect(() => {
    if (data) {
      setActiveChatSessions(data);
    }
  }, [data]);

  return (
    <CContainer gap={2} {...restProps}>
      <CContainer>
        <SearchInput
          queryKey={"q_sidebar_navs"}
          inputRef={searchInputRef}
          inputValue={search}
          onChange={(inputValue) => {
            setSearch(inputValue || "");
          }}
        />
      </CContainer>

      <CContainer gap={1}>
        {!activeChatSessions && (
          <>
            {initialLoading && render.loading}
            {!initialLoading && (
              <>
                {error && render.error}
                {!error && (
                  <>
                    {activeChatSessions && render.loaded}

                    {(!activeChatSessions ||
                      isEmptyArray(activeChatSessions)) &&
                      render.empty}
                  </>
                )}
              </>
            )}
          </>
        )}

        {activeChatSessions && render.loaded}
      </CContainer>
    </CContainer>
  );
};

export const ChatSessionsDisclosureTrigger = (props: StackProps) => {
  // Contexts
  const { l } = useLang();

  // Hooks
  const { isOpen, onOpen } = usePopDisclosure(
    disclosureId("disclosure_chat_sessions"),
  );

  return (
    <>
      <CContainer w={"fit"} onClick={onOpen} {...props} />

      <DisclosureRoot open={isOpen} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`${l.your_chats}`} />
          </DisclosureHeader>

          <DisclosureBody>
            <ChatSessions />
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
