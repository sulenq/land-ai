"use client";

import { CContainer } from "@/components/ui/c-container";
import { Checkbox } from "@/components/ui/checkbox";
import { FileIcon } from "@/components/ui/file-icon";
import { ClampText } from "@/components/widget/ClampText";
import { RowOptions } from "@/components/widget/RowOptions";
import {
  Interface__ChatAIKnowledge,
  Interface__DataProps,
  Interface__FormattedTableRow,
} from "@/constants/interfaces";
import { useThemeConfig } from "@/context/useThemeConfig";
import { isEmptyArray } from "@/utils/array";
import { Box, Center, HStack, StackProps } from "@chakra-ui/react";
import React from "react";

interface Props extends StackProps {
  item: Interface__ChatAIKnowledge;
  dim?: boolean;
  dataProps: Interface__DataProps;
  row: Interface__FormattedTableRow;
  selectedRows: string[];
  toggleRowSelection: (row: Interface__FormattedTableRow) => void;
  routeTitle: string;
  details: any;
}

export const DataGridAIKnowledgeItem = (props: Props) => {
  // Props
  const {
    item,
    dim = false,
    dataProps,
    row,
    selectedRows,
    toggleRowSelection,
    ...restProps
  } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const isRowSelected = selectedRows.includes(row.id);
  const selectedColor = `${themeConfig.colorPalette}.focusRing`;

  return (
    <CContainer
      key={item.id}
      flex={1}
      border={"1px solid"}
      borderColor={isRowSelected ? selectedColor : "border.subtle"}
      rounded={themeConfig.radii.container}
      overflow={"clip"}
      pos={"relative"}
      {...restProps}
    >
      <HStack justify={"space-between"} p={2}>
        <Box
          onClick={(e) => {
            e.stopPropagation();
            toggleRowSelection(row);
          }}
        >
          <Checkbox checked={isRowSelected} subtle zIndex={2} />
        </Box>

        {!isEmptyArray(dataProps.rowOptions) && (
          <RowOptions
            row={row}
            rowOptions={dataProps.rowOptions}
            size={"2xs"}
            variant={"ghost"}
            rounded={themeConfig.radii.component}
            menuRootProps={{
              positioning: {
                offset: {
                  mainAxis: 16, // px
                },
              },
            }}
          />
        )}
      </HStack>

      <Center mb={1}>
        <FileIcon
          name={item.fileName}
          mimeType={item.metaData.mimeType}
          boxSize={14}
        />
      </Center>

      <CContainer
        flex={1}
        gap={1}
        px={3}
        opacity={dim || row.dim ? 0.4 : 1}
        my={3}
      >
        <HStack maxW={"calc(100% - 32px)"}>
          {typeof item.fileName === "string" ? (
            <ClampText fontWeight={"semibold"}>{item.fileName}</ClampText>
          ) : (
            item.fileName
          )}
        </HStack>

        {typeof item.metaData.fileSize === "string" ? (
          <ClampText w={"full"} color={"fg.subtle"} lineClamp={1}>
            {item.metaData.fileSize}
          </ClampText>
        ) : (
          item.metaData.fileSize
        )}
      </CContainer>
    </CContainer>
  );
};
