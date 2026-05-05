"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { CSpinner } from "@/components/ui/c-loader";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { AppIcon } from "@/components/widget/AppIcon";
import BackButton from "@/components/widget/BackButton";
import { DataTable } from "@/components/widget/DataTable";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { DotIndicator } from "@/components/widget/Indicator";
import {
  Interface__ApplicantFiles,
  Interface__ApplicantItem,
  Interface__DataProps,
} from "@/constants/interfaces";
import useDataState from "@/hooks/useDataState";
import usePopDisclosure from "@/hooks/usePopDisclosure";
import { isEmptyArray } from "@/utils/array";
import { disclosureId } from "@/utils/disclosure";
import { formatDate } from "@/utils/formatter";
import { isEmptyObject } from "@/utils/object";
import { HStack, StackProps } from "@chakra-ui/react";
import { EyeIcon } from "lucide-react";

// -----------------------------------------------------------------

interface Props__DetailPilihanTrigger extends StackProps {
  applicant: Interface__ApplicantItem;
}

const DetailPilihanTrigger = (props: Props__DetailPilihanTrigger) => {
  // Props
  const { children, applicant, ...restProps } = props;

  // Hooks
  const { isOpen, onOpen } = usePopDisclosure(
    disclosureId(`pilihan-${applicant.registration_id}`),
  );

  // States
  const { initialLoading, error, data, onRetry } =
    useDataState<Interface__ApplicantFiles>({
      url: `/api/integrations/ppat-phpt/ui/applicants/${applicant.registration_id}/files`,
      dataResource: false,
      conditions: isOpen,
    });

  // Constants
  const dataProps: Interface__DataProps = {
    headers: [
      {
        th: "JENIS FILE",
        sortable: true,
      },
      {
        th: "EKSTENSI",
        sortable: true,
      },
      {
        th: "TANGGAL UPLOAD",
        sortable: true,
      },
      {
        th: "UKURAN",
        sortable: true,
      },
      {
        th: "WAJIB",
        sortable: true,
        align: "center",
      },
      {
        th: "PILIHAN",
        sortable: true,
      },
    ],
    rows: data?.files.map((item, idx) => {
      return {
        id: `${item.document_type}-${item.file_name}`,
        idx: idx,
        data: item,
        columns: [
          {
            td: <P>{item.document_type}</P>,
            value: item.document_type,
          },
          {
            td: <P>{item.file_name}</P>,
            value: item.file_name,
          },
          {
            td: <P>{item.tanggal_upload_display}</P>,
            value: item.tanggal_upload_display,
          },
          {
            td: <P>{item.ukuran}</P>,
            value: item.ukuran,
          },
          {
            td: <Checkbox checked={item.wajib} bg={"green"} />,
            value: item.wajib,
            align: "center",
          },
          {
            td: (
              <NavLink to={`/ppat/${applicant.registration_id}/viewer`}>
                <Btn colorPalette={"green"}>
                  <AppIcon icon={EyeIcon} />
                  Lihat
                </Btn>
              </NavLink>
            ),
            value: "",
          },
        ],
      };
    }),
    // rowOptions: [
    //   (row) => ({
    //     override: (
    //       <Edit
    //         initialData={row.data}
    //         index={row.idx}
    //         routeTitle={routeTitle}
    //       />
    //     ),
    //   }),
    //   (row) => ({
    //     override: <Delete deletedIds={[row.data.id]} routeTitle={routeTitle} />,
    //   }),
    // ] as Interface__RowOptionsTableOptionGenerator<Interface__Data>[],
    // batchOptions: [
    //   (ids, { clearSelectedRows }) => ({
    //     override: (
    //       <Delete
    //         knowledgeIds={ids}
    //         clearSelectedRows={clearSelectedRows}
    //         routeTitle={routeTitle}
    //         disabled={isEmptyArray(ids)}
    //       />
    //     ),
    //   }),
    // ] as Interface__BatchOptionsTableOptionGenerator[],
  };

  // Render State Map
  const render = {
    loading: <CSpinner />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <CContainer>
        <DataTable headers={dataProps.headers} rows={dataProps.rows} />
      </CContainer>
    ),
  };

  if (isOpen) console.debug(data);

  return (
    <>
      <CContainer onClick={onOpen} {...restProps}>
        {children}
      </CContainer>

      <DisclosureRoot open={isOpen} lazyLoad size={"cover"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent
              title={`Daftar File Yang Telah Diupload`}
            />
          </DisclosureHeader>

          <DisclosureBody>
            <CContainer h={"full"}>
              {initialLoading && render.loading}
              {!initialLoading && (
                <>
                  {error && render.error}
                  {!error && (
                    <>
                      {data && !isEmptyObject(data) && render.loaded}
                      {(!data || isEmptyObject(data)) && render.empty}
                    </>
                  )}
                </>
              )}

              <CContainer mt={4}>
                <P fontWeight={"semibold"}>Perhatian!!</P>
                <P fontWeight={"semibold"} color={"fg.success"}>
                  - Semua file wajib telah diunggah
                </P>
                <P>
                  - Pastikan nama file anda tidak ada karakter khusus seperti
                  tanda + atau = atau ! atau - akan menyebabkan gagal di buka/
                  lihat file tersebut.
                </P>
              </CContainer>
            </CContainer>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};

// -----------------------------------------------------------------

export default function Page() {
  // States
  const {
    initialLoading,
    error,
    data,
    onRetry,
    limit,
    setLimit,
    page,
    setPage,
    response,
  } = useDataState<Interface__ApplicantItem[]>({
    url: `/api/integrations/ppat-phpt/ui/applicants`,
  });

  // Constants
  const dataProps: Interface__DataProps = {
    headers: [
      {
        th: "REGISTRASI ID",
        sortable: true,
      },
      {
        th: "NAMA",
        sortable: true,
      },
      {
        th: "NIK",
        sortable: true,
      },
      {
        th: "WILAYAH KERJA",
        sortable: true,
      },
      {
        th: "WILAYAH KERJA ASAL",
        sortable: true,
      },
      {
        th: "PERSYARATAN",
        sortable: true,
      },
      {
        th: "STATUS KONFIRMASI",
        sortable: true,
      },
      {
        th: "STATUS VERIFIKASI",
        sortable: true,
      },
      {
        th: "PILIHAN",
      },
      {
        th: "",
      },
    ],
    rows: data?.map((item, idx) => {
      const isConfirm = item.status_konfirmasi.label === "Sudah Dikonfirmasi";
      const isRejected = item.group === "rejected";

      return {
        id: item.registration_id,
        idx: idx,
        data: item,
        columns: [
          {
            td: <P>{item.registration_id}</P>,
            value: item.registration_id,
          },
          {
            td: <P>{item.nama}</P>,
            value: item.nama,
          },
          {
            td: <P>{item.nik}</P>,
            value: item.nik,
          },
          {
            td: (
              <P w={"300px"} whiteSpace={"wrap"}>
                {item.wilayah_kerja}
              </P>
            ),
            value: item.wilayah_kerja,
          },
          {
            td: (
              <P w={"300px"} whiteSpace={"wrap"}>
                {item.wilayah_kerja_asal}
              </P>
            ),
            value: item.wilayah_kerja_asal,
          },
          {
            td: (
              <P w={"300px"} whiteSpace={"wrap"}>
                {item.persyaratan}
              </P>
            ),
            value: item.persyaratan,
          },
          {
            td: (
              <CContainer>
                <P
                  whiteSpace={"wrap"}
                  fontWeight={"medium"}
                  color={isConfirm ? "fg.success" : "fg.error"}
                >
                  {item.status_konfirmasi.label}
                </P>

                <P>
                  {formatDate(item.status_konfirmasi.confirmed_at, {
                    variant: "numeric",
                    withTime: true,
                  })}
                </P>
              </CContainer>
            ),
            value: item.status_konfirmasi.label,
          },
          {
            td: (
              <P
                fontWeight={"medium"}
                color={`${item.status_verifikasi.tone}.500`}
              >
                {item.status_verifikasi.label}
              </P>
            ),
            value: item.status_verifikasi.label,
          },
          {
            td: (
              <CContainer gap={2}>
                <DetailPilihanTrigger applicant={item}>
                  <Btn colorPalette={"cyan"}>
                    <AppIcon icon={EyeIcon} />
                    Lihat
                  </Btn>
                </DetailPilihanTrigger>

                <NavLink to={`/ppat/${item.registration_id}`}>
                  <HStack>
                    <DotIndicator
                      color={isRejected ? "fg.error" : "fg.success"}
                      mt={"2px"}
                    />

                    <P
                      fontWeight={"medium"}
                      color={isRejected ? "fg.error" : "fg.success"}
                    >
                      {item.group}
                    </P>
                  </HStack>
                </NavLink>
              </CContainer>
            ),
            value: item.group,
          },
          {
            td: (
              <HStack>
                <Btn colorPalette={"green"}>Verifikasi</Btn>
                <Btn colorPalette={"orange"}>Tolak</Btn>
                <Btn colorPalette={"red"}>Tutup</Btn>
              </HStack>
            ),
            value: "",
          },
        ],
      };
    }),
    // rowOptions: [
    //   (row) => ({
    //     override: (
    //       <Edit
    //         initialData={row.data}
    //         index={row.idx}
    //         routeTitle={routeTitle}
    //       />
    //     ),
    //   }),
    //   (row) => ({
    //     override: <Delete deletedIds={[row.data.id]} routeTitle={routeTitle} />,
    //   }),
    // ] as Interface__RowOptionsTableOptionGenerator<Interface__Data>[],
    // batchOptions: [
    //   (ids, { clearSelectedRows }) => ({
    //     override: (
    //       <Delete
    //         knowledgeIds={ids}
    //         clearSelectedRows={clearSelectedRows}
    //         routeTitle={routeTitle}
    //         disabled={isEmptyArray(ids)}
    //       />
    //     ),
    //   }),
    // ] as Interface__BatchOptionsTableOptionGenerator[],
  };

  // Render State Map
  const render = {
    loading: <CSpinner />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <DataTable
        headers={dataProps.headers}
        rows={dataProps.rows}
        rowOptions={dataProps.rowOptions}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        totalPage={response?.meta?.totalPages}
      />
    ),
  };

  return (
    <CContainer h={"100vh"}>
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
    </CContainer>
  );
}
