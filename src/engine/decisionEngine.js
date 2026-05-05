// ─── decisionEngine.js ────────────────────────────────────────────────────────
// Maps weather parameters → severity-graded decision cards.
// Each card: { id, icon, title, body, severity, cat }
// severity: "low" | "moderate" | "high" | "info"

import { AQI_LABELS } from "../utils/constants";

/**
 * Core decision builder.
 * Returns an array of decision objects sorted by severity (high first).
 */
export function buildDecisions(weather, mode = "general") {
  const { current: c, hourly = [], daily = [] } = weather;
  const decisions = [];
  const nextRainHour = hourly.findIndex(h => h.pop > 50);
  const hour = new Date().getHours();

  // ── Temperature ────────────────────────────────────────────────────────────
  if (c.temp >= 40) {
    decisions.push({
      id: "temp-extreme", icon: "🌡️", severity: "high",
      title: "Extreme heat — stay indoors",
      body: `${c.temp}°C with ${c.feelsLike}°C feels-like. Heat stroke risk is critical. Avoid any outdoor activity until after 6 PM. Drink at least 3–4 litres of water.`,
    });
  } else if (c.temp >= 36) {
    decisions.push({
      id: "temp-high", icon: "🔆", severity: "high",
      title: "Dangerous heat advisory",
      body: `${c.temp}°C feels like ${c.feelsLike}°C. Limit physical exertion. Stay in shaded or AC spaces between 11 AM–4 PM. Carry water at all times.`,
    });
  } else if (c.temp >= 32) {
    decisions.push({
      id: "temp-warm", icon: "🌤️", severity: "moderate",
      title: "Hot and uncomfortable outside",
      body: `${c.temp}°C feels like ${c.feelsLike}°C. Morning and evening windows are better. Wear light, breathable clothing and stay hydrated.`,
    });
  } else if (c.temp <= 5) {
    decisions.push({
      id: "temp-cold", icon: "🥶", severity: "high",
      title: "Dangerous cold — layer up",
      body: `${c.temp}°C with feels-like ${c.feelsLike}°C. Hypothermia risk if exposed for extended periods. Wear thermal layers and limit outdoor time.`,
    });
  } else if (c.temp <= 12) {
    decisions.push({
      id: "temp-chilly", icon: "🧥", severity: "moderate",
      title: "Cold weather — dress warmly",
      body: `${c.temp}°C outside. A warm jacket and wind-proof layer are essential. Good conditions otherwise for a brisk walk or run.`,
    });
  }

  // ── UV Index ───────────────────────────────────────────────────────────────
  if (c.uvIndex >= 11) {
    decisions.push({
      id: "uv-extreme", icon: "🕶️", severity: "high",
      title: "Extreme UV — sunburn in 10 min",
      body: `UV index ${c.uvIndex}/11. Unprotected skin burns in under 10 minutes. Apply SPF 50+, wear a hat and UV-blocking sunglasses. Avoid direct sun 10 AM–4 PM.`,
    });
  } else if (c.uvIndex >= 8) {
    decisions.push({
      id: "uv-very-high", icon: "☀️", severity: "high",
      title: "Very high UV index",
      body: `UV index ${c.uvIndex}. Sunburn possible within 15–20 min. Mandatory: SPF 50+, hat, sunglasses. Reapply sunscreen every 2 hours outdoors.`,
    });
  } else if (c.uvIndex >= 6) {
    decisions.push({
      id: "uv-high", icon: "🌞", severity: "moderate",
      title: "Apply sunscreen before going out",
      body: `UV index ${c.uvIndex} — high. Apply SPF 30+ before leaving. Good time for outdoor activity if you're protected.`,
    });
  } else if (c.uvIndex >= 3 && c.uvIndex < 6) {
    decisions.push({
      id: "uv-moderate", icon: "🧴", severity: "info",
      title: "Moderate UV — light protection",
      body: `UV index ${c.uvIndex}. Sunscreen recommended if out for more than 30 minutes, especially between 10 AM–2 PM.`,
    });
  }

  // ── Rain ───────────────────────────────────────────────────────────────────
  if (nextRainHour !== -1 && nextRainHour <= 3) {
    decisions.push({
      id: "rain-soon", icon: "☂️", severity: "moderate",
      title: `Rain in ${nextRainHour === 0 ? "under 1 hour" : `~${nextRainHour} hour${nextRainHour > 1 ? "s" : ""}`}`,
      body: `${hourly[nextRainHour]?.pop || 0}% chance of rain soon. Carry an umbrella or raincoat if heading out. Check back before your commute.`,
    });
  } else if (c.conditionId >= 500 && c.conditionId < 600) {
    decisions.push({
      id: "rain-now", icon: "🌧️", severity: "moderate",
      title: "Currently raining",
      body: "Active rainfall detected. Use waterproof footwear and an umbrella. Allow extra travel time — roads may be slippery.",
    });
  }

  // ── Thunderstorm ───────────────────────────────────────────────────────────
  if (c.conditionId >= 200 && c.conditionId < 300) {
    decisions.push({
      id: "thunder", icon: "⛈️", severity: "high",
      title: "Thunderstorm active — seek shelter",
      body: "Lightning and heavy rain present. Move indoors immediately. Avoid open fields, tall trees, and metal structures. Do not drive unless necessary.",
    });
  } else if (daily[1]?.conditionId >= 200 && daily[1]?.conditionId < 300) {
    decisions.push({
      id: "thunder-tomorrow", icon: "⛈️", severity: "moderate",
      title: "Thunderstorms expected tomorrow",
      body: `${daily[1]?.pop || 0}% storm probability tomorrow. Reschedule outdoor plans and keep devices charged in case of power outages.`,
    });
  }

  // ── Humidity ──────────────────────────────────────────────────────────────
  if (c.humidity >= 80 && c.temp >= 28) {
    decisions.push({
      id: "humid-high", icon: "💧", severity: "high",
      title: "Oppressive heat + humidity combo",
      body: `${c.humidity}% humidity at ${c.temp}°C compounds heat stress significantly. Your body cannot cool itself effectively — restrict outdoor activity strictly.`,
    });
  } else if (c.humidity >= 70 && c.temp >= 25) {
    decisions.push({
      id: "humid-moderate", icon: "🌫️", severity: "moderate",
      title: "High humidity — wear breathable clothing",
      body: `${c.humidity}% humidity makes ${c.temp}°C feel considerably worse. Choose loose, light-coloured, moisture-wicking clothes. Hydrate frequently.`,
    });
  }

  // ── Air Quality ────────────────────────────────────────────────────────────
  if (c.aqi >= 5) {
    decisions.push({
      id: "aqi-very-poor", icon: "😷", severity: "high",
      title: "Air quality is very poor — wear a mask",
      body: `AQI: ${AQI_LABELS[c.aqi]}. PM2.5 at hazardous levels. Wear an N95 mask outdoors. Avoid heavy exercise outside. Keep windows closed.`,
    });
  } else if (c.aqi === 4) {
    decisions.push({
      id: "aqi-poor", icon: "🌫️", severity: "moderate",
      title: "Poor air quality today",
      body: `AQI: ${AQI_LABELS[c.aqi]}. Sensitive groups (asthma, elderly, children) should avoid outdoor exercise. Consider a light mask.`,
    });
  } else if (c.aqi === 3) {
    decisions.push({
      id: "aqi-moderate", icon: "💨", severity: "info",
      title: "Moderate air quality",
      body: "Air is acceptable but may cause mild discomfort for sensitive groups. Short outdoor activities are fine for most people.",
    });
  }

  // ── Wind ──────────────────────────────────────────────────────────────────
  if (c.windSpeed >= 60) {
    decisions.push({
      id: "wind-extreme", icon: "🌪️", severity: "high",
      title: "Dangerous winds — stay indoors",
      body: `${c.windSpeed} km/h winds. Risk of flying debris and structural damage. Avoid travel if possible. Secure all loose outdoor items immediately.`,
    });
  } else if (c.windSpeed >= 40) {
    decisions.push({
      id: "wind-strong", icon: "💨", severity: "moderate",
      title: "Strong winds today",
      body: `${c.windSpeed} km/h. Secure balcony furniture and loose items. Cycling is not recommended. Allow extra time if commuting.`,
    });
  }

  // ── Visibility ────────────────────────────────────────────────────────────
  if (c.visibility <= 1000) {
    decisions.push({
      id: "vis-very-low", icon: "🌫️", severity: "high",
      title: "Very low visibility — drive with caution",
      body: `Visibility under 1 km (${Math.round(c.visibility / 1000 * 10) / 10} km). Use fog lights if driving. Allow 3× normal braking distance. Avoid driving if possible.`,
    });
  } else if (c.visibility <= 3000) {
    decisions.push({
      id: "vis-low", icon: "👁️", severity: "moderate",
      title: "Reduced visibility",
      body: `Visibility ${Math.round(c.visibility / 100) / 10} km. Drive carefully. Use headlights even during daylight.`,
    });
  }

  // ── Mode-specific decisions ────────────────────────────────────────────────
  const modeDecisions = buildModeDecisions(c, hourly, daily, mode, hour);
  decisions.push(...modeDecisions);

  // ── Default positive card if conditions are fine ──────────────────────────
  if (decisions.filter(d => d.severity !== "info").length === 0) {
    decisions.push({
      id: "all-clear", icon: "✅", severity: "low",
      title: "Conditions look good today",
      body: "No significant weather concerns detected. Enjoy your day with light sun protection. A great time for outdoor activities.",
    });
  }

  // Sort: high → moderate → low → info
  const order = { high: 0, moderate: 1, low: 2, info: 3 };
  return decisions
    .sort((a, b) => order[a.severity] - order[b.severity])
    .slice(0, 6);
}

// ─── Mode-specific decisions ──────────────────────────────────────────────────
function buildModeDecisions(c, hourly, daily, mode, hour) {
  const decisions = [];

  if (mode === "student") {
    const commuteTime = hour < 8 ? "morning commute" : hour < 9 ? "you're in commute now" : "next commute";
    const nextRain    = hourly.findIndex(h => h.pop > 40);
    decisions.push({
      id: "student-commute", icon: "🎒", severity: "info",
      title: "Commute check",
      body: nextRain !== -1 && nextRain <= 4
        ? `Rain likely in ~${nextRain}h — pack your umbrella before leaving. Allow 10–15 extra minutes for delays.`
        : `No rain expected for your ${commuteTime}. ${c.temp > 35 ? "It's very hot — carry water and avoid peak sun hours." : "Conditions are manageable."}`,
    });
    decisions.push({
      id: "student-study", icon: "📚", severity: c.temp > 36 ? "moderate" : "info",
      title: c.temp > 36 ? "Go to an AC indoor space to study" : "Study environment check",
      body: c.temp > 36
        ? "Outdoor heat will impair concentration. Campus libraries, malls, or any air-conditioned space are ideal today."
        : "Indoor studying is comfortable. If studying outside, seek shade and check for afternoon showers.",
    });
  }

  if (mode === "fitness") {
    const bestTemp  = c.temp < 28;
    const safeAQI   = c.aqi <= 2;
    const safeUV    = c.uvIndex < 7;
    const isGood    = bestTemp && safeAQI && safeUV;
    const window    = c.temp > 34 ? "6–8 AM or after 7 PM (indoors preferred)" : "morning (6–9 AM) or evening (6–8 PM)";

    decisions.push({
      id: "fitness-window", icon: "🏃", severity: isGood ? "low" : c.temp > 37 ? "high" : "moderate",
      title: isGood ? "Great conditions for training" : "Pick your workout window carefully",
      body: isGood
        ? `${c.temp}°C with clean air — ideal for outdoor running or cycling. Apply SPF if training beyond 30 min.`
        : `Best training window today: ${window}. ${c.temp > 37 ? "Outdoor cardio not advisable right now." : "Keep sessions under 45 min in current heat."}`,
    });

    if (c.uvIndex >= 6) {
      decisions.push({
        id: "fitness-gear", icon: "🧴", severity: "info",
        title: "Pre-workout sun checklist",
        body: `UV ${c.uvIndex} — apply SPF 50+ before heading out, wear UV-protective kit, and carry at least 750 ml water per hour of activity.`,
      });
    }

    if (c.aqi >= 3) {
      decisions.push({
        id: "fitness-aqi", icon: "😤", severity: "moderate",
        title: "AQI may affect performance",
        body: "Reduced air quality will lower VO₂ capacity during intense training. Consider an indoor workout session today.",
      });
    }
  }

  if (mode === "traveler") {
    const bestDay  = daily.find(d => d.pop < 15 && d.hi < 38);
    const worstDay = daily.reduce((w, d) => d.pop > w.pop ? d : w, daily[0]);

    decisions.push({
      id: "traveler-window", icon: "✈️", severity: "info",
      title: "Best day to explore this week",
      body: bestDay
        ? `${bestDay.day} looks optimal — under 15% rain chance, high of ${bestDay.hi}°C. Plan major sightseeing or travel for then.`
        : "No ideal days this week. Thursday and Friday appear to be the most manageable — pack layers and rain gear.",
    });

    decisions.push({
      id: "traveler-avoid", icon: "🗓️", severity: worstDay.pop > 70 ? "high" : "moderate",
      title: `Avoid travel on ${worstDay.day}`,
      body: `${worstDay.pop}% rain probability and ${worstDay.hi}°C. Rebook any outdoor activities. Good day for indoor attractions — museums, restaurants, malls.`,
    });

    if (c.uvIndex >= 7) {
      decisions.push({
        id: "traveler-sun", icon: "🧳", severity: "info",
        title: "Packing tip: UV is intense",
        body: `UV ${c.uvIndex} in this region. Essential items: SPF 50+ sunscreen, polarised sunglasses, wide-brim hat, and UV shirt for all-day touring.`,
      });
    }
  }

  if (mode === "wfh") {
    const stormRisk = c.windSpeed > 40 || (c.conditionId >= 200 && c.conditionId < 300);
    const heatLoad  = c.temp > 33;

    decisions.push({
      id: "wfh-power", icon: "💻", severity: stormRisk ? "high" : "info",
      title: stormRisk ? "Power interruption risk — prepare now" : "WFH conditions are stable",
      body: stormRisk
        ? "High wind or storm conditions may cause power outages. Back up your work now, charge all devices, and keep a UPS or power bank ready."
        : `No disruptions expected. ${heatLoad ? "Keep curtains closed in the afternoon to cut AC load." : "Natural ventilation should be fine until midday."}`,
    });

    decisions.push({
      id: "wfh-ventilation", icon: "🪟", severity: "info",
      title: c.temp < 28 && c.aqi <= 2 ? "Open windows — fresh air available" : "Keep windows closed",
      body: c.temp < 28 && c.aqi <= 2
        ? "Outdoor air is cooler and clean right now. Open windows for natural ventilation and lower your energy bill."
        : `${c.temp >= 28 ? `Outside is ${c.temp}°C` : `AQI is ${AQI_LABELS[c.aqi]}`} — keep windows closed. Run AC or air purifier if available.`,
    });
  }

  return decisions;
}

// ─── Micro alerts ─────────────────────────────────────────────────────────────
export function buildAlerts(weather) {
  const { current: c, daily = [] } = weather;
  const alerts = [];

  if (c.uvIndex >= 8)
    alerts.push({ icon: "☀️", title: "UV Alert: Very High", desc: `Index ${c.uvIndex} — risk of severe sunburn within 15 min`, type: "danger" });

  if (c.temp >= 38)
    alerts.push({ icon: "🌡️", title: "Heat Stress Risk", desc: `Feels like ${c.feelsLike}°C — high risk, especially for children and elderly`, type: "danger" });
  else if (c.temp >= 34)
    alerts.push({ icon: "🔥", title: "Heat Advisory", desc: "Elevated heat — stay hydrated and limit sun exposure", type: "warn" });

  if (c.aqi >= 4)
    alerts.push({ icon: "🌫️", title: "Poor Air Quality", desc: "PM2.5 levels elevated — reduce outdoor time, wear mask", type: "danger" });

  if (c.windSpeed >= 50)
    alerts.push({ icon: "🌪️", title: "High Wind Warning", desc: `${c.windSpeed} km/h — risk of debris and damage`, type: "danger" });

  if (daily[1]?.pop > 75)
    alerts.push({ icon: "⛈️", title: "Storm System Incoming", desc: `${daily[1]?.day}: ${daily[1]?.pop}% storm probability`, type: "warn" });

  if (c.conditionId >= 200 && c.conditionId < 300)
    alerts.push({ icon: "⚡", title: "Active Thunderstorm", desc: "Seek shelter immediately — lightning risk", type: "danger" });

  if (c.visibility <= 1000)
    alerts.push({ icon: "👁️", title: "Dense Fog / Low Visibility", desc: `Only ${Math.round(c.visibility / 100) / 10} km — extreme driving hazard`, type: "danger" });

  if (alerts.length === 0)
    alerts.push({ icon: "✅", title: "No Active Alerts", desc: "Conditions are within safe normal range for all activities", type: "success" });

  return alerts;
}
