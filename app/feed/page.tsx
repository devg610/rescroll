"use client";

import { useEffect, useState } from "react";

export default function Feed() {
  const [embedHtml, setEmbedHtml] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setEmbedHtml(null);
    setError(false);
    fetch("https://publish.twitter.com/oembed?url=https://x.com/chodadev/status/1538932357364858880&omit_script=true")
      .then((res) => res.json())
      .then((data) => setEmbedHtml(data.html))
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    if (!embedHtml) return;
    const existing = document.getElementById("twitter-widgets-script");
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.id = "twitter-widgets-script";
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);
  }, [embedHtml]);

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-10" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
      {error && <p style={{ color: "var(--muted)" }}>could not load tweet.</p>}
      {!error && !embedHtml && <p style={{ color: "var(--muted)" }}>loading...</p>}
      {embedHtml && (
        <div style={{ width: "100%", maxWidth: "min(90vw, 680px)", margin: "0 auto" }} dangerouslySetInnerHTML={{ __html: embedHtml }} />
      )}
    </main>
  );
}
