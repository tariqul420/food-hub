import { env } from "./env";

type Params = Record<string, string | number | boolean | undefined>;

type FetcherOptions = Omit<RequestInit, "body"> & {
  params?: Params;
  json?: unknown;
  throwOnError?: boolean;
  headers?: HeadersInit;
  auth?: "required" | "optional";
};

function buildUrl(url: string, params?: Params) {
  const isAbsolute = /^https?:\/\//i.test(url);
  let u: URL;
  if (isAbsolute) {
    u = new URL(url);
  } else {
    const base = env.api_url.endsWith("/") ? env.api_url : env.api_url + "/";
    const relative = url.startsWith("/") ? url.slice(1) : url;
    u = new URL(relative, base);
  }
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
  const { params, json, throwOnError = true, headers, auth, ...init } = opts;
  const fullUrl = buildUrl(url, params);

  // Normalize headers to a mutable shape
  const finalHeaders: HeadersInit = { ...(headers || {}) };

  function headerHas(h: HeadersInit, key: string) {
    if (h instanceof Headers) return !!h.get(key);
    if (Array.isArray(h))
      return h.some(([k]) => k.toLowerCase() === key.toLowerCase());
    return Object.keys(h as Record<string, string>).some(
      (k) => k.toLowerCase() === key.toLowerCase(),
    );
  }

  function setHeader(h: HeadersInit, key: string, value: string) {
    if (h instanceof Headers) h.set(key, value);
    else if (Array.isArray(h)) {
      const idx = h.findIndex(([k]) => k.toLowerCase() === key.toLowerCase());
      if (idx >= 0) h[idx][1] = value;
      else h.push([key, value]);
    } else (h as Record<string, string>)[key] = value;
  }

  async function getIncomingHeaders(): Promise<Record<string, string>> {
    if (typeof window !== "undefined") return {};
    try {
      const hdrsModule = await import("next/headers");
      const hdrsFn = (hdrsModule as unknown as { headers?: unknown }).headers;
      const hdrs = typeof hdrsFn === "function" ? await hdrsFn() : hdrsFn;
      return Object.fromEntries(hdrs as Iterable<readonly [string, string]>);
    } catch {
      return {};
    }
  }

  function extractTokenFromSession(session: unknown): string | undefined {
    if (!session || typeof session !== "object") return undefined;
    const s = session as Record<string, unknown>;
    if (typeof s.token === "string") return s.token as string;
    if (typeof s.accessToken === "string") return s.accessToken as string;
    if (s.user && typeof s.user === "object") {
      const u = s.user as Record<string, unknown>;
      if (typeof u.token === "string") return u.token as string;
      if (typeof u.accessToken === "string") return u.accessToken as string;
    }
    return undefined;
  }

  // Merge incoming server headers (cookies) when running server-side
  const incoming = await getIncomingHeaders();
  Object.entries(incoming).forEach(([k, v]) => {
    if (!headerHas(finalHeaders, k)) setHeader(finalHeaders, k, String(v));
  });

  // Resolve token: prefer session token on server (lazy import), else cookie
  let token: string | undefined;
  try {
    if (typeof window === "undefined") {
      const guard = await import("./auth/guard");
      const session = await guard.getSession();
      token = extractTokenFromSession(session);
      if (!token && incoming.cookie) {
        const m = incoming.cookie.match(/(?:^|; )token=([^;]*)/);
        if (m) token = decodeURIComponent(m[1]);
      }
    } else {
      const cookie = typeof document !== "undefined" ? document.cookie : "";
      const m = cookie ? cookie.match(/(?:^|; )token=([^;]*)/) : null;
      if (m) token = decodeURIComponent(m[1]);
    }
  } catch {
    token = undefined;
  }

  if (token) setHeader(finalHeaders, "authorization", `Bearer ${token}`);
  else if (auth === "required") {
    const err = new Error("Unauthorized") as Error & { status?: number };
    err.status = 401;
    throw err;
  }

  const initReq: RequestInit = {
    method: method ?? (init.method as string) ?? (json ? "POST" : "GET"),
    headers: finalHeaders,
    // include credentials (cookies) when running in the browser so auth cookies are sent
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
    // ensure content-type
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
};

export default api;
