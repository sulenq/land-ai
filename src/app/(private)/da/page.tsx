"use client";

import { CContainer } from "@/components/ui/c-container";
import { HelperText } from "@/components/ui/helper-text";
import { Img } from "@/components/ui/img";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip } from "@/components/ui/tooltip";
import { ContainerLayout, PageContainer } from "@/components/widget/Page";
import { IMAGES_PATH } from "@/constants/paths";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import { pluckString } from "@/utils/string";
import { getGridColumns } from "@/utils/style";
import { SimpleGrid, SimpleGridProps } from "@chakra-ui/react";
import { useRef } from "react";

const Services = (props: SimpleGridProps) => {
  const SERVICES = [
    {
      id: 1,
      iconPath: `${IMAGES_PATH}/da/services/service1.png`,
      titleKey: "service_1_title",
      descriptionKey: "service_1_description",
      path: `/da/service1`,
    },
    {
      id: 2,
      iconPath: `${IMAGES_PATH}/da/services/service2.png`,
      titleKey: "service_2_title",
      descriptionKey: "service_2_description",
      path: `/da/service2`,
    },
    {
      id: 3,
      iconPath: `${IMAGES_PATH}/da/services/service3.png`,
      titleKey: "service_3_title",
      descriptionKey: "service_3_description",
      path: `/da/service3`,
    },
    {
      id: 4,
      iconPath: `${IMAGES_PATH}/da/services/service4.png`,
      titleKey: "service_4_title",
      descriptionKey: "service_4_description",
      path: `/da/service4`,
    },
    {
      id: 5,
      iconPath: `${IMAGES_PATH}/da/services/service5.png`,
      titleKey: "service_5_title",
      descriptionKey: "service_5_description",
      path: `/da/service5`,
    },
    {
      id: 6,
      iconPath: `${IMAGES_PATH}/da/services/service6.png`,
      titleKey: "service_6_title",
      descriptionKey: "service_6_description",
      path: `/da/service6`,
    },
    {
      id: 7,
      iconPath: `${IMAGES_PATH}/da/services/service7.png`,
      titleKey: "service_7_title",
      descriptionKey: "service_7_description",
      path: `/da/service7`,
    },
  ];

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  return (
    <SimpleGrid gap={4} {...props}>
      {SERVICES.map((service) => {
        return (
          <NavLink
            key={service.id}
            to={service.path}
            className="clicky"
            flex={"1 1 200px"}
            w={"full"}
            gap={8}
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
            <Img src={service.iconPath} fluid w={"40px"} mb={"auto"} />

            <CContainer gap={2}>
              <P fontSize={"lg"} fontWeight={"semibold"}>
                {pluckString(l, service.titleKey)}
              </P>

              <Tooltip content={pluckString(l, service.descriptionKey)}>
                <P color={"fg.subtle"} lineClamp={2}>
                  {pluckString(l, service.descriptionKey)}
                </P>
              </Tooltip>
            </CContainer>
          </NavLink>
        );
      })}
    </SimpleGrid>
  );
};

export default function Page() {
  const GRID_COLS_BREAKPOINTS = {
    0: 1,
    350: 2,
    720: 3,
  };

  // Contexts
  const { l } = useLang();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const containerDimension = useContainerDimension(containerRef);

  // SX
  const cols = getGridColumns(containerDimension.width, GRID_COLS_BREAKPOINTS);

  return (
    <PageContainer p={4}>
      <ContainerLayout ref={containerRef}>
        <CContainer gap={4} my={"auto"}>
          <P fontSize={"2xl"} fontWeight={"bold"} textAlign={"center"}>
            {l.document_analysis_service}
          </P>

          {containerDimension.width > 0 ? (
            <Services columns={cols} />
          ) : (
            <Skeleton minH={"500px"} />
          )}

          <HelperText textAlign={"center"}>{l.msg_da_disclaimer}</HelperText>
        </CContainer>
      </ContainerLayout>
    </PageContainer>
  );
}
