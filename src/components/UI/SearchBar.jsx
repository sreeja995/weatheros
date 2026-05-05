// ─── SearchBar.jsx ────────────────────────────────────────────────────────────
import React, { useState, useRef } from "react";
import { useWeatherContext }        from "../../context/WeatherContext";
import { useGeolocation }           from "../../hooks/useGeolocation";
import { IS_DEMO }                  from "../../services/weatherService";

export default function SearchBar() {
  const { loadWeather, city, loading } = useWeatherContext();
  const [input,    setInput]    = useState("");
  const [focused,  setFocused]  = useState(false);
  const inputRef = useRef(null);

  const handleSearch = () => {
    const q = input.trim();
    if (!q) return;
    loadWeather(q);
    setInput("");
    inputRef.current?.blur();
  };

  const { getLocation, locating, geoError } = useGeolocation((detectedCity) => {
    loadWeather(detectedCity);
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search input */}
        <div
          className="flex items-center gap-2 flex-1"
          style={{
            minWidth: 220,
            background: "var(--glass-bg)",
            border: `1px solid ${focused ? "rgba(124,157,255,0.5)" : "var(--glass-border)"}`,
            borderRadius: 30,
            padding: "8px 16px",
            backdropFilter: "blur(12px)",
            transition: "border-color 0.2s",
          }}
        >
          <span style={{ color: "var(--text-muted)", fontSize: 15 }}>📍</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={`Search city… (${city})`}
            style={{
              background: "none", border: "none", outline: "none",
              color: "var(--text-primary)", fontSize: 14, width: "100%",
            }}
          />
          {input && (
            <button
              onClick={() => setInput("")}
              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 16, lineHeight: 1 }}
            >×</button>
          )}
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          disabled={loading || !input.trim()}
          style={{
            background: input.trim() ? "var(--accent-blue)" : "rgba(124,157,255,0.3)",
            border: "none", borderRadius: 30, padding: "9px 18px",
            color: "#fff", fontSize: 13, fontWeight: 700,
            cursor: input.trim() ? "pointer" : "default",
            transition: "all 0.2s", whiteSpace: "nowrap",
          }}
        >
          {loading ? "Loading…" : "Search"}
        </button>

        {/* Geolocation button */}
        {!IS_DEMO && (
          <button
            onClick={getLocation}
            disabled={locating}
            title="Use my location"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              borderRadius: 30, padding: "8px 14px",
              color: "var(--text-secondary)", fontSize: 13,
              cursor: "pointer", whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}
          >
            {locating ? "📡 Locating…" : "📡 My location"}
          </button>
        )}

        {/* Refresh */}
        <button
          onClick={() => loadWeather(city)}
          disabled={loading}
          title="Refresh weather"
          style={{
            background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
            borderRadius: 30, padding: "8px 12px",
            color: "var(--text-secondary)", fontSize: 14,
            cursor: "pointer", transition: "all 0.2s",
          }}
        >
          ↺
        </button>
      </div>

      {/* Geo error */}
      {geoError && (
        <div style={{ fontSize: 12, color: "var(--accent-red)", paddingLeft: 12 }}>
          ⚠ {geoError}
        </div>
      )}
    </div>
  );
}
