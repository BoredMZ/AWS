#!/usr/bin/env node

/**
 * Script to generate initial test data for Philippine weather stations
 * Populates the /testWeatherStations/ path with sample test data
 * Run with: node scripts/generate-test-data.js
 */

const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin
const path = require('path');
const serviceAccount = require(path.resolve(__dirname, '../.credentials/autoweathersys-firebase-adminsdk-fbsvc-5682673736.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
});

const db = admin.database();

// Philippine Luzon weather stations (6 locations) with main and extra sensors - TEST DATA
const testStations = [
  {
    region: 'Manila',
    stationName: 'Manila Weather Station',
    municipality: 'Manila',
    province: 'Metro Manila',
    mainSensors: {
      temperature: 26.8,
      humidity: 68,
      rainfall: 0.5,
      windVane: 'NW',
      windSpeed: 7.2,
    },
    extraSensors: {
      atmosphericPressure: 1012.5,
      solarRadiation: 920,
    },
    sensorTypes: ['atmosphericPressure', 'solarRadiation'],
  },
  {
    region: 'Laguna',
    stationName: 'Laguna Weather Station',
    municipality: 'Santa Rosa',
    province: 'Laguna',
    mainSensors: {
      temperature: 27.5,
      humidity: 71,
      rainfall: 0.2,
      windVane: 'SE',
      windSpeed: 5.8,
    },
    extraSensors: {
      soilMoisture: 52.1,
    },
    sensorTypes: ['soilMoisture'],
  },
  {
    region: 'Pampanga',
    stationName: 'Pampanga Weather Station',
    municipality: 'Capas',
    province: 'Pampanga',
    mainSensors: {
      temperature: 29.4,
      humidity: 65,
      rainfall: 0,
      windVane: 'SW',
      windSpeed: 9.1,
    },
    extraSensors: {
      uvIndex: 7.8,
      visibility: 9500,
    },
    sensorTypes: ['uvIndex', 'visibility'],
  },
  {
    region: 'Cavite',
    stationName: 'Cavite Weather Station',
    municipality: 'Kawit',
    province: 'Cavite',
    mainSensors: {
      temperature: 28.3,
      humidity: 67,
      rainfall: 0.1,
      windVane: 'W',
      windSpeed: 8.5,
    },
    extraSensors: {},
    sensorTypes: [],
  },
  {
    region: 'Bulacan',
    stationName: 'Bulacan Weather Station',
    municipality: 'Bulacan',
    province: 'Bulacan',
    mainSensors: {
      temperature: 26.9,
      humidity: 73,
      rainfall: 0.8,
      windVane: 'N',
      windSpeed: 6.3,
    },
    extraSensors: {
      soilMoisture: 48.5,
      atmosphericPressure: 1013.8,
    },
    sensorTypes: ['soilMoisture', 'atmosphericPressure'],
  },
  {
    region: 'Batangas',
    stationName: 'Batangas Station',
    municipality: 'Lipa',
    province: 'Batangas',
    mainSensors: {
      temperature: 28.7,
      humidity: 69,
      rainfall: 0.3,
      windVane: 'E',
      windSpeed: 7.9,
    },
    extraSensors: {
      uvIndex: 8.1,
    },
    sensorTypes: ['uvIndex'],
  },
];

async function generateTestData() {
  try {
    console.log('🧪 Generating initial test data for 6 Luzon weather stations...\n');

    for (let i = 0; i < testStations.length; i++) {
      const station = testStations[i];
      const stationKey = station.region.toLowerCase().replace(/\s+/g, '');

      // Add timestamp and last updated
      const stationData = {
        ...station,
        timestamp: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      await db.ref(`testWeatherStations/${stationKey}`).set(stationData);

      // Display sensible emoji indicator
      let sensorEmojis = '';
      if (station.sensorTypes.includes('atmosphericPressure'))
        sensorEmojis += '🏙️ ';
      if (station.sensorTypes.includes('solarRadiation')) sensorEmojis += '☀️ ';
      if (station.sensorTypes.includes('soilMoisture')) sensorEmojis += '🌱 ';
      if (station.sensorTypes.includes('uvIndex')) sensorEmojis += '🌞 ';
      if (station.sensorTypes.includes('visibility')) sensorEmojis += '👁️ ';

      console.log(
        `✓ ${i + 1}. ${station.region} - ${station.mainSensors.temperature}°C ${sensorEmojis.trim() || '(main only)'}`
      );
    }

    console.log(
      '\n✅ Test data successfully uploaded to Firebase at /testWeatherStations/!'
    );
    console.log(`📊 Total stations: ${testStations.length}`);
    console.log('📍 Region: Luzon (Philippines)');
    console.log(`🕐 Timestamp: ${new Date().toISOString()}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating test data:', error);
    process.exit(1);
  }
}

generateTestData();
