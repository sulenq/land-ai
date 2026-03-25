"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Field, FieldsetRoot } from "@/components/ui/field";
import { FileInput } from "@/components/ui/file-input";
import { Img } from "@/components/ui/img";
import { ImgInput } from "@/components/ui/img-input";
import { MenuItem } from "@/components/ui/menu";
import { P } from "@/components/ui/p";
import SearchInput from "@/components/ui/search-input";
import { StringInput } from "@/components/ui/string-input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIcon } from "@/components/widget/AppIcon";
import { ClampText } from "@/components/widget/ClampText";
import { ConfirmationDisclosureTrigger } from "@/components/widget/ConfirmationDisclosure";
import { DataDisplayToggle } from "@/components/widget/DataDisplayToggle";
import { DataGrid } from "@/components/widget/DataGrid";
import { DataGridItem } from "@/components/widget/DataGridItem";
import { DataTable } from "@/components/widget/DataTable";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { HScroll } from "@/components/widget/HScroll";

import {
  PageContainer,
  PageContent,
  PageTitle,
} from "@/components/widget/PageShell";
import { RowOptionMenuTooltip } from "@/components/widget/RowOptions";
import { SimpleDisclosure } from "@/components/widget/SimpleDisclosure";
import { TableSkeleton } from "@/components/widget/TableSkeleton";
import { ADMIN_API_DA_SERVICE_BASE } from "@/constants/apis";
import {
  Interface__BatchOptionsTableOptionGenerator,
  Interface__DAServiceDetail,
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
import { fileValidation, min1File } from "@/utils/validationSchema";
import { Center, HStack, InputGroup, SimpleGrid } from "@chakra-ui/react";
import { useFormik } from "formik";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import * as yup from "yup";

const BASE_ENDPOINT = ADMIN_API_DA_SERVICE_BASE;
const PREFIX_ID = "da_service";
type Interface__Data = Interface__DAServiceDetail;

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
      icon: null as any,
      titleId: "",
      titleEn: "",
      descriptionId: "",
      descriptionEn: "",
      requirements: "",
    },
    validationSchema: yup.object().shape({
      icon: fileValidation({
        maxFileSizeMB: 50,
        allowedExtensions: ["png", "jpg", "jpeg", "webp"],
      }).required(l.msg_required_form),
      titleId: yup.string().required(l.msg_required_form),
      titleEn: yup.string().required(l.msg_required_form),
      descriptionId: yup.string().required(l.msg_required_form),
      descriptionEn: yup.string().required(l.msg_required_form),
      requirements: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values, { resetForm }) => {
      back();

      const payload = new FormData();
      payload.append("icon", values.icon[0]);
      payload.append("title_id", values.titleId);
      payload.append("title_en", values.titleEn);
      payload.append("description_id", values.descriptionId);
      payload.append("description_en", values.descriptionEn);
      payload.append("requirements", values.requirements);

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

      <SimpleDisclosure
        withMaximizeButton
        open={isOpen}
        title={`${l.add} ${routeTitle}`}
        bodyContent={
          <form id={ID} onSubmit={formik.handleSubmit}>
            <FieldsetRoot>
              <Field
                label={"Icon"}
                invalid={!!formik.errors.icon}
                errorText={formik.errors.icon as string}
              >
                <FileInput
                  dropzone
                  maxFileSizeMB={50}
                  maxFiles={10}
                  inputValue={formik.values.icon}
                  onChange={(inputValue) => {
                    formik.setFieldValue("icon", inputValue);
                  }}
                />
              </Field>

              <Field
                label={l.name}
                invalid={!!(formik.errors.titleId || formik.errors.titleEn)}
                errorText={
                  (formik.errors.titleId || formik.errors.titleEn) as string
                }
              >
                <InputGroup startElement={<P>ID</P>}>
                  <StringInput
                    inputValue={formik.values.titleId}
                    onChange={(inputValue) => {
                      formik.setFieldValue("titleId", inputValue);
                    }}
                  />
                </InputGroup>

                <InputGroup startElement={<P>EN</P>}>
                  <StringInput
                    inputValue={formik.values.titleEn}
                    onChange={(inputValue) => {
                      formik.setFieldValue("titleEn", inputValue);
                    }}
                  />
                </InputGroup>
              </Field>

              <Field
                label={l.description}
                invalid={
                  !!(formik.errors.descriptionId || formik.errors.descriptionEn)
                }
                errorText={
                  (formik.errors.descriptionId ||
                    formik.errors.descriptionEn) as string
                }
              >
                <InputGroup
                  startElement={
                    <P mt={"10px"} mb={"auto"}>
                      ID
                    </P>
                  }
                >
                  <Textarea
                    inputValue={formik.values.descriptionId}
                    onChange={(inputValue) => {
                      formik.setFieldValue("descriptionId", inputValue);
                    }}
                    pl={"40px !important"}
                  />
                </InputGroup>

                <InputGroup
                  startElement={
                    <P mt={"10px"} mb={"auto"}>
                      EN
                    </P>
                  }
                >
                  <Textarea
                    inputValue={formik.values.descriptionEn}
                    onChange={(inputValue) => {
                      formik.setFieldValue("descriptionEn", inputValue);
                    }}
                    pl={"40px !important"}
                  />
                </InputGroup>
              </Field>

              <Field
                label={l.requirements}
                invalid={!!formik.errors.requirements}
                errorText={formik.errors.requirements as string}
              >
                <Textarea
                  inputValue={formik.values.requirements}
                  onChange={(inputValue) => {
                    formik.setFieldValue("requirements", inputValue);
                  }}
                />
              </Field>
            </FieldsetRoot>
          </form>
        }
        footerContent={
          <>
            <Btn
              type={"submit"}
              form={ID}
              colorPalette={themeConfig.colorPalette}
              loading={loading}
            >
              {l.add}
            </Btn>
          </>
        }
      />
    </>
  );
};

const Edit = (props: any) => {
  const ID = `${PREFIX_ID}_edit`;

  // Props
  const { routeTitle, initialData, index, ...restProps } = props;
  const data = initialData as Interface__Data;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Refs
  const bodyRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { isOpen, onOpen } = usePopDisclosure(
    disclosureId(`${PREFIX_ID}_edit_${initialData.id}`),
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
  const bodyDimension = useContainerDimension(bodyRef);

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      icon: null as any,
      titleId: data.title.id,
      titleEn: data.title.en,
      descriptionId: data.description.id,
      descriptionEn: data.description.en,
      requirements: JSON.stringify(data.documentRequirements),
    },
    validationSchema: yup.object().shape({
      icon: fileValidation({
        maxFileSizeMB: 50,
        allowedExtensions: ["png", "jpg", "jpeg", "webp"],
      }).concat(
        min1File({
          resolvedData: data,
          existingKey: "icon",
          deletedKey: "deleteIconIds",
          newKey: "icon",
          message: l.msg_required_form,
        }),
      ),
      titleId: yup.string().required(l.msg_required_form),
      titleEn: yup.string().required(l.msg_required_form),
      descriptionId: yup.string().required(l.msg_required_form),
      descriptionEn: yup.string().required(l.msg_required_form),
      requirements: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values, { resetForm }) => {
      back();

      const payload = new FormData();
      if (values.icon[0]) payload.append("icon", values.icon[0]);
      payload.append("title_id", values.titleId);
      payload.append("title_en", values.titleEn);
      payload.append("description_id", values.descriptionId);
      payload.append("description_en", values.descriptionEn);
      payload.append("requirements", values.requirements);

      const config = {
        url: `${BASE_ENDPOINT}/update/${data.id}`,
        method: "PATCH",
        data: payload,
      };

      console.debug("hit");

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
        <MenuItem onClick={onOpen} {...restProps}>
          Edit
          <AppIcon icon={PencilIcon} ml={"auto"} />
        </MenuItem>
      </Tooltip>

      <SimpleDisclosure
        withMaximizeButton
        open={isOpen}
        title={`Edit ${routeTitle}`}
        bodyProps={{
          ref: bodyRef,
        }}
        bodyContent={
          <form id={ID} onSubmit={formik.handleSubmit}>
            <FieldsetRoot>
              <SimpleGrid gap={4} columns={bodyDimension?.width < 500 ? 1 : 2}>
                <Field
                  label={"Icon"}
                  invalid={!!formik.errors.icon}
                  errorText={formik.errors.icon as string}
                >
                  <ImgInput
                    maxFileSizeMB={50}
                    minH={"300px"}
                    inputValue={formik.values.icon}
                    onChange={(inputValue) => {
                      formik.setFieldValue("icon", inputValue);
                    }}
                    existingFiles={[
                      {
                        id: "1",
                        fileName: "Icon",
                        filePath: data.icon,
                        fileUrl: imgUrl(data.icon) as string,
                        fileMimeType: "",
                        fileSize: "",
                      },
                    ]}
                    onDeleteFile={(fileData) => {
                      formik.setFieldValue(
                        "icon",
                        Array.from(
                          new Set([...formik.values.icon, fileData.id]),
                        ),
                      );
                    }}
                    onUndoDeleteFile={(fileData) => {
                      formik.setFieldValue(
                        "icon",
                        formik.values.icon.filter(
                          (id: string) => id !== fileData.id,
                        ),
                      );
                    }}
                  />
                </Field>

                <CContainer gap={4}>
                  <Field
                    label={l.name}
                    invalid={!!(formik.errors.titleId || formik.errors.titleEn)}
                    errorText={
                      (formik.errors.titleId || formik.errors.titleEn) as string
                    }
                  >
                    <InputGroup startElement={<P>ID</P>}>
                      <StringInput
                        inputValue={formik.values.titleId}
                        onChange={(inputValue) => {
                          formik.setFieldValue("titleId", inputValue);
                        }}
                      />
                    </InputGroup>

                    <InputGroup startElement={<P>EN</P>}>
                      <StringInput
                        inputValue={formik.values.titleEn}
                        onChange={(inputValue) => {
                          formik.setFieldValue("titleEn", inputValue);
                        }}
                      />
                    </InputGroup>
                  </Field>

                  <Field
                    label={l.description}
                    invalid={
                      !!(
                        formik.errors.descriptionId ||
                        formik.errors.descriptionEn
                      )
                    }
                    errorText={
                      (formik.errors.descriptionId ||
                        formik.errors.descriptionEn) as string
                    }
                  >
                    <InputGroup
                      startElement={
                        <P mt={"10px"} mb={"auto"}>
                          ID
                        </P>
                      }
                    >
                      <Textarea
                        inputValue={formik.values.descriptionId}
                        onChange={(inputValue) => {
                          formik.setFieldValue("descriptionId", inputValue);
                        }}
                        pl={"40px !important"}
                      />
                    </InputGroup>

                    <InputGroup
                      startElement={
                        <P mt={"10px"} mb={"auto"}>
                          EN
                        </P>
                      }
                    >
                      <Textarea
                        inputValue={formik.values.descriptionEn}
                        onChange={(inputValue) => {
                          formik.setFieldValue("descriptionEn", inputValue);
                        }}
                        pl={"40px !important"}
                      />
                    </InputGroup>
                  </Field>
                </CContainer>
              </SimpleGrid>

              <Field
                label={l.requirements}
                invalid={!!formik.errors.requirements}
                errorText={formik.errors.requirements as string}
              >
                <Textarea
                  inputValue={formik.values.requirements}
                  onChange={(inputValue) => {
                    formik.setFieldValue("requirements", inputValue);
                  }}
                />
              </Field>
            </FieldsetRoot>
          </form>
        }
        footerContent={
          <>
            <Btn
              type={"submit"}
              form={ID}
              colorPalette={themeConfig.colorPalette}
              loading={loading}
            >
              {l.save}
            </Btn>
          </>
        }
      />
    </>
  );
};

const DataUtils = (props: any) => {
  // Props
  const { filter, setFilter, ...restProps } = props;

  return (
    <HStack {...restProps}>
      <SearchInput
        queryKey={`${PREFIX_ID}_search`}
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
  const { deletedIds, clearSelectedRows, disabled, routeTitle } = props;

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
          daServiceIds: deletedIds,
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
      id={`${ID}-${deletedIds}`}
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
  const { l, lang } = useLang();
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
    url: `${BASE_ENDPOINT}/index`,
    params: filter,
    dependencies: [filter],
  });
  const dataProps: Interface__DataProps = {
    headers: [
      {
        th: l.name,
        sortable: true,
      },
      {
        th: l.description,
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
              <Img
                src={imgUrl(item?.icon)}
                w={"20px"}
                h={"20px"}
                objectFit={"contain"}
              />
              <P>{item.title[lang]}</P>
            </HStack>
          ),
          value: item.title[lang],
        },

        {
          td: <ClampText>{item.description[lang]}</ClampText>,
          value: item.description[lang],
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
        override: (
          <Edit
            initialData={row.data}
            index={row.idx}
            routeTitle={routeTitle}
          />
        ),
      }),
      (row) => ({
        override: <Delete deletedIds={[row.data.id]} routeTitle={routeTitle} />,
      }),
    ] as Interface__RowOptionsTableOptionGenerator<Interface__Data>[],
    batchOptions: [
      (ids, { clearSelectedRows }) => ({
        override: (
          <Delete
            knowledgeIds={ids}
            clearSelectedRows={clearSelectedRows}
            routeTitle={routeTitle}
            disabled={isEmptyArray(ids)}
          />
        ),
      }),
    ] as Interface__BatchOptionsTableOptionGenerator[],
  };
  const render = {
    loading: <TableSkeleton />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
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
        totalPage={pagination?.lastPage}
      />
    ) : (
      <DataGrid
        data={data}
        dataProps={dataProps}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        totalPage={pagination?.lastPage}
        gridItem={({
          item,
          row,
          details,
          selectedRows,
          toggleRowSelection,
        }: any) => {
          const resolvedItem: Interface__Data = item;

          return (
            <DataGridItem
              key={resolvedItem.id}
              item={{
                id: resolvedItem.id,
                topElement: (
                  <Center p={4} w={"fit"}>
                    <Img
                      src={imgUrl(resolvedItem.icon)}
                      w={"40px"}
                      h={"40px"}
                      objectFit={"contain"}
                    />
                  </Center>
                ),
                title: resolvedItem.title[lang],
                description: resolvedItem.description[lang],
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
              {!isEmptyArray(data) && render.loaded}

              {isEmptyArray(data) && render.empty}
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
      <PageTitle w={"full"} justify={"space-between"} pr={4}>
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
