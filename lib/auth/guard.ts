import { headers } from "next/headers";
import { redirect } from "next/navigation";

const BASE = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:4000";

async function fetchSessionFromEndpoint(ep: string) {
  try {
    const hdrs = Object.fromEntries(await headers());
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
  const endpoints = [
    "/api/auth/get-session",
    "/api/auth/session",
    "/api/session",
    "/session",
    "/api/auth/me",
  ];

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

export async function getUser() {
  const session = await getSession();
  if (!session) return redirectToRole();
  return session.user;
}
