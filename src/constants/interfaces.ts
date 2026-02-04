import { BtnProps } from "@/components/ui/btn";
import { Enum__ActivityAction } from "@/constants/enums";
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
  role: number;
  avatar: Interface__StorageFile[];
  name: string;
  email: string;
  isActive?: boolean;
  accountStatus?: string;
  gender?: boolean;
  phoneNumber?: string;
  birthDate?: string;
  address?: string;
  registeredAt?: string;
  deactiveAt?: string | null;

  lastLogin: string;
  lastChangePassword?: string;
  lastChangePasswordAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
export interface Interface__Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Navs
export interface Interface__NavListItem {
  icon?: any;
  labelKey?: string;
  label?: string;
  path: string;
  backPath?: string;
  allowedRoles?: string[];
  allowedPermissions?: string[];
  subMenus?: Interface__NavItem[];
  subMenusInvisible?: boolean;
}
export interface Interface__NavItem {
  groupLabelKey?: string;
  list: Interface__NavListItem[];
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
    confirmButtonProps?: BtnProps;
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
export interface Interface__ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  sources?: string[];
  sequenceNumber?: number;
  error?: boolean;
  createdAt?: string;
}
export interface Interface__ChatState {
  session: Interface__ContextChatSession | null;
  messages: Interface__ChatMessage[];
  totalMessages: number;
  isStreaming: boolean;
  isNewChat: boolean;
  hasLoadedHistory: boolean;
  // isNewSession: boolean;
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
  createdAt: string;
}
export interface Interface__DAServiceDocumentRequirement {
  key: string;
  title: Interface__LangContent;
  description?: Interface__LangContent;
  isRequired: boolean;
  allowedMimeTypes: string[];
  maxFiles: number;
  maxSize: number; // In bytes
}

export interface Interface__DAServiceDetail extends Interface__DAService {
  documentRequirements: Interface__DAServiceDocumentRequirement[];
}
export interface Interface__DASession {
  id: string;
  title: string;
  documentService: Interface__DAService;
  status: "PROCESSING" | "COMPLETED" | "ERROR";
  result: string;
  createdAt: string;
}
