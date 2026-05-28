"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const TABS = [
  { href: "/", label: "Home" },
  { href: "/feed", label: "Feed" },
];

export default function Nav() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (pathname === "/pin") return null;

  return (
    <nav
      className="flex items-center gap-6 px-6 h-14 text-base"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <Link href="/" aria-label="Rescroll" className="flex items-center">
        <Image
          src="/logo-black.svg"
          alt="Rescroll"
          width={2000}
          height={2000}
          priority
          className="logo-light"
          style={{ height: 36, width: "auto", background: "none", border: "none" }}
        />
        <Image
          src="/logo-white.svg"
          alt="Rescroll"
          width={2000}
          height={2000}
          priority
          className="logo-dark"
          style={{ height: 36, width: "auto", background: "none", border: "none" }}
        />
      </Link>

      {TABS.map((tab) => {
        const active =
          tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="relative h-full flex items-center transition-colors"
            style={{ color: active ? "#1D9BF0" : "var(--muted)" }}
          >
            {tab.label}
            {active && (
              <span
                className="absolute left-0 right-0 bottom-0 h-px"
                style={{ backgroundColor: "#1D9BF0" }}
              />
            )}
          </Link>
        );
      })}

      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle color theme"
        className="ml-auto h-7 w-7 flex items-center justify-center text-base leading-none transition-opacity hover:opacity-70"
        style={{
          color: "var(--foreground)",
          background: "transparent",
          border: "none",
        }}
      >
        {mounted ? (isDark ? "☀" : "☾") : ""}
      </button>
    </nav>
  );
}
