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
      <style>{".twitter-tweet { margin: 0 auto !important; width: 100% !important; }"}</style>
      {error && <p style={{ color: "var(--muted)" }}>could not load tweet.</p>}
      {!error && !embedHtml && (
        <div style={{ width: "100%", maxWidth: "min(90vw, 680px)", margin: "0 auto", padding: "16px", border: "1px solid var(--border)", backgroundColor: "var(--background)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ width: 48, height: 48, borderRadius: "9999px", backgroundColor: "var(--border)", animation: "pulse 1.5s ease-in-out infinite" }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 14, width: "40%", backgroundColor: "var(--border)", marginBottom: 8, animation: "pulse 1.5s ease-in-out infinite" }} />
              <div style={{ height: 12, width: "25%", backgroundColor: "var(--border)", animation: "pulse 1.5s ease-in-out infinite" }} />
            </div>
          </div>
          <div style={{ height: 14, width: "90%", backgroundColor: "var(--border)", marginBottom: 8, animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ height: 14, width: "70%", backgroundColor: "var(--border)", animation: "pulse 1.5s ease-in-out infinite" }} />
        </div>
      )}
      {embedHtml && (
        <div style={{ width: "100%", maxWidth: "min(90vw, 680px)", margin: "0 auto", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%" }} dangerouslySetInnerHTML={{ __html: embedHtml }} />
        </div>
      )}
    </main>
  );
}
