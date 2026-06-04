"use client";

import { useEffect, useState } from "react";

type Tweet = {
  url: string;
  year: number;
  html: string;
};

export default function Feed() {
  const MOCK_DATE = "January 1";

  const tweetList = [
    { url: "https://x.com/todaysdaytoday/status/1609535289810206721", year: 2023 },
    { url: "https://x.com/todaysdaytoday/status/1477264082801770497", year: 2022 },
    { url: "https://x.com/nickjfuentes/status/1874335588717125879", year: 2025 },
    { url: "https://x.com/nickjfuentes/status/2006717798509101118", year: 2026 },
    { url: "https://x.com/elonmusk/status/153594528908058624", year: 2011 },
    { url: "https://x.com/cobratate/status/1741744326823002131", year: 2024 },
  ];

  const [embeds, setEmbeds] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    Promise.all(
      tweetList.map((t) =>
        fetch(`https://publish.twitter.com/oembed?url=${t.url}&omit_script=true`)
          .then((r) => r.json())
          .then((data) => ({ ...t, html: data.html as string }))
          .catch(() => null)
      )
    ).then((results) => {
      setEmbeds(results.filter((r): r is Tweet => r !== null && typeof r.html === "string"));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (embeds.length === 0) return;

    const injectAndLoad = () => {
      const twttr = (window as any).twttr;
      if (twttr?.widgets) {
        twttr.widgets.load();
      } else {
        const existing = document.getElementById("twitter-widgets-script");
        if (existing) existing.remove();
        const script = document.createElement("script");
        script.id = "twitter-widgets-script";
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.charset = "utf-8";
        script.onload = () => (window as any).twttr?.widgets?.load();
        document.body.appendChild(script);
      }
    };

    const timer = setTimeout(injectAndLoad, 100);
    return () => clearTimeout(timer);
  }, [embeds, sortBy]);

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

  const sorted = [...embeds].sort((a, b) => {
    if (sortBy === "date-desc") return b.year - a.year;
    if (sortBy === "date-asc") return a.year - b.year;
    return 0;
  });

  const skeletonCard = (
    <div style={{ width: "100%", maxWidth: "min(90vw, 680px)", margin: "0 auto 24px", padding: "16px", border: "1px solid var(--border)", backgroundColor: "var(--background)" }}>
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
  );

  const tweetSection = (
    <>
      <div style={{ width: "100%", maxWidth: "min(90vw, 680px)", margin: "0 auto 16px" }}>
        <h2 style={{ fontWeight: "bold", fontSize: "18px", color: "var(--foreground)" }}>
          On This Day — {MOCK_DATE}
        </h2>
      </div>

      {loading && (
        <>
          {skeletonCard}
          {skeletonCard}
          {skeletonCard}
        </>
      )}

      {!loading && sorted.map((t) => (
        <div key={t.url} style={{ width: "100%", maxWidth: "min(90vw, 680px)", margin: "0 auto 24px", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
          <div style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "4px" }}>{t.year}</div>
          <div style={{ width: "100%" }} dangerouslySetInnerHTML={{ __html: t.html }} />
        </div>
      ))}
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
        <div style={{ width: "100%", overflowX: "auto", paddingBottom: "12px", marginBottom: "16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", whiteSpace: "nowrap" }}>
            <div style={{ flexShrink: 0, minWidth: "160px" }}>{viewSelect}</div>
            <span style={{ fontSize: "14px", color: "var(--foreground)", flexShrink: 0 }}>Sort By:</span>
            {sortOptions.map(renderSortButton)}
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", minWidth: 0 }}>
        {tweetSection}
      </div>

      {isDesktop && (
        <aside style={{ width: "240px", flexShrink: 0, padding: "24px 20px 20px 20px", borderLeft: "1px solid var(--border)" }}>
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