import Script from "next/script";

type OEmbedResponse = {
  html: string;
};

async function getTweetEmbed(): Promise<OEmbedResponse | null> {
  try {
    const res = await fetch(
      "https://publish.twitter.com/oembed?url=https://x.com/chodadev/status/1538932357364858880&omit_script=true",
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return (await res.json()) as OEmbedResponse;
  } catch {
    return null;
  }
}

export default async function Feed() {
  const embed = await getTweetEmbed();

  return (
    <main
      className="flex flex-1 flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <style>{`
        .tweet-card {
          max-width: 550px;
          margin: 40px auto 0;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 16px;
          overflow: hidden;
          padding: 0;
          width: 100%;
        }
        html.dark .tweet-card {
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
      `}</style>
      {embed ? (
        <>
          <div
            className="tweet-card"
            dangerouslySetInnerHTML={{ __html: embed.html }}
          />
          <Script
            src="https://platform.twitter.com/widgets.js"
            strategy="afterInteractive"
          />
        </>
      ) : (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          could not load tweet.
        </p>
      )}
    </main>
  );
}
