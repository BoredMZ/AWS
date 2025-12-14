// Generate random weather data specific to each station's sensor types

export interface StationSpecificWeatherData {
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

export function generateStationSpecificData(
  sensorTypes: string[] | undefined
): StationSpecificWeatherData {
  const data: StationSpecificWeatherData = {
    temperature: Math.round((15 + Math.random() * 23) * 10) / 10, // 15-38°C
    humidity: Math.round((40 + Math.random() * 55) * 10) / 10, // 40-95%
    pressure: Math.round((1008 + Math.random() * 15) * 10) / 10, // 1008-1023 hPa
    windSpeed: Math.round((2 + Math.random() * 18) * 10) / 10, // 2-20 m/s
    windVane: windDirections[Math.floor(Math.random() * windDirections.length)],
    rainfall: Math.round((0 + Math.random() * 25) * 10) / 10, // 0-25mm
  };

  // Only generate extra sensors that this station actually has
  if (sensorTypes && Array.isArray(sensorTypes)) {
    if (sensorTypes.includes('atmosphericPressure')) {
      data.atmosphericPressure = Math.round((1008 + Math.random() * 15) * 10) / 10;
    }
    if (sensorTypes.includes('solarRadiation')) {
      data.solarRadiation = Math.round(Math.random() * 1000);
    }
    if (sensorTypes.includes('soilMoisture')) {
      data.soilMoisture = Math.round((30 + Math.random() * 50) * 10) / 10;
    }
    if (sensorTypes.includes('uvIndex')) {
      data.uvIndex = Math.round((1 + Math.random() * 11) * 10) / 10;
    }
    if (sensorTypes.includes('visibility')) {
      data.visibility = Math.round((5000 + Math.random() * 5000) / 100) * 100;
    }
  }

  return data;
}
