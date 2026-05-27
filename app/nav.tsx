"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Home" },
  { href: "/feed", label: "Feed" },
];

export default function Nav() {
  const pathname = usePathname();

  if (pathname === "/pin") return null;

  return (
    <nav
      className="flex items-center gap-6 px-6 h-12 bg-black border-b font-mono text-sm"
      style={{ borderColor: "#1f1f1f" }}
    >
      {TABS.map((tab) => {
        const active =
          tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="relative h-full flex items-center transition-colors"
            style={{ color: active ? "#c8f542" : "#a1a1aa" }}
          >
            {tab.label}
            {active && (
              <span
                className="absolute left-0 right-0 bottom-0 h-px"
                style={{ backgroundColor: "#c8f542" }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
