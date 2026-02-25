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
import { MenuItem } from "@/components/ui/menu";
import { P } from "@/components/ui/p";
import SearchInput from "@/components/ui/search-input";
import { StringInput } from "@/components/ui/string-input";
import { Tooltip } from "@/components/ui/tooltip";
import { AccountStatus } from "@/components/widget/AccountStatus";
import { AppIcon } from "@/components/widget/AppIcon";
import { ConfirmationDisclosureTrigger } from "@/components/widget/ConfirmationDisclosure";
import { DataDisplayToggle } from "@/components/widget/DataDisplayToggle";
import { DataGrid } from "@/components/widget/DataGrid";
import { DataGridItem } from "@/components/widget/DataGridItem";
import { DataTable } from "@/components/widget/DataTable";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import HScroll from "@/components/widget/HScroll";
import { MiniUser } from "@/components/widget/MiniUser";
import {
  PageContainer,
  PageContent,
  PageTitle,
} from "@/components/widget/PageShell";
import { RowOptionMenuTooltip } from "@/components/widget/RowOptions";
import { TableSkeleton } from "@/components/widget/TableSkeleton";
import { ADMIN_API_USER_BAsE } from "@/constants/apis";
import { DUMMY_USERS } from "@/constants/dummyData";
import {
  Interface__BatchOptionsTableOptionGenerator,
  Interface__DataProps,
  Interface__RowOptionsTableOptionGenerator,
  Interface__User,
} from "@/constants/interfaces";
import { SVGS_PATH } from "@/constants/paths";
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
import { HStack, Icon } from "@chakra-ui/react";
import { IconActivity, IconX } from "@tabler/icons-react";
import { useFormik } from "formik";
import { PlusIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import * as yup from "yup";

const BASE_ENDPOINT = ADMIN_API_USER_BAsE;
const PREFIX_ID = "user";
type Interface__Data = Interface__User;

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
      name: "",
    },
    validationSchema: yup.object().shape({}),
    onSubmit: (values, { resetForm }) => {
      back();

      const payload = values;

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
                  invalid={!!formik.errors.name}
                  errorText={formik.errors.name as string}
                >
                  <StringInput
                    inputValue={formik.values.name}
                    onChange={(inputValue) => {
                      formik.setFieldValue("name", inputValue);
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
        queryKey="user"
        inputValue={filter.search}
        onChange={(inputValue) => {
          setFilter({ ...filter, search: inputValue });
        }}
      />

      <DataDisplayToggle navKey={PREFIX_ID} />
    </HStack>
  );
};

const Activate = (props: any) => {
  const ID = `${PREFIX_ID}_activate`;

  // Props
  const { activateAccountIds, clearSelectedRows, disabled, routeTitle } = props;

  // Contexts
  const { l } = useLang();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`${l.activate} ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`${l.activate} ${routeTitle} ${l.successful}`),
    },
  });

  // Utils
  function onActivate() {
    back();
    req({
      config: {
        url: `${BASE_ENDPOINT}/activate`,
        method: "PATCH",
        data: {
          activateAccountIds: activateAccountIds,
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
      id={`${ID}-${activateAccountIds}`}
      title={`${l.activate} ${routeTitle}`}
      description={l.msg_activate}
      confirmLabel={`${l.activate}`}
      onConfirm={onActivate}
      loading={loading}
      disabled={disabled}
    >
      <RowOptionMenuTooltip content={l.activate}>
        <MenuItem value="activate" disabled={disabled}>
          {l.activate}
          <Icon boxSize={"18px"} ml={"auto"}>
            <IconActivity stroke={1.5} />
          </Icon>
        </MenuItem>
      </RowOptionMenuTooltip>
    </ConfirmationDisclosureTrigger>
  );
};
const Suspend = (props: any) => {
  const ID = `${PREFIX_ID}_suspend`;

  // Props
  const { suspendedAccountIds, clearSelectedRows, disabled, routeTitle } =
    props;

  // Contexts
  const { l } = useLang();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`${l.suspend} ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`${l.suspend} ${routeTitle} ${l.successful}`),
    },
  });

  // Utils
  function onDeactivate() {
    back();
    req({
      config: {
        url: `${BASE_ENDPOINT}/suspend`,
        method: "PATCH",
        data: {
          suspendedAccountIds: suspendedAccountIds,
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
      id={`${ID}-${suspendedAccountIds}`}
      title={`${l.suspend} ${routeTitle}`}
      description={l.msg_suspend}
      confirmLabel={`${l.suspend}`}
      onConfirm={onDeactivate}
      confirmButtonProps={{
        color: "fg.error",
        colorPalette: "gray",
        variant: "outline",
      }}
      loading={loading}
      disabled={disabled}
    >
      <RowOptionMenuTooltip content={l.suspend}>
        <MenuItem value="suspend" color={"fg.error"} disabled={disabled}>
          {l.suspend}
          <Icon boxSize={"18px"} ml={"auto"}>
            <IconX stroke={1.5} />
          </Icon>
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
    initialData: DUMMY_USERS,
    // url: `${BASE_ENDPOINT}/index`,
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
        th: l.account_status,
        sortable: true,
      },

      // timestamps
      {
        th: l.added,
        sortable: true,
      },
      {
        th: l.updated,
        sortable: true,
      },
      {
        th: l.deleted,
        sortable: true,
      },
    ],
    rows: data?.map((item, idx) => ({
      id: item.id,
      idx: idx,
      data: item,
      dim: !!item.deletedAt,
      columns: [
        {
          td: <MiniUser user={item} minW={"150px"} />,
          value: item.name,
        },
        {
          td: (
            <AccountStatus
              accountStatus={item.accountStatus}
              w={displayTable ? "80px" : ""}
            />
          ),
          value: item.accountStatus,
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
        {
          td: formatDate(item.updatedAt, {
            variant: "numeric",
            withTime: true,
            dashEmpty: true,
          }),
          value: item.updatedAt,
          dataType: "date",
        },
        {
          td: formatDate(item.deletedAt, {
            variant: "numeric",
            withTime: true,
            dashEmpty: true,
          }),
          value: item.deletedAt,
          dataType: "date",
        },
      ],
    })),
    rowOptions: [
      // (row) => ({
      //   override: <Update data={row.data} routeTitle={routeTitle} />,
      // }),
      (row) => ({
        override: (
          <Activate
            activateAccountIds={[row.data.id]}
            disabled={row.data.accountStatus == `ACTIVE`}
            routeTitle={routeTitle}
          />
        ),
      }),
      (row) => ({
        override: (
          <Suspend
            suspendedAccountIds={[row.data.id]}
            disabled={row.data.accountStatus != `ACTIVE`}
            routeTitle={routeTitle}
          />
        ),
      }),
    ] as Interface__RowOptionsTableOptionGenerator<Interface__Data>[],
    batchOptions: [
      (ids, { clearSelectedRows }) => ({
        override: (
          <Activate
            activateAccountIds={ids}
            clearSelectedRows={clearSelectedRows}
            disabled={
              isEmptyArray(ids) ||
              data
                ?.filter((item) => ids.includes(item.id))
                .some((item) => item.accountStatus == `ACTIVE`)
            }
            routeTitle={routeTitle}
          />
        ),
      }),
      (ids, { clearSelectedRows }) => ({
        override: (
          <Suspend
            suspendedAccountIds={ids}
            clearSelectedRows={clearSelectedRows}
            disabled={
              isEmptyArray(ids) ||
              data
                ?.filter((item) => ids.includes(item.id))
                .some((item) => item.accountStatus != `ACTIVE`)
            }
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
                showImg: true,
                img: imgUrl(resolvedItem.avatar?.[0]?.filePath),
                imgFallbackSrc: `${SVGS_PATH}/no-avatar.svg`,
                title: (
                  <HStack>
                    <P fontWeight={"semibold"} lineClamp={1}>
                      {resolvedItem?.name}
                    </P>

                    <AccountStatus
                      accountStatus={resolvedItem.accountStatus}
                      pos={"absolute"}
                      top={1}
                      left={2}
                    />
                  </HStack>
                ),
                description: resolvedItem?.email,
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
