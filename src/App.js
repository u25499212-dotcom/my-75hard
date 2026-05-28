import { useState, useEffect } from "react";

const TOTAL_DAYS = 75;
const START_DATE = new Date("2026-05-29");

function getDayDate(dayIndex) {
  const d = new Date(START_DATE);
  d.setDate(d.getDate() + dayIndex);
  return d;
}

function formatDate(d) {
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

const defaultDay = () => ({ walk: false, pilates: false, water: false, diet: false, reading: false, photo: false,foodjournal:false, journal:false});

export default function App() {
  const [days, setDays] = useState(() => {
    try {
      const saved = localStorage.getItem("75hard_days");
      return saved ? JSON.parse(saved) : Array.from({ length: TOTAL_DAYS }, defaultDay);
    } catch {
      return Array.from({ length: TOTAL_DAYS }, defaultDay);
    }
  });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    try { localStorage.setItem("75hard_days", JSON.stringify(days)); } catch {}
  }, [days]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function getStatus(i) {
    const dayDate = getDayDate(i);
    dayDate.setHours(0, 0, 0, 0);
    const d = days[i];
    const allDone = Object.values(d).every(Boolean);
    if (dayDate > today) return "future";
    if (allDone) return "complete";
    if (dayDate < today) return "missed";
    return "today";
  }

  function toggleTask(dayIdx, task) {
    setDays(prev => {
      const next = prev.map((d, i) => i === dayIdx ? { ...d, [task]: !d[task] } : d);
      return next;
    });
  }

  const completedDays = days.filter((_, i) => getStatus(i) === "complete").length;
  const currentStreak = (() => {
    let streak = 0;
    for (let i = 0; i < TOTAL_DAYS; i++) {
      if (getStatus(i) === "complete") streak++;
      else if (getStatus(i) === "missed") streak = 0;
      else break;
    }
    return streak;
  })();

  const tasks = [
    { key: "walk", icon: "🚶", label: "Walk 45min" },
    { key: "pilates", icon: "🧘", label: "Pilates 45min" },
    { key: "water", icon: "💧", label: "1 Gallon Water" },
    { key: "diet", icon: "🥩", label: "High Protein Diet" },
    { key: "reading", icon: "📖", label: "10 Pages Read" },
    { key: "photo", icon: "📸", label: "Progress Photo" },
     { key: "Foodjournal", icon: "🍽", label: "List of food eaten" },
       { key: "Journal", icon: "📓", label: "Recap of day" },

  ];

  const selStatus = selected !== null ? getStatus(selected) : null;

  return (
    <div style={{
minHeight: "100vh",
background: "#111",
color: "#ffffff",
fontFamily: "'Georgia', 'Times New Roman', serif",
padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
        borderBottom: "1px solid #2a2a2a",
        padding: "32px 24px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(255,140,0,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ fontSize: 11, letterSpacing: "0.3em", color: "#ff8c00", marginBottom: 8, textTransform: "uppercase" }}>
          THE CHALLENGE
        </div>
        <h1 style={{
          fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
          fontWeight: 400,
          margin: "0 0 4px",
          letterSpacing: "-0.02em",
          color: "#f0ede6",
        }}>
          75 <span style={{ color: "#ff8c00", fontStyle: "italic" }}>Hard</span>
        </h1>
        <div style={{ fontSize: 12, color: "#555", letterSpacing: "0.15em", marginBottom: 28, textTransform: "uppercase" }}>
          May 29 — Aug 11, 2026
        </div>

        {/* Stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
          {[
            { value: completedDays, label: "Days Done" },
            { value: currentStreak, label: "Streak" },
            { value: TOTAL_DAYS - completedDays, label: "Remaining" },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 400, color: "#ff8c00", lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 24, maxWidth: 400, margin: "24px auto 0" }}>
          <div style={{ height: 3, background: "#1e1e1e", borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${(completedDays / TOTAL_DAYS) * 100}%`,
              background: "linear-gradient(90deg, #ff8c00, #ffb347)",
              borderRadius: 2,
              transition: "width 0.5s ease",
            }} />
          </div>
          <div style={{ fontSize: 11, color: "#444", marginTop: 6, textAlign: "right", letterSpacing: "0.1em" }}>
            {Math.round((completedDays / TOTAL_DAYS) * 100)}% COMPLETE
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", padding: "16px 24px", flexWrap: "wrap" }}>
        {[
          { color: "#ff8c00", label: "Today" },
          { color: "#2d5a27", label: "Complete" },
          { color: "#3a1a1a", label: "Missed" },
          { color: "#1a1a1a", label: "Upcoming" },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color, border: "1px solid #333" }} />
            <span style={{ fontSize: 11, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(54px, 1fr))",
        gap: 6,
        padding: "8px 20px 32px",
        maxWidth: 600,
        margin: "0 auto",
      }}>
        {Array.from({ length: TOTAL_DAYS }, (_, i) => {
          const status = getStatus(i);
          const d = days[i];
          const progress = Object.values(d).filter(Boolean).length;
          const isSelected = selected === i;

          const bg = status === "complete" ? "#1a3318"
            : status === "today" ? "#1a1000"
            : status === "missed" ? "#1a0a0a"
            : "#111";

          const border = status === "complete" ? "#2d5a27"
            : status === "today" ? "#ff8c00"
            : status === "missed" ? "#3a1a1a"
            : "#1e1e1e";

          const numColor = status === "complete" ? "#4caf50"
            : status === "today" ? "#ff8c00"
            : status === "missed" ? "#5a2a2a"
            : "#333";

          return (
            <button
              key={i}
              onClick={() => setSelected(selected === i ? null : i)}
              style={{
                background: isSelected ? (status === "today" ? "#2a1800" : bg) : bg,
                border: `1px solid ${isSelected ? (status === "today" ? "#ff8c00" : border) : border}`,
                borderRadius: 6,
                padding: "10px 4px 8px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                transition: "all 0.15s ease",
                transform: isSelected ? "scale(1.08)" : "scale(1)",
                outline: "none",
                boxShadow: isSelected ? `0 0 12px ${status === "today" ? "rgba(255,140,0,0.3)" : "rgba(255,255,255,0.05)"}` : "none",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: numColor, lineHeight: 1 }}>
                {i + 1}
              </div>
              {status !== "future" && progress > 0 && (
                <div style={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center", maxWidth: 28 }}>
                  {Array.from({ length: 6 }, (_, t) => (
                    <div key={t} style={{
                      width: 4, height: 4, borderRadius: 1,
                      background: Object.values(d)[t] ? "#ff8c00" : "#222",
                    }} />
                  ))}
                </div>
              )}
              {status === "complete" && <div style={{ fontSize: 9 }}>✓</div>}
            </button>
          );
        })}
      </div>

      {/* Day Detail Panel */}
      {selected !== null && (
        <div style={{
          position: "fixed",
          bottom: 0, left: 0, right: 0,
          background: "#111",
          borderTop: "1px solid #2a2a2a",
          padding: "20px 24px 32px",
          maxHeight: "65vh",
          overflowY: "auto",
          zIndex: 100,
          boxShadow: "0 -20px 60px rgba(0,0,0,0.8)",
        }}>
          <div style={{ maxWidth: 500, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  {formatDate(getDayDate(selected))}
                </div>
                <div style={{ fontSize: "1.8rem", fontWeight: 400, color: "#f0ede6", lineHeight: 1.1, marginTop: 2 }}>
                  Day <span style={{ color: "#ff8c00" }}>{selected + 1}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{
                background: "none", border: "1px solid #2a2a2a", color: "#555",
                width: 36, height: 36, borderRadius: "50%", cursor: "pointer",
                fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
              }}>×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {tasks.map(({ key, icon, label }) => {
                const done = days[selected][key];
                const canToggle = selStatus === "today" || selStatus === "missed" || selStatus === "complete";
                return (
                  <button
                    key={key}
                    onClick={() => canToggle && toggleTask(selected, key)}
                    style={{
                      background: done ? "rgba(76,175,80,0.08)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${done ? "#2d5a27" : "#1e1e1e"}`,
                      borderRadius: 8,
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      cursor: canToggle ? "pointer" : "default",
                      transition: "all 0.15s",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    <div style={{
                      width: 22, height: 22, borderRadius: 4,
                      border: `1.5px solid ${done ? "#4caf50" : "#333"}`,
                      background: done ? "#4caf50" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, fontSize: 13, color: "#fff",
                      transition: "all 0.15s",
                    }}>
                      {done ? "✓" : ""}
                    </div>
                    <span style={{ fontSize: 14 }}>{icon}</span>
                    <span style={{ fontSize: 14, color: done ? "#ccc" : "#888", letterSpacing: "0.02em" }}>{label}</span>
                    {done && <span style={{ marginLeft: "auto", fontSize: 11, color: "#4caf50", letterSpacing: "0.1em" }}>DONE</span>}
                  </button>
                );
              })}
            </div>

            {selStatus === "future" && (
              <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#444", letterSpacing: "0.1em" }}>
                THIS DAY IS UPCOMING — KEEP GOING
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
