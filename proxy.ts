import { NextResponse, type NextRequest } from "next/server";
import { getSessionData } from "./lib/auth/guard";

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const user = await getSessionData();
  const authed = !!user;

  // lightweight debug logging to help track cookie behavior in production
  try {
    const cookieHeader = req.headers.get("cookie");
    console.log(
      "[middleware][proxy] path=",
      pathname,
      "cookie=",
      cookieHeader?.slice(0, 200),
    );
  } catch {
    // ignore logging errors
  }

  if (pathname === "/login" || pathname === "/signup") {
    if (authed) {
      const res = NextResponse.redirect(new URL("/dashboard", req.url));
      res.headers.set("x-middleware-debug", "redirect-to-dashboard");
      return res;
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard") && !authed) {
    const next = encodeURIComponent(pathname + (search || ""));
    const res = NextResponse.redirect(new URL(`/login?next=${next}`, req.url));
    res.headers.set("x-middleware-debug", "redirect-to-login");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/login",
    "/signup",
    "/dashboard/:path*",
  ],
};
