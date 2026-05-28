import Image from "next/image";

export default function Home() {
  return (
    <main
      className="flex flex-1 flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <div className="flex items-center gap-1">
        {/* Icon - static */}
        <Image
          src="/logo-black.svg"
          alt="Rescroll"
          width={2000}
          height={2000}
          priority
          className="logo-light"
          style={{ height: 120, width: "auto", background: "none", border: "none" }}
        />
        <Image
          src="/logo-white.svg"
          alt="Rescroll"
          width={2000}
          height={2000}
          priority
          className="logo-dark"
          style={{ height: 120, width: "auto", background: "none", border: "none" }}
        />

        {/* Wordmark - will animate later */}
        <Image
          src="/animationlogotextonly-black.svg"
          alt="Rescroll"
          width={2000}
          height={2000}
          priority
          className="logo-light"
          style={{ height: 170, width: "auto", background: "none", border: "none" }}
        />
        <Image
          src="/animationlogotextonly-white.svg"
          alt="Rescroll"
          width={2000}
          height={2000}
          priority
          className="logo-dark"
          style={{ height: 170, width: "auto", background: "none", border: "none" }}
        />
      </div>
      <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
        your likes, through time.
      </p>
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
    </main>
  );
}
