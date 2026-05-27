export default function Home() {
  return (
    <main
      className="flex flex-1 flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <h1 className="font-serif italic text-7xl sm:text-8xl text-zinc-100 tracking-tight">
        Rescroll
      </h1>
      <p className="mt-4 font-mono text-sm text-zinc-400">
        your likes, through time.
      </p>
      <form className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <input
          type="email"
          placeholder="you@example.com"
          className="flex-1 rounded border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded border border-transparent px-5 py-2.5 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#c8f542" }}
        >
          Get Early Access
        </button>
      </form>
    </main>
  );
}
