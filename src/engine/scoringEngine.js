// ─── scoringEngine.js ─────────────────────────────────────────────────────────
// Computes a 0–100 Outdoor Comfort Score from multiple weather parameters.
// Each parameter contributes a weighted penalty deducted from 100.

import { clamp } from "../utils/formatters";

/**
 * Score a temperature value (0–30 penalty).
 * Ideal range: 18–26°C. Deductions increase beyond that.
 */
function scoreTemperature(temp) {
  if (temp >= 18 && temp <= 26) return 0;
  if (temp > 26  && temp <= 30) return 5;
  if (temp > 30  && temp <= 34) return 12;
  if (temp > 34  && temp <= 38) return 20;
  if (temp > 38)                return 30;
  if (temp >= 10 && temp < 18)  return 5;
  if (temp >= 5  && temp < 10)  return 12;
  return 25; // below 5°C
}

/**
 * Score UV index (0–25 penalty).
 */
function scoreUV(uvi) {
  if (uvi <= 2)  return 0;
  if (uvi <= 5)  return 5;
  if (uvi <= 7)  return 10;
  if (uvi <= 10) return 18;
  return 25;
}

/**
 * Score humidity (0–20 penalty).
 * Ideal: 30–60%. High humidity + heat compounds discomfort.
 */
function scoreHumidity(humidity) {
  if (humidity >= 30 && humidity <= 60) return 0;
  if (humidity > 60  && humidity <= 70) return 5;
  if (humidity > 70  && humidity <= 80) return 10;
  if (humidity > 80)                    return 20;
  if (humidity < 30)                    return 5;
  return 0;
}

/**
 * Score AQI (OWM 1–5 scale, 0–15 penalty).
 */
function scoreAQI(aqi) {
  const map = { 1: 0, 2: 3, 3: 8, 4: 12, 5: 15 };
  return map[aqi] ?? 0;
}

/**
 * Score wind speed in km/h (0–10 penalty).
 */
function scoreWind(windKmh) {
  if (windKmh <= 20)  return 0;
  if (windKmh <= 35)  return 3;
  if (windKmh <= 50)  return 6;
  return 10;
}

/**
 * Main scorer — returns { score, breakdown, label, color }
 */
export function computeOutdoorScore(current) {
  const penalties = {
    temperature : scoreTemperature(current.temp),
    uvIndex     : scoreUV(current.uvIndex),
    humidity    : scoreHumidity(current.humidity),
    aqi         : scoreAQI(current.aqi),
    wind        : scoreWind(current.windSpeed),
  };

  const total = Object.values(penalties).reduce((a, b) => a + b, 0);
  const score = clamp(100 - total, 0, 100);

  return {
    score,
    breakdown: penalties,
    ...getScoreMeta(score),
  };
}

/**
 * Human-readable label + color for a given score
 */
export function getScoreMeta(score) {
  if (score >= 80) return { label: "Excellent",      color: "#6bffb8", ring: "#6bffb8", tier: "low"      };
  if (score >= 65) return { label: "Good",           color: "#a8ffda", ring: "#6bffb8", tier: "low"      };
  if (score >= 50) return { label: "Moderate",       color: "#ffd166", ring: "#ffd166", tier: "moderate" };
  if (score >= 35) return { label: "Uncomfortable",  color: "#ffb86c", ring: "#ffb86c", tier: "moderate" };
  if (score >= 20) return { label: "Poor",           color: "#ff8c6b", ring: "#ff6b6b", tier: "high"     };
  return                  { label: "Dangerous",      color: "#ff6b6b", ring: "#ff6b6b", tier: "high"     };
}

/**
 * Find the best hourly window (lowest effective discomfort)
 * Returns the index into the hourly array.
 */
export function findBestHour(hourly) {
  if (!hourly || hourly.length === 0) return 0;

  let bestIdx   = 0;
  let bestScore = -1;

  hourly.forEach((h, i) => {
    const s = computeOutdoorScore({
      temp      : h.temp,
      uvIndex   : h.uvIndex,
      humidity  : h.humidity,
      aqi       : 2,         // hourly AQI not always available
      windSpeed : h.windSpeed,
    });
    // Penalise very high rain probability
    const adjusted = s.score - (h.pop > 50 ? 20 : h.pop > 30 ? 10 : 0);
    if (adjusted > bestScore) {
      bestScore = adjusted;
      bestIdx   = i;
    }
  });

  return bestIdx;
}

/**
 * Find the worst hourly window
 */
export function findWorstHour(hourly) {
  if (!hourly || hourly.length === 0) return 0;

  let worstIdx   = 0;
  let worstScore = 999;

  hourly.forEach((h, i) => {
    const s = computeOutdoorScore({
      temp      : h.temp,
      uvIndex   : h.uvIndex,
      humidity  : h.humidity,
      aqi       : 2,
      windSpeed : h.windSpeed,
    });
    const adjusted = s.score - (h.pop > 50 ? 20 : 0);
    if (adjusted < worstScore) {
      worstScore = adjusted;
      worstIdx   = i;
    }
  });

  return worstIdx;
}
