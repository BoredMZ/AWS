import type { WeatherStationData } from '@/types/weather';

export interface WeatherAlert {
  level: 'info' | 'warning' | 'danger';
  color: string;
  message: string;
  text?: string;
}

export const getWeatherIcon = (
  temperature: number,
  humidity: number,
  rainfall: number
): string => {
  if (rainfall > 50) return '⛈️';
  if (rainfall > 20) return '🌧️';
  if (humidity > 85 && temperature > 28) return '🥵';
  if (temperature > 35) return '🔥';
  if (temperature > 28) return '☀️';
  if (temperature < 20) return '❄️';
  return '🌤️';
};

export const getWeatherAlert = (
  data: WeatherStationData,
  language: 'en' | 'tl' = 'en'
): WeatherAlert | null => {
  const alerts = {
    en: {
      heavyRain: 'Heavy rainfall detected',
      typhoon: 'High wind speed - Potential typhoon warning',
      extremeHeat: 'Extreme heat warning',
      highHumidity: 'Very high humidity - Flood risk',
      lowPressure: 'Low pressure - Storm approaching',
    },
    tl: {
      heavyRain: 'Mataas na ulan na natukoy',
      typhoon: 'Mataas na bilis ng hangin - Posibleng babagyo',
      extremeHeat: 'Alerto ng matinding init',
      highHumidity: 'Napakataas na kahalumigaan - Panganib ng baha',
      lowPressure: 'Mababang presyon - Bagyo na paparating',
    },
  };

  const a = alerts[language];

  if (data.rainfall > 50) {
    return {
      level: 'warning',
      color: 'bg-yellow-100 border-yellow-300',
      message: a.heavyRain,
    };
  }

  if (data.windSpeed > 25) {
    return {
      level: 'danger',
      color: 'bg-red-100 border-red-300',
      message: a.typhoon,
    };
  }

  if (data.temperature > 38) {
    return {
      level: 'danger',
      color: 'bg-red-100 border-red-300',
      message: a.extremeHeat,
    };
  }

  if (data.humidity > 85 && data.temperature > 30) {
    return {
      level: 'warning',
      color: 'bg-yellow-100 border-yellow-300',
      message: a.highHumidity,
    };
  }

  if (data.pressure < 1000) {
    return {
      level: 'warning',
      color: 'bg-orange-100 border-orange-300',
      message: a.lowPressure,
    };
  }

  return null;
};
