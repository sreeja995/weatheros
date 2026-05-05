// ─── VerdictCard.jsx ─────────────────────────────────────────────────────────
import React                              from "react";
import OutdoorRing                        from "./OutdoorRing";
import { computeOutdoorScore }            from "../../engine/scoringEngine";
import { buildSmartInsight, getVerdict }  from "../../engine/insightEngine";
import { findBestHour, findWorstHour }    from "../../engine/scoringEngine";
import { useWeatherContext }              from "../../context/WeatherContext";

export default function VerdictCard({ weather }) {
  const { mode }  = useWeatherContext();
  const { score, ring, label } = computeOutdoorScore(weather.current);
  const verdict   = getVerdict(score);
  const insight   = buildSmartInsight(weather, mode);

  const bestIdx   = findBestHour(weather.hourly);
  const worstIdx  = findWorstHour(weather.hourly);
  const bestHour  = weather.hourly[bestIdx]?.label;
  const worstHour = weather.hourly[worstIdx]?.label;

  return (
    <div
      className="glass animate-slide-up"
      style={{ padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}
    >
      {/* Top */}
      <div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>
          Today's Verdict
        </div>
        <div style={{ fontSize: "clamp(18px,4vw,24px)", fontWeight: 700, color: ring, lineHeight: 1.25 }}>
          {verdict}
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8, lineHeight: 1.55 }}>
          {insight}
        </div>
      </div>

      {/* Score ring + bar */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18 }}>
          <OutdoorRing score={score} size={60} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 5 }}>Outdoor Comfort Score</div>
            <div style={{
              height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden",
            }}>
              <div style={{
                height: "100%", borderRadius: 3,
                background: ring,
                width: `${score}%`,
                transition: "width 1.2s ease",
              }} />
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{label} conditions</div>
          </div>
        </div>

        {/* Best / worst hours */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
          <div style={{
            background: "rgba(107,255,184,0.08)", border: "1px solid rgba(107,255,184,0.25)",
            borderRadius: 8, padding: "8px 10px",
          }}>
            <div style={{ fontSize: 10, color: "var(--accent-green)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Best time</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginTop: 2 }}>
              {bestHour || "—"}
            </div>
          </div>
          <div style={{
            background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)",
            borderRadius: 8, padding: "8px 10px",
          }}>
            <div style={{ fontSize: 10, color: "var(--accent-red)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Worst time</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginTop: 2 }}>
              {worstHour || "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
