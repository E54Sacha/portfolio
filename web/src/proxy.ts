import { NextResponse, type NextRequest } from "next/server";
import { isLocale, localeFromAcceptLanguage } from "@/content/i18n";

const COOKIE = "lang"; // the language the visitor last chose (or was sent to)
const YEAR = 60 * 60 * 24 * 365;

// Sends "/" (and any path without a language) to /en/... or /fr/..., and remembers the language in use.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";

  if (isLocale(first)) {
    const response = NextResponse.next();
    if (request.cookies.get(COOKIE)?.value !== first) {
      response.cookies.set(COOKIE, first, { path: "/", maxAge: YEAR, sameSite: "lax" });
    }
    return response;
  }

  const saved = request.cookies.get(COOKIE)?.value;
  const lang = saved && isLocale(saved) ? saved : localeFromAcceptLanguage(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next.js internals and files with an extension (favicon.ico, images…).
  matcher: ["/((?!_next/|.*\\..*).*)"],
};
