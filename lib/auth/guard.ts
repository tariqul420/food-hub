"use server";

import { cookies } from "next/headers";
import { api } from "../fetcher";

const BASE =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://foodhub-api.tariqul.dev";

export async function getSession() {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${BASE}/api/auth/get-session`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Failed to get session: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();

    if (!data || !data.session || !data.user) {
      return null;
    }

    return { data: data, error: null, status: true };
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}

export async function redirectToRole() {
  const session = await getSession();
  const { redirect } = await import("next/navigation");
  if (!session?.data) return redirect("/login");

  const role = session.data.user?.role;
  if (role === "ADMIN") return redirect("/dashboard/admin");
  if (role === "PROVIDER") return redirect("/dashboard/provider");

  return redirect("/dashboard");
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.data) return redirectToRole();
  if (session.data.user?.role !== "ADMIN") return redirectToRole();
  return session.data.user;
}

export async function requireProvider() {
  const session = await getSession();
  if (!session?.data) return redirectToRole();
  if (session.data.user?.role !== "PROVIDER") return redirectToRole();
  return session.data.user;
}

export async function requireCustomer() {
  const session = await getSession();
  if (!session?.data) return redirectToRole();
  if (session.data.user?.role !== "CUSTOMER") return redirectToRole();
  return session.data.user;
}

export async function getUser() {
  const session = await getSession();
  if (!session?.data) return redirectToRole();
  return session.data.user;
}

export async function getSessionData() {
  const session = await getSession();
  return session?.data ?? null;
}

export async function getProvider() {
  interface ProviderProfile {
    id: string;
    name: string;
  }

  const session = await getSession();
  if (!session?.data) return redirectToRole();
  if (session.data.user?.role !== "PROVIDER") return redirectToRole();

  try {
    const res = await api.get<{ data?: ProviderProfile }>(
      `/v1/providers/me`,
      undefined,
      {
        throwOnError: false,
      },
    );
    return res?.data || null;
  } catch {
    return null;
  }
}
