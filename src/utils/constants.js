// ─── API ─────────────────────────────────────────────────────────────────────
export const OWM_BASE      = "https://api.openweathermap.org";
export const OWM_GEO_URL   = `${OWM_BASE}/geo/1.0/direct`;
export const OWM_CURRENT   = `${OWM_BASE}/data/2.5/weather`;  // fallback, free tier
export const OWM_FORECAST  = `${OWM_BASE}/data/2.5/forecast`; // fallback, free tier

export const API_KEY = process.env.REACT_APP_OWM_KEY || "";

// ─── Lifestyle Modes ─────────────────────────────────────────────────────────
export const MODES = [
  { id: "general",  icon: "🌐", label: "General"        },
  { id: "student",  icon: "🎒", label: "Student"        },
  { id: "fitness",  icon: "🏃", label: "Fitness"        },
  { id: "traveler", icon: "✈️", label: "Traveler"       },
  { id: "wfh",      icon: "💻", label: "Work From Home" },
];

// ─── Tabs ─────────────────────────────────────────────────────────────────────
export const TABS = [
  { id: "decisions", label: "Decisions" },
  { id: "hourly",    label: "Hourly"    },
  { id: "forecast",  label: "Forecast"  },
  { id: "alerts",    label: "Alerts"    },
];

// ─── Scoring weights ──────────────────────────────────────────────────────────
export const SCORE_WEIGHTS = {
  temperature : 30,
  uvIndex     : 25,
  humidity    : 20,
  aqi         : 15,
  wind        : 10,
};

// ─── AQI labels ───────────────────────────────────────────────────────────────
export const AQI_LABELS = ["", "Good", "Fair", "Moderate", "Poor", "Very Poor"];

// ─── Default city ─────────────────────────────────────────────────────────────
export const DEFAULT_CITY = "Amaravati";
