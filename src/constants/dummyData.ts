import {
  Interface__ChatMessage,
  Interface__ChatSession,
  Interface__DASession,
  Interface__DASessionDetail,
} from "@/constants/interfaces";

export const DUMMY_ACTIVE_DA_SESSION: Interface__DASessionDetail = {
  id: "1",
  title: "DA Service Analysis Session",
  status: "COMPLETED",
  documentService: {
    id: "101",
    icon: `/uploads/services/service-1770357423697-697371719.png`,
    title: {
      id: "Business Registration Verification",
      en: "Business Registration Verification",
    },
    description: {
      id: "Verification service for registered business entities.",
      en: "Verification service for registered business entities.",
    },
    documentRequirements: [
      {
        id: 1,
        name: "Business License",
        description: "Official business license issued by authorities.",
        isMandatory: true,
      },
      {
        id: 2,
        name: "Tax Identification Number",
        description: "Valid tax identification document.",
        isMandatory: true,
      },
      {
        id: 3,
        name: "Company Profile",
        description: "Overview of company background and operations.",
        isMandatory: false,
      },
    ],
    createdAt: "2026-02-05T10:15:30.000Z",
  },
  uploadedDocuments: [
    {
      documentRequirement: {
        id: 1,
        name: "Surat Pengantar",
        description: "Official business license issued by authorities.",
        isMandatory: true,
      },
      metaData: {
        fileName: "sertipikat.pdf",
      },
    },
    {
      documentRequirement: {
        id: 2,
        name: "Sertipikat",
        description: "Valid tax identification document.",
        isMandatory: true,
      },
      metaData: {
        fileName: "surat.pdf",
      },
    },
  ],
  result: [
    {
      key: "nama_pemilik",
      label: "Nama Pemilik",
      values: [
        { documentId: 12, renderType: "string", value: "Jolitos" },
        { documentId: 27, renderType: "string", value: "Jolitos" },
      ],
      validation: { status: true }, // object aja sapa tau ada tambahan entity lain nantinya
    },
    {
      key: "tanggal",
      label: "Tanggal Hak/Sertipikat",
      values: [
        { documentId: 12, renderType: "date", value: "2023-01-01" },
        { documentId: 27, renderType: "date", value: "2023-01-02" },
      ],
      validation: { status: false },
    },
  ],
  createdAt: "2026-02-05T10:15:30.000Z",
};
export const DUMMY_DA_SESSIONS: Interface__DASession[] = [
  {
    id: "da_session_1",
    title: "Verifikasi Sertifikat Hak Milik",
    status: "COMPLETED",
    createdAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "da_session_2",
    title: "Pemeriksaan Peta Bidang Tanah",
    status: "PROCESSING",
    createdAt: "2025-01-02T11:30:00Z",
  },
  {
    id: "da_session_3",
    title: "Analisis Riwayat Peralihan Hak",
    status: "FAILED",
    createdAt: "2025-01-03T09:15:00Z",
  },
  {
    id: "da_session_4",
    title: "Validasi Surat Ukur",
    status: "COMPLETED",
    createdAt: "2025-01-04T14:45:00Z",
  },
  {
    id: "da_session_5",
    title: "Pengecekan Status Hak Guna Bangunan",
    status: "PROCESSING",
    createdAt: "2025-01-05T08:20:00Z",
  },
];
export const DUMMY_CHAT_SESSIONS: Interface__ChatSession[] = [
  {
    id: "30e23784-d63a-4e41-bc5f-01e69d7b6308",
    title: "Analisis SHM Jakarta Selatan",
    createdAt: "2026-01-10T10:12:00Z",
    isProtected: false,
  },
];
export const DUMMY_CHAT_SESSION: {
  session: Interface__ChatSession;
  totalMessages: number;
  messages: Interface__ChatMessage[];
} = {
  session: {
    id: "f8e025f0-10cf-4815-a6bf-5d19405e0ccc",
    title: "Dasar Hukum Yang Mendasari Teknis",
    createdAt: "2025-11-12T04:20:00Z",
    isProtected: false,
  },
  totalMessages: 2,
  messages: [
    {
      id: "1d901f95-cda7-4e1b-85bf-a6654dedea6e",
      role: "user",
      content:
        "Lorem ipsum dolor sit amet, apa saja dasar hukum yang mendasari petunjuk teknis?",
    },
    {
      id: "eb0e89f3-7e7c-4548-b1c4-8eb156b8b5b2",
      role: "assistant",
      content: `
Berikut adalah dasar hukum yang mendasari Petunjuk Teknis ini:

1. **Undang-Undang Nomor 26 Tahun 2007** tentang Penataan Ruang (Lembaran Negara Republik Indonesia Tahun 2007 Nomor 68, Tambahan Lembaran Negara Nomor 4725);
2. **Undang-Undang Nomor 39 Tahun 2008** tentang Kementerian Negara (Lembaran Negara Republik Indonesia Tahun 2008 Nomor 116, Tambahan Lembaran Negara Nomor 4916), sebagaimana telah diubah dengan **Undang-Undang Nomor 61 Tahun 2024**;
3. **Peraturan Pemerintah Nomor 21 Tahun 2021** tentang Penyelenggaraan Penataan Ruang (Lembaran Negara Republik Indonesia Tahun 2021 Nomor 31, Tambahan Lembaran Negara Nomor 6633);
4. **Peraturan Presiden Nomor 176 Tahun 2024** tentang Kementerian Agraria dan Tata Ruang (Lembaran Negara Republik Indonesia Tahun 2024 Nomor 372);
5. **Peraturan Presiden Nomor 177 Tahun 2024** tentang Badan Pertanahan Nasional (Lembaran Negara Republik Indonesia Tahun 2024 Nomor 373);
6. **Peraturan Menteri Agraria dan Tata Ruang/Kepala Badan Pertanahan Nasional Nomor 17 Tahun 2020** tentang Organisasi dan Tata Kerja Kantor Wilayah Badan Pertanahan Nasional dan Kantor Pertanahan (Berita Negara Republik Indonesia Tahun 2020 Nomor 986);
7. **Peraturan Menteri Agraria dan Tata Ruang/Kepala Badan Pertanahan Nasional Nomor 13 Tahun 2021** tentang Pelaksanaan Kesesuaian Kegiatan Pemanfaatan Ruang dan Sinkronisasi Program Pemanfaatan Ruang (Berita Negara Republik Indonesia Tahun 2021 Nomor 330);
8. **Peraturan Menteri Agraria dan Tata Ruang/Kepala Badan Pertanahan Nasional Nomor 15 Tahun 2021** tentang Koordinasi Penyelenggaraan Penataan Ruang (Berita Negara Republik Indonesia Tahun 2021 Nomor 327);
9. **Peraturan Menteri Agraria dan Tata Ruang/Kepala Badan Pertanahan Nasional Nomor 9 Tahun 2022** tentang Perubahan atas Peraturan Nomor 15 Tahun 2021 (Berita Negara Republik Indonesia Tahun 2022 Nomor 530);
10. **Peraturan Menteri Agraria dan Tata Ruang/Kepala Badan Pertanahan Nasional Nomor 6 Tahun 2025** tentang Organisasi dan Tata Kerja Kementerian Agraria dan Tata Ruang/Badan Pertanahan Nasional (Berita Negara Republik Indonesia Tahun 2025 Nomor 309).

Dokumen ini menjadi dasar bagi pelaksanaan teknis penataan ruang dan koordinasi antara kementerian/lembaga terkait. Silakan merujuk tiap regulasi untuk detail lebih lanjut.
`,
      sources: ["https://example.com/doc/123", "https://example.com/doc/456"],
    },
  ],
};

const generate1D = () => {
  let v23 = 80;
  let v24 = 90;
  let v25 = 100;

  return Array.from({ length: 366 }, (_, i) => {
    v23 += Math.floor(Math.random() * 7 - 3);
    v24 += Math.floor(Math.random() * 7 - 3);
    v25 += Math.floor(Math.random() * 7 - 3);

    v23 = Math.max(20, Math.min(160, v23));
    v24 = Math.max(20, Math.min(160, v24));
    v25 = Math.max(20, Math.min(160, v25));

    return {
      2023: v23,
      2024: v24,
      2025: v25,
      day: i + 1,
    };
  });
};
const generate1W = () => {
  let v23 = 90;
  let v24 = 100;
  let v25 = 110;

  return Array.from({ length: 52 }, (_, i) => {
    v23 += Math.floor(Math.random() * 9 - 4);
    v24 += Math.floor(Math.random() * 9 - 4);
    v25 += Math.floor(Math.random() * 9 - 4);

    v23 = Math.max(30, Math.min(180, v23));
    v24 = Math.max(30, Math.min(180, v24));
    v25 = Math.max(30, Math.min(180, v25));

    return {
      2023: v23,
      2024: v24,
      2025: v25,
      week: i + 1,
    };
  });
};
const generate1M = () => {
  let v23 = 90;
  let v24 = 100;
  let v25 = 110;

  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ].map((month) => {
    v23 += Math.floor(Math.random() * 5 - 2);
    v24 += Math.floor(Math.random() * 5 - 2);
    v25 += Math.floor(Math.random() * 5 - 2);

    v23 = Math.max(60, Math.min(140, v23));
    v24 = Math.max(60, Math.min(140, v24));
    v25 = Math.max(60, Math.min(140, v25));

    return {
      2023: v23,
      2024: v24,
      2025: v25,
      month,
    };
  });
};
const generate3M = () => {
  let v23 = 95;
  let v24 = 105;
  let v25 = 115;

  return ["January", "April", "July", "October"].map((month) => {
    v23 += Math.floor(Math.random() * 3 - 1);
    v24 += Math.floor(Math.random() * 3 - 1);
    v25 += Math.floor(Math.random() * 3 - 1);

    v23 = Math.max(80, Math.min(130, v23));
    v24 = Math.max(80, Math.min(130, v24));
    v25 = Math.max(80, Math.min(130, v25));

    return {
      2023: v23,
      2024: v24,
      2025: v25,
      month,
    };
  });
};

export const dummyChartData = {
  "1D": generate1D(),

  "1W": generate1W(),

  "1M": generate1M(),

  "3M": generate3M(),
};
