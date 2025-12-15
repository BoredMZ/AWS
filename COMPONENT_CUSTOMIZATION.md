# Component Customization System

## Overview

The ESP32 Arduino code generator now supports **alternative sensor components** with automatic configuration. Users can select different hardware implementations for rainfall sensors and wind speed sensors through the web UI, and the generated Arduino code will include correct pin assignments and calibration values.

## Available Components

### Rainfall Sensors

| Component | PIN | Calibration | Description |
|-----------|-----|-------------|-------------|
| **Tip Bucket Rain Gauge** (Default) | GPIO_35 | 0.254 mm/tip | Standard tipping bucket with magnetic reed switch |
| **Reed Switch Rain Gauge** | GPIO_35 | 0.2 mm/tip | Direct reed switch with magnet-triggered bucket |
| **Capacitive Rain Sensor** | ADC0 (GPIO_36) | 0.5 mm cal | Analog capacitive sensor for gradual rainfall detection |
| **Optical Rain Gauge** | GPIO_32 | 0.254 mm/tip | Optical sensor detects bucket tip motion |

### Wind Speed Sensors

| Component | PIN | Calibration | Description |
|-----------|-----|-------------|-------------|
| **3-Cup Anemometer** (Default) | GPIO_34 | 2.4 km/h/Hz | Traditional 3-cup anemometer with reed switch |
| **Reed Switch Anemometer** | GPIO_34 | 2.0 km/h/Hz | Magnet on cup rotor triggers reed switch |
| **Hot Wire Anemometer** | ADC1 (GPIO_39) | 1.0 scaling | Analog hot wire sensor for fine resolution |
| **Sonic Anemometer** | RX/TX (GPIO_16/17) | Serial | Ultrasonic sensor with serial output (high accuracy) |
| **Propeller Anemometer** | GPIO_32 | 1.8 km/h/Hz | Propeller rotor with reed switch counting |

## How to Use Component Customization

### Via Web Interface

1. Click the **🤖 ESP32** floating button
2. Click **🟢 Customize Sensors**
3. Select your station and sensors
4. Click **🔧 Customize Components**
5. Choose your preferred:
   - **Rainfall Sensor Component** (with PIN, calibration, and description)
   - **Wind Speed Sensor Component** (with PIN, calibration, and description)
6. Click **📥 Download Code**
7. The generated `.ino` file will include:
   - Component type definitions
   - Correct PIN assignments
   - Calibration values
   - Component-specific sensor reading functions (stubbed)

### Generated Arduino Code Structure

```cpp
// Component Configuration
#define RAINFALL_COMPONENT "reedSwitch_RainGauge"
#define WIND_SPEED_COMPONENT "sonic_Anemometer"

// Component Pin & Calibration Configuration
#define RAINFALL_PIN GPIO_35
#define RAINFALL_MM_PER_TIP 0.2  // Component: Reed Switch Rain Gauge
// Direct reed switch with magnet-triggered bucket

#define WIND_SPEED_PIN RX/TX (GPIO_16/17)
#define WIND_SPEED_CALIBRATION Serial  // Component: Sonic Anemometer
// Ultrasonic sensor with serial output (higher accuracy)
```

### Component-Specific Sensor Functions

The generated code includes helper functions for reading sensors based on component type:

```cpp
float readRainfallSensor() {
  // Implementation varies by component:
  // - Reed switches: Count interrupts
  // - Capacitive: Read analog voltage
  // - Optical: Detect state changes
  return rainfall_mm;
}

float readWindSpeedSensor() {
  // Implementation varies by component:
  // - Reed switch: Count RPM
  // - Hot wire: Read analog voltage
  // - Sonic: Parse serial data
  return wind_speed_kmh;
}
```

## Implementation Examples

### Using Reed Switch Rain Gauge

```cpp
#define RAINFALL_COMPONENT "reedSwitch_RainGauge"
#define RAINFALL_PIN GPIO_35
#define RAINFALL_MM_PER_TIP 0.2

// In your setup()
pinMode(RAINFALL_PIN, INPUT_PULLUP);
attachInterrupt(digitalPinToInterrupt(RAINFALL_PIN), countRainfallTips, FALLING);

// In your loop()
float rainfall = rainfallTips * RAINFALL_MM_PER_TIP;
```

### Using Hot Wire Anemometer

```cpp
#define WIND_SPEED_COMPONENT "hotwire_Anemometer"
#define WIND_SPEED_PIN ADC1  // GPIO_39
#define WIND_SPEED_CALIBRATION 1.0

// In your loop()
int adcValue = analogRead(WIND_SPEED_PIN);
float voltage = (adcValue / 4095.0) * 3.3;
float wind_speed = (voltage - 0.4) * WIND_SPEED_CALIBRATION;
```

### Using Sonic Anemometer

```cpp
#define WIND_SPEED_COMPONENT "sonic_Anemometer"
#define WIND_SPEED_PIN "RX/TX"  // GPIO_16/17 (Serial2 on ESP32)

// In your setup()
Serial2.begin(9600, SERIAL_8N1, 16, 17);

// In your loop()
if (Serial2.available()) {
  String sonicData = Serial2.readStringUntil('\n');
  float wind_speed = parseWindSpeed(sonicData);
}
```

## Code Generation Process

1. **User Selection**: User selects station, sensors, and components via UI
2. **Lookup**: System finds component config (pins, calibration, description)
3. **Template Injection**: Arduino template includes component-specific values
4. **Code Generation**: Dynamic #define statements generated
5. **Download**: User receives pre-configured `.ino` file

## Technical Details

### Updated Files

- **`src/lib/credentialsGenerator.ts`**
  - Added `COMPONENT_ALTERNATIVES` constant with 4 rainfall + 5 wind speed options
  - Updated `ArduinoCodeOptions` interface to include component selections
  - Enhanced `generateArduinoCode()` to inject component configs
  - Added `readRainfallSensor()` and `readWindSpeedSensor()` stub functions

- **`src/components/CredentialsPanel.tsx`**
  - Added component state management (rain/wind selections)
  - Added component customization toggle button
  - Added component selector dropdowns with descriptions
  - Passes component selections to download function
  - Shows component descriptions as help text

### Build Status
✅ **Build successful** - No TypeScript errors, 2 minor warnings (non-blocking)

## Future Extensions

Possible additions to the component system:

1. **Wind Direction Components**
   - Vane pot (analog)
   - Digital compass
   - Optical encoder
   - Potentiometer (variable resistor)

2. **Temperature Components**
   - DHT22 (default)
   - DS18B20
   - RTD sensor
   - Thermistor

3. **Humidity Components**
   - DHT22 (default)
   - Capacitive sensor
   - Resistive sensor

4. **Pressure Components**
   - BMP280 (default)
   - BMP180
   - MPL3115A2

## Firmware Notes

- All components assume ESP32 microcontroller
- GPIO and ADC pin assignments are pre-configured
- Users must implement actual sensor reading logic (stub functions provided)
- Calibration values are starting points (tune based on actual hardware)
- Some components require additional libraries (e.g., Serial for sonic anemometers)

## Support

For each component, refer to the generated Arduino code for:
- PIN definitions
- Calibration values
- Component name/description
- Implementation notes

Users should consult component datasheets for:
- Exact wiring diagrams
- Interrupt handling
- Serial communication protocols
- Voltage requirements
