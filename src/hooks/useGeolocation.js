// ─── useGeolocation.js ────────────────────────────────────────────────────────
import { useState, useCallback } from "react";
import axios                     from "axios";
import { API_KEY }               from "../utils/constants";

/**
 * useGeolocation — requests browser geolocation, then reverse-geocodes
 * the lat/lon into a city name using the OWM Reverse Geocoding API.
 *
 * Returns: { getLocation, locating, geoError }
 * onSuccess(cityName) is called with the resolved city string.
 */
export function useGeolocation(onSuccess) {
  const [locating,  setLocating]  = useState(false);
  const [geoError,  setGeoError]  = useState(null);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { lat, lon } = { lat: coords.latitude, lon: coords.longitude };

          // Reverse geocode — OWM free endpoint
          const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
          const { data } = await axios.get(url, { timeout: 8000 });

          if (data && data.length > 0) {
            onSuccess(data[0].name);
          } else {
            // Fallback: use lat,lon directly with current weather endpoint
            onSuccess(`${lat},${lon}`);
          }
        } catch {
          setGeoError("Could not determine your city. Please search manually.");
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        const messages = {
          1: "Location access denied. Please allow location permission.",
          2: "Location unavailable. Try searching manually.",
          3: "Location request timed out.",
        };
        setGeoError(messages[err.code] || "Geolocation failed.");
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  }, [onSuccess]);

  return { getLocation, locating, geoError };
}
