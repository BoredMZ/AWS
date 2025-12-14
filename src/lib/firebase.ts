    import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, type Database } from 'firebase/database';
import type { WeatherStationData } from '@/types/weather';
import { getFirebaseConfig } from './firebaseConfig';

const firebaseConfig = getFirebaseConfig();

let app = initializeApp(firebaseConfig);
let database: Database | null = null;

export const initializeFirebase = () => {
  if (!database) {
    database = getDatabase(app);
  }
  return database;
};

export const subscribeToWeatherData = (
  callback: (data: WeatherStationData[]) => void,
  isTestMode: boolean = false
): (() => void) => {
  try {
    if (!database) {
      database = getDatabase(app);
    }
    
    // Use different paths for real vs test data
    const path = isTestMode ? 'testWeatherStations' : 'weatherStations';
    const weatherRef = ref(database, path);

    const unsubscribe = onValue(
      weatherRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const weatherArray: WeatherStationData[] = Object.entries(data).map(
            ([key, value]: [string, any]) => {
              const station: WeatherStationData = {
                id: key,
                stationName: value.stationName || 'Unknown Station',
                region: value.region || 'Unknown',
                province: value.province,
                municipality: value.municipality,
                temperature: value.temperature || 0,
                humidity: value.humidity || 0,
                pressure: value.pressure || 0,
                windSpeed: value.windSpeed || 0,
                windDirection: value.windDirection || 'N',
                windVane: value.windVane,
                rainfall: value.rainfall || 0,
                timestamp: value.timestamp 
                  ? new Date(value.timestamp) 
                  : new Date(),
                audienceFocus: value.audienceFocus || 'students',
                location: value.location,
                mainSensors: value.mainSensors,
                extraSensors: value.extraSensors,
                sensorTypes: value.sensorTypes,
              };
              
              // Debug logging for extra sensors
              if (value.extraSensors && Object.keys(value.extraSensors).length > 0) {
                console.log(`📊 Station: ${station.stationName}`, {
                  extraSensors: value.extraSensors,
                  windVane: value.windVane,
                });
              }
              
              return station;
            }
          );
          callback(weatherArray);
        }
      },
      (error) => {
        console.error('Error reading weather data:', error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to weather data:', error);
    return () => {};
  }
};
