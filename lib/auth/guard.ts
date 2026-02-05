import { api } from "../fetcher";

const BASE = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:4000";

async function fetchSessionFromEndpoint(ep: string) {
  try {
    const hdrsModule = await import("next/headers");
    const headersFn = (hdrsModule as unknown as { headers?: unknown }).headers;
    const entries =
      typeof headersFn === "function" ? await headersFn() : headersFn;
    const hdrs = Object.fromEntries(
      (entries as Iterable<readonly [string, string]>) || [],
    );

    const res = await fetch(`${BASE}${ep}`, {
      headers: hdrs,
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getSession() {
  const endpoints = ["/api/auth/get-session"];

  for (const ep of endpoints) {
    const payload = await fetchSessionFromEndpoint(ep);
    if (!payload) continue;

    if (payload.session || payload.user || payload.data) return payload;
    if (typeof payload === "object") return { user: payload };
  }

  return null;
}

export async function redirectToRole() {
  const session = await getSession();
  const { redirect } = await import("next/navigation");
  if (!session) return redirect("/login");

  const role = session.user?.role;
  if (role === "ADMIN") return redirect("/dashboard/admin");
  if (role === "PROVIDER") return redirect("/dashboard/provider");

  return redirect("/dashboard");
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) return redirectToRole();
  if (session.user?.role !== "ADMIN") return redirectToRole();
  return session.user;
}

export async function requireProvider() {
  const session = await getSession();
  if (!session) return redirectToRole();
  if (session.user?.role !== "PROVIDER") return redirectToRole();
  return session.user;
}

export async function requireCustomer() {
  const session = await getSession();
  if (!session) return redirectToRole();
  if (session.user?.role !== "CUSTOMER") return redirectToRole();
  return session.user;
}

export async function getUser() {
  const session = await getSession();
  if (!session) return redirectToRole();
  return session.user;
}

export async function getProvider() {
  interface ProviderProfile {
    id: string;
    name: string;
  }

  const session = await getSession();
  if (!session) return redirectToRole();
  if (session.user?.role !== "PROVIDER") return redirectToRole();

  try {
    const res = await api.get<{ data?: ProviderProfile }>(
      `/providers/me`,
      undefined,
      {
        throwOnError: false,
      },
    );
    return res?.data || null;
  } catch (err) {
    return null;
  }
}
