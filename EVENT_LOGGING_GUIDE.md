# Event Logging System Guide

## Overview

The event logging system allows you to manually record observations, maintenance activities, calibration checks, and alerts directly from the dashboard. All events are stored in Firebase and displayed in real-time.

**Features:**
- ✅ Push-button quick logging (4 event types)
- ✅ Detailed form for custom events
- ✅ Real-time event display with expandable details
- ✅ Firebase integration for persistent storage
- ✅ Optional sensor readings capture
- ✅ Timestamp and formatting included

---

## Quick Start

### 1. Open Event Logging

In the dashboard, click on any **station card**, then:
1. Click the blue button: **▼ Show Events & Logging**
2. Two sections appear:
   - 📊 **Quick Log Event** (4 buttons)
   - 📋 **Event Log** (recent events)

### 2. Quick Logging (4 Buttons)

Click any quick button to instantly log an event:

| Button | Event Type | Use Case |
|--------|-----------|----------|
| 📝 Observation | Manual observation | Record a visual observation |
| 🔧 Maintenance | Maintenance work | Document maintenance performed |
| ⚙️ Calibration | Sensor calibration | Record calibration check |
| ⚠️ Alert | System alert | Log system issues or alerts |

**Example:**
- Click "📝 Observation" → Event logged instantly with timestamp
- Check **Event Log** below → See your new event appear in real-time

### 3. Detailed Event Logging

For more detailed information, click **▼ Detailed Event Log**:

**Fill in:**
1. **Event Type** (5 options with visual buttons)
2. **Description** ⭐ (required - what happened)
3. **Sensor Readings** (optional - current temperature, humidity, etc.)
4. **Additional Notes** (optional - extra context)

**Click:** ✅ **Log Event** button

---

## Event Types Explained

### 📝 Manual Observation
- Visual weather observations
- Sky conditions, cloud types
- Local weather phenomena
- General observations

**Example Descriptions:**
- "Heavy rain observed in past hour"
- "Clear skies, good visibility"
- "Strong northerly winds"
- "Hail detected during storm"

### 🔧 Maintenance
- Sensor cleaning
- Equipment repairs
- Part replacements
- Routine maintenance checks

**Example Descriptions:**
- "Cleaned rainfall sensor screen"
- "Replaced wind sensor bearings"
- "Calibrated humidity sensor"
- "Fixed loose cable connections"

### ⚙️ Calibration
- Sensor calibration activities
- Accuracy verification
- Equipment adjustments
- Test measurements

**Example Descriptions:**
- "Calibrated temperature sensor against reference"
- "Verified pressure sensor accuracy"
- "Adjusted zero point on wind sensor"
- "Passed quarterly calibration check"

### ⚠️ Alert
- System malfunctions
- Data anomalies
- Connection issues
- Warning conditions

**Example Descriptions:**
- "Sensor offline for 5 minutes"
- "Unusual temperature spike detected"
- "WiFi connection lost"
- "Data transmission failed"

### 📌 Other
- Miscellaneous notes
- General information
- Context-specific events
- Custom event types

**Example Descriptions:**
- "Visitor at station today"
- "Power outage from 2-3 PM"
- "Weather forecast mismatch"
- "Research data collection"

---

## Detailed Form Examples

### Example 1: Maintenance Logging

```
Event Type:    🔧 Maintenance
Description:   Cleaned rainfall sensor bucket
Temperature:   (leave blank)
Humidity:      (leave blank)
Rainfall:      (leave blank)
Wind Speed:    (leave blank)
Notes:         Removed debris, checked drainage
```

**Result in Firebase:**
```json
{
  "stationName": "Manila Weather Station",
  "eventType": "maintenance",
  "description": "Cleaned rainfall sensor bucket",
  "notes": "Removed debris, checked drainage",
  "timestamp": 1702776540000,
  "formattedTime": "12/16/2024, 10:29:00 AM"
}
```

### Example 2: Manual Observation with Readings

```
Event Type:    📝 Manual Observation
Description:   Manual weather check during storm
Temperature:   26.5
Humidity:      88
Rainfall:      12.5
Wind Speed:    35
Notes:         Strong gusts from north, heavy rainfall
```

**Result in Firebase:**
```json
{
  "stationName": "Laguna Weather Station",
  "eventType": "manual_observation",
  "description": "Manual weather check during storm",
  "temperature": 26.5,
  "humidity": 88,
  "rainfall": 12.5,
  "windSpeed": 35,
  "notes": "Strong gusts from north, heavy rainfall",
  "timestamp": 1702776540000,
  "formattedTime": "12/16/2024, 10:29:00 AM"
}
```

---

## Viewing Events

### Real-Time Display

Events appear instantly in the **📋 Event Log** section:

- **Latest events first** (newest at top)
- Shows **event emoji** and **description**
- Displays **timestamp** in Philippines timezone
- Expandable for full details

### Expand Event Details

Click any event card to expand and see:
- ✅ Event type (formatted label)
- ✅ Timestamp (formatted date and time)
- ✅ Description
- ✅ Sensor readings (if recorded)
- ✅ Additional notes
- ✅ Unique event ID

### Collapse Event

Click the expanded event again to collapse

---

## Firebase Storage Structure

Events are stored in Firebase at:

```
/events/[station-name]/[event-id]/
  ├── stationName: string
  ├── eventType: string
  ├── description: string
  ├── temperature: number (optional)
  ├── humidity: number (optional)
  ├── rainfall: number (optional)
  ├── windSpeed: number (optional)
  ├── notes: string (optional)
  ├── timestamp: number (milliseconds)
  └── formattedTime: string
```

**Example path:**
```
/events/manila_weather_station/event_001/
```

---

## Browser Console Logging

Events are also logged to browser console:

### Successful Log
```
✅ Event logged to Firebase: Manila Weather Station {
  stationName: "Manila Weather Station",
  eventType: "manual_observation",
  description: "Heavy rain",
  timestamp: 1702776540000,
  formattedTime: "12/16/2024, 10:29:00 AM"
}
```

### Events Retrieved
```
📋 Retrieved 5 events for Laguna Weather Station
```

### Errors
```
❌ Failed to log event to Firebase: [error message]
❌ Error retrieving events: [error message]
```

**Open console:** Press `F12` → Click **Console** tab

---

## Best Practices

### 1. Be Descriptive
✅ Good: "Heavy rainfall detected - 45mm in 30 minutes"  
❌ Bad: "Rain"

### 2. Include Sensor Data When Relevant
- Maintenance: Optional (not recording readings)
- Calibration: Include readings if verifying accuracy
- Observation: Include if manually measuring

### 3. Use Appropriate Event Types
- Different types help organize and filter events
- Use "Other" only when no type fits

### 4. Log Immediately
- Log events as they happen
- Don't wait - timestamps must be accurate

### 5. Add Context in Notes
- Why did this happen?
- What was the weather like?
- Any relevant external factors?

---

## Common Use Cases

### Weather Station Maintenance Schedule
```
Date: Monthly
Events to log:
1. 🔧 "Monthly sensor inspection"
2. 🔧 "Cleaned all sensors"
3. ⚙️ "Calibration check passed"
4. 📝 "All systems operational"
```

### During Severe Weather
```
1. 📝 "Severe storm approaching"
2. 📝 "Heavy rainfall ongoing - 50mm+"
3. ⚠️ "Wind speed exceeding safe limits"
4. 📝 "Storm ended, conditions normalizing"
```

### Daily Operations
```
Morning:
- 📝 "Daily morning observation - clear skies"

Mid-day:
- ⚠️ "Sensor offline briefly - connectivity issue"

Evening:
- 🔧 "Replaced battery in wireless sensor"
- 📝 "Evening forecast vs actual - notes"
```

### Research Activities
```
1. 📌 "Research data collection - temperature gradient"
2. 📝 "Manual measurements taken for validation"
3. ⚙️ "Cross-checked automated data with manual"
4. 📌 "Data quality: excellent match"
```

---

## Troubleshooting

### Event Not Appearing After Logging

**Check:**
1. Is Firebase `.env.local` configured correctly?
2. Check browser **Console (F12)** for errors
3. Is the internet connection stable?
4. Try refreshing the page (F5)

**Verify:**
```bash
# In Firebase Console:
# Go to Realtime Database
# Look for /events/ path
# Should see your station's events
```

### Can't See Event Logs on Page Load

**Check:**
1. Click **▼ Show Events & Logging** to expand section
2. May need to wait 2-3 seconds for Firebase to sync
3. Check **Console (F12)** for Firebase connection errors

**Verify:**
1. Firebase credentials are correct
2. Firebase database rules allow write access
3. Network requests are successful (Network tab in DevTools)

### Events Showing Old Timestamp

**Check:**
1. Device time must be accurate (check system clock)
2. Browser timezone should be set to Philippines (Asia/Manila)
3. Timestamps are in milliseconds since epoch

**Verify:**
```javascript
// In browser console:
new Date().toLocaleString('en-PH', {timeZone: 'Asia/Manila'})
// Should show current Philippines time
```

### Missing Sensor Data in Event

**This is normal!** - Sensor fields are optional. Leave blank if not recording readings.

---

## Integration with Arduino/ESP32

To send events FROM Arduino/ESP32 to Firebase:

```cpp
// In Arduino/ESP32 code:
FirebaseData firebaseData;
String stationName = "Manila";
String eventType = "alert";
String description = "Sensor disconnected";

Firebase.setString(
  firebaseData,
  "/events/" + stationName + "/event_001/eventType",
  eventType
);

Firebase.setString(
  firebaseData,
  "/events/" + stationName + "/event_001/description",
  description
);
```

Then the event displays automatically on the dashboard!

---

## Data Export

To export logged events:

1. Go to **Firebase Console**
2. Click **Realtime Database**
3. Right-click `/events/` path
4. Click **Export JSON**
5. Save file for backup/analysis

---

## Summary

✅ **Quick buttons** for fast logging (4 types)  
✅ **Detailed form** for comprehensive events  
✅ **Real-time display** with expandable details  
✅ **Firebase storage** for persistent history  
✅ **Optional sensor readings** to record data  
✅ **Browser console logs** for debugging  

**Start logging events to your weather station today!** 📊
