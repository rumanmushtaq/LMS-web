import CheckEmailPage from "@/views/CheckEmail";
import React, { Suspense } from "react";

/**
 * Suspense is required: the view reads `?mode=` with `useSearchParams`, and
 * without a boundary the production build fails while prerendering.
 */
const Page = () => {
  return (
    <Suspense fallback={<div className="text-muted-foreground">Loading…</div>}>
      <CheckEmailPage />
    </Suspense>
  );
};

export default Page;
