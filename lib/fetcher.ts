import { env } from "./env";

type Params = Record<string, string | number | boolean | undefined>;

type Options = Omit<RequestInit, "body"> & {
  params?: Params;
  json?: unknown;
  throwOnError?: boolean;
  headers?: HeadersInit;
  /**
   * Cookie/session required কিনা (SSR এ cookie না থাকলে 401 throw করবে)
   */
  auth?: "required" | "optional";
};

function buildUrl(path: string, params?: Params) {
  const isAbsolute = /^https?:\/\//i.test(path);
  const base = env.api_url.endsWith("/") ? env.api_url : env.api_url + "/";
  const url = isAbsolute
    ? new URL(path)
    : new URL(path.startsWith("/") ? path.slice(1) : path, base);

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

/**
 * Server-side (Next.js App Router) incoming cookie header read
 */
async function getIncomingCookieHeader(): Promise<string> {
  if (typeof window !== "undefined") return "";
  try {
    const { headers } = await import("next/headers");
    // App Router: headers() returns ReadonlyHeaders (sync)
    return (await headers()).get("cookie") ?? "";
  } catch {
    return "";
  }
}

function hasAnySessionCookie(cookieHeader: string) {
  // Better Auth cookie name (common): better-auth.session_token
  // আপনার config এ নাম আলাদা হলে এখানে update করবেন
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

  // Always set accept
  if (!finalHeaders.get("accept"))
    finalHeaders.set("accept", "application/json");

  // ✅ Server-side: forward incoming cookies to backend
  const cookieHeader = await getIncomingCookieHeader();
  if (cookieHeader && !finalHeaders.get("cookie")) {
    finalHeaders.set("cookie", cookieHeader);
  }

  // Optional auth guard for SSR
  if (auth === "required") {
    const hasCookie =
      typeof window !== "undefined"
        ? /(?:^|;\s*)better-auth\.session_token=/.test(document.cookie || "")
        : hasAnySessionCookie(cookieHeader);

    if (!hasCookie) {
      const err = new Error("Unauthorized") as Error & { status?: number };
      err.status = 401;
      throw err;
    }
  }

  const initReq: RequestInit = {
    method: method ?? (init.method as string) ?? (json ? "POST" : "GET"),
    headers: finalHeaders,

    /**
     * ✅ Important:
     * Client-side: credentials include লাগবে cookie send করতে
     * Server-side: fetch এ cookie jar নেই, তাই আমরা header দিয়ে cookie forward করছি
     */
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

  // If backend returns 204
  if (res.status === 204) return null as T;

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
