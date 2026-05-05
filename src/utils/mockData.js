// ─── mockData.js ─────────────────────────────────────────────────────────────
// Realistic demo data used when no API key is present.

export const MOCK_WEATHER = {
  city        : "Amaravati",
  region      : "Andhra Pradesh",
  country     : "IN",
  lat         : 16.51,
  lon         : 80.52,
  timezone    : 19800,   // UTC+5:30
  updatedAt   : Date.now(),

  current: {
    temp        : 36,
    feelsLike   : 41,
    tempMin     : 28,
    tempMax     : 39,
    humidity    : 62,
    pressure    : 1008,
    visibility  : 7000,
    windSpeed   : 14,
    windDeg     : 220,
    clouds      : 5,
    uvIndex     : 9,
    dewPoint    : 27,
    aqi         : 3,          // 1–5 scale (OWM AQI)
    conditionId : 800,
    condition   : "Clear",
    description : "clear sky",
    icon        : "☀️",
    isDay       : true,
  },

  hourly: [
    { dt: 1700000000, temp: 36, feelsLike: 41, humidity: 62, pop: 0,  windSpeed: 14, uvIndex: 9,  conditionId: 800, icon: "☀️",  label: "Now"   },
    { dt: 1700003600, temp: 37, feelsLike: 42, humidity: 60, pop: 0,  windSpeed: 15, uvIndex: 10, conditionId: 800, icon: "☀️",  label: "1 PM"  },
    { dt: 1700007200, temp: 38, feelsLike: 43, humidity: 58, pop: 5,  windSpeed: 16, uvIndex: 11, conditionId: 800, icon: "☀️",  label: "2 PM"  },
    { dt: 1700010800, temp: 39, feelsLike: 44, humidity: 57, pop: 8,  windSpeed: 18, uvIndex: 10, conditionId: 801, icon: "🌤️", label: "3 PM"  },
    { dt: 1700014400, temp: 38, feelsLike: 43, humidity: 59, pop: 20, windSpeed: 17, uvIndex: 8,  conditionId: 801, icon: "🌤️", label: "4 PM"  },
    { dt: 1700018000, temp: 35, feelsLike: 39, humidity: 63, pop: 35, windSpeed: 15, uvIndex: 5,  conditionId: 802, icon: "⛅",  label: "5 PM"  },
    { dt: 1700021600, temp: 32, feelsLike: 36, humidity: 68, pop: 55, windSpeed: 13, uvIndex: 2,  conditionId: 500, icon: "🌧️", label: "6 PM"  },
    { dt: 1700025200, temp: 30, feelsLike: 33, humidity: 72, pop: 65, windSpeed: 12, uvIndex: 0,  conditionId: 500, icon: "🌧️", label: "7 PM"  },
    { dt: 1700028800, temp: 29, feelsLike: 32, humidity: 70, pop: 30, windSpeed: 10, uvIndex: 0,  conditionId: 802, icon: "⛅",  label: "8 PM"  },
    { dt: 1700032400, temp: 28, feelsLike: 30, humidity: 68, pop: 10, windSpeed: 9,  uvIndex: 0,  conditionId: 800, icon: "🌙",  label: "9 PM"  },
    { dt: 1700036000, temp: 27, feelsLike: 29, humidity: 66, pop: 5,  windSpeed: 8,  uvIndex: 0,  conditionId: 800, icon: "🌙",  label: "10 PM" },
    { dt: 1700039600, temp: 27, feelsLike: 29, humidity: 65, pop: 0,  windSpeed: 7,  uvIndex: 0,  conditionId: 800, icon: "🌙",  label: "11 PM" },
  ],

  daily: [
    { dt: 1699920000, day: "Today", icon: "☀️",  hi: 39, lo: 28, pop: 30, humidity: 62, uvIndex: 11, conditionId: 801, summary: "Partly cloudy afternoon, afternoon showers possible"       },
    { dt: 1700006400, day: "Tue",   icon: "🌦️", hi: 34, lo: 27, pop: 65, humidity: 74, uvIndex: 6,  conditionId: 500, summary: "Rainy day — carry umbrella, avoid outdoor plans"           },
    { dt: 1700092800, day: "Wed",   icon: "⛈️",  hi: 32, lo: 26, pop: 80, humidity: 80, uvIndex: 4,  conditionId: 211, summary: "Thunderstorms — stay indoors, secure loose items"          },
    { dt: 1700179200, day: "Thu",   icon: "⛅",  hi: 35, lo: 27, pop: 20, humidity: 65, uvIndex: 8,  conditionId: 802, summary: "Partly cloudy, good commute window morning and evening"     },
    { dt: 1700265600, day: "Fri",   icon: "☀️",  hi: 37, lo: 28, pop: 5,  humidity: 58, uvIndex: 10, conditionId: 800, summary: "Clear and sunny — ideal day for outdoor activities"        },
    { dt: 1700352000, day: "Sat",   icon: "☀️",  hi: 38, lo: 29, pop: 0,  humidity: 55, uvIndex: 11, conditionId: 800, summary: "Perfect travel day — low rain, strong UV, plan early start" },
    { dt: 1700438400, day: "Sun",   icon: "🌤️", hi: 36, lo: 28, pop: 15, humidity: 60, uvIndex: 9,  conditionId: 801, summary: "Mostly sunny, morning activity recommended"                },
  ],

  alerts: [],
};
