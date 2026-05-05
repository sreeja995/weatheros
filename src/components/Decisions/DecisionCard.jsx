// ─── DecisionCard.jsx ─────────────────────────────────────────────────────────
import React from "react";

const SEV_CONFIG = {
  high:     { bar: "var(--accent-red)",    badge: { bg: "rgba(255,107,107,0.15)", color: "#ff6b6b" } },
  moderate: { bar: "var(--accent-yellow)", badge: { bg: "rgba(255,209,102,0.15)", color: "#ffd166" } },
  low:      { bar: "var(--accent-green)",  badge: { bg: "rgba(107,255,184,0.15)", color: "#6bffb8" } },
  info:     { bar: "var(--accent-blue)",   badge: { bg: "rgba(124,157,255,0.15)", color: "#7c9dff" } },
};

export default function DecisionCard({ decision }) {
  const { icon, title, body, severity } = decision;
  const cfg = SEV_CONFIG[severity] || SEV_CONFIG.info;

  return (
    <div
      className="glass card-hover animate-fade-in"
      style={{
        padding: "1.1rem 1.1rem 1.1rem 1.3rem",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Left severity bar */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: 3, background: cfg.bar, borderRadius: "2px 0 0 2px",
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 22, lineHeight: 1 }}>{icon}</span>
        <span style={{
          fontSize: 10, fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "1px", padding: "3px 8px", borderRadius: 10,
          background: cfg.badge.bg, color: cfg.badge.color,
        }}>
          {severity}
        </span>
      </div>

      {/* Title */}
      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 5 }}>
        {title}
      </div>

      {/* Body */}
      <div style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.55 }}>
        {body}
      </div>
    </div>
  );
}
