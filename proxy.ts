import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "./lib/auth/guard";

// function isAuthenticated(req: NextRequest) {
//   const secure = req.cookies.get("__Secure-better-auth.session_token")?.value;
//   const normal = req.cookies.get("better-auth.session_token")?.value;
//   const token = secure || normal;

//   return Boolean(token);
// }

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const { data } = await getSession();
  const user = data?.user;
  const authed = !!user;

  if (pathname === "/login" || pathname === "/signup") {
    if (authed) return NextResponse.redirect(new URL("/dashboard", req.url));
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard") && !authed) {
    const next = encodeURIComponent(pathname + (search || ""));
    return NextResponse.redirect(new URL(`/login?next=${next}`, req.url));
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
