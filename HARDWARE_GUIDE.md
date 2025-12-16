# Hardware Guide

ESP32 sensor components, Arduino code customization, and implementation examples.

---

## Available Sensor Components

### Rainfall Sensors (4 options)

| Name | GPIO | Calibration | Best For |
|------|------|-------------|----------|
| **Tip Bucket** (default) | GPIO_35 | 0.254 mm/tip | Most common, reliable |
| **Reed Switch** | GPIO_35 | 0.2 mm/tip | Precise counts |
| **Capacitive** | GPIO_36 | 0.5 mm | Gradual detection |
| **Optical** | GPIO_32 | 0.254 mm/tip | Digital sensing |

### Wind Speed Sensors (5 options)

| Name | GPIO | Calibration | Best For |
|------|------|-------------|----------|
| **3-Cup Anemometer** (default) | GPIO_34 | 2.4 km/h/Hz | Standard choice |
| **Reed Switch** | GPIO_34 | 2.0 km/h/Hz | Direct pulse counting |
| **Hot Wire** | GPIO_39 | 1.0 | Fine resolution |
| **Sonic** | GPIO_16/17 | Serial | Highest accuracy |
| **Propeller** | GPIO_32 | 1.8 km/h/Hz | Lightweight |

### Water Level Sensors (5 options)

| Name | GPIO/Interface | Calibration | Best For |
|------|-----------------|-------------|----------|
| **Ultrasonic** (default) | GPIO 22/23 | 0.0173 cm/pulse | Non-contact, accurate distance |
| **Capacitive** | ADC2 (GPIO 26) | 0.02 | Analog level detection |
| **Float Switch** | GPIO 25 | 0.1 | Binary high/low detection |
| **Resistive Strips** | ADC3 (GPIO 27) | 0.01 | Multi-point analog reading |
| **Pressure-based** | I2C (GPIO 21/22) | 0.002 m/hPa | Barometric height calculation |

---

## Arduino Code Customization

### How It Works

1. Go to dashboard → Click 🤖 **ESP32**
2. Click **"Customize Sensors"**
3. Select station & sensors
4. Click **"🔧 Customize Components"**
5. Choose rainfall & wind sensors
6. Code auto-generates with:
   - Correct PIN assignments
   - Component calibration values
   - Component descriptions
   - Sensor reading function stubs

### Generated Code Structure

```cpp
// Station Configuration (AUTO-FILLED)
const char* STATION_LOCATION = "manila";
const char* STATION_NAME = "Manila Weather Station";
const char* AUDIENCE_TARGET = "farmers";

// Component Configuration (SELECTED BY YOU)
#define RAINFALL_COMPONENT "reedSwitch_RainGauge"
#define WIND_SPEED_COMPONENT "sonic_Anemometer"

// PIN Configuration (AUTO-INJECTED)
#define RAINFALL_PIN GPIO_35
#define RAINFALL_MM_PER_TIP 0.2

#define WIND_SPEED_PIN RX/TX (GPIO_16/17)
#define WIND_SPEED_CALIBRATION Serial

// Sensor reading functions (YOU MUST IMPLEMENT)
float readRainfallSensor() { /* your code */ }
float readWindSpeedSensor() { /* your code */ }
```

---

## Sensor Implementation Examples

### Example 1: Reed Switch Rain Gauge

```cpp
volatile int rainfallTips = 0;

void setup() {
  pinMode(RAINFALL_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(RAINFALL_PIN), countRain, FALLING);
}

void IRAM_ATTR countRain() {
  rainfallTips++;
}

float readRainfallSensor() {
  float rainfall = rainfallTips * RAINFALL_MM_PER_TIP;
  rainfallTips = 0;  // Reset for next reading
  return rainfall;
}
```

### Example 2: Hot Wire Anemometer

```cpp
void setup() {
  pinMode(WIND_SPEED_PIN, INPUT);
}

float readWindSpeedSensor() {
  int adcValue = analogRead(WIND_SPEED_PIN);
  float voltage = (adcValue / 4095.0) * 3.3;
  float wind_speed = (voltage - 0.4) * WIND_SPEED_CALIBRATION;
  return max(0.0, wind_speed);  // No negative values
}
```

### Example 3: Sonic Anemometer (Serial)

```cpp
void setup() {
  Serial2.begin(9600, SERIAL_8N1, 16, 17);  // RX, TX
}

float readWindSpeedSensor() {
  if (Serial2.available()) {
    String sonicData = Serial2.readStringUntil('\n');
    // Parse data based on your sensor's format
    // Example: "WS=12.5" → extract 12.5
    int index = sonicData.indexOf('=');
    if (index != -1) {
      return sonicData.substring(index + 1).toFloat();
    }
  }
  return 0.0;
}
```

### Example 4: 3-Cup Anemometer with Reed Switch

```cpp
volatile int anemometerTicks = 0;

void setup() {
  pinMode(WIND_SPEED_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(WIND_SPEED_PIN), countAnemometer, FALLING);
}

void IRAM_ATTR countAnemometer() {
  anemometerTicks++;
}

float readWindSpeedSensor() {
  // Get RPM (ticks per minute)
  float rpm = anemometerTicks / 2.0;  // 2 ticks per rotation
  anemometerTicks = 0;
  
  // Convert to km/h
  float wind_speed = rpm * WIND_SPEED_CALIBRATION;
  return wind_speed;
}
```

### Example 5: Ultrasonic Water Level Sensor

```cpp
// GPIO 22: Trigger (output)
// GPIO 23: Echo (input)
#define WATER_LEVEL_TRIG_PIN 22
#define WATER_LEVEL_ECHO_PIN 23

float readWaterLevel() {
  // Send pulse
  digitalWrite(WATER_LEVEL_TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(WATER_LEVEL_TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(WATER_LEVEL_TRIG_PIN, LOW);
  
  // Measure echo time (microseconds)
  long duration = pulseIn(WATER_LEVEL_ECHO_PIN, HIGH, 30000);
  
  // Convert to distance: distance = (duration / 2) * speed of sound
  // Speed of sound: ~340 m/s = 0.034 cm/μs
  float distance = (duration / 2.0) * 0.034;
  
  return distance;  // Return in cm
}
```

### Example 6: Capacitive Water Level Sensor (Analog)

```cpp
#define WATER_LEVEL_ANALOG_PIN 26

float readWaterLevel() {
  int adcValue = analogRead(WATER_LEVEL_ANALOG_PIN);
  
  // ADC range: 0-4095, Calibration: dry=600, wet=3000
  float waterLevel = map(adcValue, 600, 3000, 0, 100);
  
  return constrain(waterLevel, 0, 100);  // Return 0-100%
}
```

### Example 7: Float Switch Water Level

```cpp
#define WATER_LEVEL_DIGITAL_PIN 25

float readWaterLevel() {
  int switchState = digitalRead(WATER_LEVEL_DIGITAL_PIN);
  
  // HIGH = water present, LOW = no water
  return (switchState == HIGH) ? 100.0 : 0.0;
}
```

---

## Station-Specific Sensor Configurations

### Manila
- **Extra Sensors:** Atmospheric Pressure, Solar Radiation
- **Recommended Rainfall:** Tip Bucket (standard)
- **Recommended Wind:** 3-Cup Anemometer
- **Audience:** Government (policy decisions)

### Laguna
- **Extra Sensors:** Soil Moisture
- **Recommended Rainfall:** Reed Switch (precise)
- **Recommended Wind:** 3-Cup Anemometer
- **Audience:** Farmers (agriculture)

### Pampanga
- **Extra Sensors:** UV Index, Visibility
- **Recommended Rainfall:** Capacitive (gradual)
- **Recommended Wind:** Sonic (high accuracy)
- **Audience:** Farmers (crop planning)

### Cavite
- **Extra Sensors:** None
- **Recommended Rainfall:** Tip Bucket
- **Recommended Wind:** 3-Cup Anemometer
- **Audience:** Students (research)

### Bulacan
- **Extra Sensors:** Soil Moisture, Atmospheric Pressure
- **Recommended Rainfall:** Reed Switch
- **Recommended Wind:** Hot Wire
- **Audience:** Farmers (soil monitoring)

### Batangas
- **Extra Sensors:** UV Index
- **Recommended Rainfall:** Optical
- **Recommended Wind:** Propeller
- **Audience:** Government (disaster mgmt)

---

## Connecting Hardware to ESP32

### Pin Configuration Reference

```
ESP32 GPIO Pins (Digital Interrupts):
├── GPIO 32-39: Can use interrupts
├── GPIO 34-39: Input only (no output)
└── GPIO 4, 12-15, 2, 5, 18-23, 25-27: Full I/O

Analog Input (ADC):
├── ADC0: GPIO 36
├── ADC1: GPIO 39
├── ADC2: GPIO 4, 12, 13, 14, 15, 25, 26, 27
└── Note: ADC2 unavailable if WiFi enabled

Serial Ports:
├── Serial (USB): GPIO 1, 3
├── Serial1: GPIO 9, 10
└── Serial2: GPIO 16, 17
```

### Wiring Diagram Example

```
ESP32                    Reed Switch Rain Gauge
├─ GPIO_35 ─────────────► Switch Ground Pin
├─ GPIO_35 (via 10kΩ) ──► +3.3V
└─ GND ─────────────────► Magnet Ground

ESP32                    3-Cup Anemometer
├─ GPIO_34 ─────────────► Reed Switch Out
├─ GPIO_34 (via 10kΩ) ──► +3.3V
└─ GND ─────────────────► Anemometer Ground
```

---

## Calibration Values

### Rainfall Calibration

Measure volume of your tipping bucket:
```
Tips needed to fill 10mm = X tips
RAINFALL_MM_PER_TIP = 10 / X

Example: 10mm = 40 tips → 10/40 = 0.25mm per tip
```

### Wind Speed Calibration

Check anemometer specifications:
```
Example 3-Cup: 2.4 km/h per Hz
- If spinning at 10 Hz → 10 × 2.4 = 24 km/h

If unsure: Compare with known wind speed, adjust calibration
```

---

## Testing Sensor Code

### 1. Serial Monitor Testing

```cpp
void setup() {
  Serial.begin(115200);
  // ... sensor setup ...
}

void loop() {
  float rainfall = readRainfallSensor();
  float windSpeed = readWindSpeedSensor();
  
  Serial.print("Rainfall: ");
  Serial.print(rainfall);
  Serial.println(" mm");
  
  Serial.print("Wind Speed: ");
  Serial.print(windSpeed);
  Serial.println(" km/h");
  
  delay(1000);
}
```

### 2. Firebase Testing

Check `/weatherStations/{location}/` in Firebase console:
- Real-time updates every 30 seconds
- mainSensors object contains: temperature, humidity, rainfall, windSpeed, windVane
- Compare Firebase values with Serial Monitor values
- Check timestamps for data freshness

---

## Component Selection Guide

**Choose Rainfall Sensor Based On:**
- **Accuracy needed?** → Reed Switch (precise counts)
- **Analog preferred?** → Capacitive (simpler code)
- **Standard setup?** → Tip Bucket (most common)
- **Digital simplicity?** → Optical (state detection)

**Choose Wind Sensor Based On:**
- **Accuracy priority?** → Sonic (highest)
- **Simple interrupt?** → 3-Cup or Reed Switch
- **Analog reading?** → Hot Wire
- **Lightweight?** → Propeller

**Choose Audience Based On:**
- 👨‍🎓 **Students** → Education/research focus
- 👨‍🌾 **Farmers** → Agriculture/crop focus
- 🏛️ **Government** → Policy/disaster focus

---

## Troubleshooting

### Sensor Reading Always Zero
**Problem:** Sensor not wired correctly  
**Solution:**
1. Verify GPIO pin matches generated code
2. Check physical connection
3. Test with Serial.print(digitalRead(PIN))

### WiFi Connects But No Upload
**Problem:** Firebase credentials missing  
**Solution:**
1. Fill `const char* firebaseAuth` in code
2. Get from Firebase → Project Settings

### Values Seem Off
**Problem:** Calibration incorrect  
**Solution:**
1. Check calibration value in generated code
2. Compare with component datasheet
3. Adjust multiplier if needed

### Interrupts Not Triggering
**Problem:** Wrong GPIO for interrupts  
**Solution:**
1. Use GPIO 32-39 for interrupts
2. Use IRAM_ATTR for interrupt function
3. Use volatile for counter variable

---

## Further Reading

- ESP32 Pin Reference: https://www.espressif.com
- Arduino Interrupts: https://www.arduino.cc/reference/en/language/functions/external-interrupts/attachinterrupt
- Component Datasheets: Check manufacturer docs for each sensor
