// ─── AlertsView.jsx ───────────────────────────────────────────────────────────
import React                       from "react";
import AlertItem                   from "./AlertItem";
import OutdoorRing                 from "../Hero/OutdoorRing";
import { buildAlerts }             from "../../engine/decisionEngine";
import { computeOutdoorScore }     from "../../engine/scoringEngine";
import { AQI_LABELS }              from "../../utils/constants";
import { windDirection }           from "../../utils/formatters";

export default function AlertsView({ weather }) {
  const alerts  = buildAlerts(weather);
  const c       = weather.current;
  const { score, ring, label } = computeOutdoorScore(c);

  const params = [
    { label: "Temperature",   value: `${c.temp}°C / Feels ${c.feelsLike}°C`, status: c.temp > 37 ? "high" : c.temp > 30 ? "moderate" : "low",      pct: Math.min(100, (c.temp / 45) * 100) },
    { label: "UV Index",      value: `${c.uvIndex} / 11`,                    status: c.uvIndex > 8 ? "high" : c.uvIndex > 5 ? "moderate" : "low",     pct: (c.uvIndex / 11) * 100 },
    { label: "Air Quality",   value: AQI_LABELS[c.aqi] || "Good",            status: c.aqi >= 4 ? "high" : c.aqi >= 3 ? "moderate" : "low",           pct: ((c.aqi - 1) / 4) * 100 },
    { label: "Humidity",      value: `${c.humidity}%`,                        status: c.humidity > 75 ? "high" : c.humidity > 60 ? "moderate" : "low", pct: c.humidity },
    { label: "Wind Speed",    value: `${c.windSpeed} km/h ${windDirection(c.windDeg)}`, status: c.windSpeed > 40 ? "high" : c.windSpeed > 20 ? "moderate" : "low", pct: Math.min(100, (c.windSpeed / 60) * 100) },
    { label: "Visibility",    value: `${Math.round(c.visibility / 100) / 10} km`, status: c.visibility < 2000 ? "high" : c.visibility < 5000 ? "moderate" : "low", pct: Math.min(100, (c.visibility / 10000) * 100) },
  ];

  const statusColor = { high: "#ff6b6b", moderate: "#ffd166", low: "#6bffb8" };

  return (
    <div>
      {/* Active alerts */}
      <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "0.75rem" }}>
        Active Alerts
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1.5rem" }}>
        {alerts.map((a, i) => <AlertItem key={i} alert={a} />)}
      </div>

      {/* Outdoor index */}
      <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "0.75rem" }}>
        Outdoor Comfort Index
      </div>
      <div
        className="glass"
        style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", marginBottom: "1.25rem" }}
      >
        <OutdoorRing score={score} size={64} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Overall Score</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: ring }}>{score}/100 — {label}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 3 }}>
            Composite of temperature, UV, humidity, air quality, and wind
          </div>
        </div>
      </div>

      {/* Parameter breakdown */}
      <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "0.75rem" }}>
        Parameter Breakdown
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
        {params.map(p => (
          <div key={p.label} className="glass" style={{ padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
              {p.label}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>
              {p.value}
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 2,
                background: statusColor[p.status],
                width: `${p.pct}%`,
                transition: "width 1s ease",
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
