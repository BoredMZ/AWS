// Utility to generate random weather data for testing

export interface RandomWeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windVane: string;
  rainfall: number;
  atmosphericPressure?: number;
  solarRadiation?: number;
  soilMoisture?: number;
  uvIndex?: number;
  visibility?: number;
}

const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export function generateRandomWeatherData(): RandomWeatherData {
  return {
    temperature: Math.round((15 + Math.random() * 23) * 10) / 10, // 15-38°C
    humidity: Math.round((40 + Math.random() * 55) * 10) / 10, // 40-95%
    pressure: Math.round((1008 + Math.random() * 15) * 10) / 10, // 1008-1023 hPa
    windSpeed: Math.round((2 + Math.random() * 18) * 10) / 10, // 2-20 m/s
    windVane: windDirections[Math.floor(Math.random() * windDirections.length)],
    rainfall: Math.round((0 + Math.random() * 25) * 10) / 10, // 0-25mm
    atmosphericPressure: Math.round((1008 + Math.random() * 15) * 10) / 10,
    solarRadiation: Math.round(Math.random() * 1000),
    soilMoisture: Math.round((30 + Math.random() * 50) * 10) / 10,
    uvIndex: Math.round((1 + Math.random() * 11) * 10) / 10,
    visibility: Math.round((5000 + Math.random() * 5000) / 100) * 100,
  };
}
