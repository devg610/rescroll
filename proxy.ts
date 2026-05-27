import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (request.cookies.get("rescroll_auth")?.value === "true") {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/pin", request.url));
}

export const config = {
  matcher: ["/((?!pin|api|_next/static|_next/image|favicon.ico).*)"],
};
