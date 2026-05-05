// ─── MainTempCard.jsx ─────────────────────────────────────────────────────────
import React             from "react";
import { windDirection } from "../../utils/formatters";
import { AQI_LABELS }    from "../../utils/constants";

export default function MainTempCard({ weather }) {
  const { city, region, country, current: c } = weather;

  const stats = [
    { label: "Humidity",    value: `${c.humidity}%`             },
    { label: "Wind",        value: `${c.windSpeed} km/h ${windDirection(c.windDeg)}` },
    { label: "UV Index",    value: `${c.uvIndex}/11`            },
    { label: "Visibility",  value: `${Math.round(c.visibility / 100) / 10} km` },
    { label: "Pressure",    value: `${c.pressure} hPa`          },
    { label: "Air Quality", value: AQI_LABELS[c.aqi] || "Good"  },
  ];

  return (
    <div
      className="glass animate-slide-up"
      style={{ padding: "1.5rem", position: "relative", overflow: "hidden", height: "100%" }}
    >
      {/* Subtle gradient overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(135deg, rgba(124,157,255,0.1), rgba(0,212,170,0.06))",
      }} />

      {/* Location row */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent-green)", display: "inline-block" }} />
        <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
          {city}{region ? `, ${region}` : ""}{country ? `, ${country}` : ""}
        </span>
      </div>

      {/* Temperature */}
      <div
        className="gradient-text"
        style={{ fontSize: "clamp(56px,12vw,76px)", fontWeight: 800, lineHeight: 1, letterSpacing: -3 }}
      >
        {c.temp}°
      </div>

      <div style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>
        Feels like {c.feelsLike}° &nbsp;·&nbsp; {c.description}
      </div>

      {/* Condition badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "rgba(255,255,255,0.08)", borderRadius: 20,
        padding: "4px 12px", fontSize: 13, marginTop: 10,
      }}>
        <span style={{ fontSize: 16 }}>{c.icon}</span>
        {c.condition}
        &nbsp;·&nbsp; H:{c.tempMax}° &nbsp; L:{c.tempMin}°
      </div>

      {/* Stats grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        gap: 8, marginTop: 14,
      }}>
        {stats.map(s => (
          <div
            key={s.label}
            style={{
              background: "rgba(255,255,255,0.07)", borderRadius: 8,
              padding: "8px 10px",
            }}
          >
            <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {s.label}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginTop: 2 }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
