# ⚡ WeatherOS — Hyperlocal Weather Decision Engine

> **Not a weather app. A decision intelligence system.**
> Converts raw weather data → actionable decisions, scored insights, and lifestyle-aware recommendations.

---

## 🚀 Quick Start (3 steps)

```bash
# 1. Install dependencies
npm install

# 2. Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# 3. Start the app (demo mode — no API key needed)
npm start
```

Open [http://localhost:3000](http://localhost:3000). The app runs in **demo mode** with realistic simulated data.

---

## 🔑 Add Live Weather Data (Optional)

1. Get a **free API key** at [openweathermap.org/api](https://openweathermap.org/api)
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env`:
   ```
   REACT_APP_OWM_KEY=your_actual_key_here
   ```
4. Restart the dev server: `npm start`

The app automatically tries **One Call API 3.0** first, then falls back to the free `/weather` + `/forecast` endpoints if your key is on the free tier.

---

## 📁 Folder Structure

```
src/
├── App.jsx                          ← Root component
├── index.js / index.css             ← Entry point + global styles
│
├── components/
│   ├── Hero/
│   │   ├── MainTempCard.jsx         ← Temperature, stats grid
│   │   ├── VerdictCard.jsx          ← Today's verdict + outdoor score ring
│   │   └── OutdoorRing.jsx          ← Animated SVG score ring
│   ├── Decisions/
│   │   ├── DecisionsGrid.jsx        ← Grid of decision cards + smart insight
│   │   └── DecisionCard.jsx         ← Individual decision card
│   ├── Hourly/
│   │   ├── HourlyStrip.jsx          ← Scrollable hourly + hour decisions
│   │   └── HourCard.jsx             ← Individual hour tile
│   ├── Forecast/
│   │   ├── ForecastView.jsx         ← 7-day view + week summary
│   │   └── DailyRow.jsx             ← Individual day row
│   ├── Alerts/
│   │   ├── AlertsView.jsx           ← Active alerts + parameter breakdown
│   │   └── AlertItem.jsx            ← Individual alert row
│   └── UI/
│       ├── SearchBar.jsx            ← City search + geolocation
│       ├── ModeSelector.jsx         ← Lifestyle mode buttons
│       ├── TabNav.jsx               ← Tab switcher
│       └── LoadingState.jsx         ← Loading spinner
│
├── engine/
│   ├── decisionEngine.js            ← Weather params → decision cards
│   ├── scoringEngine.js             ← Outdoor comfort score (0–100)
│   └── insightEngine.js             ← Natural language verdicts
│
├── services/
│   └── weatherService.js            ← OWM API + mock fallback
│
├── context/
│   └── WeatherContext.js            ← Global state (Context API + useReducer)
│
├── hooks/
│   ├── useWeather.js                ← Bootstrap hook
│   └── useGeolocation.js           ← Browser geolocation + reverse geocode
│
└── utils/
    ├── constants.js                 ← API URLs, modes, tabs, weights
    ├── formatters.js                ← Time, wind, icons, rounding
    └── mockData.js                  ← Demo dataset (Amaravati)
```

---

## 🧠 How the Decision Engine Works

```
Weather API Data
      │
      ▼
┌─────────────────────────────────────┐
│  scoringEngine.js                   │
│  Outdoor Score = 100 - penalties    │
│  • Temperature  (0–30 pts)          │
│  • UV Index     (0–25 pts)          │
│  • Humidity     (0–20 pts)          │
│  • AQI          (0–15 pts)          │
│  • Wind Speed   (0–10 pts)          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  decisionEngine.js                  │
│  Parameter combos → severity cards  │
│  + Mode-specific decisions          │
│  (Student / Fitness / Traveler/WFH) │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  insightEngine.js                   │
│  Score + mode → natural language    │
│  one-paragraph verdict              │
└─────────────────────────────────────┘
```

---

## 🎨 Tech Stack

| Layer        | Technology                                 |
|--------------|--------------------------------------------|
| UI           | React 18 (functional + hooks)              |
| Styling      | Tailwind CSS + custom CSS variables        |
| HTTP         | Axios                                      |
| State        | Context API + useReducer                   |
| API (primary)| OpenWeatherMap One Call 3.0               |
| API (fallback)| OWM /weather + /forecast (free tier)     |
| AQI          | OWM Air Pollution API (free)               |
| Demo mode    | Rich mock data (no key required)           |

---

## ⚡ Features

- **Decision Engine** — converts temp, UV, rain, humidity, AQI, wind → 6 graded decision cards
- **Outdoor Score** — proprietary 0–100 composite comfort index
- **Lifestyle Modes** — General / Student / Fitness / Traveler / WFH
- **Best + Worst Hour** — algorithmically determined from hourly data
- **7-Day Forecast** — with smart week summary and travel recommendations
- **Micro Alerts** — UV, heat stress, storm, air quality, visibility
- **City Search** — any city worldwide
- **Geolocation** — detect current location (with real API key)
- **Error handling** — invalid city, network failure, API errors
- **Demo mode** — works without any API key
- **Fully responsive** — mobile, tablet, desktop

---

## 🛠 Troubleshooting

| Issue | Fix |
|-------|-----|
| `Module not found: tailwindcss` | Run `npm install -D tailwindcss postcss autoprefixer` |
| "City not found" error | Check spelling; use English city names |
| 401 Unauthorized | Check your `.env` key is correct and the server is restarted |
| One Call API fails | App auto-falls back to free `/weather` + `/forecast` endpoints |
| Blank screen | Check browser console; confirm `npm install` completed |

---

## 📈 Future Enhancements

- Push notifications via Service Workers
- Personal risk profiles (heat sensitivity, asthma, etc.)
- Historical decision accuracy tracking  
- PWA / lock-screen widget mode
- Voice readout via Web Speech API
- Hyperlocal GPS precision (50m radius)
