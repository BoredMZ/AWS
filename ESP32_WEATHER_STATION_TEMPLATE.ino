/*
 * ESP32 Weather Station Sensor Template
 * 
 * Purpose: Arduino sketch for ESP32 microcontroller to read weather sensors
 * and upload data to Firebase Realtime Database
 * 
 * Target Path: /weatherStations/{stationLocation}/
 * 
 * Required Libraries:
 * - Firebase Realtime Database (firebase-esp32)
 * - DHT Sensor Library (for temperature & humidity)
 * - Adjust based on your actual sensors
 * 
 * Installation:
 * 1. Arduino IDE → Sketch → Include Library → Manage Libraries
 * 2. Search and install:
 *    - "Firebase Arduino Client Library by Mobizt"
 *    - "DHT sensor library by Adafruit" (if using DHT sensor)
 * 3. Configure WiFi and Firebase credentials below
 * 4. Upload to ESP32
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
const char* firebaseHost = "your-project.firebaseio.com";
const char* firebaseAuth = "your_firebase_database_secret";

// Station Configuration
const char* STATION_LOCATION = "manila";  // Change per station: manila, laguna, pampanga, cavite, bulacan, batangas
const char* STATION_NAME = "Manila Weather Station";
const char* MUNICIPALITY = "Manila";
const char* PROVINCE = "Metro Manila";

// Sensor Pins
#define DHT_PIN 4              // Temperature & Humidity sensor (GPIO 4)
#define RAIN_GAUGE_PIN 5       // Rain gauge (GPIO 5)
#define WIND_SPEED_PIN 12      // Anemometer (GPIO 12)
#define WIND_DIRECTION_PIN 34  // Wind vane (analog pin)

// Water Level Sensor Pins (if using water level sensor)
// #define WATER_LEVEL_TRIG_PIN 22    // Ultrasonic trigger (GPIO 22)
// #define WATER_LEVEL_ECHO_PIN 23    // Ultrasonic echo (GPIO 23)
// #define WATER_LEVEL_ANALOG_PIN 26  // Capacitive analog (GPIO 26)
// #define WATER_LEVEL_DIGITAL_PIN 25 // Float switch (GPIO 25)

// Sensor Type Configuration
// Define which extra sensors this station has
// Uncomment the ones YOUR station uses
#define HAS_ATMOSPHERIC_PRESSURE  // Manila: YES
#define HAS_SOLAR_RADIATION       // Manila: YES
// #define HAS_SOIL_MOISTURE       // Laguna: YES
// #define HAS_UV_INDEX            // Pampanga: YES
// #define HAS_VISIBILITY          // Pampanga: YES
// #define HAS_WATER_LEVEL         // Optional: Water level monitoring

// Update Interval (milliseconds)
#define UPDATE_INTERVAL 30000   // Upload data every 30 seconds

// ============================================
// GLOBAL VARIABLES
// ============================================

FirebaseData firebaseData;
unsigned long lastUpdateTime = 0;
float temperature = 0;
float humidity = 0;
float rainfall = 0;
float windSpeed = 0;
String windDirection = "N";

// For atmospheric pressure (if available)
#ifdef HAS_ATMOSPHERIC_PRESSURE
float atmosphericPressure = 1013.25;
#endif

// For solar radiation (if available)
#ifdef HAS_SOLAR_RADIATION
float solarRadiation = 0;
#endif

// For soil moisture (if available)
#ifdef HAS_SOIL_MOISTURE
float soilMoisture = 0;
#endif

// For water level (if available)
#ifdef HAS_WATER_LEVEL
float waterLevel = 0;  // cm or meters depending on sensor
#endif

// For UV index (if available)
#ifdef HAS_UV_INDEX
float uvIndex = 0;
#endif

// For visibility (if available)
#ifdef HAS_VISIBILITY
float visibility = 10000;  // meters
#endif

// ============================================
// SETUP
// ============================================

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n");
  Serial.println("=== ESP32 Weather Station Starting ===");
  Serial.print("Station: ");
  Serial.println(STATION_LOCATION);
  
  // Configure time for timestamp
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  
  // Connect to WiFi
  connectToWiFi();
  
  // Configure Firebase
  Firebase.begin(firebaseHost, firebaseAuth);
  Firebase.reconnectWiFi(true);
  
  // Configure sensor pins
  pinMode(DHT_PIN, INPUT);
  pinMode(RAIN_GAUGE_PIN, INPUT);
  pinMode(WIND_SPEED_PIN, INPUT);
  pinMode(WIND_DIRECTION_PIN, INPUT);
  
  Serial.println("✓ Setup complete");
}

// ============================================
// MAIN LOOP
// ============================================

void loop() {
  // Check if it's time to update
  if (millis() - lastUpdateTime >= UPDATE_INTERVAL) {
    lastUpdateTime = millis();
    
    // Read all sensors
    readSensors();
    
    // Prepare data structure
    FirebaseJson json;
    
    // Add basic metadata
    json.set("region", STATION_LOCATION);
    json.set("stationName", STATION_NAME);
    json.set("municipality", MUNICIPALITY);
    json.set("province", PROVINCE);
    
    // Add main sensors (all stations have these)
    json.set("mainSensors/temperature", temperature);
    json.set("mainSensors/humidity", humidity);
    json.set("mainSensors/rainfall", rainfall);
    json.set("mainSensors/windVane", windDirection);
    json.set("mainSensors/windSpeed", windSpeed);
    
    // Add extra sensors based on station configuration
    #ifdef HAS_ATMOSPHERIC_PRESSURE
    json.set("extraSensors/atmosphericPressure", atmosphericPressure);
    #endif
    
    #ifdef HAS_SOLAR_RADIATION
    json.set("extraSensors/solarRadiation", solarRadiation);
    #endif
    
    #ifdef HAS_SOIL_MOISTURE
    json.set("extraSensors/soilMoisture", soilMoisture);
    #endif
    
    #ifdef HAS_UV_INDEX
    json.set("extraSensors/uvIndex", uvIndex);
    #endif
    
    #ifdef HAS_VISIBILITY
    json.set("extraSensors/visibility", visibility);
    #endif
    
    #ifdef HAS_WATER_LEVEL
    json.set("extraSensors/waterLevel", waterLevel);
    #endif
    
    // Add sensorTypes array
    String sensorTypes = "[\"temperature\",\"humidity\",\"rainfall\",\"windVane\",\"windSpeed\"";
    #ifdef HAS_ATMOSPHERIC_PRESSURE
    sensorTypes += ",\"atmosphericPressure\"";
    #endif
    #ifdef HAS_SOLAR_RADIATION
    sensorTypes += ",\"solarRadiation\"";
    #endif
    #ifdef HAS_SOIL_MOISTURE
    sensorTypes += ",\"soilMoisture\"";
    #endif
    #ifdef HAS_UV_INDEX
    sensorTypes += ",\"uvIndex\"";
    #endif
    #ifdef HAS_VISIBILITY
    sensorTypes += ",\"visibility\"";
    #endif
    #ifdef HAS_WATER_LEVEL
    sensorTypes += ",\"waterLevel\"";
    #endif
    sensorTypes += "]";
    
    // Add timestamps
    String timestamp = getTimestamp();
    json.set("timestamp", timestamp);
    json.set("lastUpdated", timestamp);
    
    // Upload to Firebase path: /weatherStations/{stationLocation}
    String firebasePath = "/weatherStations/";
    firebasePath += STATION_LOCATION;
    
    if (Firebase.set(firebaseData, firebasePath, json)) {
      Serial.print("✓ Data uploaded: ");
      Serial.print(temperature);
      Serial.print("°C, ");
      Serial.print(windSpeed);
      Serial.println(" m/s");
    } else {
      Serial.print("✗ Firebase error: ");
      Serial.println(firebaseData.errorReason());
    }
  }
  
  delay(100);  // Small delay to prevent watchdog timeout
}

// ============================================
// SENSOR READING FUNCTIONS
// ============================================

void readSensors() {
  // Read Temperature & Humidity (DHT22 example)
  // You may need to adjust based on your actual sensor
  temperature = readTemperature();  // Should be 15-35°C
  humidity = readHumidity();        // Should be 0-100%
  
  // Read Rainfall (tipping bucket example)
  // Each tip = 0.2mm of rain
  rainfall = readRainfall();        // Should be 0-5mm per reading
  
  // Read Wind Speed (anemometer example)
  // 1 rotation per second = 2.4 km/h = 0.67 m/s
  windSpeed = readWindSpeed();      // Should be 0-20 m/s
  
  // Read Wind Direction (wind vane)
  windDirection = readWindDirection();  // N, NE, E, SE, S, SW, W, NW
  
  // Optional: Read extra sensors based on station config
  #ifdef HAS_ATMOSPHERIC_PRESSURE
  atmosphericPressure = readAtmosphericPressure();  // ~1000-1050 hPa
  #endif
  
  #ifdef HAS_SOLAR_RADIATION
  solarRadiation = readSolarRadiation();            // 0-1000 W/m²
  #endif
  
  #ifdef HAS_SOIL_MOISTURE
  soilMoisture = readSoilMoisture();                // 0-100%
  #endif
  
  #ifdef HAS_UV_INDEX
  uvIndex = readUVIndex();                          // 0-11+
  #endif
  
  #ifdef HAS_VISIBILITY
  visibility = readVisibility();                    // meters
  #endif
  
  #ifdef HAS_WATER_LEVEL
  waterLevel = readWaterLevel();                    // cm or meters
  #endif
}

// Main Sensor Readings (customize based on your hardware)

float readTemperature() {
  // Example: DHT22 sensor
  // Replace with your actual sensor reading code
  // For now, returning realistic Philippine temperature
  return 25.0 + (random(0, 50) / 10.0);  // 25-30°C range
}

float readHumidity() {
  // Example: DHT22 sensor
  return 60.0 + (random(0, 200) / 10.0);  // 60-80% range
}

float readRainfall() {
  // Example: Tipping bucket rain gauge
  // Count pulses on RAIN_GAUGE_PIN
  // Each pulse = 0.2mm
  int pulses = 0;  // Read from sensor
  return pulses * 0.2;
}

float readWindSpeed() {
  // Example: Cup anemometer
  // Count rotations on WIND_SPEED_PIN
  // Each rotation = 0.67 m/s
  int rotations = 0;  // Read from sensor
  return rotations * 0.67;
}

String readWindDirection() {
  // Example: Wind vane on analog pin
  int analogValue = analogRead(WIND_DIRECTION_PIN);
  // Convert analog value to direction
  // 0=N, 45=NE, 90=E, 135=SE, 180=S, 225=SW, 270=W, 315=NW
  
  if (analogValue < 23) return "N";
  if (analogValue < 68) return "NE";
  if (analogValue < 113) return "E";
  if (analogValue < 158) return "SE";
  if (analogValue < 203) return "S";
  if (analogValue < 248) return "SW";
  if (analogValue < 293) return "W";
  return "NW";
}

// Optional Extra Sensor Readings

#ifdef HAS_ATMOSPHERIC_PRESSURE
float readAtmosphericPressure() {
  // Example: BME280 or BMP280 sensor
  // Connect via I2C
  return 1013.25 + (random(0, 50) / 10.0);  // 1013-1018 hPa
}
#endif

#ifdef HAS_SOLAR_RADIATION
float readSolarRadiation() {
  // Example: Pyranometer sensor on analog pin
  int analogValue = analogRead(A0);
  // Convert analog to W/m² (depends on sensor calibration)
  return analogValue * 0.5;  // Example conversion
}
#endif

#ifdef HAS_SOIL_MOISTURE
float readSoilMoisture() {
  // Example: Capacitive soil moisture sensor
  int analogValue = analogRead(A1);
  // Calibration: dry=600, wet=300, convert to 0-100%
  float percentage = map(analogValue, 600, 300, 0, 100);
  return constrain(percentage, 0, 100);
}
#endif

#ifdef HAS_UV_INDEX
float readUVIndex() {
  // Example: ML8511 UV sensor
  int analogValue = analogRead(A2);
  // Convert analog to UV index (depends on calibration)
  return analogValue / 100.0;  // Example conversion
}
#endif

#ifdef HAS_WATER_LEVEL
float readWaterLevel() {
  // Example implementations for different water level sensors:
  
  // Option 1: Ultrasonic Sensor (HC-SR04)
  // digitalWrite(WATER_LEVEL_TRIG_PIN, LOW);
  // delayMicroseconds(2);
  // digitalWrite(WATER_LEVEL_TRIG_PIN, HIGH);
  // delayMicroseconds(10);
  // digitalWrite(WATER_LEVEL_TRIG_PIN, LOW);
  // long duration = pulseIn(WATER_LEVEL_ECHO_PIN, HIGH);
  // float distance = duration * 0.0173; // cm
  // return distance;
  
  // Option 2: Capacitive Analog Sensor
  // int analogValue = analogRead(WATER_LEVEL_ANALOG_PIN);
  // float level = map(analogValue, 0, 4095, 0, 100) / 100.0;  // 0-100% to 0-1.0
  // return level;
  
  // Option 3: Float Switch (Binary)
  // bool waterPresent = digitalRead(WATER_LEVEL_DIGITAL_PIN);
  // return waterPresent ? 100.0 : 0.0;  // 100cm if present, 0cm if not
  
  // Option 4: Pressure-based (at tank bottom)
  // float pressureReading = readI2CPressure();
  // float waterHeight = (pressureReading - 101.325) * 10.19;  // cm
  // return waterHeight;
  
  // For now, returning placeholder value
  return 0.0;  // cm or percentage depending on your sensor
}
#endif

// ============================================
// UTILITY FUNCTIONS
// ============================================

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
    Serial.println("\n✓ WiFi connected");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n✗ WiFi connection failed");
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
// STATION CONFIGURATION REFERENCE
// ============================================

/*
 * Configure each station by setting:
 * 1. STATION_LOCATION (manila, laguna, pampanga, cavite, bulacan, batangas)
 * 2. STATION_NAME, MUNICIPALITY, PROVINCE
 * 3. Comment/uncomment #define lines for extra sensors
 * 
 * Station Configurations:
 * 
 * MANILA:
 * - Location: manila
 * - Extra Sensors: HAS_ATMOSPHERIC_PRESSURE, HAS_SOLAR_RADIATION
 * 
 * LAGUNA:
 * - Location: laguna
 * - Extra Sensors: HAS_SOIL_MOISTURE
 * 
 * PAMPANGA:
 * - Location: pampanga
 * - Extra Sensors: HAS_UV_INDEX, HAS_VISIBILITY
 * 
 * CAVITE:
 * - Location: cavite
 * - Extra Sensors: (none)
 * 
 * BULACAN:
 * - Location: bulacan
 * - Extra Sensors: HAS_SOIL_MOISTURE, HAS_ATMOSPHERIC_PRESSURE
 * 
 * BATANGAS:
 * - Location: batangas
 * - Extra Sensors: HAS_UV_INDEX
 * 
 * All stations have main sensors:
 * - Temperature, Humidity, Rainfall, Wind Vane, Wind Speed
 */

// ============================================
// FIREBASE PATH STRUCTURE
// ============================================

/*
 * This sketch uploads to: /weatherStations/{stationLocation}/
 * 
 * Example: /weatherStations/manila/
 * {
 *   "region": "manila",
 *   "stationName": "Manila Weather Station",
 *   "municipality": "Manila",
 *   "province": "Metro Manila",
 *   "mainSensors": {
 *     "temperature": 28.5,
 *     "humidity": 72,
 *     "rainfall": 0,
 *     "windVane": "NE",
 *     "windSpeed": 8.5
 *   },
 *   "extraSensors": {
 *     "atmosphericPressure": 1013.2,
 *     "solarRadiation": 850
 *   },
 *   "sensorTypes": ["temperature", "humidity", ..., "atmosphericPressure", "solarRadiation"],
 *   "timestamp": "2025-12-14T12:34:56Z",
 *   "lastUpdated": "2025-12-14T12:34:56Z"
 * }
 * 
 * TEST DATA is in /testWeatherStations/ (populated by dashboard)
 * 
 * DO NOT modify /testWeatherStations/ from ESP32
 * Only send real sensor data to /weatherStations/
 */

// ============================================
// TROUBLESHOOTING
// ============================================

/*
 * Issue: "Firebase error: Authentication Failed"
 * Solution: Check firebaseAuth token - use database secret, not API key
 * 
 * Issue: "WiFi connection failed"
 * Solution: Verify SSID and password are correct
 * 
 * Issue: "Data not appearing in Firebase"
 * Solution: 
 *   1. Check WiFi connection
 *   2. Verify /weatherStations/{stationLocation} path exists
 *   3. Check Firebase security rules allow writes
 *   4. View Arduino Serial Monitor for errors
 * 
 * Issue: "Sensor values seem wrong"
 * Solution: 
 *   1. Check sensor wiring
 *   2. Verify sensor pins match #define statements
 *   3. Calibrate sensors (temperature offset, etc.)
 *   4. Test sensor with dedicated Arduino sketch first
 */
