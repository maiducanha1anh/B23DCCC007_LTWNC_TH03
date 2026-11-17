import { NextResponse } from "next/server";
import { auth } from "@/auth";
export default auth((request) => {
  if (!request.auth) {
    const url = new URL("/login", request.url);
    url.searchParams.set(
      "callbackUrl",
      request.nextUrl.pathname + request.nextUrl.search,
    );
    return NextResponse.redirect(url);
  }
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    request.auth.user.role !== "admin"
  )
    return NextResponse.redirect(new URL("/forbidden", request.url));
});
export const config = { matcher: ["/loans/:path*", "/admin/:path*"] };
