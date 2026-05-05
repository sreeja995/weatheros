// ─── HourCard.jsx ─────────────────────────────────────────────────────────────
import React            from "react";
import { getScoreMeta } from "../../engine/scoringEngine";

export default function HourCard({ hour, isBest, isWorst }) {
  const score = Math.max(0, 100
    - (hour.temp > 38 ? 30 : hour.temp > 34 ? 18 : hour.temp > 30 ? 10 : 0)
    - (hour.uvIndex > 8 ? 20 : hour.uvIndex > 5 ? 10 : 0)
    - (hour.pop > 70 ? 20 : hour.pop > 40 ? 10 : 0)
  );
  const meta = getScoreMeta(score);

  const highlight = isBest
    ? { border: "1px solid rgba(107,255,184,0.45)", background: "rgba(107,255,184,0.07)" }
    : isWorst
    ? { border: "1px solid rgba(255,107,107,0.35)", background: "rgba(255,107,107,0.05)" }
    : {};

  return (
    <div
      className="glass card-hover"
      style={{
        minWidth: 72, padding: "12px 8px", textAlign: "center",
        flexShrink: 0, ...highlight,
      }}
    >
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 5 }}>
        {hour.label}
      </div>
      <div style={{ fontSize: 20, marginBottom: 4 }}>{hour.icon}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>
        {hour.temp}°
      </div>
      {hour.pop > 0 && (
        <div style={{ fontSize: 10, color: "var(--accent-blue)", marginBottom: 2 }}>
          💧{hour.pop}%
        </div>
      )}
      <div style={{ fontSize: 9, fontWeight: 700, color: meta.ring, marginTop: 2 }}>
        {isBest ? "★ Best" : isWorst ? "✗ Worst" : meta.label}
      </div>
    </div>
  );
}
