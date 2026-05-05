// ─── ModeSelector.jsx ─────────────────────────────────────────────────────────
import React from "react";
import { MODES }              from "../../utils/constants";
import { useWeatherContext }  from "../../context/WeatherContext";

export default function ModeSelector() {
  const { mode, setMode } = useWeatherContext();

  return (
    <div className="flex flex-wrap gap-2">
      {MODES.map(m => {
        const isActive = mode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            style={{
              padding: "7px 16px",
              borderRadius: 30,
              border: isActive ? "1px solid var(--accent-blue)" : "1px solid var(--glass-border)",
              background: isActive ? "var(--accent-blue)" : "var(--glass-bg)",
              color: isActive ? "#fff" : "var(--text-secondary)",
              fontSize: 13,
              fontWeight: isActive ? 700 : 400,
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              transition: "all 0.2s ease",
              display: "flex", alignItems: "center", gap: 5,
            }}
          >
            <span style={{ fontSize: 14 }}>{m.icon}</span>
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
