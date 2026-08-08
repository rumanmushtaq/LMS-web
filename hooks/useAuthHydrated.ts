"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";

/**
 * True once the persisted auth state has been read back from localStorage.
 *
 * The server renders with an empty store, so on the first client render
 * `isAuthenticated()` is false even for a signed-in user. Any guard that
 * redirects on that render bounces people to /login for no reason. Wait for
 * this before deciding whether someone is signed in.
 *
 * `useAuthStore.persist` is only defined when the persist middleware found a
 * usable storage. On the server `window.localStorage` is unreachable, so
 * zustand bails out early and never attaches the API — dereferencing it
 * unguarded crashes prerendering. Hence the `?.` below.
 */
export function useAuthHydrated(): boolean {
  const [hydrated, setHydrated] = useState(
    () => useAuthStore.persist?.hasHydrated() ?? false,
  );

  useEffect(() => {
    const { persist } = useAuthStore;

    // No storage means there is nothing to rehydrate from; don't spin forever.
    if (!persist) {
      setHydrated(true);
      return;
    }

    // Covers the case where hydration finishes after this component mounts.
    const unsubscribe = persist.onFinishHydration(() => setHydrated(true));

    if (persist.hasHydrated()) setHydrated(true);

    return unsubscribe;
  }, []);

  return hydrated;
}
