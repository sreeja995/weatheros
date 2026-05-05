// ─── OutdoorRing.jsx ─────────────────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import { getScoreMeta }               from "../../engine/scoringEngine";

export default function OutdoorRing({ score, size = 60 }) {
  const [animated, setAnimated] = useState(0);
  const meta = getScoreMeta(score);

  useEffect(() => {
    // Animate from 0 to score on mount/change
    const t = setTimeout(() => setAnimated(score), 80);
    return () => clearTimeout(t);
  }, [score]);

  const r    = (size / 2) - 6;
  const cx   = size / 2;
  const circ = 2 * Math.PI * r;
  const fill = (animated / 100) * circ;

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="4"
        />
        {/* Fill */}
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke={meta.ring}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${fill} ${circ}`}
          style={{
            transform: `rotate(-90deg)`,
            transformOrigin: `${cx}px ${cx}px`,
            transition: "stroke-dasharray 1.2s ease",
          }}
        />
      </svg>
      {/* Score number */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size < 50 ? 11 : 14,
        fontWeight: 700,
        color: meta.ring,
      }}>
        {score}
      </div>
    </div>
  );
}
