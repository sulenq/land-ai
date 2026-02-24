import { Interface__Role } from "@/constants/interfaces";
import { getStorage, removeStorage, setStorage } from "@/utils/client";

export function getAccessToken() {
  return getStorage("__access_token") || null;
}

export function setAccessToken(token: string) {
  setStorage("__access_token", token, "local", 259200000);
}

export function clearAccessToken() {
  removeStorage("__access_token");
}

export function getUserData(): Record<string, any> | null {
  const raw = getStorage("__user_data");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse user data:", e);
    return null;
  }
}

export function setUserData(user: Record<string, any>) {
  try {
    setStorage("__user_data", JSON.stringify(user), "local", 259200000);
  } catch (e) {
    console.error("Failed to stringify user data:", e);
  }
}

export function clearUserData() {
  removeStorage("__user_data");
}

// below is for dynamic roles
// export function can(permission: string, user: Interface__User) {
//   return user.permissions.includes(permission);
// }

export function can(permission: string, role: Interface__Role) {
  return role.permissions.includes(permission);
}
