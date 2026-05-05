// ─── WeatherContext.js ────────────────────────────────────────────────────────
import React, { createContext, useContext, useReducer, useCallback } from "react";
import { fetchWeather }       from "../services/weatherService";
import { DEFAULT_CITY }       from "../utils/constants";

// ─── Shape ────────────────────────────────────────────────────────────────────
const initialState = {
  weather    : null,
  loading    : false,
  error      : null,
  city       : DEFAULT_CITY,
  mode       : "general",
  activeTab  : "decisions",
  isDemo     : false,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":  return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS": return { ...state, loading: false, weather: action.payload, city: action.payload.city, isDemo: action.payload.isDemo ?? false };
    case "FETCH_ERROR":  return { ...state, loading: false, error: action.payload };
    case "SET_MODE":     return { ...state, mode: action.payload };
    case "SET_TAB":      return { ...state, activeTab: action.payload };
    case "SET_CITY":     return { ...state, city: action.payload };
    default:             return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const WeatherContext = createContext(null);

export function WeatherProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadWeather = useCallback(async (city) => {
    dispatch({ type: "FETCH_START" });
    try {
      const data = await fetchWeather(city || state.city);
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      let message = "Unable to load weather data.";
      if (err.response?.status === 404) message = `City "${city}" not found. Please check the spelling.`;
      else if (err.response?.status === 401) message = "Invalid API key. Please check your .env file.";
      else if (!navigator.onLine)           message = "No internet connection. Check your network and try again.";
      else if (err.code === "ECONNABORTED") message = "Request timed out. Please try again.";
      else if (err.message)                 message = err.message;
      dispatch({ type: "FETCH_ERROR", payload: message });
    }
  }, [state.city]);

  const setMode     = useCallback((m)   => dispatch({ type: "SET_MODE", payload: m }),    []);
  const setActiveTab= useCallback((t)   => dispatch({ type: "SET_TAB",  payload: t }),    []);
  const setCity     = useCallback((c)   => dispatch({ type: "SET_CITY", payload: c }),    []);

  return (
    <WeatherContext.Provider value={{ ...state, loadWeather, setMode, setActiveTab, setCity }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeatherContext must be used inside WeatherProvider");
  return ctx;
}
