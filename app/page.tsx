import Image from "next/image";

export default function Home() {
  return (
    <main
      className="flex flex-1 flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <div style={{ marginLeft: "3px" }}>
        <div
          className="flex items-center justify-center gap-6"
          style={{ margin: "0 auto", textAlign: "center" }}
        >
        {/* Icon - static */}
        <Image
          src="/logo-black.svg"
          alt="Rescroll"
          width={2000}
          height={2000}
          priority
          className="logo-light lockup-logo"
          style={{ height: 160, width: "auto", background: "none", border: "none", verticalAlign: "middle" }}
        />
        <Image
          src="/logo-white.svg"
          alt="Rescroll"
          width={2000}
          height={2000}
          priority
          className="logo-dark lockup-logo"
          style={{ height: 160, width: "auto", background: "none", border: "none", verticalAlign: "middle" }}
        />

        {/* Animated wordmark - light mode */}
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
        {/* Animated wordmark - dark mode */}
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

        {/* Scrollbar synced with wordmark */}
        <div className="scrollbar-track" aria-hidden="true">
          <div className="scrollbar-thumb" />
        </div>
        </div>
      </div>
      <p className="mt-4 text-lg" style={{ color: "var(--subtle)" }}>
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