// ─── LoadingState.jsx ─────────────────────────────────────────────────────────
import React from "react";

export default function LoadingState({ city }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 animate-fade-in">
      {/* Spinner */}
      <div
        style={{
          width: 52, height: 52,
          border: "3px solid rgba(255,255,255,0.1)",
          borderTopColor: "var(--accent-blue)",
          borderRadius: "50%",
        }}
        className="animate-spin"
      />

      {/* Logo */}
      <div className="text-center">
        <div className="text-2xl font-bold gradient-text">WeatherOS</div>
        <div style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
          Analyzing conditions for <span style={{ color: "var(--accent-blue)", fontWeight: 600 }}>{city}</span>...
        </div>
      </div>

      {/* Animated dots */}
      <div className="flex gap-2" style={{ marginTop: 8 }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: 7, height: 7,
              borderRadius: "50%",
              background: "var(--accent-blue)",
              animation: `pulseDot 1.4s ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
