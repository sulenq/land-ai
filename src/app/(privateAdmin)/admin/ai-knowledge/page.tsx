"use client";

import { Btn } from "@/components/ui/btn";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import { Field, FieldsetRoot } from "@/components/ui/field";
import { FileIcon } from "@/components/ui/file-icon";
import { FileInput } from "@/components/ui/file-input";
import { MenuItem } from "@/components/ui/menu";
import { P } from "@/components/ui/p";
import SearchInput from "@/components/ui/search-input";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIcon } from "@/components/widget/AppIcon";
import { ConfirmationDisclosureTrigger } from "@/components/widget/ConfirmationDisclosure";
import { DataDisplayToggle } from "@/components/widget/DataDisplayToggle";
import { DataGrid } from "@/components/widget/DataGrid";
import { DataGridAIKnowledgeItem } from "@/components/widget/DataGridAIKnowledgeItem";
import { DataTable } from "@/components/widget/DataTable";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import HScroll from "@/components/widget/HScroll";
import {
  PageContainer,
  PageContent,
  PageTitle,
} from "@/components/widget/PageShell";
import { RowOptionMenuTooltip } from "@/components/widget/RowOptions";
import { TableSkeleton } from "@/components/widget/TableSkeleton";
import { ADMIN_AI_KNOWLEDGE_BASE } from "@/constants/apis";
import {
  Interface__BatchOptionsTableOptionGenerator,
  Interface__ChatAIKnowledge,
  Interface__DataProps,
  Interface__RowOptionsTableOptionGenerator,
} from "@/constants/interfaces";
import { useDataDisplay } from "@/context/useDataDisplay";
import useLang from "@/context/useLang";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import useDataState from "@/hooks/useDataState";
import usePopDisclosure from "@/hooks/usePopDisclosure";
import useRequest from "@/hooks/useRequest";
import { isEmptyArray, last } from "@/utils/array";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import { formatDate } from "@/utils/formatter";
import { capitalize, pluckString } from "@/utils/string";
import { isDimensionValid } from "@/utils/style";
import { getActiveNavs, imgUrl } from "@/utils/url";
import { fileValidation } from "@/utils/validationSchema";
import { HStack } from "@chakra-ui/react";
import { useFormik } from "formik";
import { ArrowUpRightIcon, PlusIcon, TrashIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import * as yup from "yup";

const BASE_ENDPOINT = ADMIN_AI_KNOWLEDGE_BASE;
const PREFIX_ID = "ai_knowledge";
type Interface__Data = Interface__ChatAIKnowledge;

const Create = (props: any) => {
  const ID = `${PREFIX_ID}_create`;

  // Props
  const { routeTitle, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { isOpen, onOpen } = usePopDisclosure(
    disclosureId(`${PREFIX_ID}_create`),
  );
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`${l.add} ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`${l.add} ${routeTitle} ${l.successful}`),
    },
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      files: null as any,
    },
    validationSchema: yup.object().shape({
      files: fileValidation({
        maxFileSizeMB: 50,
        allowedExtensions: ["pdf"],
      }).required(l.msg_required_form),
    }),
    onSubmit: (values, { resetForm }) => {
      back();

      const payload = new FormData();
      values.files.forEach((file: any) => {
        payload.append("files[]", file);
      });

      const config = {
        url: `${BASE_ENDPOINT}/create`,
        method: "POST",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            resetForm();
            setRt((ps) => !ps);
          },
        },
      });
    },
  });

  return (
    <>
      <Tooltip content={l.add}>
        <Btn
          iconButton
          size={"sm"}
          colorPalette={themeConfig.colorPalette}
          onClick={onOpen}
          {...restProps}
        >
          <AppIcon icon={PlusIcon} />

          {/* Add */}
        </Btn>
      </Tooltip>

      <DisclosureRoot open={isOpen} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`${l.add} ${routeTitle}`} />
          </DisclosureHeader>

          <DisclosureBody>
            <form id={ID} onSubmit={formik.handleSubmit}>
              <FieldsetRoot>
                <Field
                  label={"Files"}
                  invalid={!!formik.errors.files}
                  errorText={formik.errors.files as string}
                >
                  <FileInput
                    dropzone
                    maxFileSizeMB={50}
                    maxFiles={10}
                    inputValue={formik.values.files}
                    onChange={(inputValue) => {
                      formik.setFieldValue("files", inputValue);
                    }}
                  />
                </Field>
              </FieldsetRoot>
            </form>
          </DisclosureBody>

          <DisclosureFooter>
            <Btn
              type={"submit"}
              form={ID}
              colorPalette={themeConfig.colorPalette}
              loading={loading}
            >
              {l.add}
            </Btn>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
const DataUtils = (props: any) => {
  // Props
  const { filter, setFilter, ...restProps } = props;

  return (
    <HStack {...restProps}>
      <SearchInput
        queryKey="ai_knowledge"
        inputValue={filter.search}
        onChange={(inputValue) => {
          setFilter({ ...filter, search: inputValue });
        }}
      />

      <DataDisplayToggle navKey={PREFIX_ID} />
    </HStack>
  );
};

const Delete = (props: any) => {
  const ID = `${PREFIX_ID}_delete`;

  // Props
  const { knowledgeIds, clearSelectedRows, disabled, routeTitle } = props;

  // Contexts
  const { l } = useLang();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`${l.delete_} ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`${l.delete_} ${routeTitle} ${l.successful}`),
    },
  });

  // Utils
  function onDeactivate() {
    back();
    req({
      config: {
        url: `${BASE_ENDPOINT}/delete`,
        method: "DELETE",
        data: {
          knowledgeIds: knowledgeIds,
        },
      },
      onResolve: {
        onSuccess: () => {
          setRt((ps) => !ps);
          clearSelectedRows?.();
        },
      },
    });
  }

  return (
    <ConfirmationDisclosureTrigger
      w={"full"}
      id={`${ID}-${knowledgeIds}`}
      title={`${l.delete_} ${routeTitle}`}
      description={l.msg_perma_delete}
      confirmLabel={`${l.delete_}`}
      onConfirm={onDeactivate}
      confirmButtonProps={{
        color: "fg.error",
        colorPalette: "gray",
        variant: "outline",
      }}
      loading={loading}
      disabled={disabled}
    >
      <RowOptionMenuTooltip content={l.delete_}>
        <MenuItem value="delete" color={"fg.error"} disabled={disabled}>
          {l.delete_}

          <AppIcon icon={TrashIcon} ml={"auto"}></AppIcon>
        </MenuItem>
      </RowOptionMenuTooltip>
    </ConfirmationDisclosureTrigger>
  );
};

const Data = (props: any) => {
  // Props
  const { filter, routeTitle } = props;

  // Contexts
  const { l } = useLang();
  const displayMode = useDataDisplay((s) => s.getDisplay(PREFIX_ID));
  const displayTable = displayMode === "table";

  // States
  const {
    error,
    initialLoading,
    data,
    onRetry,
    limit,
    setLimit,
    page,
    setPage,
    pagination,
  } = useDataState<Interface__Data[]>({
    // initialData: DUMMY_CHAT_AI_KNOWLEDGE,
    url: `${BASE_ENDPOINT}/get`,
    params: filter,
    dependencies: [filter],
  });
  const dataProps: Interface__DataProps = {
    headers: [
      {
        th: l.file_name,
        sortable: true,
      },
      {
        th: l.file_size,
        sortable: true,
      },
      {
        th: l.mime_type,
        sortable: true,
      },

      // timestamps
      {
        th: l.added,
        sortable: true,
      },
    ],
    rows: data?.map((item, idx) => ({
      id: item.id,
      idx: idx,
      data: item,
      columns: [
        {
          td: (
            <HStack>
              <FileIcon mimeType={item.metaData.mimeType} />
              <P>{item.fileName}</P>
            </HStack>
          ),
          value: item.fileName,
        },
        {
          td: item.metaData.fileSize,
          value: item.metaData.fileSize,
        },
        {
          td: item.metaData.mimeType,
          value: item.metaData.mimeType,
        },

        // timestamps
        {
          td: formatDate(item.createdAt, {
            variant: "numeric",
            withTime: true,
          }),
          value: item.createdAt,
          dataType: "date",
          dashEmpty: true,
        },
      ],
    })),
    rowOptions: [
      (row) => ({
        label: l.view,
        icon: ArrowUpRightIcon,
        onClick: () => {
          window.open(
            imgUrl(row.data.metaData.filePath) as string,
            "_blank",
            "noopener,noreferrer",
          );
        },
      }),
      (row) => ({
        override: (
          <Delete knowledgeIds={[row.data.id]} routeTitle={routeTitle} />
        ),
      }),
    ] as Interface__RowOptionsTableOptionGenerator<Interface__Data>[],
    batchOptions: [
      (ids, { clearSelectedRows }) => ({
        override: (
          <Delete
            knowledgeIds={ids}
            clearSelectedRows={clearSelectedRows}
            routeTitle={routeTitle}
          />
        ),
      }),
    ] as Interface__BatchOptionsTableOptionGenerator[],
  };
  const render = {
    loading: <TableSkeleton />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    loaded: displayTable ? (
      <DataTable
        headers={dataProps.headers}
        rows={dataProps.rows}
        rowOptions={dataProps.rowOptions}
        batchOptions={dataProps.batchOptions}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        totalPage={pagination?.meta?.lastPage}
      />
    ) : (
      <DataGrid
        data={data}
        dataProps={dataProps}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        totalPage={pagination?.meta?.lastPage}
        minChildWidth="150px"
        gridItem={({
          item,
          row,
          details,
          selectedRows,
          toggleRowSelection,
        }: any) => {
          const resolvedItem: Interface__Data = item;

          return (
            <DataGridAIKnowledgeItem
              key={resolvedItem.id}
              item={{
                id: resolvedItem.id,
                fileName: resolvedItem.fileName,
                metaData: resolvedItem?.metaData,
                createdAt: resolvedItem.createdAt,
              }}
              dataProps={dataProps}
              row={row}
              selectedRows={selectedRows}
              toggleRowSelection={toggleRowSelection}
              routeTitle={routeTitle}
              details={details}
            />
          );
        }}
      />
    ),
  };

  return (
    <>
      {initialLoading && render.loading}

      {!initialLoading && (
        <>
          {error && render.error}
          {!error && (
            <>
              {data && render.loaded}
              {(!data || isEmptyArray(data)) && render.empty}
            </>
          )}
        </>
      )}
    </>
  );
};

export default function Page() {
  // Contexts
  const { l } = useLang();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const dimension = useContainerDimension(containerRef);
  const isValidDimension = isDimensionValid(dimension);
  const isSmContainer = dimension.width < 600;

  // States
  const pathname = usePathname();
  const activeNav = getActiveNavs(pathname);
  const routeTitle = pluckString(l, last(activeNav)!.labelKey);
  const DEFAULT_FILTER = {
    search: "",
  };
  const [filter, setFilter] = useState(DEFAULT_FILTER);

  return (
    <PageContainer ref={containerRef}>
      <PageTitle w={"full"} justify={"space-between"} pr={3}>
        <HStack>
          {!isSmContainer && (
            <DataUtils
              filter={filter}
              setFilter={setFilter}
              routeTitle={routeTitle}
            />
          )}

          <Create routeTitle={routeTitle} />
        </HStack>
      </PageTitle>

      {isValidDimension && (
        <PageContent overflowY={"auto"}>
          {isSmContainer && (
            <HScroll flexShrink={0} px={3} mb={4}>
              <HStack minW={"full"} justify={"space-between"}>
                <DataUtils
                  filter={filter}
                  setFilter={setFilter}
                  routeTitle={routeTitle}
                />
              </HStack>
            </HScroll>
          )}

          <Data filter={filter} routeTitle={routeTitle} />
        </PageContent>
      )}
    </PageContainer>
  );
}
