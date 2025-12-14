export interface WeatherStationData {
  id: string;
  stationName: string;
  region?: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: string;
  rainfall: number;
  timestamp: Date;
  audienceFocus?: 'students' | 'farmers' | 'government';
  location?: {
    latitude: number;
    longitude: number;
  };
  province?: string;
  municipality?: string;
  windVane?: string;
  mainSensors?: {
    temperature: number;
    humidity: number;
    rainfall: number;
    windVane: string;
    windSpeed: number;
  };
  extraSensors?: {
    atmosphericPressure?: number;
    solarRadiation?: number;
    soilMoisture?: number;
    uvIndex?: number;
    visibility?: number;
  };
  sensorTypes?: string[];
}
