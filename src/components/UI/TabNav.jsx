// ─── TabNav.jsx ───────────────────────────────────────────────────────────────
import React from "react";
import { TABS }              from "../../utils/constants";
import { useWeatherContext } from "../../context/WeatherContext";

export default function TabNav() {
  const { activeTab, setActiveTab } = useWeatherContext();

  return (
    <div
      style={{
        display: "flex", gap: 4,
        background: "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
        borderRadius: 30, padding: 4,
        width: "fit-content",
        backdropFilter: "blur(10px)",
      }}
    >
      {TABS.map(t => {
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "7px 18px",
              borderRadius: 24,
              border: "none",
              background: isActive ? "rgba(124,157,255,0.22)" : "none",
              color: isActive ? "var(--accent-blue)" : "var(--text-secondary)",
              fontSize: 13,
              fontWeight: isActive ? 700 : 400,
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "inherit",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
