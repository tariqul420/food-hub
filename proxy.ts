import { NextResponse, type NextRequest } from "next/server";

function isAuthenticated(req: NextRequest) {
  const secure = req.cookies.get("__Secure-better-auth.session_token")?.value;
  const normal = req.cookies.get("better-auth.session_token")?.value;
  const token = secure || normal;

  return Boolean(token);
}

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const authed = isAuthenticated(req);

  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/signup"
  ) {
    if (authed) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard") && !authed) {
    const next = encodeURIComponent(pathname + (search || ""));
    const res = NextResponse.redirect(new URL(`/login?next=${next}`, req.url));
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/login",
    "/register",
    "/signup",
    "/dashboard/:path*",
  ],
};
