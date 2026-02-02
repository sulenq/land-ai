import useLang from "@/context/useLang";

export function capitalize(value?: string): string {
  if (!value) return "";

  const firstChar = value.charAt(0);

  return firstChar === firstChar.toUpperCase()
    ? value
    : firstChar.toUpperCase() + value.slice(1);
}

export const capitalizeWords = (value?: string): string => {
  if (!value) return "";

  return value
    .split(" ")
    .map((word) => {
      if (!word) return "";
      const firstChar = word[0];
      return firstChar === firstChar.toUpperCase()
        ? word
        : firstChar.toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export const interpolateString = (
  text?: string,
  variables?: Record<string, string | number>,
): string => {
  if (!text) return "";
  if (!variables) return text;

  let result = text;

  Object.keys(variables).forEach((key) => {
    result = result.replace(`\${${key}}`, String(variables[key]));
  });

  return result;
};

export const pluckString = (
  obj?: Record<string, any>,
  key?: string,
): string => {
  if (!obj || !key) return "";

  const result = key.split(".").reduce<any>((acc, curr) => {
    if (acc && typeof acc === "object" && curr in acc) {
      return acc[curr];
    }
    return undefined;
  }, obj);

  return typeof result === "string" ? result : "";
};

export const maskEmail = (email?: string): string => {
  if (!email || !email.includes("@")) return "";

  const [local, domain] = email.split("@");

  if (local.length <= 3) {
    return `${local}@${domain}`;
  }

  return `${local.slice(0, 3)}${"*".repeat(local.length - 3)}@${domain}`;
};

export const getL = (): Record<string, any> => {
  return useLang.getState().l;
};
