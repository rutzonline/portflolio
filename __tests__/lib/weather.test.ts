import { describe, it, expect } from "vitest";
import {
  getDayPhase,
  getWeatherMood,
  getWeatherDescription,
  getWeatherIconName,
  getWeatherScene,
  buildOpenMeteoForecastUrl,
} from "@/lib/weather";

describe("getDayPhase", () => {
  it("returns 'day' for empty string", () => {
    expect(getDayPhase("")).toBe("day");
  });

  it("returns 'day' for invalid ISO string", () => {
    expect(getDayPhase("not-a-date")).toBe("day");
  });

  it("returns 'night' for hours before 5", () => {
    expect(getDayPhase("2024-06-15T03:00:00")).toBe("night");
    expect(getDayPhase("2024-06-15T00:00:00")).toBe("night");
    expect(getDayPhase("2024-06-15T04:59:00")).toBe("night");
  });

  it("returns 'night' for hours >= 20", () => {
    expect(getDayPhase("2024-06-15T20:00:00")).toBe("night");
    expect(getDayPhase("2024-06-15T23:59:00")).toBe("night");
  });

  it("returns 'dawn' for hours 5-7", () => {
    expect(getDayPhase("2024-06-15T05:00:00")).toBe("dawn");
    expect(getDayPhase("2024-06-15T07:30:00")).toBe("dawn");
  });

  it("returns 'day' for hours 8-16", () => {
    expect(getDayPhase("2024-06-15T08:00:00")).toBe("day");
    expect(getDayPhase("2024-06-15T12:00:00")).toBe("day");
    expect(getDayPhase("2024-06-15T16:59:00")).toBe("day");
  });

  it("returns 'dusk' for hours 17-19", () => {
    expect(getDayPhase("2024-06-15T17:00:00")).toBe("dusk");
    expect(getDayPhase("2024-06-15T19:30:00")).toBe("dusk");
  });
});

describe("getWeatherMood", () => {
  it("returns 'clear' for code 0", () => {
    expect(getWeatherMood(0)).toBe("clear");
  });

  it("returns 'cloudy' for codes 1-3", () => {
    expect(getWeatherMood(1)).toBe("cloudy");
    expect(getWeatherMood(2)).toBe("cloudy");
    expect(getWeatherMood(3)).toBe("cloudy");
  });

  it("returns 'fog' for codes 4-48", () => {
    expect(getWeatherMood(4)).toBe("fog");
    expect(getWeatherMood(45)).toBe("fog");
    expect(getWeatherMood(48)).toBe("fog");
  });

  it("returns 'rain' for codes 49-67", () => {
    expect(getWeatherMood(49)).toBe("rain");
    expect(getWeatherMood(55)).toBe("rain");
    expect(getWeatherMood(67)).toBe("rain");
  });

  it("returns 'snow' for codes 68-77", () => {
    expect(getWeatherMood(68)).toBe("snow");
    expect(getWeatherMood(71)).toBe("snow");
    expect(getWeatherMood(77)).toBe("snow");
  });

  it("returns 'rain' for codes 78-82", () => {
    expect(getWeatherMood(78)).toBe("rain");
    expect(getWeatherMood(80)).toBe("rain");
    expect(getWeatherMood(82)).toBe("rain");
  });

  it("returns 'thunder' for codes > 82", () => {
    expect(getWeatherMood(83)).toBe("thunder");
    expect(getWeatherMood(95)).toBe("thunder");
    expect(getWeatherMood(99)).toBe("thunder");
  });
});

describe("getWeatherDescription", () => {
  it("returns 'Clear' for code 0", () => {
    expect(getWeatherDescription(0)).toBe("Clear");
  });

  it("returns 'Partly Cloudy' for codes 1-3", () => {
    expect(getWeatherDescription(1)).toBe("Partly Cloudy");
    expect(getWeatherDescription(3)).toBe("Partly Cloudy");
  });

  it("returns 'Foggy' for codes 4-48", () => {
    expect(getWeatherDescription(45)).toBe("Foggy");
  });

  it("returns 'Drizzle' for codes 49-57", () => {
    expect(getWeatherDescription(50)).toBe("Drizzle");
    expect(getWeatherDescription(57)).toBe("Drizzle");
  });

  it("returns 'Rainy' for codes 58-67", () => {
    expect(getWeatherDescription(60)).toBe("Rainy");
    expect(getWeatherDescription(67)).toBe("Rainy");
  });

  it("returns 'Snowy' for codes 68-77", () => {
    expect(getWeatherDescription(70)).toBe("Snowy");
    expect(getWeatherDescription(77)).toBe("Snowy");
  });

  it("returns 'Showers' for codes 78-82", () => {
    expect(getWeatherDescription(80)).toBe("Showers");
  });

  it("returns 'Thunderstorm' for codes > 82", () => {
    expect(getWeatherDescription(95)).toBe("Thunderstorm");
  });
});

describe("getWeatherIconName", () => {
  it("returns 'sun' for code 0", () => {
    expect(getWeatherIconName(0)).toBe("sun");
  });

  it("returns 'cloud' for codes 1-3", () => {
    expect(getWeatherIconName(2)).toBe("cloud");
  });

  it("returns 'fog' for codes 4-48", () => {
    expect(getWeatherIconName(45)).toBe("fog");
  });

  it("returns 'drizzle' for codes 49-57", () => {
    expect(getWeatherIconName(53)).toBe("drizzle");
  });

  it("returns 'rain' for codes 58-67", () => {
    expect(getWeatherIconName(61)).toBe("rain");
  });

  it("returns 'snow' for codes 68-77", () => {
    expect(getWeatherIconName(71)).toBe("snow");
  });

  it("returns 'rain' for codes 78-82", () => {
    expect(getWeatherIconName(80)).toBe("rain");
  });

  it("returns 'thunder' for codes > 82", () => {
    expect(getWeatherIconName(95)).toBe("thunder");
  });
});

describe("getWeatherScene", () => {
  it("returns a scene with correct phase and mood", () => {
    const scene = getWeatherScene("2024-06-15T12:00:00", 0);
    expect(scene.phase).toBe("day");
    expect(scene.mood).toBe("clear");
    expect(scene.key).toBe("day-clear");
    expect(scene.isDark).toBe(false);
  });

  it("night + thunder scene is dark with lightning", () => {
    const scene = getWeatherScene("2024-06-15T02:00:00", 95);
    expect(scene.phase).toBe("night");
    expect(scene.mood).toBe("thunder");
    expect(scene.isDark).toBe(true);
    expect(scene.mainEffects).toContain("lightning");
  });

  it("day + rain scene has rainDrops effect", () => {
    const scene = getWeatherScene("2024-06-15T14:00:00", 61);
    expect(scene.mood).toBe("rain");
    expect(scene.mainEffects).toContain("rainDrops");
  });

  it("night + clear scene has stars effect", () => {
    const scene = getWeatherScene("2024-06-15T23:00:00", 0);
    expect(scene.mainEffects).toContain("stars");
  });

  it("day + clear scene has sunGlow effect", () => {
    const scene = getWeatherScene("2024-06-15T12:00:00", 0);
    expect(scene.mainEffects).toContain("sunGlow");
  });

  it("fog scene includes fog and fogDrift in main effects", () => {
    const scene = getWeatherScene("2024-06-15T12:00:00", 45);
    expect(scene.mood).toBe("fog");
    expect(scene.mainEffects).toContain("fog");
    expect(scene.mainEffects).toContain("fogDrift");
  });

  it("has sidebarShellBackground derived from background", () => {
    const scene = getWeatherScene("2024-06-15T12:00:00", 0);
    expect(scene.sidebarShellBackground).toContain(
      "linear-gradient(180deg, rgba(8,16,34,0.2)"
    );
  });
});

describe("buildOpenMeteoForecastUrl", () => {
  it("builds a URL with required parameters", () => {
    const url = buildOpenMeteoForecastUrl({
      latitude: 12.97,
      longitude: 77.59,
      currentFields: ["temperature_2m", "weather_code"],
    });
    expect(url).toContain("api.open-meteo.com/v1/forecast");
    expect(url).toContain("latitude=12.97");
    expect(url).toContain("longitude=77.59");
    expect(url).toContain("current=temperature_2m%2Cweather_code");
    expect(url).toContain("temperature_unit=fahrenheit");
    expect(url).toContain("wind_speed_unit=mph");
    expect(url).toContain("forecast_days=10");
  });

  it("includes daily and hourly fields when provided", () => {
    const url = buildOpenMeteoForecastUrl({
      latitude: 40.71,
      longitude: -74.01,
      currentFields: ["temperature_2m"],
      dailyFields: ["temperature_2m_max", "temperature_2m_min"],
      hourlyFields: ["precipitation_probability"],
      forecastDays: 7,
      temperatureUnit: "celsius",
      windSpeedUnit: "kmh",
    });
    expect(url).toContain("daily=temperature_2m_max%2Ctemperature_2m_min");
    expect(url).toContain("hourly=precipitation_probability");
    expect(url).toContain("forecast_days=7");
    expect(url).toContain("temperature_unit=celsius");
    expect(url).toContain("wind_speed_unit=kmh");
  });

  it("omits daily/hourly params when arrays are empty", () => {
    const url = buildOpenMeteoForecastUrl({
      latitude: 0,
      longitude: 0,
      currentFields: ["temperature_2m"],
      dailyFields: [],
      hourlyFields: [],
    });
    expect(url).not.toContain("daily=");
    expect(url).not.toContain("hourly=");
  });
});
