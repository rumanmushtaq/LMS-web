import NewPasswordForm from "@/views/NewPassword";
import { Suspense } from "react";

/**
 * Canonical password-reset page. The reset email links here with `?token=`.
 *
 * Suspense is required because the form reads the token with
 * `useSearchParams`, which opts the route into client-side rendering.
 */
const Page = () => {
  return (
    <Suspense fallback={<div className="text-muted-foreground">Loading…</div>}>
      <NewPasswordForm />
    </Suspense>
  );
};

export default Page;
