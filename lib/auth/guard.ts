import { cookies } from "next/dist/server/request/cookies";
import { api } from "../fetcher";

const BASE =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://foodhub-b.vercel.app";

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${BASE}/api/auth/get-session`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });
    const session = await res.json();
    if (session === null) {
      return { data: null, message: "No active session", status: false };
    }
    return { data: session, error: null, status: true };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      message: "Failed to fetch session data",
      status: false,
    };
  }
}

export async function redirectToRole() {
  const session = await getSession();
  const { redirect } = await import("next/navigation");
  if (!session) return redirect("/login");

  const role = session.data?.user?.role;
  if (role === "ADMIN") return redirect("/dashboard/admin");
  if (role === "PROVIDER") return redirect("/dashboard/provider");

  return redirect("/dashboard");
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) return redirectToRole();
  if (session.data?.user?.role !== "ADMIN") return redirectToRole();
  return session.data.user;
}

export async function requireProvider() {
  const session = await getSession();
  if (!session) return redirectToRole();
  if (session.data?.user?.role !== "PROVIDER") return redirectToRole();
  return session.data.user;
}

export async function requireCustomer() {
  const session = await getSession();
  if (!session) return redirectToRole();
  if (session.data?.user?.role !== "CUSTOMER") return redirectToRole();
  return session.data.user;
}

export async function getUser() {
  const session = await getSession();
  if (!session) return redirectToRole();
  return session.data.user;
}

export async function getProvider() {
  interface ProviderProfile {
    id: string;
    name: string;
  }

  const session = await getSession();
  if (!session) return redirectToRole();
  if (session.data?.user?.role !== "PROVIDER") return redirectToRole();

  try {
    const res = await api.get<{ data?: ProviderProfile }>(
      `/providers/me`,
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
