import type {
  Interface__DAAnalysisResultItem,
  Interface__DASessionDetail,
  Interface__DAUploadedDocument,
} from "@/constants/interfaces";

const BOOLEANISH_LABEL_PATTERNS = [
  "materai",
  "cap",
  "stempel",
  "tanda tangan",
  "ttd",
  "signature",
];

const normalizeText = (value: string) =>
  String(value || "")
    .trim()
    .toLowerCase();

const CANONICAL_ANALYSIS_LABELS: Record<string, string> = {
  cap: "Cap PPAT",
  "cap ppat": "Cap PPAT",
  "tanda tangan": "TTD PPAT",
  "ttd ppat": "TTD PPAT",
  "nomor hak": "Nomor Hak",
  "nomor hak/sertipikat": "Nomor Hak",
  "nomor sertipikat": "Nomor Hak",
  "nomor berkas": "Nomor Hak",
  "no berkas": "Nomor Hak",
  "no. berkas": "Nomor Hak",
  "jenis hak": "Jenis Hak",
  "nama pemilik": "Nama pemegang HAK",
  "nama pemegang hak": "Nama pemegang HAK",
  ttl: "Tempat Tanggal Lahir",
  "tempat tanggal lahir": "Tempat Tanggal Lahir",
  "ttl pemberi (pemilik)": "Tempat Tanggal Lahir",
  nik: "Nik pemegang hak",
  "nik pemilik": "Nik pemegang hak",
  "nik pemegang hak": "Nik pemegang hak",
  "nik pemberi (pemilik)": "Nik pemegang hak",
  alamat: "Alamat Pemegang Hak",
  "alamat pemilik": "Alamat Pemegang Hak",
  "alamat pemegang hak": "Alamat Pemegang Hak",
  "alamat pemberi (pemilik)": "Alamat Pemegang Hak",
  "ttd pemilikhak": "TTD Pemegang Hak",
  "ttd pemilik hak": "TTD Pemegang Hak",
  "ttd pemegang hak": "TTD Pemegang Hak",
  "kabupaten/kota": "Kota",
  "kabupaten / kota": "Kota",
  kota: "Kota",
  "desa/kelurahan": "Kelurahan/Desa",
  "desa / kelurahan": "Kelurahan/Desa",
  "kelurahan/desa": "Kelurahan/Desa",
  "kelurahan / desa": "Kelurahan/Desa",
  "luas tanah": "Luas",
  "luas tanah (m2)": "Luas",
  luas: "Luas",
  "nama ppat": "Nama PPAT",
  "ttl ppat": "Tempat Tanggal Lahir PPAT",
  "tempat tanggal lahir ppat": "Tempat Tanggal Lahir PPAT",
  "alamat ppat": "ALAMAT PPAT",
  "nik ppat": "NIK PPAT",
};

const normalizeComparableText = (value: unknown) =>
  normalizeText(String(value || ""))
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const getDocumentCandidateIds = (doc?: Interface__DAUploadedDocument | null) =>
  [doc?.id, doc?.jobId, doc?.documentRequirement?.id].filter(
    (value) => value !== null && value !== undefined,
  );

const isCertificateLikeDocument = (
  doc?: Interface__DAUploadedDocument | null,
) => {
  const documentName = String(
    doc?.documentRequirement?.name || doc?.metaData?.fileName || "",
  )
    .trim()
    .toLowerCase();

  return (
    documentName.includes("sertipikat") || documentName.includes("sertifikat")
  );
};

const isCertificateValidationDocument = (
  doc?: Interface__DAUploadedDocument | null,
) => {
  const documentName = String(
    doc?.documentRequirement?.name || doc?.metaData?.fileName || "",
  )
    .trim()
    .toLowerCase();

  return isCertificateLikeDocument(doc) || documentName.includes("keabsahan");
};

const isStatementLikeDocument = (
  doc?: Interface__DAUploadedDocument | null,
) => {
  const documentName = String(
    doc?.documentRequirement?.name || doc?.metaData?.fileName || "",
  )
    .trim()
    .toLowerCase();

  return (
    documentName.includes("surat pernyataan") ||
    documentName.includes("keabsahan")
  );
};

const isLetterLikeDocument = (doc?: Interface__DAUploadedDocument | null) => {
  const documentName = String(
    doc?.documentRequirement?.name || doc?.metaData?.fileName || "",
  )
    .trim()
    .toLowerCase();

  return (
    documentName.includes("surat") ||
    documentName.includes("permohonan") ||
    documentName.includes("kuasa")
  );
};

const isProductSkptDocument = (doc?: Interface__DAUploadedDocument | null) => {
  const documentName = String(
    doc?.documentRequirement?.name || doc?.metaData?.fileName || "",
  )
    .trim()
    .toLowerCase();

  return documentName.includes("produk skpt");
};

const shouldBlankAnalysisValueForDocument = (
  label: string,
  doc?: Interface__DAUploadedDocument | null,
) => {
  const normalizedLabel = normalizeText(label);

  if (
    isProductSkptDocument(doc) &&
    (normalizedLabel === "cap" ||
      normalizedLabel === "cap ppat" ||
      normalizedLabel === "ttd ppat" ||
      normalizedLabel === "tanda tangan" ||
      normalizedLabel === "ttd pemegang hak" ||
      normalizedLabel === "ttd pemilik hak" ||
      normalizedLabel === "ttd pemilikhak")
  ) {
    return true;
  }

  if (!isCertificateValidationDocument(doc)) return false;

  return (
    normalizedLabel === "cap" ||
    ((normalizedLabel === "ttd pemilik hak" ||
      normalizedLabel === "ttd pemilikhak") &&
      isCertificateLikeDocument(doc))
  );
};

export const isNotFoundAnalysisValue = (value: unknown) =>
  value === "NOT_FOUND";

export const getCanonicalAnalysisLabel = (label: string) => {
  const normalizedLabel = normalizeText(label);
  return CANONICAL_ANALYSIS_LABELS[normalizedLabel] || label;
};

export const shouldHideAnalysisLabel = (label: string) => {
  const normalizedLabel = normalizeText(label);
  return (
    normalizedLabel === "ttd" ||
    normalizedLabel === "jalan" ||
    normalizedLabel === "nama jalan" ||
    normalizedLabel === "keaslian" ||
    normalizedLabel === "keaslian dokumen" ||
    normalizedLabel === "verifikasi ttd kiri" ||
    normalizedLabel === "verifikasi ttd kanan" ||
    normalizedLabel === "cek dua ttd" ||
    normalizedLabel === "alamat penerima" ||
    normalizedLabel === "alamat pemberi"
  );
};

export const shouldHideAnalysisLabelForService = (
  label: string,
  serviceId?: string | number | null,
) => {
  if (shouldHideAnalysisLabel(label)) return true;

  const normalizedLabel = normalizeText(label);
  return String(serviceId || "") === "6" && normalizedLabel === "nama penerima";
};

const ALWAYS_SHOW_ANALYSIS_LABELS = [
  "nik pemegang hak",
  "nik ppat",
  "cap ppat",
  "cap",
  "ttd pemegang hak",
  "ttd pemilik hak",
];

export const shouldAlwaysShowAnalysisLabel = (label: string) => {
  const canonicalLabel = normalizeText(getCanonicalAnalysisLabel(label));
  return ALWAYS_SHOW_ANALYSIS_LABELS.some(
    (candidate) => canonicalLabel === candidate,
  );
};

const PRIORITIZED_ANALYSIS_LABELS = [
  "nomor hak",
  "nomor hak/sertipikat",
  "jenis hak",
];

const DEPRIORITIZED_ANALYSIS_LABELS = [
  "materai",
  "cap ppat",
  "cap",
  "ttd ppat",
  "ttd pemegang hak",
  "ttd pemilik hak",
  "tanda tangan",
];

export const sortAnalysisResultItems = <
  T extends { label: string | null | undefined },
>(
  items?: T[] | null,
) =>
  [...(items || [])].sort((a, b) => {
    const aLabel = String(a?.label || "").toLowerCase();
    const bLabel = String(b?.label || "").toLowerCase();
    const aIsDeprioritized = DEPRIORITIZED_ANALYSIS_LABELS.some((label) =>
      aLabel.includes(label),
    );
    const bIsDeprioritized = DEPRIORITIZED_ANALYSIS_LABELS.some((label) =>
      bLabel.includes(label),
    );

    if (aIsDeprioritized !== bIsDeprioritized) {
      return aIsDeprioritized ? 1 : -1;
    }

    const aPriority = PRIORITIZED_ANALYSIS_LABELS.findIndex((label) =>
      aLabel.includes(label),
    );
    const bPriority = PRIORITIZED_ANALYSIS_LABELS.findIndex((label) =>
      bLabel.includes(label),
    );
    const normalizedAPriority =
      aPriority === -1 ? Number.MAX_SAFE_INTEGER : aPriority;
    const normalizedBPriority =
      bPriority === -1 ? Number.MAX_SAFE_INTEGER : bPriority;

    if (normalizedAPriority !== normalizedBPriority) {
      return normalizedAPriority - normalizedBPriority;
    }

    return 0;
  });

export const orderAnalysisResultItemsBySource = <
  T extends { label: string | null | undefined },
>(
  items?: T[] | null,
  sourceItems?: { label: string | null | undefined }[] | null,
) => {
  const sourceOrder = new Map<string, number>();

  (sourceItems || []).forEach((item, index) => {
    const canonicalLabel = getCanonicalAnalysisLabel(String(item?.label || ""));
    if (!sourceOrder.has(canonicalLabel)) {
      sourceOrder.set(canonicalLabel, index);
    }
  });

  if (!sourceOrder.size) {
    return sortAnalysisResultItems(items);
  }

  return [...(items || [])].sort((a, b) => {
    const aLabel = getCanonicalAnalysisLabel(String(a?.label || ""));
    const bLabel = getCanonicalAnalysisLabel(String(b?.label || ""));
    const aIndex = sourceOrder.get(aLabel);
    const bIndex = sourceOrder.get(bLabel);

    if (aIndex !== undefined && bIndex !== undefined) {
      return aIndex - bIndex;
    }

    if (aIndex !== undefined) return -1;
    if (bIndex !== undefined) return 1;

    return 0;
  });
};

const ANALYSIS_VALUE_FALLBACK_LABELS: Record<string, string[]> = {
  Alamat: ["Alamat Penerima", "Alamat Pemberi", "Alamat Pemberi Kuasa"],
  "TTD Pemegang Hak": ["Tanda Tangan", "TTD", "Semua Subjek TTD"],
};

const hasComparableAnalysisValue = (value: unknown) =>
  value !== null &&
  value !== undefined &&
  value !== "" &&
  !isNotFoundAnalysisValue(value);

const pickPreferredAnalysisValue = <
  T extends { value: string | number | boolean | null },
>(
  currentValue: T,
  nextValue: T,
) => {
  if (
    !hasComparableAnalysisValue(currentValue?.value) &&
    hasComparableAnalysisValue(nextValue?.value)
  ) {
    return nextValue;
  }

  return currentValue;
};

export const mergeAnalysisResultItems = (
  items?: Interface__DAAnalysisResultItem[] | null,
) => {
  const groupedItems = new Map<string, Interface__DAAnalysisResultItem>();

  (items || []).forEach((item) => {
    const canonicalLabel = getCanonicalAnalysisLabel(item.label);
    const existingItem = groupedItems.get(canonicalLabel);

    if (!existingItem) {
      groupedItems.set(canonicalLabel, {
        ...item,
        label: canonicalLabel,
        values: [...(item.values || [])],
      });
      return;
    }

    const valueMap = new Map<string, (typeof item.values)[number]>();

    [...(existingItem.values || []), ...(item.values || [])].forEach(
      (value) => {
        const key = String(value.documentId);
        const currentValue = valueMap.get(key);

        if (!currentValue) {
          valueMap.set(key, value);
          return;
        }

        valueMap.set(key, pickPreferredAnalysisValue(currentValue, value));
      },
    );

    const mergedValues = Array.from(valueMap.values());
    const comparableValues = mergedValues
      .filter(
        (value: any) =>
          hasComparableAnalysisValue(value?.value) &&
          value?.shouldCompare !== false,
      )
      .map((value) => normalizeComparableText(value.value));

    const mergedValidationStatus =
      comparableValues.length <= 1
        ? existingItem.validation.status || item.validation.status
        : new Set(comparableValues).size <= 1;

    groupedItems.set(canonicalLabel, {
      ...existingItem,
      label: canonicalLabel,
      values: mergedValues,
      validation: {
        status: mergedValidationStatus,
      },
    });
  });

  return Array.from(groupedItems.values());
};

export const getAnalysisValueByLabelForDocument = (params: {
  resultItems?: Interface__DAAnalysisResultItem[] | null;
  label: string;
  doc?: Interface__DAUploadedDocument | null;
  docIndex?: number | null;
}) => {
  const { resultItems, label, doc, docIndex } = params;
  if (shouldBlankAnalysisValueForDocument(label, doc)) {
    return {
      value: null,
      renderType: "string" as const,
    };
  }

  const candidateIds = getDocumentCandidateIds(doc);
  const resultMap = new Map<string, Interface__DAAnalysisResultItem>();

  (resultItems || []).forEach((item) => {
    resultMap.set(item.label, item);
    resultMap.set(getCanonicalAnalysisLabel(item.label), item);
  });

  const resolvedLabels = [
    label,
    getCanonicalAnalysisLabel(label),
    ...(ANALYSIS_VALUE_FALLBACK_LABELS[getCanonicalAnalysisLabel(label)] || []),
  ];

  for (const resolvedLabel of resolvedLabels) {
    const field = resultMap.get(resolvedLabel);
    const matchedValue = field?.values?.find((value) =>
      candidateIds.includes(value.documentId),
    );
    const value = matchedValue?.value ?? null;

    if (value !== null && value !== undefined && value !== "") {
      return {
        value,
        renderType: matchedValue?.renderType || "string",
      };
    }

    if (
      docIndex !== null &&
      docIndex !== undefined &&
      docIndex >= 0 &&
      field?.values?.[docIndex]
    ) {
      const indexedValue = field.values[docIndex];
      const fallbackValue = indexedValue?.value ?? null;

      if (
        fallbackValue !== null &&
        fallbackValue !== undefined &&
        fallbackValue !== ""
      ) {
        return {
          value: fallbackValue,
          renderType: indexedValue?.renderType || "string",
        };
      }
    }
  }

  const canonicalLabel = getCanonicalAnalysisLabel(label);
  if (canonicalLabel === "Nomor Hak" && isLetterLikeDocument(doc)) {
    const sharedValues = resolvedLabels
      .map((resolvedLabel) => resultMap.get(resolvedLabel))
      .flatMap((field) => field?.values || [])
      .map((entry) => entry?.value)
      .filter(hasComparableAnalysisValue)
      .map((value) => String(value).trim());
    const uniqueSharedValues = Array.from(new Set(sharedValues));

    if (uniqueSharedValues.length === 1) {
      return {
        value: uniqueSharedValues[0],
        renderType: "string" as const,
      };
    }
  }

  const signatureFound = (doc as any)?.fraudCheck?.checks?.signature?.found;
  if (
    canonicalLabel === "TTD Pemegang Hak" &&
    signatureFound === true &&
    isStatementLikeDocument(doc)
  ) {
    return {
      value: "1",
      renderType: "string" as const,
    };
  }

  return {
    value: null,
    renderType: "string" as const,
  };
};

export const formatAnalysisValue = (label: string, value: unknown): string => {
  if (value === null || value === undefined || value === "") return "-";
  if (isNotFoundAnalysisValue(value)) return value?.toString() ?? "-";

  const strValue = value?.toString().trim().toLowerCase();

  if (strValue === "tidak tersedia") return "-";

  const normalizedLabel = normalizeText(label);
  const isBooleanishLabel = BOOLEANISH_LABEL_PATTERNS.some((pattern) =>
    normalizedLabel.includes(pattern),
  );

  if (!isBooleanishLabel) return value?.toString() ?? "-";

  if (value === 1 || value === "1") return "Ada";
  if (value === 0 || value === "0") return "Tidak Ada";
  if (strValue === "true") return "Ada";
  if (strValue === "false") return "Tidak Ada";

  return value?.toString() ?? "-";
};

const getResultValueForDocument = (
  item: Interface__DAAnalysisResultItem,
  doc?: Interface__DAUploadedDocument | null,
  docIndex?: number | null,
) => {
  const candidateIds = getDocumentCandidateIds(doc);

  const matchedValue = item.values.find((value) =>
    candidateIds.includes(value.documentId),
  );

  if (
    matchedValue?.value !== null &&
    matchedValue?.value !== undefined &&
    matchedValue?.value !== ""
  ) {
    return matchedValue.value;
  }

  if (
    docIndex !== null &&
    docIndex !== undefined &&
    docIndex >= 0 &&
    item.values?.[docIndex]
  ) {
    return item.values[docIndex]?.value ?? null;
  }

  return null;
};

const getDisplayableValue = (label: string, value: unknown) => {
  if (value === null || value === undefined || value === "") return "-";
  if (isNotFoundAnalysisValue(value)) return "-";

  const formatted = formatAnalysisValue(label, value);
  return String(formatted || "-").trim();
};

const levenshteinDistance = (left: string, right: string) => {
  if (!left) return right.length;
  if (!right) return left.length;

  const dp = Array.from({ length: left.length + 1 }, () =>
    new Array(right.length + 1).fill(0),
  );

  for (let i = 0; i <= left.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= right.length; j += 1) dp[0][j] = j;

  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }

  return dp[left.length][right.length];
};

const looksLikeMinorTypo = (left: string, right: string) => {
  const normalizedLeft = normalizeComparableText(left);
  const normalizedRight = normalizeComparableText(right);

  if (
    !normalizedLeft ||
    !normalizedRight ||
    normalizedLeft === normalizedRight
  ) {
    return false;
  }

  const longestLength = Math.max(normalizedLeft.length, normalizedRight.length);
  if (longestLength < 5) return false;

  const distance = levenshteinDistance(normalizedLeft, normalizedRight);
  return distance > 0 && distance <= 2;
};

const buildMismatchDetail = (
  label: string,
  currentValue: string,
  expectedValue: string,
  currentCount: number,
  totalCount: number,
) => {
  const normalizedLabel = normalizeComparableText(label);
  const normalizedCurrent = normalizeComparableText(currentValue);
  const normalizedExpected = normalizeComparableText(expectedValue);
  const isNameLikeLabel =
    normalizedLabel.includes("nama") ||
    normalizedLabel.includes("pemilik") ||
    normalizedLabel.includes("penjual") ||
    normalizedLabel.includes("pembeli") ||
    normalizedLabel.includes("persetujuan");
  const mentionsCorporateTerm = (value: string) =>
    /\b(pt|cv|tbk|corp|company|persero|bank)\b/i.test(value);
  const oneCorporateOnePerson =
    isNameLikeLabel &&
    mentionsCorporateTerm(currentValue) !==
      mentionsCorporateTerm(expectedValue);

  if (oneCorporateOnePerson) {
    return `${label} menampilkan subjek yang berbeda bentuk antara perorangan dan badan usaha. Ini belum tentu salah, karena orang yang tercantum bisa saja bertindak untuk atau mewakili badan usaha yang terkait; tetap perlu dicek hubungan hukumnya pada dokumen pendukung.`;
  }

  if (
    isNameLikeLabel &&
    normalizedCurrent &&
    normalizedExpected &&
    (normalizedCurrent.includes(normalizedExpected) ||
      normalizedExpected.includes(normalizedCurrent))
  ) {
    return `${label} tampak belum seragam, tetapi masih ada indikasi keterkaitan antar nama yang muncul. Perlu dicek apakah perbedaan ini hanya variasi penulisan, nama perwakilan, atau nama badan usaha yang terkait.`;
  }

  if (looksLikeMinorTypo(currentValue, expectedValue)) {
    return `${label} berbeda tipis, indikasi typo: "${currentValue}" sementara mayoritas "${expectedValue}".`;
  }

  if (currentCount <= 1 && totalCount > 2) {
    return `${label} pada dokumen ini berbeda dari mayoritas, yaitu "${currentValue}" sedangkan mayoritas "${expectedValue}".`;
  }

  return `${label} belum seragam; dokumen ini berisi "${currentValue}" sementara pembanding dominan "${expectedValue}".`;
};

export const buildDocumentExtractionSummaryNote = (params: {
  daSession?: Interface__DASessionDetail | null;
  uploadedDocument?: Interface__DAUploadedDocument | null;
}) => {
  const daSession = params.daSession;
  const uploadedDocument = params.uploadedDocument;
  const result = daSession?.result || [];
  const uploadedDocuments = daSession?.uploadedDocuments || [];

  if (
    !uploadedDocument ||
    result.length === 0 ||
    uploadedDocuments.length === 0
  ) {
    return "";
  }

  let consistentCount = 0;
  let mismatchCount = 0;
  const mismatchDetails: string[] = [];

  result.forEach((item) => {
    const currentDocIndex = uploadedDocuments.findIndex(
      (doc) => doc === uploadedDocument,
    );
    const currentRawValue = getResultValueForDocument(
      item,
      uploadedDocument,
      currentDocIndex,
    );
    const currentDisplayValue = getDisplayableValue(
      item.label,
      currentRawValue,
    );

    if (!currentDisplayValue) return;

    const comparableValues = uploadedDocuments
      .map((doc, docIndex) => {
        const rawValue = getResultValueForDocument(item, doc, docIndex);
        const displayValue = getDisplayableValue(item.label, rawValue);
        const normalizedValue = normalizeComparableText(displayValue);

        return displayValue && normalizedValue
          ? {
              displayValue,
              normalizedValue,
            }
          : null;
      })
      .filter(
        (value): value is { displayValue: string; normalizedValue: string } =>
          Boolean(value),
      );

    if (comparableValues.length < 2) return;

    const groupedValues = new Map<
      string,
      { displayValue: string; count: number }
    >();

    comparableValues.forEach((value) => {
      const currentGroup = groupedValues.get(value.normalizedValue);
      if (currentGroup) {
        currentGroup.count += 1;
        return;
      }

      groupedValues.set(value.normalizedValue, {
        displayValue: value.displayValue,
        count: 1,
      });
    });

    if (groupedValues.size <= 1) {
      consistentCount += 1;
      return;
    }

    const normalizedCurrentValue = normalizeComparableText(currentDisplayValue);
    const currentGroup = groupedValues.get(normalizedCurrentValue) || {
      displayValue: currentDisplayValue,
      count: 1,
    };
    const dominantGroup = Array.from(groupedValues.entries()).sort(
      (left, right) => right[1].count - left[1].count,
    )[0];

    if (!dominantGroup) return;

    if (dominantGroup[0] === normalizedCurrentValue) {
      consistentCount += 1;
      return;
    }

    mismatchCount += 1;

    if (mismatchDetails.length < 2) {
      mismatchDetails.push(
        buildMismatchDetail(
          item.label,
          currentDisplayValue,
          dominantGroup[1].displayValue,
          currentGroup.count,
          comparableValues.length,
        ),
      );
    }
  });

  if (consistentCount === 0 && mismatchCount === 0) {
    return "Belum cukup data pembanding untuk merangkum hasil ekstraksi dokumen ini.";
  }

  if (mismatchCount === 0) {
    return `Hasil ekstraksi pada dokumen ini sudah konsisten 100% untuk ${consistentCount} parameter yang terisi.`;
  }

  const consistencyPrefix =
    consistentCount > 0 ? `${consistentCount} parameter sudah konsisten. ` : "";

  return `${consistencyPrefix}Perlu perhatian pada ${mismatchCount} parameter. ${mismatchDetails.join(
    " ",
  )}`.trim();
};

export const buildOverallAnalysisSummary = (params: {
  items?: Interface__DAAnalysisResultItem[] | null;
  uploadedDocuments?: Interface__DAUploadedDocument[] | null;
  getValidationState: (
    item: Interface__DAAnalysisResultItem,
  ) => "match" | "note" | "mismatch";
}) => {
  const items = params.items || [];
  const uploadedDocuments = params.uploadedDocuments || [];

  if (!items.length) return "";

  let matchCount = 0;
  let noteCount = 0;
  let mismatchCount = 0;
  const issueLabels: string[] = [];
  const issueDetails: string[] = [];

  const pushIssueDetail = (item: Interface__DAAnalysisResultItem) => {
    if (issueDetails.length >= 2) return;

    const comparableValues = uploadedDocuments
      .map((doc, docIndex) => {
        const rawValue = getResultValueForDocument(item, doc, docIndex);
        const displayValue = getDisplayableValue(item.label, rawValue);
        const normalizedValue = normalizeComparableText(displayValue);

        return displayValue !== "-" && normalizedValue
          ? { displayValue, normalizedValue }
          : null;
      })
      .filter(
        (value): value is { displayValue: string; normalizedValue: string } =>
          Boolean(value),
      );

    if (comparableValues.length <= 1) {
      issueDetails.push(
        `${item.label} masih perlu konfirmasi karena baru terisi pada ${comparableValues.length || 0} dokumen pembanding.`,
      );
      return;
    }

    const groupedValues = new Map<
      string,
      { displayValue: string; count: number }
    >();
    comparableValues.forEach((value) => {
      const current = groupedValues.get(value.normalizedValue);
      if (current) {
        current.count += 1;
        return;
      }
      groupedValues.set(value.normalizedValue, {
        displayValue: value.displayValue,
        count: 1,
      });
    });

    const sortedGroups = Array.from(groupedValues.entries()).sort(
      (left, right) => right[1].count - left[1].count,
    );
    const dominantGroup = sortedGroups[0];

    if (!dominantGroup) return;

    if (sortedGroups.length <= 1) {
      issueDetails.push(
        `${item.label} ditandai perhatian karena pembandingnya masih terbatas meski nilainya terlihat seragam.`,
      );
      return;
    }

    const differingGroup = sortedGroups[1];
    issueDetails.push(
      buildMismatchDetail(
        item.label,
        differingGroup[1].displayValue,
        dominantGroup[1].displayValue,
        differingGroup[1].count,
        comparableValues.length,
      ),
    );
  };

  items.forEach((item) => {
    const validationState = params.getValidationState(item);

    if (validationState === "match") {
      matchCount += 1;
      return;
    }

    if (validationState === "note") {
      noteCount += 1;
    } else {
      mismatchCount += 1;
    }

    if (issueLabels.length < 4) {
      issueLabels.push(item.label);
    }

    pushIssueDetail(item);
  });

  const issueCount = noteCount + mismatchCount;
  const summaryLines = [
    `Ringkasan: ${matchCount}/${items.length} parameter sudah konsisten${
      issueCount > 0 ? `, ${issueCount} perlu perhatian` : ""
    }.`,
  ];

  if (issueLabels.length > 0) {
    summaryLines.push("Fokus utama:");
    issueLabels.forEach((label) => {
      summaryLines.push(`- ${label}`);
    });
  }

  if (issueDetails.length > 0) {
    summaryLines.push("Penilaian AI:");
    issueDetails.forEach((detail) => {
      summaryLines.push(`- ${detail}`);
    });
  }

  return summaryLines.join("\n");
};

export const getAiAssessmentNotice = (params: {
  aiAssessment?: string | null;
  aiConfidenceScore?: string | null;
}) => {
  const rawAssessment = String(params.aiAssessment || "").trim();
  const rawScore = String(params.aiConfidenceScore || "").trim();
  const normalizedAssessment = rawAssessment.toLowerCase();
  const noticeDescription = rawScore || rawAssessment;

  if (normalizedAssessment === "tervalidasi") {
    return {
      colorPalette: "green",
      title: "Penilaian AI:",
      description: `Dokumen bisa di Validasi, Hasil penilaian AI ${noticeDescription}`,
    };
  }

  if (normalizedAssessment === "perlu perhatian") {
    return {
      colorPalette: "yellow",
      title: "Penilaian AI:",
      description: `Dokumen perlu di cek ulang, Hasil penilaian AI ${noticeDescription}`,
    };
  }

  if (normalizedAssessment === "ditolak") {
    return {
      colorPalette: "red",
      title: "Penilaian AI:",
      description: `Dokumen bisa di Tolak, Hasil penilaian AI ${noticeDescription}`,
    };
  }

  if (!rawScore) return null;

  const normalized = rawScore.replace(",", ".");
  const matchedNumber = normalized.match(/-?\d+(\.\d+)?/);
  const score = matchedNumber ? Number(matchedNumber[0]) : Number.NaN;

  if (!Number.isFinite(score)) return null;

  if (score > 90) {
    return {
      colorPalette: "green",
      title: "Penilaian AI:",
      description: `Dokumen bisa di Validasi, Hasil penilaian AI ${noticeDescription}`,
    };
  }

  if (score >= 50) {
    return {
      colorPalette: "yellow",
      title: "Penilaian AI:",
      description: `Dokumen perlu di cek ulang, Hasil penilaian AI ${noticeDescription}`,
    };
  }

  return {
    colorPalette: "red",
    title: "Penilaian AI:",
    description: `Dokumen bisa di Tolak, Hasil penilaian AI ${noticeDescription}`,
  };
};
