import {
  Interface__ChatAIKnowledge,
  Interface__ChatMessage,
  Interface__ChatSession,
  Interface__DASession,
  Interface__DASessionDetail,
  Interface__User,
} from "@/constants/interfaces";

export const DUMMY_DASHBOARD_DATA = {
  totalUsers: 1284,
  totalDocument: 356,
  totalQueryThisDay: 742,
  totalDOcumentCompared: 189,
  AnswerSuccessRate: 0.94,
  AvgResponseTime: 1820,
};

export const DUMMY_SURAT_KUASA_DATA = {
  grantorName: "Budi Santoso",
  grantorBirthPlaceDate: "Jakarta, 12 Januari 1975",
  grantorNik: "3175012301750001",
  grantorOccupation: "Karyawan Swasta",
  grantorAddress: "Jl. Melati No. 12, RT 05/RW 03, Jakarta Pusat",
  granteeName: "Siti Aminah",
  granteeBirthPlaceDate: "Bandung, 20 Februari 1980",
  granteeNIK: "3278012002800002",
  granteeOccupation: "Pegawai Negeri Sipil",
  granteeAddress: "Jl. Anggrek No. 45, RT 07/RW 02, Bandung",
  city: "Jakarta",
  subject: "Pembuatan Sertipikat Tanah",
  road: "Jl. Kenanga No. 99",
  village: "Kampung Baru",
  district: "Sawah Besar",
  province: "DKI Jakarta",
  titleNumber: "12345/2026",
  area: "150 m²",
  nib: "09.02.13.04.1.12345",
  imgDate: "10 Januari 2026",
  imgNumber: "98765/2026",
  titleType: "Hak Milik",
  certificateSerialNumber: "AD 123456",
  address: "Kementerian ATR/BPN RI Kantor Pertanahan Jakarta Pusat",
  noSuratKuasa: "012/SK/II/2026",
  suratKuasaDate: "20 Februari 2026",
  dateStamp: "25 Februari 2026",
};

export const DUMMY_CHAT_AI_KNOWLEDGE: Interface__ChatAIKnowledge[] = [
  {
    id: "1",
    fileName: "document-1.pdf",
    metaData: {
      fileSize: 10000,
      mimeType: "application/pdf",
      filePath: "/",
      fileName: "",
    },
    createdAt: "2026-02-01T08:12:00Z",
  },
  {
    id: "2",
    fileName: "document-2.pdf",
    metaData: {
      fileSize: 10000,
      mimeType: "application/pdf",
      filePath: "/",
      fileName: "",
    },
    createdAt: "2026-02-02T09:20:00Z",
  },
  {
    id: "3",
    fileName: "document-3.pdf",
    metaData: {
      fileSize: 10000,
      mimeType: "application/pdf",
      filePath: "/",
      fileName: "",
    },
    createdAt: "2026-02-03T10:45:00Z",
  },
  {
    id: "4",
    fileName: "document-4.pdf",
    metaData: {
      fileSize: 10000,
      mimeType: "application/pdf",
      filePath: "/",
      fileName: "",
    },
    createdAt: "2026-02-04T11:30:00Z",
  },
  {
    id: "5",
    fileName: "document-5.pdf",
    metaData: {
      fileSize: 10000,
      mimeType: "application/pdf",
      filePath: "/",
      fileName: "",
    },
    createdAt: "2026-02-05T12:10:00Z",
  },
  {
    id: "6",
    fileName: "document-6.pdf",
    metaData: {
      fileSize: 10000,
      mimeType: "application/pdf",
      filePath: "/",
      fileName: "",
    },
    createdAt: "2026-02-06T13:05:00Z",
  },
  {
    id: "7",
    fileName: "document-7.pdf",
    metaData: {
      fileSize: 10000,
      mimeType: "application/pdf",
      filePath: "/",
      fileName: "",
    },
    createdAt: "2026-02-07T14:22:00Z",
  },
  {
    id: "8",
    fileName: "document-8.pdf",
    metaData: {
      fileSize: 10000,
      mimeType: "application/pdf",
      filePath: "/",
      fileName: "",
    },
    createdAt: "2026-02-08T15:40:00Z",
  },
  {
    id: "9",
    fileName: "document-9.pdf",
    metaData: {
      fileSize: 10000,
      mimeType: "application/pdf",
      filePath: "/",
      fileName: "",
    },
    createdAt: "2026-02-09T16:18:00Z",
  },
  {
    id: "10",
    fileName: "document-10.pdf",
    metaData: {
      fileSize: 10000,
      mimeType: "application/pdf",
      filePath: "/",
      fileName: "",
    },
    createdAt: "2026-02-10T08:55:00Z",
  },
  {
    id: "11",
    fileName: "document-11.pdf",
    metaData: {
      fileSize: 10000,
      mimeType: "application/pdf",
      filePath: "/",
      fileName: "",
    },
    createdAt: "2026-02-11T09:42:00Z",
  },
  {
    id: "12",
    fileName: "document-12.pdf",
    metaData: {
      fileSize: 10000,
      mimeType: "application/pdf",
      filePath: "/",
      fileName: "",
    },
    createdAt: "2026-02-12T10:33:00Z",
  },
  {
    id: "13",
    fileName: "document-13.pdf",
    metaData: {
      fileSize: 10000,
      mimeType: "application/pdf",
      filePath: "/",
      fileName: "",
    },
    createdAt: "2026-02-13T11:27:00Z",
  },
  {
    id: "14",
    fileName: "document-14.pdf",
    metaData: {
      fileSize: 10000,
      mimeType: "application/pdf",
      filePath: "/",
      fileName: "",
    },
    createdAt: "2026-02-14T12:50:00Z",
  },
  {
    id: "15",
    fileName: "document-15.pdf",
    metaData: {
      fileSize: 10000,
      mimeType: "application/pdf",
      filePath: "/",
      fileName: "",
    },
    createdAt: "2026-02-15T13:15:00Z",
  },
];
export const DUMMY_USERS: Interface__User[] = [
  {
    id: "1",
    name: "User 1",
    email: "user1@mail.com",
    accountStatus: "ACTIVE",
    role: 1,
    permissions: [],
    avatar: [],
    lastLogin: "2026-02-01T08:00:00Z",
    createdAt: "2026-01-01T08:00:00Z",
    createdBy: "system",
  },
  {
    id: "2",
    name: "User 2",
    email: "user2@mail.com",
    accountStatus: "ACTIVE",
    role: 2,
    permissions: [],
    avatar: [],
    lastLogin: "2026-02-02T08:00:00Z",
    createdAt: "2026-01-02T08:00:00Z",
    createdBy: "system",
  },
  {
    id: "3",
    name: "User 3",
    email: "user3@mail.com",
    accountStatus: "SUSPENDED",
    role: 1,
    permissions: [],
    avatar: [],
    lastLogin: "2026-02-03T08:00:00Z",
    createdAt: "2026-01-03T08:00:00Z",
    createdBy: "system",
  },
  {
    id: "4",
    name: "User 4",
    email: "user4@mail.com",
    accountStatus: "ACTIVE",
    role: 3,
    permissions: [],
    avatar: [],
    lastLogin: "2026-02-04T08:00:00Z",
    createdAt: "2026-01-04T08:00:00Z",
    createdBy: "system",
  },
  {
    id: "5",
    name: "User 5",
    email: "user5@mail.com",
    accountStatus: "ACTIVE",
    role: 2,
    permissions: [],
    avatar: [],
    lastLogin: "2026-02-05T08:00:00Z",
    createdAt: "2026-01-05T08:00:00Z",
    createdBy: "system",
  },
  {
    id: "6",
    name: "User 6",
    email: "user6@mail.com",
    accountStatus: "INACTIVE",
    role: 1,
    permissions: [],
    avatar: [],
    lastLogin: "2026-02-06T08:00:00Z",
    createdAt: "2026-01-06T08:00:00Z",
    createdBy: "system",
  },
  {
    id: "7",
    name: "User 7",
    email: "user7@mail.com",
    accountStatus: "ACTIVE",
    role: 2,
    permissions: [],
    avatar: [],
    lastLogin: "2026-02-07T08:00:00Z",
    createdAt: "2026-01-07T08:00:00Z",
    createdBy: "system",
  },
  {
    id: "8",
    name: "User 8",
    email: "user8@mail.com",
    accountStatus: "ACTIVE",
    role: 3,
    permissions: [],
    avatar: [],
    lastLogin: "2026-02-08T08:00:00Z",
    createdAt: "2026-01-08T08:00:00Z",
    createdBy: "system",
  },
  {
    id: "9",
    name: "User 9",
    email: "user9@mail.com",
    accountStatus: "SUSPENDED",
    role: 1,
    permissions: [],
    avatar: [],
    lastLogin: "2026-02-09T08:00:00Z",
    createdAt: "2026-01-09T08:00:00Z",
    createdBy: "system",
  },
  {
    id: "10",
    name: "User 10",
    email: "user10@mail.com",
    accountStatus: "ACTIVE",
    role: 2,
    permissions: [],
    avatar: [],
    lastLogin: "2026-02-10T08:00:00Z",
    createdAt: "2026-01-10T08:00:00Z",
    createdBy: "system",
  },
  {
    id: "11",
    name: "User 11",
    email: "user11@mail.com",
    accountStatus: "ACTIVE",
    role: 1,
    permissions: [],
    avatar: [],
    lastLogin: "2026-02-11T08:00:00Z",
    createdAt: "2026-01-11T08:00:00Z",
    createdBy: "system",
  },
  {
    id: "12",
    name: "User 12",
    email: "user12@mail.com",
    accountStatus: "INACTIVE",
    role: 2,
    permissions: [],
    avatar: [],
    lastLogin: "2026-02-12T08:00:00Z",
    createdAt: "2026-01-12T08:00:00Z",
    createdBy: "system",
  },
  {
    id: "13",
    name: "User 13",
    email: "user13@mail.com",
    accountStatus: "ACTIVE",
    role: 3,
    permissions: [],
    avatar: [],
    lastLogin: "2026-02-13T08:00:00Z",
    createdAt: "2026-01-13T08:00:00Z",
    createdBy: "system",
  },
  {
    id: "14",
    name: "User 14",
    email: "user14@mail.com",
    accountStatus: "ACTIVE",
    role: 1,
    permissions: [],
    avatar: [],
    lastLogin: "2026-02-14T08:00:00Z",
    createdAt: "2026-01-14T08:00:00Z",
    createdBy: "system",
  },
  {
    id: "15",
    name: "User 15",
    email: "user15@mail.com",
    accountStatus: "SUSPENDED",
    role: 2,
    permissions: [],
    avatar: [],
    lastLogin: "2026-02-15T08:00:00Z",
    createdAt: "2026-01-15T08:00:00Z",
    createdBy: "system",
  },
];
export const DUMMY_ACTIVE_DA_SESSION: Interface__DASessionDetail = {
  id: "1",
  title: "DA Service Analysis Session",
  status: "COMPLETED",
  rawData: {},
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
        fileName: "",
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
        fileName: "",
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
    title: "Verifikasi Sertipikat Hak Milik",
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

export const dummyUser: any = {
  id: "1",
  avatar: [
    {
      id: "10",
      fileName: "profile_rani_kartika.jpg",
      filePath: "/uploads/profile/profile_rani_kartika.jpg",
      fileUrl:
        "https://cdn.rssehat.id/uploads/profile/profile_rani_kartika.jpg",
      fileMimeType: "image/jpeg",
      fileSileSize: "245320",
      createdBy: "system",
      updatedBy: "system",
      createdAt: "2023-03-10T08:42:00Z",
      updatedAt: "2025-11-12T04:20:00Z",
    },
  ],
  name: "Dr. Rani Kartika",
  email: "rani.kartika@rssehat.id",
  role: 3,
  permissions: [],
  isActive: true,
  lastChangePassword: "2025-05-01T12:30:00Z",
  accountStatus: "active",
  gender: false, // female
  phoneNumber: "+6281234567890",
  birthDate: "1985-07-12",
  address: "Jl. Melati No. 12, Jakarta Selatan",
  registeredAt: "2023-03-10T08:42:00Z",
  lastLogin: "2025-11-12T04:20:00Z",
  lastChangePasswordAt: "2025-05-01T12:30:00Z",
  deactiveAt: null,
  createdBy: "system",
  updatedBy: "system",
  createdAt: "2023-03-10T08:42:00Z",
  updatedAt: "2025-11-12T04:20:00Z",
  deletedAt: null,
};

export const dummyAuthLogs = [
  {
    id: "sh_001",
    action: "Sign out",
    ip: "192.168.1.10",
    city: "Jakarta",
    countryCode: "ID",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    createdAt: "2025-11-14T03:20:00.000Z",
    updatedAt: "2025-11-14T03:20:00.000Z",
    deletedAt: null,
  },
  {
    id: "sh_002",
    action: "Sign in",
    ip: "10.0.0.5",
    city: "Jakarta",
    countryCode: "ID",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5)",
    createdAt: "2025-11-13T10:45:00.000Z",
    updatedAt: "2025-11-13T10:45:00.000Z",
    deletedAt: null,
  },
  {
    id: "sh_003",
    action: "Sign in",
    ip: "36.72.11.88",
    city: "Jakarta",
    countryCode: "ID",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1)",
    createdAt: "2025-11-10T21:12:00.000Z",
    updatedAt: "2025-11-11T09:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "sh_004",
    action: "Sign out",
    ip: "172.16.0.22",
    city: "Jakarta",
    countryCode: "ID",
    userAgent: "Mozilla/5.0 (Linux; Android 14)",
    createdAt: "2025-11-09T14:30:00.000Z",
    updatedAt: "2025-11-09T14:30:00.000Z",
    deletedAt: null,
  },
  {
    id: "sh_005",
    action: "Sign in",
    ip: "103.110.7.51",
    city: "Jakarta",
    countryCode: "ID",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; rv:144.0) Gecko/20100101 Firefox/144.0",
    createdAt: "2025-11-08T08:12:00.000Z",
    updatedAt: "2025-11-08T08:12:00.000Z",
    deletedAt: null,
  },
];

export const dummyActivityLogs = [
  {
    id: "1",
    userId: "101",
    action: "DELETE_LAYER",
    metadata: { layerName: "Boundary Layer" },
    createdAt: "2025-11-12T18:45:00.000Z",
    updatedAt: "2025-11-12T18:45:00.000Z",
    deletedAt: null,
  },
  {
    id: "2",
    userId: "101",
    action: "CREATE_WORKSPACE",
    metadata: { workspaceName: "Project Alpha" },
    createdAt: "2025-11-14T01:15:00.000Z",
    updatedAt: "2025-11-14T01:15:00.000Z",
    deletedAt: null,
  },
  {
    id: "3",
    userId: "101",
    action: "UPDATE_WORKSPACE",
    metadata: { workspaceName: "Project Alpha" },
    createdAt: "2025-11-13T10:20:00.000Z",
    updatedAt: "2025-11-13T10:20:00.000Z",
    deletedAt: null,
  },
  {
    id: "4",
    userId: "101",
    action: "CREATE_LAYER",
    metadata: { layerName: "Boundary Layer" },
    createdAt: "2025-11-13T09:05:00.000Z",
    updatedAt: "2025-11-13T09:05:00.000Z",
    deletedAt: null,
  },
  {
    id: "5",
    userId: "101",
    action: "UPDATE_LAYER",
    metadata: { layerName: "Boundary Layer" },
    createdAt: "2025-11-12T18:30:00.000Z",
    updatedAt: "2025-11-12T18:30:00.000Z",
    deletedAt: null,
  },
];

export const dummyAllActivityLogs = [
  {
    id: "1",
    userId: "103",
    user: DUMMY_USERS[2],
    action: "DELETE_LAYER",
    metadata: { layerName: "Boundary Layer" },
    createdAt: "2025-11-12T18:45:00.000Z",
    updatedAt: "2025-11-12T18:45:00.000Z",
    deletedAt: null,
  },
  {
    id: "2",
    userId: "101",
    user: DUMMY_USERS[0],
    action: "CREATE_WORKSPACE",
    metadata: { workspaceName: "Project Alpha" },
    createdAt: "2025-11-14T01:15:00.000Z",
    updatedAt: "2025-11-14T01:15:00.000Z",
    deletedAt: null,
  },
  {
    id: "3",
    userId: "102",
    user: DUMMY_USERS[1],
    action: "UPDATE_WORKSPACE",
    metadata: { workspaceName: "Project Alpha" },
    createdAt: "2025-11-13T10:20:00.000Z",
    updatedAt: "2025-11-13T10:20:00.000Z",
    deletedAt: null,
  },
  {
    id: "4",
    userId: "104",
    user: DUMMY_USERS[3],
    action: "CREATE_LAYER",
    metadata: { layerName: "Boundary Layer" },
    createdAt: "2025-11-13T09:05:00.000Z",
    updatedAt: "2025-11-13T09:05:00.000Z",
    deletedAt: null,
  },
  {
    id: "5",
    userId: "105",
    user: DUMMY_USERS[4],
    action: "UPDATE_LAYER",
    metadata: { layerName: "Boundary Layer" },
    createdAt: "2025-11-12T18:30:00.000Z",
    updatedAt: "2025-11-12T18:30:00.000Z",
    deletedAt: null,
  },
];
