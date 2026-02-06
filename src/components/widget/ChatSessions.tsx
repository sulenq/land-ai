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
import { Field, FieldsetRoot } from "@/components/ui/field";
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
import { StringInput } from "@/components/ui/string-input";
import { AppIcon } from "@/components/widget/AppIcon";
import BackButton from "@/components/widget/BackButton";
import { ConfirmationDisclosureTrigger } from "@/components/widget/ConfirmationDisclosure";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { LeftIndicator } from "@/components/widget/Indicator";
import { DesktopNavTooltip } from "@/components/widget/Navs";
import {
  CHAT_API_SESSION_GET_ALL,
  CHAT_API_SESSION_DELETE,
  CHAT_API_SESSION_PROTECT,
  CHAT_API_SESSION_RENAME,
} from "@/constants/apis";
import { Interface__ChatSession } from "@/constants/interfaces";
import { useChatSessions } from "@/context/useChatSessions";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useDataState from "@/hooks/useDataState";
import usePopDisclosure from "@/hooks/usePopDisclosure";
import useRequest from "@/hooks/useRequest";
import { isEmptyArray } from "@/utils/array";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import { capitalizeWords } from "@/utils/string";
import { HStack, MenuItemProps, StackProps } from "@chakra-ui/react";
import { useFormik } from "formik";
import {
  EllipsisIcon,
  PenIcon,
  ShieldIcon,
  ShieldOffIcon,
  TrashIcon,
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import * as yup from "yup";

interface Props__Rename extends MenuItemProps {
  sessionId: string;
  title: string;
}
const Rename = (props: Props__Rename) => {
  const ID = `rename_${props.sessionId}`;

  // Props
  const { sessionId, title, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const renameChatSession = useChatSessions((s) => s.renameChatSession);

  // Hooks
  const { isOpen, onOpen } = usePopDisclosure(disclosureId(ID));
  const { req, loading } = useRequest({
    id: ID,
    showLoadingToast: false,
    showSuccessToast: false,
  });

  // States
  const originalTitle = title;
  const formik = useFormik({
    validateOnChange: false,
    initialValues: { title: title },
    validationSchema: yup
      .object()
      .shape({ title: yup.string().required(l.msg_required_form) }),
    onSubmit: (values) => {
      back();

      renameChatSession(sessionId, values.title);

      const config = {
        method: "PATCH",
        url: `${CHAT_API_SESSION_RENAME}/${sessionId}`,
        data: values,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {},
          onError: () => {
            renameChatSession(sessionId, originalTitle);
          },
        },
      });
    },
  });

  return (
    <>
      <MenuItem
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        {...restProps}
      >
        <AppIcon icon={PenIcon} /> {l.rename}
      </MenuItem>

      <DisclosureRoot open={isOpen} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`${capitalizeWords(l.rename)}`} />
          </DisclosureHeader>

          <DisclosureBody>
            <form id={ID} onSubmit={formik.handleSubmit}>
              <FieldsetRoot>
                <Field
                  invalid={!!formik.errors.title}
                  errorText={formik.errors.title as string}
                >
                  <StringInput
                    inputValue={formik.values.title}
                    onChange={(inputValue) => {
                      formik.setFieldValue("title", inputValue);
                    }}
                  />
                </Field>
              </FieldsetRoot>
            </form>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />

            <Btn
              type={"submit"}
              form={ID}
              colorPalette={themeConfig.colorPalette}
              loading={loading}
            >
              {l.save}
            </Btn>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};

interface Props__Protect extends MenuItemProps {
  sessionId: string;
  isProtected: boolean;
}
const Protect = (props: Props__Protect) => {
  const ID = `protect_${props.sessionId}`;

  // Props
  const { sessionId, isProtected, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const toggleProtectedSession = useChatSessions(
    (s) => s.toggleProtectedSession,
  );

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    showLoadingToast: false,
    showSuccessToast: false,
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {},
    validationSchema: yup.object().shape({}),
    onSubmit: () => {
      back();

      const config = {
        method: "PATCH",
        url: `${CHAT_API_SESSION_PROTECT}/${sessionId}`,
        params: [sessionId],
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            toggleProtectedSession(sessionId);
          },
          onError: () => {},
        },
      });
    },
  });

  return (
    <ConfirmationDisclosureTrigger
      id={ID}
      title={capitalizeWords(isProtected ? l.unprotect : l.protect)}
      description={l.msg_toggle_protect_session}
      confirmButtonProps={{
        type: "submit",
        form: ID,
      }}
      confirmLabel={isProtected ? l.unprotect : l.protect}
      onConfirm={formik.handleSubmit}
      loading={loading}
      w={"full"}
    >
      <form
        id={ID}
        onSubmit={formik.handleSubmit}
        style={{
          display: "none",
        }}
      ></form>

      <MenuItem {...restProps}>
        <AppIcon icon={isProtected ? ShieldOffIcon : ShieldIcon} />
        {isProtected ? l.unprotect : l.protect}
      </MenuItem>
    </ConfirmationDisclosureTrigger>
  );
};

interface Props__Delete extends MenuItemProps {
  sessionId: string;
  disabled?: boolean;
}
const Delete = (props: Props__Delete) => {
  const ID = `delete_${props.sessionId}`;

  // Props
  const { sessionId, disabled, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const removeFromChatSessions = useChatSessions(
    (s) => s.removeFromChatSessions,
  );

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    showLoadingToast: false,
    showSuccessToast: false,
  });
  const { sessionId: activeSessionId } = useParams();
  const router = useRouter();

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {},
    validationSchema: yup.object().shape({}),
    onSubmit: () => {
      back();

      const config = {
        method: "DELETE",
        url: `${CHAT_API_SESSION_DELETE}/${sessionId}`,
        params: [sessionId],
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            if (sessionId === activeSessionId) {
              router.replace("/new-chat");
            }
            removeFromChatSessions(sessionId);
          },
          onError: () => {},
        },
      });
    },
  });

  return (
    <ConfirmationDisclosureTrigger
      id={ID}
      title={l.delete_}
      description={l.msg_perma_delete}
      confirmButtonProps={{
        type: "submit",
        form: ID,
        variant: "outline",
        color: "fg.error",
      }}
      confirmLabel={l.delete_}
      onConfirm={formik.handleSubmit}
      loading={loading}
      w={"full"}
      disabled={disabled}
    >
      <form
        id={ID}
        onSubmit={formik.handleSubmit}
        style={{
          display: "none",
        }}
      ></form>

      <MenuItem
        color={"fg.error"}
        disabled={disabled}
        cursor={disabled ? "disabled" : "auto"}
        {...restProps}
      >
        <AppIcon icon={TrashIcon} /> {l.delete_}
      </MenuItem>
    </ConfirmationDisclosureTrigger>
  );
};

export const ChatSessions = (props: any) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();
  const chatSessions = useChatSessions((s) => s.chatSessions);
  const setChatSessions = useChatSessions((s) => s.setChatSessions);

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  // States
  const { loading, error, data, onRetry } = useDataState<
    Interface__ChatSession[]
  >({
    // initialData: DUMMY_CHAT_SESSIONS,
    url: CHAT_API_SESSION_GET_ALL,
    dataResource: false,
    loadingBar: false,
    conditions: !chatSessions,
  });
  const [search, setSearch] = useState<string>("");
  const q = (search ?? "").toLowerCase();
  const qNormalized = q?.toLowerCase().trim();
  const isReady = Array.isArray(chatSessions);
  const resolvedData = useMemo(() => {
    if (!isReady) return null;
    if (qNormalized === "") return chatSessions;

    return chatSessions.filter((chat) =>
      chat.title.toLowerCase().includes(qNormalized),
    );
  }, [isReady, chatSessions, qNormalized]);

  // Render
  let loadedContent = null;
  if (isEmptyArray(resolvedData)) {
    loadedContent = <FeedbackNotFound />;
  } else {
    loadedContent = resolvedData?.map((session) => {
      const isActive = pathname === `/c/${session.id}`;
      const isProtected = session.isProtected as boolean;

      return (
        <DesktopNavTooltip key={session.id} content={session.title}>
          <HStack
            pl={"10px"}
            gap={0}
            justifyContent={"space-between"}
            rounded={themeConfig.radii.component}
            _hover={{ bg: "bg.muted" }}
            transition={"200ms"}
            pos={"relative"}
          >
            <NavLink to={`/c/${session.id}`} w={"full"}>
              <HStack h={["44px", null, "36px"]} pr={1}>
                {isActive && <LeftIndicator />}

                <P lineClamp={1} textAlign={"left"}>
                  {session.title}
                </P>

                {isProtected && (
                  <AppIcon icon={ShieldIcon} color={"fg.subtle"} ml={"auto"} />
                )}
              </HStack>
            </NavLink>

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
                <Rename
                  value="rename"
                  sessionId={session.id}
                  title={session.title}
                />

                <Protect
                  value="protect"
                  sessionId={session.id}
                  isProtected={isProtected}
                />

                <Delete
                  value="delete"
                  sessionId={session.id}
                  disabled={isProtected}
                />
              </MenuContent>
            </MenuRoot>
          </HStack>
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
      setChatSessions(data);
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
        <>
          {loading && render.loading}

          {!loading && (
            <>
              {error && render.error}

              {!error && (
                <>
                  {!chatSessions && null}

                  {chatSessions && (
                    <>
                      {/* Empty */}
                      {isEmptyArray(chatSessions) && render.empty}

                      {/* Not found */}
                      {!isEmptyArray(chatSessions) &&
                        isEmptyArray(resolvedData) &&
                        render.notFound}

                      {/* Loaded */}
                      {!isEmptyArray(resolvedData) && render.loaded}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
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
            <DisclosureHeaderContent
              title={`${capitalizeWords(l.your_chats)}`}
            />
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
