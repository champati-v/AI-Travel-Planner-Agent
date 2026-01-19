// hooks/useDarkMode.ts
import { useEffect, useState, useCallback } from "react";

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  const toggleDark = useCallback(() => {
    setIsDark((prev) => {
      const newTheme = !prev ? "dark" : "light";
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      localStorage.setItem("theme", newTheme);
      return !prev;
    });
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = storedTheme === "dark" || (!storedTheme && prefersDark);

    document.documentElement.classList.toggle("dark", shouldUseDark);
    setIsDark(shouldUseDark);
  }, []);

  return { isDark, toggleDark };
}
