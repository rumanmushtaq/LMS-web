import { redirect } from "next/navigation";

/**
 * Back-compat for reset emails already in inboxes.
 *
 * The email used to link to `/auth/reset-password`, a route that never
 * existed — clicking the button in the email 404'd. New emails point at
 * `/reset-password`; this forwards the old URL, token intact, so links sent
 * before the fix still work until they expire.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  redirect(token ? `/reset-password?token=${encodeURIComponent(token)}` : "/reset-password");
}
