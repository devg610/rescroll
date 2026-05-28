"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <main
      className="flex flex-1 flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Logo lockup — compensate for 3px scrollbar by shifting 1.5px left */}
      <div style={{ marginRight: "-1.5px" }}>
        <div className="flex items-center gap-6">

          {/* Icon */}
          <Image
            src="/logo-black.svg"
            alt="Rescroll"
            width={2000}
            height={2000}
            priority
            className="logo-light"
            style={{ height: 90, width: "auto", background: "none", border: "none" }}
          />
          <Image
            src="/logo-white.svg"
            alt="Rescroll"
            width={2000}
            height={2000}
            priority
            className="logo-dark"
            style={{ height: 90, width: "auto", background: "none", border: "none" }}
          />

          {/* Animated wordmark */}
          <div className="logo-light wordmark-window">
            <Image
              src="/animationlogotextonly-black.svg"
              alt="Rescroll"
              width={7770}
              height={2290}
              priority
              className="wordmark-image"
            />
          </div>
          <div className="logo-dark wordmark-window">
            <Image
              src="/animationlogotextonly-white.svg"
              alt="Rescroll"
              width={7770}
              height={2290}
              priority
              className="wordmark-image"
            />
          </div>

          {/* Scrollbar */}
          <div className="scrollbar-track" aria-hidden="true">
            <div className="scrollbar-thumb" />
          </div>

        </div>
      </div>

      {/* Subtitle */}
      <p className="mt-4 text-lg" style={{ color: "var(--subtle)" }}>
        your likes, through time.
      </p>

      {/* Email form */}
      <form className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <input
          type="email"
          placeholder="you@example.com"
          className="flex-1 px-4 py-2.5 text-sm focus:outline-none"
          style={{
            backgroundColor: "var(--input-bg)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          }}
        />
        <button
          type="submit"
          className="px-5 py-2.5 text-sm font-bold transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "#1D9BF0",
            color: "#FFFFFF",
            border: "none",
          }}
        >
          Get Early Access
        </button>
      </form>

      {/* Dark mode toggle */}
      <button
        onClick={toggleDark}
        aria-label="Toggle dark mode"
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--foreground)",
          fontSize: 20,
        }}
      >
        {dark ? "☀️" : "🌙"}
      </button>
    </main>
  );
}