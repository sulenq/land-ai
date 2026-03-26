"use client";

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
import { Img } from "@/components/ui/img";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { Skeleton } from "@/components/ui/skeleton";
import { StringInput } from "@/components/ui/string-input";
import { AppIcon } from "@/components/widget/AppIcon";
import BackButton from "@/components/widget/BackButton";
import { ClampText } from "@/components/widget/ClampText";
import { ConfirmationDisclosureTrigger } from "@/components/widget/ConfirmationDisclosure";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { ContainerLayout, PageContainer } from "@/components/widget/PageShell";
import {
  DA_API_SESSION_DELETE,
  DA_API_SESSION_GET_ALL,
  DA_API_SESSION_RENAME,
} from "@/constants/apis";
import {
  Interface__DAService,
  Interface__DASession,
} from "@/constants/interfaces";
import { useActiveDA } from "@/context/useActiveDA";
import { useBreadcrumbs } from "@/context/useBreadcrumbs";
import { useDASessions } from "@/context/useDASessions";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useDataState from "@/hooks/useDataState";
import usePopDisclosure from "@/hooks/usePopDisclosure";
import useRequest from "@/hooks/useRequest";
import { isEmptyArray } from "@/utils/array";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import { capitalizeWords } from "@/utils/string";
import { imgUrl } from "@/utils/url";
import { HStack, MenuItemProps, StackProps } from "@chakra-ui/react";
import { useFormik } from "formik";
import {
  ArrowRight,
  EllipsisVerticalIcon,
  PenIcon,
  TrashIcon,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import * as yup from "yup";

// -----------------------------------------------------------------

interface Props__Rename extends MenuItemProps {
  sessionId: string;
  title: string;
}

const Rename = (props: Props__Rename) => {
  const ID = `rename_${props.sessionId}`;

  // Props
  const { sessionId, title, ...restProps } = props;

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const renameDASession = useDASessions((s) => s.renameDASession);
  const activeDASession = useActiveDA((s) => s.activeDA.session);
  const setActiveDASession = useActiveDA((s) => s.setSession);

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

      renameDASession(sessionId, values.title);

      if (activeDASession?.id === sessionId) {
        setActiveDASession({
          ...activeDASession,
          title: values.title,
        });
      }

      const config = {
        method: "PATCH",
        url: `${DA_API_SESSION_RENAME}/${sessionId}`,
        data: values,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {},
          onError: () => {
            renameDASession(sessionId, originalTitle);
            setActiveDASession({
              ...activeDASession,
              title: originalTitle,
            });
          },
        },
      });
    },
  });

  // Focus input when open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 1);
    }
  }, [isOpen]);

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
                    ref={inputRef}
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

// -----------------------------------------------------------------

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
  const removeFromDASessions = useDASessions((s) => s.removeFromDASessions);

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
        url: `${DA_API_SESSION_DELETE}/${sessionId}`,
        params: [sessionId],
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            if (sessionId === activeSessionId) {
              router.replace("/new-da");
            }
            removeFromDASessions(sessionId);
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
        colorPalette: "gray",
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

// -----------------------------------------------------------------

// const DeleteAllButton = (props: Props__Btn) => {
//   // Contexts
//   const { l } = useLang();
//   const DASessions = useDASessions((s) => s.DASessions);
//   const setRt = useRenderTrigger((s) => s.setRt);

//   // Hooks
//   const { req, loading } = useRequest({
//     id: "delete-all-da-sessions",
//   });

//   return (
//     <ConfirmationDisclosureTrigger
//       id={"delete-all-da-sessions"}
//       title={capitalizeWords(l.delete_all)}
//       description={l.msg_perma_delete}
//       confirmLabel={l.delete_all}
//       confirmButtonProps={{
//         variant: "outline",
//         colorPalette: "gray",
//         color: "fg.error",
//       }}
//       confirmCountdownDuration={5}
//       onConfirm={() => {
//         back();

//         const config = {
//           url: DA_API_SESSION_DELETE,
//           method: "DELETE",
//           params: DASessions?.map((s) => s.id),
//         };

//         req({
//           config,
//           onResolve: {
//             onSuccess: () => {
//               setRt((ps) => !ps);
//             },
//           },
//         });
//       }}
//       loading={loading}
//       w={"full"}
//     >
//       <Btn variant={"outline"} color={"fg.error"} {...props}>
//         <AppIcon icon={TrashIcon} />

//         {l.delete_all}
//       </Btn>
//     </ConfirmationDisclosureTrigger>
//   );
// };

// -----------------------------------------------------------------

interface Interface__DAList extends StackProps {
  daService: Interface__DAService | null;
}

const DAList = (props: Interface__DAList) => {
  // Props
  const { daService, ...restProps } = props;

  // Contexts
  const { l, lang } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  // const initialLoading = true;
  const {
    initialLoading,
    error,
    data,
    onRetry,
    // limit,
    // setLimit,
    // page,
    // setPage,
    // pagination,
  } = useDataState<Interface__DASession[]>({
    initialData: undefined,
    url: `${DA_API_SESSION_GET_ALL}`,
    dataResource: false,
    params: {
      daServiceIds: [daService?.id],
    },
  });

  // Render State Map
  const render = {
    loading: <Skeleton flex={1} />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <CContainer gap={2}>
        {data?.map((session) => {
          return (
            <HStack
              key={session.id}
              className={"group"}
              justify={"space-between"}
              bg={"bg.muted"}
              rounded={themeConfig.radii.component}
              cursor={"pointer"}
              _hover={{
                bg: "d2",
              }}
              transition={"200ms"}
            >
              <NavLink
                to={`/your-da/${daService?.id}/${session.id}?service=${JSON.stringify(daService)}`}
                flex={1}
              >
                <HStack flex={1} justify={"space-between"} pl={4} py={2}>
                  <CContainer gap={1}>
                    <ClampText>{session.id}</ClampText>
                    <ClampText color={"fg.subtle"}>{session.title}</ClampText>
                  </CContainer>

                  <AppIcon
                    icon={ArrowRight}
                    opacity={0}
                    color={`${themeConfig.colorPalette}.fg`}
                    _groupHover={{
                      opacity: 1,
                    }}
                    transition={"200ms"}
                  />
                </HStack>
              </NavLink>

              {/* Options */}
              <MenuRoot positioning={{ placement: "right-start" }}>
                <MenuTrigger
                  asChild
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Btn iconButton size={"md"} variant={"plain"}>
                    <AppIcon icon={EllipsisVerticalIcon} />
                  </Btn>
                </MenuTrigger>

                <MenuContent>
                  <Rename
                    value="rename"
                    sessionId={session.id}
                    title={session.title}
                  />

                  <Delete value="delete" sessionId={session.id} />
                </MenuContent>
              </MenuRoot>
            </HStack>
          );
        })}
      </CContainer>
    ),
  };

  // console.debug(daService);

  return (
    <ContainerLayout flex={1} gap={8} {...restProps}>
      <CContainer gap={1} px={themeConfig.radii.component}>
        <P fontSize={"3xl"} fontWeight={"semibold"}>
          {l.navs.your_da}
        </P>

        <HStack>
          <Img
            src={imgUrl(daService?.icon)}
            w={"20px"}
            h={"20px"}
            objectFit={"contain"}
          />

          <P fontSize={"lg"} color={"fg.subtle"}>
            {daService?.title?.[lang]}
          </P>
        </HStack>
      </CContainer>

      {initialLoading && render.loading}
      {!initialLoading && (
        <>
          {error && render.error}
          {!error && (
            <>
              {data && !isEmptyArray(data) && render.loaded}
              {(!data || isEmptyArray(data)) && render.empty}
            </>
          )}
        </>
      )}
    </ContainerLayout>
  );
};

export default function Page() {
  // Contexts
  const { lang } = useLang();
  const setBreadcrumbs = useBreadcrumbs((s) => s.setBreadcrumbs);

  // Hooks
  const { serviceId } = useParams();
  const searchParams = useSearchParams();
  const daServiceParam = searchParams.get("service");

  // Derived Values
  const daService: Interface__DAService | null = daServiceParam
    ? JSON.parse(daServiceParam)
    : null;

  // Set breadcrumbs
  useEffect(() => {
    setBreadcrumbs({
      backPath: "/your-da",
      activeNavs: [
        {
          labelKey: "navs.your_da",
          path: "/your-da",
        },
        {
          label: daService?.title?.[lang],
          path: `/your-da-analysis/${serviceId}`,
        },
      ],
    });
  }, []);

  return (
    <PageContainer p={8}>
      <DAList daService={daService} />
    </PageContainer>
  );
}
