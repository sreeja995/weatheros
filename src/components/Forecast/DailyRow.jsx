// ─── DailyRow.jsx ────────────────────────────────────────────────────────────
import React from "react";

export default function DailyRow({ day, isToday }) {
  const rainColor = day.pop > 70 ? "#ff6b6b" : day.pop > 40 ? "#ffd166" : "#7c9dff";

  return (
    <div
      className="card-hover"
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 14px", borderRadius: 10,
        background: isToday ? "rgba(124,157,255,0.06)" : "rgba(255,255,255,0.06)",
        border: isToday ? "1px solid rgba(124,157,255,0.3)" : "1px solid var(--glass-border)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Day */}
      <span style={{
        fontSize: 13, fontWeight: isToday ? 700 : 600,
        minWidth: 44, color: isToday ? "var(--accent-blue)" : "var(--text-primary)",
      }}>
        {day.day}
      </span>

      {/* Icon */}
      <span style={{ fontSize: 18, minWidth: 24, textAlign: "center" }}>{day.icon}</span>

      {/* Summary */}
      <span style={{ fontSize: 12.5, color: "var(--text-secondary)", flex: 1 }}>
        {day.summary}
        {day.pop > 0 && (
          <span style={{ color: rainColor, fontWeight: 600 }}> · 💧{day.pop}%</span>
        )}
      </span>

      {/* UV badge */}
      {day.uvIndex > 0 && (
        <span style={{
          fontSize: 10, padding: "2px 7px", borderRadius: 8,
          background: day.uvIndex >= 8 ? "rgba(255,107,107,0.15)" : "rgba(255,209,102,0.15)",
          color: day.uvIndex >= 8 ? "#ff6b6b" : "#ffd166",
          fontWeight: 700, whiteSpace: "nowrap",
        }}>
          UV {day.uvIndex}
        </span>
      )}

      {/* Temps */}
      <span style={{
        fontSize: 13, display: "flex", gap: 4, minWidth: 64,
        justifyContent: "flex-end",
      }}>
        <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{day.hi}°</span>
        <span style={{ color: "var(--text-muted)" }}>/{day.lo}°</span>
      </span>
    </div>
  );
}
