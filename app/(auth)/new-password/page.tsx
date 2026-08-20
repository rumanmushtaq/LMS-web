import { redirect } from "next/navigation";

/**
 * Older alias for the reset page. This rendered an empty <div>, so anyone
 * routed here saw a blank screen instead of the password form.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  redirect(token ? `/reset-password?token=${encodeURIComponent(token)}` : "/reset-password");
}
