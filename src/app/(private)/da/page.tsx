"use client";

import { CContainer } from "@/components/ui/c-container";
import { Img } from "@/components/ui/img";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { ContainerLayout, PageContainer } from "@/components/widget/Page";
import { IMAGES_PATH } from "@/constants/paths";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { pluckString } from "@/utils/string";
import { SimpleGrid } from "@chakra-ui/react";

const ServiceOptions = () => {
  const SERVICES = [
    {
      id: 1,
      iconPath: `${IMAGES_PATH}/da/services/land.png`,
      titleKey: "service_1_title",
      descriptionKey: "service_1_description",
      path: `/da/service1`,
    },
    {
      id: 2,
      iconPath: `${IMAGES_PATH}/da/services/land.png`,
      titleKey: "service_2_title",
      descriptionKey: "service_2_description",
      path: `/da/service2`,
    },
    {
      id: 3,
      iconPath: `${IMAGES_PATH}/da/services/land.png`,
      titleKey: "service_3_title",
      descriptionKey: "service_3_description",
      path: `/da/service3`,
    },
    {
      id: 4,
      iconPath: `${IMAGES_PATH}/da/services/land.png`,
      titleKey: "service_4_title",
      descriptionKey: "service_4_description",
      path: `/da/service4`,
    },
    {
      id: 5,
      iconPath: `${IMAGES_PATH}/da/services/land.png`,
      titleKey: "service_5_title",
      descriptionKey: "service_5_description",
      path: `/da/service5`,
    },
    {
      id: 6,
      iconPath: `${IMAGES_PATH}/da/services/land.png`,
      titleKey: "service_6_title",
      descriptionKey: "service_6_description",
      path: `/da/service6`,
    },
    {
      id: 7,
      iconPath: `${IMAGES_PATH}/da/services/land.png`,
      titleKey: "service_7_title",
      descriptionKey: "service_7_description",
      path: `/da/service7`,
    },
  ];

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  return (
    <SimpleGrid columns={[2, null, 3]} gap={4}>
      {SERVICES.map((service) => {
        return (
          <NavLink
            key={service.id}
            to={service.path}
            className="clicky"
            flex={"1 1 200px"}
            w={"full"}
            gap={4}
            p={4}
            border={"1px solid"}
            borderColor={"border.subtle"}
            rounded={themeConfig.radii.component}
            cursor={"pointer"}
            _hover={{
              bg: "bg.muted",
            }}
            transition={"200ms"}
          >
            <Img src={service.iconPath} fluid w={"40px"} />

            <CContainer>
              <P fontSize={"lg"} fontWeight={"semibold"}>
                {pluckString(l, service.titleKey)}
              </P>
              <P color={"fg.subtle"}>
                {pluckString(l, service.descriptionKey)}
              </P>
            </CContainer>
          </NavLink>
        );
      })}
    </SimpleGrid>
  );
};

export default function Page() {
  // Contexts
  const { l } = useLang();

  return (
    <PageContainer p={4}>
      <ContainerLayout className="scrollY">
        <P fontSize={"2xl"} fontWeight={"bold"} textAlign={"center"} mb={4}>
          {l.document_analysis_service}
        </P>

        <ServiceOptions />
      </ContainerLayout>
    </PageContainer>
  );
}
