// Auth
export const AUTH_API_USER_PROFILE = `/api/get-user-profile`; // GET
export const AUTH_API_SIGNUP = `/api/register`; // POST
export const AUTH_API_SIGNIN = `/api/login`; // POST
export const AUTH_API_SIGNIN_SUPER_ADMIN = `/api/signin/superadmin`; // POST
export const AUTH_API_SIGNIN_ADMIN = `/api/signin/admin`; // POST
export const AUTH_API_SIGNIN_PUBLIC = `/api/signin/public`; // POST
export const AUTH_API_SIGNOUT = `/api/logout`; // POST

// AI Chat
export const CHAT_API_SESSION_GET_ALL = `/api/ai/chat/index`; // GET
export const CHAT_API_SESSION_AI_STREAM = `/api/ai/chat/stream`; // STREAM
export const CHAT_API_SESSION_SHOW = `/api/ai/chat/show`; // GET + /:sessionId
export const CHAT_API_SESSION_RENAME = `/api/ai/chat/rename`; // PATCH + /:sessionId
export const CHAT_API_SESSION_PROTECT = `/api/ai/chat/protect`; // PATCH + /:sessionId
export const CHAT_API_SESSION_DELETE = `/api/ai/chat/delete`; // DELETE + /:sessionIds

// Docs Analysis
export const DA_API_SERVICE_GET_ALL = `/api/da/services/get`; // GET
export const DA_API_SERVICE_DETAIL = `/api/da/services/get-detail`; // GET + /:daServiceId
export const DA_API_SESSON_CREATE = `/api/da/session/create`; // POST
export const DA_API_SESSION_DETAIL = `/api/da/session/get`; // GET + /:daSessionId
export const DA_API_SESSION_GET_ALL = `/api/da/session/get-all`; // GET
export const DA_API_SESSION_RENAME = `/api/da/session/rename`; // PATCH + /:daSessionId
export const DA_API_SESSION_DELETE = `/api/da/session/delete`; // DELETE + /:daSessionIds
export const DA_API_EXTRACT_SERTIPIKAT = `/api/da/extract-sertipikat`; // POST
export const DA_API_STATUS = `/api/da/status`; // GET + /:jobId
// Admin
export const ADMIN_API_AI_KNOWLEDGE_BASE = "/api/admin/ai/knowledge";
export const ADMIN_API_USER_BAsE = "/api/admin/user";
