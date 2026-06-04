"use client";

import { useEffect, useState } from "react";

export default function Feed() {
  const [embedHtml, setEmbedHtml] = useState(null);
  const [error, setError] = useState(false);
  const [view, setView] = useState("on-this-day");
  const [sortBy, setSortBy] = useState("date-desc");
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

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

  const sortOptions = [
    { value: "date-asc", label: "Date ↑" },
    { value: "date-desc", label: "Date ↓" },
    { value: "likes-asc", label: "Likes ↑" },
    { value: "likes-desc", label: "Likes ↓" },
  ];

  const renderSortButton = (opt: { value: string; label: string }) => {
    const active = sortBy === opt.value;
    return (
      <button
        key={opt.value}
        onClick={() => setSortBy(opt.value)}
        style={{
          padding: "6px 14px",
          borderRadius: "9999px",
          border: "none",
          backgroundColor: active ? "#1D9BF0" : "var(--border)",
          color: active ? "#ffffff" : "var(--foreground)",
          cursor: "pointer",
          fontSize: "14px",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {opt.label}
      </button>
    );
  };

  const viewSelect = (
    <select
      value={view}
      onChange={(e) => setView(e.target.value)}
      style={{
        width: "100%",
        padding: "8px",
        borderRadius: 0,
        border: "1px solid var(--border)",
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        fontSize: "14px",
      }}
    >
      <option value="on-this-day">On This Day</option>
    </select>
  );

  const tweetSection = (
    <>
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
    </>
  );

  return (
    <main
      style={{
        flex: 1,
        display: "flex",
        flexDirection: isDesktop ? "row" : "column",
        alignItems: "stretch",
        padding: isDesktop ? "40px 24px" : "16px 24px 40px",
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <style>{".twitter-tweet { margin: 0 auto !important; width: 100% !important; }"}</style>

      {!isDesktop && (
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            paddingBottom: "12px",
            marginBottom: "16px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", whiteSpace: "nowrap" }}>
            <div style={{ flexShrink: 0, minWidth: "160px" }}>{viewSelect}</div>
            <span style={{ fontSize: "14px", color: "var(--foreground)", flexShrink: 0 }}>Sort By:</span>
            {sortOptions.map(renderSortButton)}
          </div>
        </div>
      )}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: 0,
        }}
      >
        {tweetSection}
      </div>

      {isDesktop && (
        <aside
          style={{
            width: "240px",
            flexShrink: 0,
            padding: "24px 20px 20px 20px",
            borderLeft: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "var(--foreground)" }}>View</label>
              {viewSelect}
            </div>
            <div>
              <div style={{ marginBottom: "8px", fontSize: "14px", color: "var(--foreground)" }}>Sort By</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {sortOptions.map(renderSortButton)}
              </div>
            </div>
          </div>
        </aside>
      )}
    </main>
  );
}
