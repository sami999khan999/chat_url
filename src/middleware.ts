import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const existingSessionId = req.cookies.get("sessionId")?.value;

  if (existingSessionId) {
    return NextResponse.next();
  }

  const sessionId = crypto.randomUUID();

  // Expose the new id to the request as well, otherwise the page rendering this
  // very request reads `undefined` and builds a session id that no longer
  // matches the one used on every following request.
  req.cookies.set("sessionId", sessionId);

  const res = NextResponse.next({ request: { headers: req.headers } });
  res.cookies.set("sessionId", sessionId);

  return res;
}

export const config = {
  // Skip Next.js internals, the API route and static assets.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
