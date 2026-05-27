export default function Feed() {
  return (
    <main
      className="flex flex-1 flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <h1
        className="text-7xl sm:text-8xl tracking-tight"
        style={{ color: "var(--foreground)", fontWeight: 700 }}
      >
        Feed
      </h1>
      <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
        connect your account to load your likes.
      </p>
    </main>
  );
}
