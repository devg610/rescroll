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
  const [showContent, setShowContent] = useState(false);
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
    // Inject script immediately
    const existing = document.getElementById("twitter-widgets-script");
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.id = "twitter-widgets-script";
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);

    // Fetch tweets
    Promise.all(
      tweetList.map((t) =>
        fetch(`https://publish.twitter.com/oembed?url=${t.url}&omit_script=true`)
          .then((r) => r.json())
          .then((data) => ({ ...t, html: data.html as string }))
          .catch(() => null)
      )
    ).then((results) => {
      const valid = results.filter((r): r is Tweet => r !== null && typeof r.html === "string");
      // Store tweets but don't show yet
      setEmbeds(valid);
      // Show content 5 seconds after tweets are fetched
      setTimeout(() => setShowContent(true), 5000);
    });
  }, []);

  // When showContent becomes true, add tweets to DOM then immediately call widgets.load
  useEffect(() => {
    if (!showContent) return;
    setTimeout(() => {
      const twttr = (window as any).twttr;
      if (twttr?.widgets) {
        twttr.widgets.load();
      }
    }, 50);
  }, [showContent]);

  useEffect(() => {
    if (!showContent) return;
    const twttr = (window as any).twttr;
    if (twttr?.widgets) {
      setTimeout(() => twttr.widgets.load(), 100);
    }
  }, [sortBy]);

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

  const dateSort = (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
      <span style={{ fontSize: "14px", fontWeight: "bold", color: "var(--foreground)", whiteSpace: "nowrap" }}>
        Date:
      </span>
      <button
        onClick={() => setSortBy("date-asc")}
        style={{
          padding: "6px 14px",
          borderRadius: "9999px",
          border: "none",
          backgroundColor: sortBy === "date-asc" ? "#1D9BF0" : "var(--border)",
          color: sortBy === "date-asc" ? "#ffffff" : "var(--foreground)",
          cursor: "pointer",
          fontSize: "14px",
          whiteSpace: "nowrap",
        }}
      >
        Oldest
      </button>
      <button
        onClick={() => setSortBy("date-desc")}
        style={{
          padding: "6px 14px",
          borderRadius: "9999px",
          border: "none",
          backgroundColor: sortBy === "date-desc" ? "#1D9BF0" : "var(--border)",
          color: sortBy === "date-desc" ? "#ffffff" : "var(--foreground)",
          cursor: "pointer",
          fontSize: "14px",
          whiteSpace: "nowrap",
        }}
      >
        Newest
      </button>
    </div>
  );

  const sorted = [...embeds].sort((a, b) => {
    if (sortBy === "date-desc") return b.year - a.year;
    if (sortBy === "date-asc") return a.year - b.year;
    return 0;
  });

  const skeletonCard = (key: number) => (
    <div key={key} style={{ width: "100%", maxWidth: "min(90vw, 680px)", margin: "0 auto 24px", padding: "16px", border: "1px solid var(--border)", backgroundColor: "var(--background)" }}>
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

  return (
    <>
      <style>{`
        .twitter-tweet { margin: 0 auto !important; width: 100% !important; }
      `}</style>

      {/* Full screen fixed overlay — shows skeleton, hides everything beneath */}
      {!showContent && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "var(--background)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "80px 24px 40px",
        }}>
          <div style={{ width: "100%", maxWidth: "min(90vw, 680px)", marginBottom: "16px" }}>
            <h2 style={{ fontWeight: "bold", fontSize: "18px", color: "var(--foreground)" }}>
              On This Day — {MOCK_DATE}
            </h2>
          </div>
          {[0, 1, 2].map((k) => skeletonCard(k))}
        </div>
      )}

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
        {!isDesktop && (
          <div style={{ width: "100%", overflowX: "auto", paddingBottom: "12px", marginBottom: "16px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", whiteSpace: "nowrap" }}>
              <div style={{ flexShrink: 0, minWidth: "160px" }}>{viewSelect}</div>
              {dateSort}
            </div>
          </div>
        )}

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", minWidth: 0 }}>
          <div style={{ width: "100%", maxWidth: "min(90vw, 680px)", margin: "0 auto 16px" }}>
            <h2 style={{ fontWeight: "bold", fontSize: "18px", color: "var(--foreground)" }}>
              On This Day — {MOCK_DATE}
            </h2>
          </div>

          <div style={{ width: "100%" }}>
            {/* Only render tweet HTML after showContent is true */}
            {showContent && sorted.map((t) => (
              <div
                key={t.url}
                style={{ width: "100%", maxWidth: "min(90vw, 680px)", margin: "0 auto 24px", display: "flex", flexDirection: "column", alignItems: "stretch" }}
              >
                <div style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "4px" }}>{t.year}</div>
                <div style={{ width: "100%" }} dangerouslySetInnerHTML={{ __html: t.html }} />
              </div>
            ))}
          </div>
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
                {dateSort}
              </div>
            </div>
          </aside>
        )}
      </main>
    </>
  );
}