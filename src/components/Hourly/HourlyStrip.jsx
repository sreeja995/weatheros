// ─── HourlyStrip.jsx ─────────────────────────────────────────────────────────
import React                            from "react";
import HourCard                         from "./HourCard";
import { findBestHour, findWorstHour }  from "../../engine/scoringEngine";

export default function HourlyStrip({ weather }) {
  const { hourly } = weather;
  const bestIdx  = findBestHour(hourly);
  const worstIdx = findWorstHour(hourly);

  const hourlyDecisions = hourly.map((h, i) => {
    if (i === bestIdx)  return { ...h, tag: "Best window to go out" };
    if (i === worstIdx) return { ...h, tag: "Avoid going out" };
    if (h.pop > 60)     return { ...h, tag: "Rain likely — stay in" };
    if (h.temp > 37)    return { ...h, tag: "Dangerous heat" };
    return h;
  });

  return (
    <div>
      {/* Scrollable strip */}
      <div className="no-scrollbar" style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
        {hourlyDecisions.map((h, i) => (
          <HourCard
            key={h.dt || i}
            hour={h}
            isBest={i === bestIdx}
            isWorst={i === worstIdx}
          />
        ))}
      </div>

      {/* Hour-by-hour decisions */}
      <div style={{ marginTop: "1rem" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "0.75rem" }}>
          Decision by hour
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {hourly.slice(0, 6).map((h, i) => {
            const isHigh = h.pop > 60 || h.temp > 38;
            const isWarn = h.pop > 30 || h.temp > 34 || h.uvIndex > 8;
            const type   = i === bestIdx ? "success" : isHigh ? "danger" : isWarn ? "warn" : "info";

            const colors = {
              danger:  { bg: "rgba(255,107,107,0.1)", border: "rgba(255,107,107,0.25)", text: "#ff6b6b" },
              warn:    { bg: "rgba(255,209,102,0.1)", border: "rgba(255,209,102,0.25)", text: "#ffd166" },
              success: { bg: "rgba(107,255,184,0.1)", border: "rgba(107,255,184,0.25)", text: "#6bffb8" },
              info:    { bg: "rgba(124,157,255,0.1)", border: "rgba(124,157,255,0.25)", text: "#7c9dff" },
            };
            const c = colors[type];

            const msg = i === bestIdx
              ? "Best window — conditions are optimal for outdoor activity"
              : h.pop > 60
              ? `${h.pop}% rain chance — carry umbrella or stay in`
              : h.temp > 37
              ? "Dangerous heat — limit outdoor activity strictly"
              : h.pop > 30
              ? `${h.pop}% rain chance — plan accordingly`
              : "Conditions acceptable for normal activity";

            return (
              <div
                key={h.dt || i}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px", borderRadius: 10,
                  background: c.bg, border: `1px solid ${c.border}`,
                }}
              >
                <span style={{ fontSize: 18, minWidth: 24, textAlign: "center" }}>{h.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{h.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{msg}</div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: 13, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                  {h.temp}° · {h.windSpeed} km/h
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
