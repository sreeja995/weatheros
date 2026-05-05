// ─── formatters.js ────────────────────────────────────────────────────────────

/**
 * Format a Unix timestamp into a short time string e.g. "3 PM"
 */
export function formatHour(unixTs, timezone = 0) {
  const date = new Date((unixTs + timezone) * 1000);
  const h = date.getUTCHours();
  if (h === 0)  return "12 AM";
  if (h === 12) return "12 PM";
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
}

/**
 * Format a Unix timestamp into a day name e.g. "Mon"
 */
export function formatDay(unixTs, timezone = 0) {
  const date = new Date((unixTs + timezone) * 1000);
  return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][date.getUTCDay()];
}

/**
 * Round a number to given decimal places
 */
export function round(n, decimals = 0) {
  const factor = Math.pow(10, decimals);
  return Math.round(n * factor) / factor;
}

/**
 * Clamp a number between min and max
 */
export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Return a wind direction label from degrees
 */
export function windDirection(deg) {
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  return dirs[Math.round(deg / 45) % 8];
}

/**
 * Map OWM weather condition code → emoji icon
 */
export function conditionIcon(id, isDay = true) {
  if (id >= 200 && id < 300) return "⛈️";
  if (id >= 300 && id < 400) return "🌦️";
  if (id >= 500 && id < 510) return "🌧️";
  if (id === 511)             return "🌨️";
  if (id >= 511 && id < 600) return "🌧️";
  if (id >= 600 && id < 700) return "❄️";
  if (id >= 700 && id < 800) return "🌫️";
  if (id === 800)             return isDay ? "☀️" : "🌙";
  if (id === 801)             return "🌤️";
  if (id === 802)             return "⛅";
  if (id >= 803)              return "☁️";
  return "🌡️";
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
