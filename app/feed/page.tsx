export default function Feed() {
  return (
    <main
      className="flex flex-1 flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <h1 className="font-serif italic text-7xl sm:text-8xl text-zinc-100 tracking-tight">
        Feed
      </h1>
      <p className="mt-4 font-mono text-sm text-zinc-400">
        connect your account to load your likes.
      </p>
    </main>
  );
}
