"use client";

import { useThemeStore } from "@/store/theme";
import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  // Prevent flash of unstyled content (FOUC)
  // Initially, the theme might be 'light' but stored as 'dark'
  // A small script tag in layout.tsx is better for immediate application,
  // but this is a good start for dynamic updates.

  return <>{children}</>;
}
