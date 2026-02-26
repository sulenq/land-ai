"use client";

import { Avatar } from "@/components/ui/avatar";
import { Field } from "@/components/ui/field";
import { H1 } from "@/components/ui/heading";
import { NavLink } from "@/components/ui/nav-link";
import { LucideIcon } from "@/components/widget/Icon";
import { Logo } from "@/components/widget/Logo";
import { APP } from "@/constants/_meta";
import { AUTH_API_SIGNIN, AUTH_API_SIGNOUT } from "@/constants/apis";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import useAuthMiddleware from "@/context/useAuthMiddleware";
import { useDASessions } from "@/context/useDASessions";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useRequest from "@/hooks/useRequest";
import {
  clearAccessToken,
  clearUserData,
  getAccessToken,
  getUserData,
  setAccessToken,
  setUserData,
} from "@/utils/auth";
import { imgUrl } from "@/utils/url";
import {
  FieldsetRoot,
  HStack,
  Icon,
  InputGroup,
  StackProps,
  VStack,
} from "@chakra-ui/react";
import { IconLock, IconUser } from "@tabler/icons-react";
import { useFormik } from "formik";
import { LogInIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import * as yup from "yup";
import { useChatSessions } from "../../context/useChatSessions";
import { Btn } from "../ui/btn";
import { CContainer } from "../ui/c-container";
import { Divider } from "../ui/divider";
import { P } from "../ui/p";
import { PasswordInput } from "../ui/password-input";
import { StringInput } from "../ui/string-input";
import ResetPasswordDisclosureTrigger from "./ResetPasswordDisclosure";

const AUTH_PROVIDER_CONFIG = {
  "1": {
    indexRoute: `/admin`,
  },
  "2": {
    indexRoute: `/admin`,
  },
  "3": {
    indexRoute: "/new-chat",
  },
};

const SignoutButton = () => {
  // Contexts
  const { l } = useLang();
  const removeAuth = useAuthMiddleware((s) => s.removeAuth);

  // Hooks
  const { req, loading } = useRequest({
    id: "signout",
    loadingMessage: l.loading_signout,
    successMessage: l.success_signout,
  });

  // Utils
  function onSignout() {
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
        },
        onError: () => {
          removeAuth();
        },
      },
    });
  }

  return (
    <Btn w={"140px"} variant={"ghost"} onClick={onSignout} loading={loading}>
      Sign out
    </Btn>
  );
};
interface Props__Signedin extends StackProps {
  indexRoute: string;
}
const Signedin = (props: Props__Signedin) => {
  // Props
  const { indexRoute, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const user = getUserData();

  return (
    <VStack gap={4} m={"auto"} {...restProps}>
      <Avatar size={"2xl"} src={imgUrl(user?.avatar?.[0]?.filePath)} />

      <VStack gap={0}>
        <P fontWeight={"semibold"}>{user?.name}</P>
        <P>{user?.email}</P>
      </VStack>

      <VStack>
        <NavLink to={indexRoute}>
          <Btn w={"140px"} colorPalette={themeConfig.colorPalette}>
            {l.access} App
          </Btn>
        </NavLink>

        <SignoutButton />
      </VStack>
    </VStack>
  );
};

interface Props__Form extends StackProps {}
const Form = (props: Props__Form) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  const setVerifiedAuthToken = useAuthMiddleware((s) => s.setVerifiedAuthToken);
  const setPermissions = useAuthMiddleware((s) => s.setPermissions);

  // Hooks
  const router = useRouter();
  const { req, loading } = useRequest({
    id: "signin",
    loadingMessage: l.loading_signin,
    successMessage: l.success_signin,
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      identifier: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      identifier: yup.string().required(l.msg_required_form),
      password: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values) => {
      const payload = {
        email: values.identifier,
        password: values.password,
      };
      const config = {
        method: "POST",
        url: AUTH_API_SIGNIN,
        data: payload,
      };
      req({
        config,
        onResolve: {
          onSuccess: (r: any) => {
            const accessToken = r.data?.data?.authToken;
            const user = r.data?.data?.user;
            const permissionsData = r.data?.data?.user?.permissions;

            setAccessToken(accessToken);
            setUserData(user);
            setVerifiedAuthToken(accessToken);
            setPermissions(permissionsData);

            router.push(
              AUTH_PROVIDER_CONFIG[
                `${user?.role}` as keyof typeof AUTH_PROVIDER_CONFIG
              ].indexRoute,
            );
          },
        },
      });
    },
  });

  return (
    <CContainer {...restProps}>
      <form id="signin_form" onSubmit={formik.handleSubmit}>
        <FieldsetRoot disabled={loading}>
          <Field
            invalid={!!formik.errors.identifier}
            errorText={formik.errors.identifier as string}
          >
            <InputGroup
              w={"full"}
              startElement={
                <Icon boxSize={5}>
                  <IconUser stroke={1.5} />
                </Icon>
              }
            >
              <StringInput
                name="identifier"
                onChange={(input) => {
                  formik.setFieldValue("identifier", input);
                }}
                inputValue={formik.values.identifier}
                placeholder="Email"
                pl={"40px !important"}
                variant={"subtle"}
              />
            </InputGroup>
          </Field>

          <Field
            invalid={!!formik.errors.password}
            errorText={formik.errors.password as string}
          >
            <InputGroup
              w={"full"}
              startElement={
                <Icon boxSize={5}>
                  <IconLock stroke={1.5} />
                </Icon>
              }
            >
              <PasswordInput
                name="password"
                onChange={(input) => {
                  formik.setFieldValue("password", input);
                }}
                inputValue={formik.values.password}
                placeholder="Password"
                pl={"40px !important"}
                variant={"subtle"}
              />
            </InputGroup>
          </Field>
        </FieldsetRoot>

        <Btn
          type="submit"
          form="signin_form"
          w={"full"}
          mt={6}
          size={"lg"}
          loading={loading}
          colorPalette={themeConfig.colorPalette}
        >
          <Icon boxSize={BASE_ICON_BOX_SIZE}>
            <LucideIcon icon={LogInIcon} />
          </Icon>
          Sign in
        </Btn>

        <HStack mt={4}>
          <Divider h={"1px"} w={"full"} />

          <ResetPasswordDisclosureTrigger>
            <Btn variant={"ghost"} color={themeConfig.primaryColor}>
              Reset Password
            </Btn>
          </ResetPasswordDisclosureTrigger>

          <Divider h={"1px"} w={"full"} />
        </HStack>
      </form>
    </CContainer>
  );
};

export const SigninForm = (props: StackProps) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const authToken = getAccessToken();
  const verifiedAuthToken = useAuthMiddleware((s) => s.verifiedAuthToken);
  const resolvedAuthToken = authToken || verifiedAuthToken;
  const clearChatSessions = useChatSessions((s) => s.clearChatSessions);
  const clearDASessions = useDASessions((s) => s.clearDASessions);

  // Clear chat sessions and DA sessions on mount
  useEffect(() => {
    clearChatSessions();
    clearDASessions();
  }, []);

  return (
    <CContainer
      m={"auto"}
      w={"full"}
      maxW={"380px"}
      p={4}
      gap={4}
      rounded={themeConfig.radii.container}
      {...restProps}
    >
      {resolvedAuthToken ? (
        <Signedin
          indexRoute={
            AUTH_PROVIDER_CONFIG[
              `${getUserData()?.role}` as keyof typeof AUTH_PROVIDER_CONFIG
            ]?.indexRoute
          }
        />
      ) : (
        <>
          <CContainer align={"center"} gap={2} mb={4}>
            <Logo mb={2} />

            <H1 fontSize={"3xl"} fontWeight={"bold"} textAlign={"center"}>
              {APP.name}
            </H1>

            <P textAlign={"center"} color={"fg.subtle"}>
              {l.msg_signin}
            </P>
          </CContainer>

          <CContainer gap={4} mx={"auto"}>
            <Form />
          </CContainer>
        </>
      )}
    </CContainer>
  );
};
