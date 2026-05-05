// ─── useWeather.js ────────────────────────────────────────────────────────────
import { useEffect } from "react";
import { useWeatherContext } from "../context/WeatherContext";
import { DEFAULT_CITY }      from "../utils/constants";

/**
 * Bootstraps the initial weather fetch on mount.
 * Components just call useWeatherContext() directly for state access.
 */
export function useWeather() {
  const ctx = useWeatherContext();

  useEffect(() => {
    ctx.loadWeather(DEFAULT_CITY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ctx;
}
