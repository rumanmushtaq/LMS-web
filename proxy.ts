import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Keeps signed-in users off the sign-in screens.
 *
 * Deliberately narrower than the admin app's middleware. The admin is entirely
 * behind a login, so it can bounce every tokenless request to /login. This app
 * is a public site *and* an app — home, shop, instructors, contact and
 * become-a-tutor are all meant to be readable while signed out — so guarding
 * routes here would lock visitors out of the marketing pages. Access control
 * stays with the API, which is the only thing that can actually enforce it.
 *
 * So this does exactly one job: if you already have a session, /login and
 * /signup send you where logging in would have.
 */

/** Screens that make no sense once you are already signed in. */
const SIGNED_OUT_ONLY = ["/login", "/signup"];

/** Mirrors the post-login destinations in views/Login/useLogin.ts. */
const HOME_FOR_STUDENT = "/instructors";
const HOME_DEFAULT = "/";

/**
 * Reads `role` out of the access token.
 *
 * The signature is NOT verified — the frontend has no business holding the
 * signing secret, and this only chooses which page to land on. Nothing here is
 * an access-control decision; the API rejects bad tokens regardless.
 */
function roleFromAccessToken(token: string | undefined): string | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = Buffer.from(
      payload.replace(/-/g, "+").replace(/_/g, "/"),
      "base64",
    ).toString("utf8");
    return (JSON.parse(json) as { role?: string }).role ?? null;
  } catch {
    return null;
  }
}

/**
 * Only same-origin paths are honoured, so `?redirect=https://evil.example`
 * cannot turn our own login screen into an open redirect.
 */
function safeRedirectPath(raw: string | null): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  if (SIGNED_OUT_ONLY.some((p) => raw.startsWith(p))) return null;
  return raw;
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (!SIGNED_OUT_ONLY.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  // The escape hatch. A session can die server-side (idle timeout, logout
  // elsewhere, revocation) while these cookies are still sitting in the
  // browser — they outlive the access token by design. The axios interceptor
  // sends such users to /login?reason=expired, so that must always be allowed
  // through; otherwise they bounce off this redirect and can never sign back in.
  if (searchParams.has("reason")) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  if (!accessToken && !refreshToken) {
    return NextResponse.next();
  }

  // Send them back where they were headed, if that is where they came from.
  const requested = safeRedirectPath(searchParams.get("redirect"));
  const destination =
    requested ??
    (roleFromAccessToken(accessToken) === "student"
      ? HOME_FOR_STUDENT
      : HOME_DEFAULT);

  return NextResponse.redirect(new URL(destination, request.url));
}

export const config = {
  // Only the sign-in screens are inspected; everything else short-circuits in
  // the matcher rather than running the function on every asset request.
  matcher: ["/login/:path*", "/signup/:path*"],
};
