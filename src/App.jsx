/* eslint-disable */
// ─── App.jsx ─────────────────────────────────────────────────────────────────
import React, { useEffect } from "react";
import { WeatherProvider, useWeatherContext } from "./context/WeatherContext";

import LoadingState   from "./components/UI/LoadingState";
import SearchBar      from "./components/UI/SearchBar";
import ModeSelector   from "./components/UI/ModeSelector";
import TabNav         from "./components/UI/TabNav";

import MainTempCard   from "./components/Hero/MainTempCard";
import VerdictCard    from "./components/Hero/VerdictCard";

import DecisionsGrid  from "./components/Decisions/DecisionsGrid";
import HourlyStrip    from "./components/Hourly/HourlyStrip";
import ForecastView   from "./components/Forecast/ForecastView";
import AlertsView     from "./components/Alerts/AlertsView";

import { DEFAULT_CITY } from "./utils/constants";
import { IS_DEMO }      from "./services/weatherService";

// ─── Inner app (has access to context) ───────────────────────────────────────
function WeatherApp() {
  const { weather, loading, error, city, activeTab, loadWeather } = useWeatherContext();

  // Bootstrap on first load
  useEffect(() => {
    loadWeather(DEFAULT_CITY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) return <LoadingState city={city} />;

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "2rem" }}>
      <div
        className="glass animate-fade-in"
        style={{ padding: "2rem", maxWidth: 420, width: "100%", textAlign: "center" }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
          Could not load weather
        </div>
        <div style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20, lineHeight: 1.6 }}>
          {error}
        </div>
        <SearchBar />
        <button
          onClick={() => loadWeather(city)}
          style={{
            marginTop: 12, background: "var(--accent-blue)", border: "none",
            borderRadius: 30, padding: "10px 24px", color: "#fff",
            fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );

  if (!weather) return null;

  // ── Main UI ──────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 940, margin: "0 auto", padding: "1.5rem 1rem 3rem" }} className="content-layer">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg,#7c9dff,#00d4aa)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>⚡</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5 }} className="gradient-text">WeatherOS</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase" }}>Decision Engine</div>
          </div>
        </div>
        {/* Search */}
        <div style={{ flex: 1, maxWidth: 520 }}>
          <SearchBar />
        </div>
      </header>

      {/* ── Demo banner ────────────────────────────────────────────── */}
      {IS_DEMO && (
        <div style={{
          background: "rgba(255,209,102,0.1)", border: "1px solid rgba(255,209,102,0.3)",
          borderRadius: 10, padding: "9px 14px", fontSize: 12,
          color: "var(--accent-yellow)", marginBottom: "1rem",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span>⚡</span>
          <span>
            <strong>Demo mode</strong> — using simulated data for <em>{weather.city}</em>.
            Add <code>REACT_APP_OWM_KEY=your_key</code> in <code>.env</code> to get live data.
          </span>
        </div>
      )}

      {/* ── Hero grid ──────────────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1rem", marginBottom: "1.25rem",
      }}>
        <MainTempCard weather={weather} />
        <VerdictCard  weather={weather} />
      </div>

      {/* ── Lifestyle Mode ─────────────────────────────────────────── */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "0.6rem" }}>
          Lifestyle Mode
        </div>
        <ModeSelector />
      </div>

      {/* ── Tab Nav ────────────────────────────────────────────────── */}
      <div style={{ marginBottom: "1rem" }}>
        <TabNav />
      </div>

      {/* ── Tab Content ────────────────────────────────────────────── */}
      <div className="animate-fade-in" key={activeTab}>
        {activeTab === "decisions" && <DecisionsGrid weather={weather} />}
        {activeTab === "hourly"    && <HourlyStrip   weather={weather} />}
        {activeTab === "forecast"  && <ForecastView  weather={weather} />}
        {activeTab === "alerts"    && <AlertsView    weather={weather} />}
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer style={{ textAlign: "center", marginTop: "2.5rem", color: "var(--text-muted)", fontSize: 11 }}>
        WeatherOS · Decision Engine v1.0 &nbsp;·&nbsp;
        Updated {new Date(weather.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} &nbsp;·&nbsp;
        Data refreshes every 30 min
      </footer>
    </div>
  );
}

// ─── Root with background orbs ───────────────────────────────────────────────
export default function App() {
  return (
    <WeatherProvider>
      <div className="app-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <WeatherApp />
      </div>
    </WeatherProvider>
  );
}
