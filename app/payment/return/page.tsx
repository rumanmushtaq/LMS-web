import React, { Suspense } from "react";
import PaymentReturnView from "./PaymentReturnView";

/**
 * Where buyers land after leaving the site to pay: a bank (PSE via Wompi) or
 * a card check (Stripe 3-D Secure). Suspense is required because the view
 * reads `?paymentId=` with `useSearchParams`.
 */
const Page = () => (
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    }
  >
    <PaymentReturnView />
  </Suspense>
);

export default Page;
