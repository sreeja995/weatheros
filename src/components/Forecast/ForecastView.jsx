// ─── ForecastView.jsx ────────────────────────────────────────────────────────
import React   from "react";
import DailyRow from "./DailyRow";

export default function ForecastView({ weather }) {
  const { daily } = weather;

  // Smart week summary
  const rainDays  = daily.filter(d => d.pop > 50).length;
  const bestDay   = daily.find(d => d.pop < 15);
  const stormDay  = daily.find(d => d.conditionId >= 200 && d.conditionId < 300);

  return (
    <div>
      {/* Week summary bar */}
      <div
        className="glass"
        style={{
          padding: "0.9rem 1.1rem", marginBottom: "1rem",
          background: "rgba(124,157,255,0.06)", border: "1px solid rgba(124,157,255,0.2)",
        }}
      >
        <div style={{ fontSize: 11, color: "var(--accent-blue)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4, fontWeight: 700 }}>
          Week Summary
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
          {rainDays > 0 && <span>{rainDays} rainy day{rainDays > 1 ? "s" : ""} ahead. </span>}
          {bestDay  && <span style={{ color: "var(--accent-green)" }}>Best day: <strong>{bestDay.day}</strong> — clear, {bestDay.hi}°C. </span>}
          {stormDay && <span style={{ color: "var(--accent-red)" }}>Storm risk on <strong>{stormDay.day}</strong> — reschedule outdoor plans. </span>}
          {!rainDays && !stormDay && <span style={{ color: "var(--accent-green)" }}>Dry week ahead — great conditions for outdoor activities.</span>}
        </div>
      </div>

      {/* Daily rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {daily.map((d, i) => (
          <DailyRow key={d.dt || i} day={d} isToday={i === 0} />
        ))}
      </div>
    </div>
  );
}
