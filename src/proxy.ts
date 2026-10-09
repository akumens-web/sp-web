import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
const middleware = createMiddleware(routing);
export default function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const saved = request.cookies.get("NEXT_LOCALE")?.value;
    const supported = routing.locales as readonly string[];
    let locale = saved && supported.includes(saved) ? saved : undefined;
    if (!locale) {
      const preferences = (request.headers.get("accept-language") || "")
        .split(",")
        .map((entry) => {
          const [language, weight] = entry.trim().split(";q=");
          return {
            language: language.split("-")[0].toLowerCase(),
            weight: weight ? Number(weight) : 1,
          };
        })
        .sort((a, b) => b.weight - a.weight);
      locale =
        preferences.find((p) => supported.includes(p.language) && p.weight > 0)
          ?.language || "en";
    }
    return NextResponse.redirect(new URL("/" + locale, request.url));
  }
  return middleware(request);
}
export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
