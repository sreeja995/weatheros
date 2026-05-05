// ─── weatherService.js ────────────────────────────────────────────────────────
// Uses ONLY free OWM endpoints:
//   /data/2.5/weather     → current conditions
//   /data/2.5/forecast    → 5-day / 3-hour forecast (hourly + daily)
//   /data/2.5/air_pollution → AQI
//   /geo/1.0/direct       → city → lat/lon
// NO paid endpoints. NO /data/3.0/onecall.
import axios from "axios";
import { OWM_GEO_URL, OWM_CURRENT, OWM_FORECAST } from "../utils/constants";
import { MOCK_WEATHER } from "../utils/mockData";
import { conditionIcon, capitalize } from "../utils/formatters";

// ✅ FIRST define
const API_KEY = process.env.REACT_APP_OWM_KEY;

// ✅ THEN log
console.log("API KEY:", API_KEY);

// ✅ THEN use
export const IS_DEMO = !API_KEY;

// ─── Geocode: city name → { lat, lon, city, region, country } ────────────────
async function geocodeCity(city) {
  const url = `${OWM_GEO_URL}?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;
  const { data } = await axios.get(url, { timeout: 8000 });
  if (!data || data.length === 0) throw new Error(`City "${city}" not found. Please check the spelling.`);
  const { lat, lon, name, country, state } = data[0];
  return { lat, lon, city: name, region: state || "", country };
}

// ─── Current weather: /data/2.5/weather (FREE) ───────────────────────────────
async function fetchCurrent(lat, lon) {
  const url = `${OWM_CURRENT}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const { data } = await axios.get(url, { timeout: 8000 });
  return data;
}

// ─── 5-day / 3-hour forecast: /data/2.5/forecast (FREE) ─────────────────────
async function fetchForecast(lat, lon) {
  const url = `${OWM_FORECAST}?lat=${lat}&lon=${lon}&units=metric&cnt=40&appid=${API_KEY}`;
  const { data } = await axios.get(url, { timeout: 8000 });
  return data;
}

// ─── AQI: /data/2.5/air_pollution (FREE) ─────────────────────────────────────
async function fetchAQI(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const { data } = await axios.get(url, { timeout: 8000 });
    return data?.list?.[0]?.main?.aqi ?? 1;
  } catch {
    return 1; // graceful fallback
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatHourLabel(ts, tzOffset) {
  const d = new Date((ts + tzOffset) * 1000);
  const h = d.getUTCHours();
  if (h === 0)  return "12 AM";
  if (h === 12) return "12 PM";
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
}

function formatDayLabel(ts, tzOffset) {
  const d = new Date((ts + tzOffset) * 1000);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getUTCDay()];
}

// ─── Build hourly array from 3h forecast slots ────────────────────────────────
function buildHourly(foreList, tzOffset) {
  return foreList.slice(0, 12).map((h, i) => {
    const cond = h.weather[0];
    return {
      dt         : h.dt,
      temp       : Math.round(h.main.temp),
      feelsLike  : Math.round(h.main.feels_like),
      humidity   : h.main.humidity,
      pop        : Math.round((h.pop || 0) * 100),
      windSpeed  : Math.round(h.wind.speed * 3.6), // m/s → km/h
      uvIndex    : 0, // not in free forecast endpoint
      conditionId: cond.id,
      icon       : conditionIcon(cond.id, true),
      label      : i === 0 ? "Now" : formatHourLabel(h.dt, tzOffset),
    };
  });
}

// ─── Build daily array by grouping 3h slots by date ──────────────────────────
function buildDaily(foreList, tzOffset) {
  const map = {};

  foreList.forEach(h => {
    const d   = new Date((h.dt + tzOffset) * 1000);
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
    if (!map[key]) {
      map[key] = { dt: h.dt, temps: [], pops: [], conds: h.weather };
    }
    map[key].temps.push(h.main.temp);
    map[key].pops.push(h.pop || 0);
  });

  return Object.values(map).slice(0, 7).map((d, i) => {
    const cond = d.conds[0];
    return {
      dt         : d.dt,
      day        : i === 0 ? "Today" : formatDayLabel(d.dt, tzOffset),
      icon       : conditionIcon(cond.id, true),
      hi         : Math.round(Math.max(...d.temps)),
      lo         : Math.round(Math.min(...d.temps)),
      pop        : Math.round(Math.max(...d.pops) * 100),
      humidity   : 65,
      uvIndex    : 0,
      conditionId: cond.id,
      summary    : capitalize(cond.description),
    };
  });
}

// ─── Normalize all free-tier data → internal app shape ───────────────────────
function normalize(curr, fore, geo, aqi) {
  const cond  = curr.weather[0];
  const isDay = curr.dt > curr.sys.sunrise && curr.dt < curr.sys.sunset;
  const tz    = curr.timezone; // seconds offset from UTC

  return {
    city      : geo.city,
    region    : geo.region,
    country   : geo.country,
    lat       : geo.lat,
    lon       : geo.lon,
    timezone  : tz,
    updatedAt : Date.now(),
    isDemo    : false,

    current: {
      temp        : Math.round(curr.main.temp),
      feelsLike   : Math.round(curr.main.feels_like),
      tempMin     : Math.round(curr.main.temp_min),
      tempMax     : Math.round(curr.main.temp_max),
      humidity    : curr.main.humidity,
      pressure    : curr.main.pressure,
      visibility  : curr.visibility ?? 10000,
      windSpeed   : Math.round(curr.wind.speed * 3.6),
      windDeg     : curr.wind.deg ?? 0,
      clouds      : curr.clouds.all,
      uvIndex     : 0, // not in /weather endpoint; would need separate UV call
      dewPoint    : 0,
      aqi,
      conditionId : cond.id,
      condition   : capitalize(cond.main),
      description : capitalize(cond.description),
      icon        : conditionIcon(cond.id, isDay),
      isDay,
    },

    hourly : buildHourly(fore.list, tz),
    daily  : buildDaily(fore.list, tz),
    alerts : [],
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────
export async function fetchWeather(city) {
  // ── Demo mode (no API key) ─────────────────────────────────────────────────
  if (IS_DEMO) {
    await new Promise(r => setTimeout(r, 700));
    return { ...MOCK_WEATHER, city, isDemo: true };
  }

  // ── Live mode: all free endpoints only ────────────────────────────────────
  // 1. Geocode city → lat/lon
  const geo = await geocodeCity(city);

  // 2. Fetch current, forecast, AQI in parallel
  const [curr, fore, aqi] = await Promise.all([
    fetchCurrent(geo.lat, geo.lon),
    fetchForecast(geo.lat, geo.lon),
    fetchAQI(geo.lat, geo.lon),
  ]);

  // 3. Normalize and return
  return normalize(curr, fore, geo, aqi);
}