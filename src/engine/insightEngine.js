// ─── insightEngine.js ─────────────────────────────────────────────────────────
// Generates a concise, human-readable verdict sentence tailored to the
// current conditions and selected lifestyle mode.

import { computeOutdoorScore } from "./scoringEngine";
import { AQI_LABELS }          from "../utils/constants";

/**
 * Returns a 1–3 sentence natural language verdict.
 */
export function buildSmartInsight(weather, mode = "general") {
  const { current: c, hourly = [], daily = [] } = weather;
  const { score, label } = computeOutdoorScore(c);
  const nextRainHour = hourly.findIndex(h => h.pop > 50);
  const rainNote = nextRainHour !== -1
    ? `Rain expected in ~${nextRainHour === 0 ? "under an hour" : `${nextRainHour}h`} — pack an umbrella.`
    : "";

  // ── Mode-specific ──────────────────────────────────────────────────────────
  if (mode === "fitness") {
    if (c.temp > 37)
      return `Outdoor training is not advisable today — ${c.temp}°C with UV ${c.uvIndex} creates high heat stress. ${rainNote} Stick to indoor workouts until the evening cool-down after 7 PM.`;
    if (c.temp <= 28 && c.aqi <= 2 && c.uvIndex < 7)
      return `Excellent conditions for training! ${c.temp}°C, clean air (AQI: ${AQI_LABELS[c.aqi] || "Good"}), and manageable UV. Morning runs before 9 AM are ideal. ${rainNote}`;
    return `Manageable training conditions. Best outdoor window: ${c.temp > 32 ? "after 6 PM" : "morning 6–9 AM or evening 6–8 PM"}. ${rainNote} Outdoor score: ${score}/100 (${label}).`;
  }

  if (mode === "student") {
    const commute = nextRainHour !== -1 && nextRainHour <= 4
      ? "Carry an umbrella — rain is expected during likely commute hours."
      : "No rain expected for your commute.";
    if (c.temp > 36)
      return `Very hot today (${c.temp}°C). ${commute} Prioritise AC indoor spaces for studying — heat impairs focus. Library or campus commons recommended.`;
    return `${commute} Outdoor conditions are ${score >= 60 ? "manageable" : "uncomfortable"} (score ${score}/100). ${c.aqi >= 3 ? `Air quality is ${AQI_LABELS[c.aqi]} — keep commute brief.` : "Air quality is fine."}`;
  }

  if (mode === "traveler") {
    const bestDay  = daily.find(d => d.pop < 15 && d.hi < 38);
    const intro    = `This week's best travel window is ${bestDay ? bestDay.day : "later in the week"}.`;
    if (c.temp > 37 || c.uvIndex >= 10)
      return `${intro} Today is tough for touring — ${c.temp}°C with UV ${c.uvIndex}. Start early (before 10 AM) and retreat indoors by noon. ${rainNote}`;
    return `${intro} Today's outdoor score is ${score}/100 (${label}). ${rainNote} Pack sunscreen and light layers — conditions can shift in the afternoon.`;
  }

  if (mode === "wfh") {
    const powerRisk = c.windSpeed > 40 || (c.conditionId >= 200 && c.conditionId < 300);
    if (powerRisk)
      return `WFH risk today: high wind or storm conditions may cause power disruptions. Back up work now, charge devices, and have a hotspot ready as backup.`;
    if (c.temp > 35)
      return `Hot day ahead (${c.temp}°C). Keep curtains drawn in the afternoon to reduce heat load and AC costs. Air quality is ${AQI_LABELS[c.aqi] || "good"} — keep windows closed until evening.`;
    return `Comfortable WFH day. ${c.temp < 28 && c.aqi <= 2 ? "You can open windows for fresh air — outdoor conditions are pleasant." : "Standard indoor setup works well."} No weather disruptions expected.`;
  }

  // ── General ────────────────────────────────────────────────────────────────
  if (score >= 75)
    return `Great day outdoors! Conditions score ${score}/100 (${label}). ${c.uvIndex >= 6 ? `UV is ${c.uvIndex} — apply sunscreen.` : ""} ${rainNote}`.trim();
  if (score >= 50)
    return `Use caution outdoors today — score ${score}/100 (${label}). ${c.temp > 33 ? `Heat (${c.temp}°C) and UV ${c.uvIndex} are the main risks.` : ""} ${rainNote}`.trim();
  return `Limit outdoor exposure — conditions are ${label.toLowerCase()} (score ${score}/100). ${c.temp > 37 ? "Extreme heat advisory in effect." : "Multiple risk factors are elevated."} ${rainNote}`.trim();
}

/**
 * Returns a short one-line verdict for the hero card.
 */
export function getVerdict(score) {
  if (score >= 80) return "Great to go outside";
  if (score >= 65) return "Good with precautions";
  if (score >= 50) return "Proceed with caution";
  if (score >= 30) return "Limit outdoor time";
  return "Stay indoors today";
}
