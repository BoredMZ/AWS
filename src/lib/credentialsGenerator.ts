/**
 * Generate ESP32 credentials configuration file
 * Outputs a JSON file suitable for ESP32 devices to connect to Firebase
 */

interface ESP32Credentials {
  firebase_api_key: string;
  firebase_auth_domain: string;
  firebase_database_url: string;
  firebase_project_id: string;
  firebase_storage_bucket: string;
  firebase_messaging_sender_id: string;
  firebase_app_id: string;
  device_type: string;
  created_at: string;
}

export const generateESP32Credentials = (): ESP32Credentials => {
  return {
    firebase_api_key: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDN0rnOH0P92wPvO2ggPuDXvq5BOfBjNjQ',
    firebase_auth_domain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'autoweathersys.firebaseapp.com',
    firebase_database_url: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://autoweathersys-default-rtdb.asia-southeast1.firebasedatabase.app',
    firebase_project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'autoweathersys',
    firebase_storage_bucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'autoweathersys.appspot.com',
    firebase_messaging_sender_id: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '866976850819',
    firebase_app_id: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:866976850819:web:9c7e6b6f3c2e1d0f0a9b8c',
    device_type: 'ESP32',
    created_at: new Date().toISOString(),
  };
};

export const downloadCredentials = (): void => {
  const credentials = generateESP32Credentials();
  const dataStr = JSON.stringify(credentials, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `esp32_credentials_${new Date().getTime()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

interface ArduinoCodeOptions {
  stationLocation?: string;
  stationName?: string;
  sensors?: string[];
  rainfallComponent?: string;
  windSpeedComponent?: string;
}

export const COMPONENT_ALTERNATIVES = {
  RAINFALL: {
    default: 'TipBucket_RainGauge',
    alternatives: [
      { 
        id: 'TipBucket_RainGauge', 
        name: 'Tip Bucket Rain Gauge (Default)', 
        pins: 'GPIO_35',
        calibration: '0.254',
        description: 'Standard tipping bucket with magnetic reed switch'
      },
      { 
        id: 'reedSwitch_RainGauge', 
        name: 'Reed Switch Rain Gauge', 
        pins: 'GPIO_35',
        calibration: '0.2',
        description: 'Direct reed switch with magnet-triggered bucket'
      },
      { 
        id: 'capac_RainSensor', 
        name: 'Capacitive Rain Sensor', 
        pins: 'ADC0 (GPIO_36)',
        calibration: '0.5',
        description: 'Analog capacitive sensor for gradual rainfall detection'
      },
      { 
        id: 'optical_RainGauge', 
        name: 'Optical Rain Gauge', 
        pins: 'GPIO_32',
        calibration: '0.254',
        description: 'Optical sensor detects bucket tip motion'
      },
    ]
  },
  WIND_SPEED: {
    default: 'Anemometer_3Cup',
    alternatives: [
      { 
        id: 'Anemometer_3Cup', 
        name: '3-Cup Anemometer (Default)', 
        pins: 'GPIO_34',
        calibration: '2.4',
        description: 'Traditional 3-cup anemometer with reed switch'
      },
      { 
        id: 'reedSwitch_Anemometer', 
        name: 'Reed Switch Anemometer', 
        pins: 'GPIO_34',
        calibration: '2.0',
        description: 'Magnet on cup rotor triggers reed switch for each rotation'
      },
      { 
        id: 'hotwire_Anemometer', 
        name: 'Hot Wire Anemometer', 
        pins: 'ADC1 (GPIO_39)',
        calibration: '1.0',
        description: 'Analog hot wire sensor for fine wind speed resolution'
      },
      { 
        id: 'sonic_Anemometer', 
        name: 'Sonic Anemometer', 
        pins: 'RX/TX (GPIO_16/17)',
        calibration: 'Serial',
        description: 'Ultrasonic sensor with serial output (higher accuracy)'
      },
      { 
        id: 'propeller_Anemometer', 
        name: 'Propeller Anemometer', 
        pins: 'GPIO_32',
        calibration: '1.8',
        description: 'Propeller rotor with reed switch counting'
      },
    ]
  }
};

export const STATION_CONFIG: Record<string, { name: string; municipality: string; province: string; sensors: string[] }> = {
  manila: {
    name: 'Manila Weather Station',
    municipality: 'Manila',
    province: 'Metro Manila',
    sensors: ['atmosphericPressure', 'solarRadiation'],
  },
  laguna: {
    name: 'Laguna Weather Station',
    municipality: 'Santa Rosa',
    province: 'Laguna',
    sensors: ['soilMoisture'],
  },
  pampanga: {
    name: 'Pampanga Weather Station',
    municipality: 'Capas',
    province: 'Pampanga',
    sensors: ['uvIndex', 'visibility'],
  },
  cavite: {
    name: 'Cavite Weather Station',
    municipality: 'Kawit',
    province: 'Cavite',
    sensors: [],
  },
  bulacan: {
    name: 'Bulacan Weather Station',
    municipality: 'Bulacan',
    province: 'Bulacan',
    sensors: ['soilMoisture', 'atmosphericPressure'],
  },
  batangas: {
    name: 'Batangas Station',
    municipality: 'Lipa',
    province: 'Batangas',
    sensors: ['uvIndex'],
  },
};

export const generateArduinoCode = (options?: ArduinoCodeOptions): string => {
  const credentials = generateESP32Credentials();
  const dbUrl = credentials.firebase_database_url;
  const host = dbUrl.replace('https://', '').replace('.firebasedatabase.app', '');
  
  const location = options?.stationLocation || 'manila';
  const config = STATION_CONFIG[location];
  const stationName = options?.stationName || config?.name || 'Manila Weather Station';
  const municipality = config?.municipality || 'Manila';
  const province = config?.province || 'Metro Manila';
  const selectedSensors = options?.sensors || config?.sensors || ['atmosphericPressure', 'solarRadiation'];
  
  // Component selection
  const rainfallComponent = options?.rainfallComponent || COMPONENT_ALTERNATIVES.RAINFALL.default;
  const windSpeedComponent = options?.windSpeedComponent || COMPONENT_ALTERNATIVES.WIND_SPEED.default;
  
  const rainfallConfig = COMPONENT_ALTERNATIVES.RAINFALL.alternatives.find(c => c.id === rainfallComponent) || COMPONENT_ALTERNATIVES.RAINFALL.alternatives[0];
  const windSpeedConfig = COMPONENT_ALTERNATIVES.WIND_SPEED.alternatives.find(c => c.id === windSpeedComponent) || COMPONENT_ALTERNATIVES.WIND_SPEED.alternatives[0];
  
  // Generate sensor defines
  const sensorDefines = selectedSensors
    .map(sensor => {
      switch (sensor) {
        case 'atmosphericPressure': return '#define HAS_ATMOSPHERIC_PRESSURE';
        case 'solarRadiation': return '#define HAS_SOLAR_RADIATION';
        case 'soilMoisture': return '#define HAS_SOIL_MOISTURE';
        case 'uvIndex': return '#define HAS_UV_INDEX';
        case 'visibility': return '#define HAS_VISIBILITY';
        default: return '';
      }
    })
    .filter(Boolean)
    .join('\n');
  
  return `/*
 * ESP32 Weather Station Sensor Template
 * 
 * Purpose: Arduino sketch for ESP32 microcontroller to read weather sensors
 * and upload data to Firebase Realtime Database
 * 
 * Target Path: /weatherStations/{stationLocation}/
 * 
 * Generated: ${credentials.created_at}
 * Firebase Project: ${credentials.firebase_project_id}
 * 
 * Station: ${stationName} (${municipality}, ${province})
 * Rainfall Component: ${rainfallConfig.name}
 * Wind Speed Component: ${windSpeedConfig.name}
 * 
 * Required Libraries:
 * - Firebase Realtime Database (firebase-esp32)
 * - DHT Sensor Library (for temperature & humidity)
 * 
 * Installation:
 * 1. Arduino IDE → Sketch → Include Library → Manage Libraries
 * 2. Search and install: "Firebase Arduino Client Library by Mobizt"
 * 3. Configure WiFi and Firebase credentials below
 * 4. Set STATION_LOCATION and sensor flags
 * 5. Upload to ESP32
 */

#include <WiFi.h>
#include <Firebase.h>
#include <FirebaseJSON.h>
#include "time.h"

// ============================================
// CONFIGURATION - MODIFY THESE SETTINGS
// ============================================

// WiFi Credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Firebase Configuration
const char* firebaseHost = "${host}.firebaseio.com";
const char* firebaseAuth = "YOUR_FIREBASE_DATABASE_SECRET";

// Station Configuration
const char* STATION_LOCATION = "${location}";
const char* STATION_NAME = "${stationName}";
const char* MUNICIPALITY = "${municipality}";
const char* PROVINCE = "${province}";

// Sensor Type Configuration (PRE-CONFIGURED FOR YOUR STATION)
${sensorDefines || '// No extra sensors configured for this station'}

// Component Configuration
#define RAINFALL_COMPONENT "${rainfallComponent}"
#define WIND_SPEED_COMPONENT "${windSpeedComponent}"

// ============================================
// COMPONENT PIN & CALIBRATION CONFIGURATION
// ============================================

// Rainfall Sensor Configuration
#define RAINFALL_PIN ${rainfallConfig.pins}
#define RAINFALL_MM_PER_TIP ${rainfallConfig.calibration}  // Component: ${rainfallConfig.name}
// ${rainfallConfig.description}

// Wind Speed Sensor Configuration
#define WIND_SPEED_PIN ${windSpeedConfig.pins}
#define WIND_SPEED_CALIBRATION ${windSpeedConfig.calibration}  // Component: ${windSpeedConfig.name}
// ${windSpeedConfig.description}

#define UPDATE_INTERVAL 30000   // Upload data every 30 seconds

// ============================================
// GLOBAL VARIABLES & FIREBASE SETUP
// ============================================

FirebaseData firebaseData;
unsigned long lastUpdateTime = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\\n=== ESP32 Weather Station Starting ===");
  Serial.print("Station: ");
  Serial.println(STATION_LOCATION);
  
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  connectToWiFi();
  
  Firebase.begin(firebaseHost, firebaseAuth);
  Firebase.reconnectWiFi(true);
  
  Serial.println("✓ Setup complete");
}

void loop() {
  if (millis() - lastUpdateTime >= UPDATE_INTERVAL) {
    lastUpdateTime = millis();
    
    // Read sensors (implement your actual sensor code)
    float temperature = 25.0 + (random(0, 50) / 10.0);
    float humidity = 60.0 + (random(0, 200) / 10.0);
    
    // Read rainfall sensor based on selected component
    float rainfall = readRainfallSensor();
    
    // Read wind speed sensor based on selected component
    float windSpeed = readWindSpeedSensor();
    String windDirection = "N";
    
    // Prepare Firebase JSON
    FirebaseJson json;
    json.set("region", STATION_LOCATION);
    json.set("stationName", STATION_NAME);
    json.set("municipality", MUNICIPALITY);
    json.set("province", PROVINCE);
    
    // Main sensors (all stations)
    json.set("mainSensors/temperature", temperature);
    json.set("mainSensors/humidity", humidity);
    json.set("mainSensors/rainfall", rainfall);
    json.set("mainSensors/windVane", windDirection);
    json.set("mainSensors/windSpeed", windSpeed);
    
    // Extra sensors (station-specific)
#ifdef HAS_ATMOSPHERIC_PRESSURE
    json.set("extraSensors/atmosphericPressure", 1013.25);
#endif

#ifdef HAS_SOLAR_RADIATION
    json.set("extraSensors/solarRadiation", 500.0);
#endif

#ifdef HAS_SOIL_MOISTURE
    json.set("extraSensors/soilMoisture", 45.0);
#endif

#ifdef HAS_UV_INDEX
    json.set("extraSensors/uvIndex", 5.0);
#endif

#ifdef HAS_VISIBILITY
    json.set("extraSensors/visibility", 10000.0);
#endif
    
    json.set("timestamp", getTimestamp());
    json.set("lastUpdated", getTimestamp());
    
    // Upload to /weatherStations/{stationLocation}
    String path = "/weatherStations/";
    path += STATION_LOCATION;
    
    if (Firebase.set(firebaseData, path, json)) {
      Serial.print("✓ Data uploaded: ");
      Serial.print(temperature);
      Serial.println("°C");
    } else {
      Serial.print("✗ Error: ");
      Serial.println(firebaseData.errorReason());
    }
  }
  delay(100);
}

void connectToWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  int attempts = 0;
  
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\\n✓ WiFi connected");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\\n✗ WiFi failed");
  }
}

String getTimestamp() {
  time_t now = time(nullptr);
  struct tm* timeinfo = gmtime(&now);
  char buffer[30];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%S", timeinfo);
  return String(buffer) + "Z";
}

// ============================================
// SENSOR READING FUNCTIONS
// ============================================

float readRainfallSensor() {
  // Implement rainfall sensor reading based on component type
  // #if defined(RAINFALL_COMPONENT) && RAINFALL_COMPONENT == "reedSwitch_RainGauge"
  //   // Reed switch implementation
  //   return readReedSwitchRainfallTips() * RAINFALL_MM_PER_TIP;
  // #else
  //   // Default tip bucket or capacitive
  //   return readRainfallTips() * RAINFALL_MM_PER_TIP;
  // #endif
  return 0.0;  // Placeholder
}

float readWindSpeedSensor() {
  // Implement wind speed sensor reading based on component type
  // #if defined(WIND_SPEED_COMPONENT) && WIND_SPEED_COMPONENT == "reedSwitch_Anemometer"
  //   // Reed switch anemometer implementation
  //   return getAnemometerRPM() * WIND_SPEED_CALIBRATION;
  // #elif defined(WIND_SPEED_COMPONENT) && WIND_SPEED_COMPONENT == "hotwire_Anemometer"
  //   // Hot wire sensor analog reading
  //   return getAnalogWindSpeed() * WIND_SPEED_CALIBRATION;
  // #else
  //   // Default 3-cup anemometer
  //   return getAnemometerRPM() * WIND_SPEED_CALIBRATION;
  // #endif
  return 5.0;  // Placeholder
}

// ============================================
// Station Configurations:
// Manila: HAS_ATMOSPHERIC_PRESSURE, HAS_SOLAR_RADIATION
// Laguna: HAS_SOIL_MOISTURE
// Pampanga: HAS_UV_INDEX, HAS_VISIBILITY
// Cavite: (no extra sensors)
// Bulacan: HAS_SOIL_MOISTURE, HAS_ATMOSPHERIC_PRESSURE
// Batangas: HAS_UV_INDEX
// ============================================

// ============================================
// RAINFALL COMPONENT OPTIONS:
// - TipBucket_RainGauge (0.254mm per tip)
// - reedSwitch_RainGauge (0.2mm per tip)
// - capac_RainSensor (0.5mm calibration)
// - optical_RainGauge (0.254mm per tip)
//
// WIND SPEED COMPONENT OPTIONS:
// - Anemometer_3Cup (2.4 km/h per Hz)
// - reedSwitch_Anemometer (2.0 km/h per Hz)
// - hotwire_Anemometer (analog, 1.0 scaling)
// - sonic_Anemometer (serial, high accuracy)
// - propeller_Anemometer (1.8 km/h per Hz)
// ============================================
`;
};

export const downloadArduinoCode = (options?: ArduinoCodeOptions): void => {
  const code = generateArduinoCode(options);
  const location = options?.stationLocation || 'manila';
  const dataBlob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `esp32_weather_station_${location}.ino`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
