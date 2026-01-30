import { env } from "./env";

type Params = Record<string, string | number | boolean | undefined>;

type FetcherOptions = Omit<RequestInit, "body"> & {
  params?: Params;
  json?: unknown;
  throwOnError?: boolean;
  headers?: HeadersInit;
};

function buildUrl(url: string, params?: Params) {
  const isAbsolute = /^https?:\/\//i.test(url);
  const base = isAbsolute ? undefined : env.api_url;
  const u = new URL(url, base);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      u.searchParams.set(k, String(v));
    });
  }
  return u.toString();
}

async function request<T = unknown>(
  url: string,
  opts: FetcherOptions = {},
  method?: string,
): Promise<T> {
  const { params, json, throwOnError = true, headers, ...init } = opts;
  const fullUrl = buildUrl(url, params);

  const finalHeaders: HeadersInit = { ...(headers || {}) };

  const initReq: RequestInit = {
    method: method ?? (init.method as string) ?? (json ? "POST" : "GET"),
    headers: finalHeaders,
    ...init,
  };

  if (
    json != null &&
    initReq.method &&
    !["GET", "HEAD"].includes(initReq.method)
  ) {
    if (finalHeaders instanceof Headers) {
      if (!finalHeaders.get("content-type"))
        finalHeaders.set("content-type", "application/json");
    } else if (Array.isArray(finalHeaders)) {
      const has = finalHeaders.some(
        ([k]) => k.toLowerCase() === "content-type",
      );
      if (!has) finalHeaders.push(["content-type", "application/json"]);
    } else {
      const obj = finalHeaders as Record<string, string>;
      if (!Object.keys(obj).some((k) => k.toLowerCase() === "content-type"))
        obj["content-type"] = "application/json";
    }
    initReq.body = JSON.stringify(json);
  }

  const res = await fetch(fullUrl, initReq as RequestInit);
  const text = await res.text();
  let data: unknown = text || null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok && throwOnError) {
    let message = res.statusText || "Request failed";
    if (
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof (data as { message?: unknown }).message === "string"
    ) {
      message = (data as { message?: string }).message!;
    }
    const err = new Error(message) as Error & {
      status?: number;
      data?: unknown;
    };
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data as T;
}

export const api = {
  get<T = unknown>(
    url: string,
    params?: Params,
    opts?: Omit<FetcherOptions, "params">,
  ) {
    return request<T>(url, { ...(opts || {}), params }, "GET");
  },
  post<T = unknown>(
    url: string,
    json?: unknown,
    opts?: Omit<FetcherOptions, "json">,
  ) {
    return request<T>(url, { ...(opts || {}), json }, "POST");
  },
  put<T = unknown>(
    url: string,
    json?: unknown,
    opts?: Omit<FetcherOptions, "json">,
  ) {
    return request<T>(url, { ...(opts || {}), json }, "PUT");
  },
  patch<T = unknown>(
    url: string,
    json?: unknown,
    opts?: Omit<FetcherOptions, "json">,
  ) {
    return request<T>(url, { ...(opts || {}), json }, "PATCH");
  },
  del<T = unknown>(
    url: string,
    json?: unknown,
    opts?: Omit<FetcherOptions, "json">,
  ) {
    return request<T>(url, { ...(opts || {}), json }, "DELETE");
  },
  fetchById<T = unknown>(
    url: string,
    id: string | number,
    key = "id",
    appendToPath = true,
    opts?: FetcherOptions,
  ) {
    const target = appendToPath ? `${url.replace(/\/$/, "")}/${id}` : url;
    const params = appendToPath
      ? undefined
      : { ...(opts?.params || {}), [key]: id };
    return request<T>(target, { ...(opts || {}), params }, "GET");
  },
};

export default api;
