import { Props__Btn } from "@/components/ui/btn";
import { Enum__ActivityAction } from "@/constants/enums";
import {
  Type__AccountStatus,
  Type__DASessionStatus,
  Type__RenderType,
} from "@/constants/types";
import {
  MenuItemProps,
  StackProps,
  TableCellProps,
  TableColumnHeaderProps,
} from "@chakra-ui/react";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ReactNode } from "react";

// Auth
export interface Interface__ActivityLog extends Interface__CUD {
  id: string;
  userId: string;
  action: Enum__ActivityAction | string;
  metadata?: Record<string, any>;
  user?: Interface__User;
}
export interface Interface__AuthLog extends Interface__CUD {
  id: string;
  ip: string;
  city: string;
  countryCode: string;
  userAgent: string;
  action: string; // "Sign in" | "Sign out" ;
}
export interface Interface__User extends Interface__CUD {
  id: string;
  name: string;
  email: string;
  accountStatus: Type__AccountStatus;
  role: number;
  permissions: string[];
  avatar?: Interface__StorageFile[];
  lastLogin: string;
}
export interface Interface__Role extends Interface__CUD {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

// Navs
export interface Interface__NavGroup {
  labelKey?: string;
  navs: Interface__Nav[];
}
export interface Interface__Nav {
  icon?: any;
  labelKey?: string;
  label?: string;
  path: string;
  backPath?: string;
  allowedRoles?: number[];
  allowedPermissions?: string[];
  children?: Interface__NavGroup[];
  invisibleChildren?: boolean;
}

// Data Table
export interface Interface__DataProps {
  headers?: Interface__FormattedTableHeader[];
  rows?: Interface__FormattedTableRow[];
  rowOptions?: Interface__RowOptionsTableOptionGenerator[];
  batchOptions?: Interface__BatchOptionsTableOptionGenerator[];
}
export interface Interface__FormattedTableHeader {
  th: string;
  sortable?: boolean;
  headerProps?: TableColumnHeaderProps;
  wrapperProps?: StackProps;
  align?: string;
}
export interface Interface__FormattedTableRow<T = any> {
  id: string;
  idx: number;
  data: T;
  dim?: boolean;
  columns: {
    td: any;
    value: any;
    dataType?: string; // "string" | "number" | "date" | "time" |
    tableCellProps?: TableCellProps;
    wrapperProps?: StackProps;
    align?: string;
    dim?: boolean;
  }[];
}
export interface Interface__TableOption {
  disabled?: boolean;
  label?: string;
  icon?: any;
  onClick?: () => void;
  confirmation?: {
    id: string;
    title: string;
    description: string;
    confirmLabel: string;
    onConfirm: () => void;
    confirmButtonProps?: Props__Btn;
    loading?: boolean;
    disabled?: boolean;
  };
  menuItemProps?: Partial<MenuItemProps>;
  override?: ReactNode;
}
export type Interface__RowOptionsTableOptionGenerator<T = any> = (
  formattedRow: Interface__FormattedTableRow<T>,
  overloads?: any,
) => Interface__TableOption | null | false;
export type Interface__BatchOptionsTableOptionGenerator<T = string[]> = (
  selectedRowIds: T,
  overloads?: any,
) => Interface__TableOption | null | false;

// HTTP
export interface Interface__RequestState<T = any> {
  loading: boolean;
  status: number | null;
  error: any;
  response: AxiosResponse<T> | null;
}
export interface Interface__Req<T = any> {
  config: AxiosRequestConfig;
  onResolve?: {
    onSuccess?: (r: AxiosResponse<T>) => void;
    onError?: (e: any) => void;
  };
}

// CUD
export interface Interface__CUD {
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string | null;
  updatedBy?: string;
  deletedAt?: string | null;
}

// Storage
export interface Interface__StorageFile extends Interface__CUD {
  id: string;
  fileName: string;
  filePath: string;
  fileUrl: string;
  fileMimeType: string;
  fileSize: string;
}

// Select Input
export interface Interface__SelectOption {
  id: any;
  label: any;
  label2?: any;
  original_data?: any;
  disabled?: boolean;
}

// Interface__LangContent
export interface Interface__LangContent {
  id: string;
  en: string;
}

// Modul 1 - AI Chats
// Chats
export interface Interface__ChatSession extends Interface__CUD {
  id: string;
  title: string;
  user?: Interface__User;
  isProtected: boolean;
  createdAt: string;
}
export interface Interface__ContextChatSession extends Interface__ChatSession {
  controller: AbortController;
}
export type Interface__ContextChatSessionDraft =
  Partial<Interface__ContextChatSession>;

export interface Interface__ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  sources?: string[];
  sequenceNumber?: number;
  error?: boolean;
  createdAt?: string;
  feedback?: Interface__MessageFeedback;
}

export interface Interface__MessageFeedback {
  rating: 1 | -1;
  category?: Type__FeedbackCategory;
  userComment?: string;
  createdAt?: string;
}

export type Type__FeedbackCategory =
  | "NOT_RELEVANT"
  | "WRONG_INFORMATION"
  | "HALLUCINATION"
  | "INCOMPLETE"
  | "OTHER";

export interface Interface__SubmitFeedbackRequest {
  messageId: string;
  sessionId: string;
  userQuery: string;
  aiResponse: string;
  retrievedContexts?: string[];
  rating: 1 | -1;
  category?: Type__FeedbackCategory;
  userComment?: string;
}
export interface Interface__ActiveChatState {
  session: Interface__ContextChatSessionDraft | null;
  messages: Interface__ChatMessage[];
  totalMessages: number;
  isStreaming: boolean;
  isNewChat: boolean;
  hasLoadedHistory: boolean;
  // isNewSession: boolean;
}
export interface Interface__ChatAIKnowledge {
  id: string;
  fileName: string;
  metaData: {
    fileName: string;
    filePath: string;
    fileSize: number; // bytes
    mimeType: string;
  };
  createdAt: string;
}

// Modul 2 - Document Analysis
export interface Interface__DemoDetailPage {
  hasMaterai: boolean;
  pageNumber: number;
  hasSignature: boolean;
  isValidPage: boolean;
  extractedText: string;
}
export interface Interface__DemoResult {
  fileName: string;
  totalPages: number;
  pagesDetail: Interface__DemoDetailPage[];
  validationSummary: {
    note: string;
    isValid: boolean;
  };
}
export interface Interface__DAService {
  id: string;
  icon: string;
  title: Interface__LangContent;
  description: Interface__LangContent;
  trialSetup?: Interface__DATrialSetup;
  documentRequirements?: Interface__DAServiceDocumentRequirement[];
  createdAt: string;
  updatedAt?: string | null;
}
export interface Interface__DATrialSetup {
  manualSessionIds?: string[];
  aiSessionIds?: string[];
  manualScenarios?: Interface__DATrialScenario[];
  aiScenarios?: Interface__DATrialScenario[];
  uploadedFileNotesBySession?: Record<string, Record<string, string>>;
  aiNoteOverridesBySession?: Record<string, Record<string, string>>;
  compareRulesBySession?: Record<string, Interface__TrialCompareRule[]>;
  compareRules?: Interface__TrialCompareRule[];
  content?: Record<string, any>;
}
export interface Interface__DATrialScenarioSummary {
  pemohon?: string | null;
  letak?: string | null;
  aiAssessment?: string | null;
  aiConfidenceScore?: string | null;
}
export interface Interface__DATrialScenario {
  id: string;
  title: string;
  kategori?: string;
  noBerkas?: string | null;
  totalExecutionTime?: string | null;
  summary?: Interface__DATrialScenarioSummary;
  uploadedDocuments: Interface__DAUploadedDocument[];
  result: Interface__DAAnalysisResultItem[];
  aiValidationOverrides?: Interface__TrialAIValidationOverride[];
  aiNoteOverrides?: Interface__TrialAINoteOverride[];
}
export interface Interface__TrialCmsGlobalContent {
  landingTitle?: string;
  landingDescription?: string;
  warningTitle?: string;
  warningItems?: string[];
  noteText?: string;
  summaryTitle?: string;
  summaryDescription?: string;
  finishButtonLabel?: string;
  stepItems?: Array<{
    title: string;
    description: string;
  }>;
}
export interface Interface__TrialCmsSettingsResponse {
  globalContent: Interface__TrialCmsGlobalContent;
  services: Interface__DAService[];
  updatedAt?: string | null;
}
export interface Interface__TrialCompareRule {
  id?: string;
  enabled?: boolean;
  noBerkas?: string;
  sourceDocument: string;
  sourceField: string;
  targetDocument: string;
  targetField: string;
  overrideResult?: "system" | "force_match" | "force_mismatch";
  acceptedPairs?: Array<{
    left: string;
    right: string;
  }>;
  comparator:
    | "person_name"
    | "nik"
    | "nik_one_of"
    | "nib"
    | "land_right_type"
    | "location"
    | "currency"
    | "area"
    | "exact"
    | string;
}
export interface Interface__TrialCmsCompareFinding {
  type: string;
  severity: "high" | "medium" | "low";
  field: string;
  documentKey?: string;
  expected?: string;
  actual?: string;
  message: string;
  expectedValidation?: string;
  actualValidation?: string;
  actualDocs?: Array<{
    doc: string;
    value: string;
  }>;
  extraFields?: string[];
}
export interface Interface__TrialCmsCompareFile {
  id: string;
  mode: "human" | "human + ai";
  serviceId?: number | null;
  serviceFolder: string;
  serviceTitle: string;
  noBerkas: string;
  scenarioTitle: string;
  devFileName: string;
  expectedFileName: string;
  summary: {
    missingFields: number;
    diffs: number;
    extraActuals: number;
    wrongDocMatches: number;
    splitMatches: number;
    maskedSkips: number;
    validationDiffs: number;
    extraFields: number;
    totalFindings: number;
  };
  findings: Interface__TrialCmsCompareFinding[];
  extraDevFields?: string[];
}
export interface Interface__TrialCmsCompareResponse {
  generatedAt: string;
  filters: {
    serviceId?: number | null;
    mode?: string | null;
    noBerkas?: string | null;
    scenarioTitle?: string | null;
    onlyMismatched?: boolean;
  };
  sources: {
    devBaseUrl: string;
    expectedHumanRoot: string;
    expectedHumanAiRoot: string;
  };
  totals: {
    comparedFiles: number;
    mismatchedFiles: number;
    totalFindings: number;
    diffs: number;
    validationDiffs: number;
    missingFields: number;
    extraFields: number;
    unmatchedDevFiles: number;
    unmatchedExpectedFiles: number;
  };
  files: Interface__TrialCmsCompareFile[];
  unmatchedDevFiles: Array<{
    mode?: string;
    devRelPath: string;
    noBerkas?: string;
    serviceTitle?: string;
    reason: string;
  }>;
  unmatchedExpectedFiles: Array<{
    mode?: string;
    devRelPath?: string;
    expectedFileName: string;
    reason: string;
  }>;
}
export interface Interface__DAServiceDocumentRequirement {
  id: number;
  name: string;
  description?: string;
  isMandatory?: boolean;
  is_mandatory?: boolean;
  compare?: boolean;
  schema?: {
    aggregation: string;
    instruction: string;
    key: string;
    label: string;
    type: string;
  }[];
  extractionSchema?: {
    aggregation: string;
    instruction: string;
    key: string;
    label: string;
    type: string;
  }[];
}
export interface Interface__DAServiceDetail extends Interface__DAService {
  documentRequirements: Interface__DAServiceDocumentRequirement[];
}
export interface Interface__DASession {
  id: string;
  title: string;
  status: Type__DASessionStatus;
  createdAt: string;
  serviceId?: string;
  serviceIcon?: string;
  serviceName?: string;
  noBerkas?: string | null;
}
export interface Interface__DAAnalysisValue {
  documentId: string | number;
  renderType: Type__RenderType;
  value: string | number | boolean | null;
}
export interface Interface__DAAnalysisValidation {
  status: boolean;
}
// Schema?
export interface Interface__DAAnalysisResultItem {
  // key: string;
  label: string;
  values: Interface__DAAnalysisValue[];
  validation: Interface__DAAnalysisValidation;
}
export interface Interface__DAUploadedDocument {
  id?: string;
  jobId?: string | number;
  documentRequirement: Interface__DAServiceDocumentRequirement;
  metaData: {
    fileName: string;
    filePath: string;
  };
}
export interface Interface__DASessionDetail extends Interface__DASession {
  documentService: Interface__DAServiceDetail;
  uploadedDocuments: Interface__DAUploadedDocument[];
  result: Interface__DAAnalysisResultItem[];
  summary?: Interface__DATrialScenarioSummary;
  aiValidationOverrides?: Interface__TrialAIValidationOverride[];
  aiNoteOverrides?: Interface__TrialAINoteOverride[];
  rawData: any;
  kategori: string;
  totalExecutionTime: string;
}
export type Interface__DASessionDraft = Partial<Interface__DASessionDetail>;
export interface Interface__ActiveDAState {
  session: Interface__DASessionDraft | null;
  isNewDA: boolean;
  hasLoadedHistory: boolean;
}

// -----------------------------------------------------------------

// Trial
export interface Interface__TrialSession {
  id: string;
  name?: string;
  user?: Interface__User | null;
  step: number;
  questionVariant?: "A" | "B" | null;
  daSessionStep?: number;
  serviceId?: string | number | null;
  ocrSessionId?: string | null;
  finishedAt?: string | null;
  selectedService?: Partial<Interface__DAService> | null;
  trialDaSessions: Interface__TrialDASession[];
  createdAt: string;
}

export type Type__AIValidationState = "match" | "mismatch" | "note";

export interface Interface__TrialAIValidationOverride {
  label: string;
  status: Type__AIValidationState;
  source?: "manual";
  updatedAt?: string | null;
}

export interface Interface__TrialAINoteOverride {
  documentName: string;
  note: string;
  source?: "manual";
  updatedAt?: string | null;
}

export interface Interface__TrialDASession {
  id: string;
  daSession: Interface__DASession;
  startTime?: string | null;
  endTime?: string | null;
  manualStatus?: string | null;
  aiStatus?: string | null;
  manualDetails: Interface__TrialDADocumentDetail[];
  aiDetails: Interface__TrialDADocumentDetail[];
  aiValidationOverrides?: Interface__TrialAIValidationOverride[];
  createdAt: string;
}

export interface Interface__TrialDASessionDetail {
  id: string;
  daSession: Interface__DASessionDetail;
  startTime?: string | null;
  endTime?: string | null;
  manualDurationMs?: number | null;
  aiDurationMs?: number | null;
  manualStatus?: string | null;
  aiStatus?: string | null;
  manualDetails: Interface__TrialDADocumentDetail[];
  aiDetails: Interface__TrialDADocumentDetail[];
  aiValidationOverrides?: Interface__TrialAIValidationOverride[];
  aiNoteOverrides?: Interface__TrialAINoteOverride[];
  createdAt: string;
}

export interface Interface__TrialDADocumentDetail {
  jobId: string | number;
  docName: string;
  startTime?: string | null;
  endTime?: string | null;
  timeMs: number; // duration
  status: "VERIFIED" | "REJECTED";
  notes: string; // used if rejected only
  validationOverrides?: Interface__TrialAIValidationOverride[];
}
