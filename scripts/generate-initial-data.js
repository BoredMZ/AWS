#!/usr/bin/env node

/**
 * Script to generate initial test data for Philippine weather stations
 * Run with: node scripts/generate-initial-data.js
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

// Philippine Luzon weather stations (6 locations) with main and extra sensors
const stations = [
  {
    region: 'Manila',
    stationName: 'Manila Weather Station',
    municipality: 'Manila',
    province: 'Metro Manila',
    mainSensors: {
      temperature: 28.5,
      humidity: 72,
      rainfall: 0,
      windVane: 'NE',
      windSpeed: 8.5,
    },
    extraSensors: {
      atmosphericPressure: 1013.2,
      solarRadiation: 850,
    },
    sensorTypes: ['atmosphericPressure', 'solarRadiation'],
  },
  {
    region: 'Laguna',
    stationName: 'Laguna Weather Station',
    municipality: 'Santa Rosa',
    province: 'Laguna',
    mainSensors: {
      temperature: 28.2,
      humidity: 74,
      rainfall: 0,
      windVane: 'E',
      windSpeed: 6.5,
    },
    extraSensors: {
      soilMoisture: 45.2,
    },
    sensorTypes: ['soilMoisture'],
  },
  {
    region: 'Pampanga',
    stationName: 'Pampanga Weather Station',
    municipality: 'Capas',
    province: 'Pampanga',
    mainSensors: {
      temperature: 30.2,
      humidity: 68,
      rainfall: 0,
      windVane: 'W',
      windSpeed: 10.5,
    },
    extraSensors: {
      uvIndex: 8.5,
      visibility: 10000,
    },
    sensorTypes: ['uvIndex', 'visibility'],
  },
  {
    region: 'Cavite',
    stationName: 'Cavite Weather Station',
    municipality: 'Kawit',
    province: 'Cavite',
    mainSensors: {
      temperature: 29.1,
      humidity: 70,
      rainfall: 0,
      windVane: 'SW',
      windSpeed: 9.2,
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
      temperature: 27.5,
      humidity: 76,
      rainfall: 1.2,
      windVane: 'N',
      windSpeed: 5.5,
    },
    extraSensors: {
      soilMoisture: 52.8,
      atmosphericPressure: 1013.1,
    },
    sensorTypes: ['soilMoisture', 'atmosphericPressure'],
  },
  {
    region: 'Batangas',
    stationName: 'Batangas Station',
    municipality: 'Lipa',
    province: 'Batangas',
    mainSensors: {
      temperature: 29.5,
      humidity: 73,
      rainfall: 0.3,
      windVane: 'SE',
      windSpeed: 8.8,
    },
    extraSensors: {
      uvIndex: 7.2,
    },
    sensorTypes: ['uvIndex'],
  },
];

async function generateInitialData() {
  try {
    console.log('🌤️ Generating initial test data for 6 Luzon weather stations...\n');

    const updates = {};
    stations.forEach((station, index) => {
      updates[station.region] = {
        stationName: station.stationName,
        municipality: station.municipality,
        province: station.province,
        region: station.region,
        // Main sensors (all stations have these)
        temperature: station.mainSensors.temperature,
        humidity: station.mainSensors.humidity,
        rainfall: station.mainSensors.rainfall,
        windVane: station.mainSensors.windVane,
        windSpeed: station.mainSensors.windSpeed,
        // Main sensors object for reference
        mainSensors: station.mainSensors,
        // Extra sensors (location-specific)
        extraSensors: station.extraSensors || {},
        // Track which sensor types this station has
        sensorTypes: station.sensorTypes || [],
        timestamp: Date.now(),
        lastUpdated: new Date().toISOString(),
      };
      const sensorList = station.sensorTypes && station.sensorTypes.length > 0 
        ? `+ ${station.sensorTypes.join(', ')}`
        : '(main sensors only)';
      console.log(`  ✓ ${index + 1}. ${station.stationName} - ${station.mainSensors.temperature}°C ${sensorList}`);
    });

    const dbRef = db.ref('weatherStations');
    await dbRef.set(updates);

    console.log('\n✅ Initial data successfully uploaded to Firebase!');
    console.log(`📊 Total stations: ${stations.length}`);
    console.log(`📍 Region: Luzon (Philippines)`);
    console.log(`🕐 Timestamp: ${new Date().toISOString()}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error uploading data:', error);
    process.exit(1);
  }
}

generateInitialData();
