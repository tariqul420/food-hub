import { env } from "./env";

type Params = Record<string, string | number | boolean | undefined>;

type Options = Omit<RequestInit, "body"> & {
  params?: Params;
  json?: unknown;
  throwOnError?: boolean;
  headers?: HeadersInit;
  auth?: "required" | "optional";
};

function buildUrl(path: string, params?: Params) {
  const isAbsolute = /^https?:\/\//i.test(path);
  const url = isAbsolute
    ? new URL(path)
    : new URL(
        path.startsWith("/") ? path.slice(1) : path,
        env.api_url.endsWith("/") ? env.api_url : env.api_url + "/",
      );

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

async function getIncomingHeaders(): Promise<Record<string, string>> {
  if (typeof window !== "undefined") return {};
  try {
    const mod = await import("next/headers");
    const hdrsExport = (mod as { headers?: unknown }).headers;
    const hdrs =
      typeof hdrsExport === "function"
        ? await (hdrsExport as () => Iterable<readonly [string, string]>)()
        : (hdrsExport as Iterable<readonly [string, string]> | undefined);
    const out: Record<string, string> = {};
    if (!hdrs) return out;
    for (const [k, v] of hdrs) out[k] = v;
    return out;
  } catch {
    return {};
  }
}

async function request<T = unknown>(
  path: string,
  opts: Options = {},
  method?: string,
): Promise<T> {
  const { params, json, throwOnError = true, headers, auth, ...init } = opts;
  const fullUrl = buildUrl(path, params);

  const finalHeaders = new Headers(headers || {});

  const incoming = await getIncomingHeaders();
  for (const [k, v] of Object.entries(incoming)) {
    if (!finalHeaders.get(k)) finalHeaders.set(k, String(v));
  }

  let token: string | undefined;
  if (typeof window === "undefined") {
    if (incoming.cookie) {
      const m = incoming.cookie.match(/(?:^|; )token=([^;]*)/);
      if (m) token = decodeURIComponent(m[1]);
    }
  } else {
    const cookie = typeof document !== "undefined" ? document.cookie : "";
    const m = cookie ? cookie.match(/(?:^|; )token=([^;]*)/) : null;
    if (m) token = decodeURIComponent(m[1]);
  }

  if (token) finalHeaders.set("authorization", `Bearer ${token}`);
  else if (auth === "required") {
    const err = new Error("Unauthorized") as Error & { status?: number };
    err.status = 401;
    throw err;
  }

  const initReq: RequestInit = {
    method: method ?? (init.method as string) ?? (json ? "POST" : "GET"),
    headers: finalHeaders,
    ...(typeof window !== "undefined"
      ? { credentials: "include" as RequestCredentials }
      : {}),
    ...init,
  };

  if (
    json != null &&
    initReq.method &&
    !["GET", "HEAD"].includes(initReq.method)
  ) {
    if (!finalHeaders.get("content-type"))
      finalHeaders.set("content-type", "application/json");
    initReq.body = JSON.stringify(json);
  }

  const res = await fetch(fullUrl, initReq);
  const text = await res.text();
  let data: unknown = text || null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok && throwOnError) {
    let message = res.statusText || "Request failed";
    if (data && typeof data === "object" && "message" in data) {
      const d = data as { message?: unknown };
      if (typeof d.message === "string") message = d.message;
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
    opts?: Omit<Options, "params">,
  ) {
    return request<T>(url, { ...(opts || {}), params }, "GET");
  },
  post<T = unknown>(url: string, json?: unknown, opts?: Omit<Options, "json">) {
    return request<T>(url, { ...(opts || {}), json }, "POST");
  },
  put<T = unknown>(url: string, json?: unknown, opts?: Omit<Options, "json">) {
    return request<T>(url, { ...(opts || {}), json }, "PUT");
  },
  patch<T = unknown>(
    url: string,
    json?: unknown,
    opts?: Omit<Options, "json">,
  ) {
    return request<T>(url, { ...(opts || {}), json }, "PATCH");
  },
  del<T = unknown>(url: string, json?: unknown, opts?: Omit<Options, "json">) {
    return request<T>(url, { ...(opts || {}), json }, "DELETE");
  },
};

export default api;
