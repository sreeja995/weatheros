// ─── DecisionsGrid.jsx ────────────────────────────────────────────────────────
import React                    from "react";
import DecisionCard             from "./DecisionCard";
import { buildDecisions }       from "../../engine/decisionEngine";
import { buildSmartInsight }    from "../../engine/insightEngine";
import { useWeatherContext }     from "../../context/WeatherContext";

export default function DecisionsGrid({ weather }) {
  const { mode } = useWeatherContext();
  const decisions = buildDecisions(weather, mode);
  const insight   = buildSmartInsight(weather, mode);

  return (
    <div>
      {/* Smart insight banner */}
      <div
        className="glass"
        style={{
          padding: "1rem 1.25rem",
          marginBottom: "1rem",
          background: "linear-gradient(135deg,rgba(124,157,255,0.12),rgba(0,212,170,0.07))",
          border: "1px solid rgba(124,157,255,0.25)",
          position: "relative",
        }}
      >
        <div style={{ fontSize: 10, color: "var(--accent-blue)", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700, marginBottom: 4 }}>
          Smart Insight · {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </div>
        <div style={{ fontSize: 13.5, color: "var(--text-primary)", lineHeight: 1.55 }}>
          {insight}
        </div>
        <div style={{
          position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
          fontSize: 10, fontWeight: 700, color: "var(--accent-blue)",
          background: "rgba(124,157,255,0.15)", padding: "3px 8px", borderRadius: 10,
          letterSpacing: 1,
        }}>
          AI
        </div>
      </div>

      {/* Decision cards grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "0.85rem",
      }}>
        {decisions.map(d => (
          <DecisionCard key={d.id} decision={d} />
        ))}
      </div>
    </div>
  );
}
