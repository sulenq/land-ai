// Auth
export const AUTH_API_USER_PROFILE = `/api/get-user-profile`; // GET
export const AUTH_API_SIGNUP = `/api/register`; // POST
export const AUTH_API_SIGNIN = `/api/login`; // POST
export const AUTH_API_SIGNOUT = `/api/logout`; // POST

// AI Chat
export const CHAT_API_CHAT_AI_INDEX = `/api/ai/chat/index`; // GET
export const CHAT_API_CHAT_AI_STREAM = `/api/ai/chat/stream`; // STREAM
export const CHAT_API_SHOW_CHAT = `/api/ai/chat/show`; // GET + /:sessionId
export const CHAT_API_RENAME = `/api/ai/chat/rename`; // PATCH + /:sessionId
export const CHAT_API_PROTECT = `/api/ai/chat/protect`; // PATCH + /:sessionId
export const CHAT_API_DELETE = `/api/ai/chat/delete`; // DELETE + /:sessionIds

// Docs Analysis
export const DA_API_SERVICES_INDEX = `/api/da/services/get`; // GET
export const DA_API_SERVICE_DETAIL = `/api/da/services/get-detail`; // GET + /:daServiceId

export const DA_API_SERVICE_CREATE_SESSION = `/api/ocr/sessions`; // POST
export const DA_API_SERVICE_TRIGGER_JOB = `/api/ocr/upload`; // POST
export const DA_API_SERVICE1 = `/api/ocr/extract/status`; // GET + jobId
