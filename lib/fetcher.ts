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

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  let url: URL;

  if (isAbsolute) {
    url = new URL(path);
  } else {
    const base = env.api.url;
    if (base.startsWith("/")) {
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : env.app.url.replace(/\/$/, "");
      url = new URL(`${origin}${base}${normalizedPath}`);
    } else {
      // Absolute base
      const baseNormalized = base.endsWith("/") ? base.slice(0, -1) : base;
      url = new URL(`${baseNormalized}${normalizedPath}`);
    }
  }

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }

  return url.toString();
}

async function getIncomingCookieHeader(): Promise<string> {
  if (typeof window !== "undefined") return "";
  try {
    const mod = await import("next/headers");
    const headersFn = mod.headers as unknown as () => unknown;
    type ReadonlyHeadersLike = { get(name: string): string | null | undefined };
    const hdrs = await Promise.resolve(
      (headersFn as unknown as () => ReadonlyHeadersLike)(),
    );
    return hdrs?.get("cookie") ?? "";
  } catch {
    return "";
  }
}

// Better-auth session cookie
function hasSessionCookie(cookieHeader: string) {
  return /(?:^|;\s*)better-auth\.session_token=/.test(cookieHeader);
}

async function request<T = unknown>(
  path: string,
  opts: Options = {},
  method?: string,
): Promise<T> {
  const { params, json, throwOnError = true, headers, auth, ...init } = opts;

  const fullUrl = buildUrl(path, params);
  const finalHeaders = new Headers(headers || {});

  if (!finalHeaders.get("accept")) {
    finalHeaders.set("accept", "application/json");
  }

  const cookieHeader = await getIncomingCookieHeader();
  if (cookieHeader && !finalHeaders.get("cookie")) {
    finalHeaders.set("cookie", cookieHeader);
  }

  if (auth === "required") {
    if (typeof window === "undefined") {
      if (!hasSessionCookie(cookieHeader)) {
        const err = new Error("Unauthorized") as Error & { status?: number };
        err.status = 401;
        throw err;
      }
    }
  }

  const initReq: RequestInit = {
    method: method ?? (init.method as string) ?? (json ? "POST" : "GET"),
    headers: finalHeaders,
    credentials: "include",
    ...init,
  };

  if (
    json != null &&
    initReq.method &&
    !["GET", "HEAD"].includes(initReq.method)
  ) {
    if (!finalHeaders.get("content-type")) {
      finalHeaders.set("content-type", "application/json");
    }
    initReq.body = JSON.stringify(json);
  }

  const res = await fetch(fullUrl, initReq);

  if (res.status === 204) return null as T;

  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  let data: unknown = text || null;
  if (text && contentType.includes("application/json")) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
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
