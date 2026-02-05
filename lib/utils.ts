import { clsx, type ClassValue } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
}

export function removeKeysFromQuery({
  params,
  keysToRemove,
}: {
  params: string;
  keysToRemove: [string];
}) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
}

type QSValue = string | undefined;

export function setQuery(
  prevQS: string,
  pairs: Record<string, QSValue>,
): string {
  const s = new URLSearchParams(prevQS || "");
  Object.entries(pairs).forEach(([k, v]) => {
    if (v === undefined || v === "") s.delete(k);
    else s.set(k, v);
  });
  return s.toString();
}

export function withPageReset(
  pairs: Record<string, QSValue>,
): Record<string, QSValue> {
  return { ...pairs };
}

export function clearQuery(prevQS: string, keys: string[]): string {
  const s = new URLSearchParams(prevQS || "");
  keys.forEach((k) => {
    s.delete(k);
  });
  return s.toString();
}