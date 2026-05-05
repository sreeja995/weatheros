// ─── AlertItem.jsx ────────────────────────────────────────────────────────────
import React from "react";

const TYPE_CONFIG = {
  danger:  { bg: "rgba(255,107,107,0.1)", border: "rgba(255,107,107,0.3)", text: "#ff6b6b" },
  warn:    { bg: "rgba(255,209,102,0.1)", border: "rgba(255,209,102,0.3)", text: "#ffd166" },
  info:    { bg: "rgba(124,157,255,0.1)", border: "rgba(124,157,255,0.3)", text: "#7c9dff" },
  success: { bg: "rgba(107,255,184,0.1)", border: "rgba(107,255,184,0.3)", text: "#6bffb8" },
};

export default function AlertItem({ alert }) {
  const { icon, title, desc, type } = alert;
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.info;

  return (
    <div
      style={{
        display: "flex", alignItems: "flex-start", gap: 12,
        padding: "12px 16px", borderRadius: 10,
        background: cfg.bg, border: `1px solid ${cfg.border}`,
      }}
    >
      <span style={{ fontSize: 18, minWidth: 24, textAlign: "center", marginTop: 1 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: cfg.text, marginBottom: 2 }}>
          {title}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
          {desc}
        </div>
      </div>
    </div>
  );
}
