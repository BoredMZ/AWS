# 🇵🇭 Philippine Weather Station Dashboard

A modern, real-time web application for monitoring Automatic Weather Station (AWS) data across the Philippines. Built with Next.js, TypeScript, and Firebase, featuring bilingual support (English & Tagalog) and Philippine-specific weather alerts including typhoon warnings and monsoon tracking.

**📖 [Complete Operating Guide](./OPERATING_GUIDE.md)** - Read this first for setup and operation!

## ✨ Features

### Core Features
- 🌡️ **Real-time Temperature Updates** - Live data from 6 Luzon weather stations
- 💨 **Wind Information** - Wind speed and direction monitoring
- 💧 **Humidity & Pressure Monitoring** - Tracks atmospheric conditions
- 🌧️ **Rainfall Tracking** - Real rainfall measurements
- 🎨 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Real-time Sync** - Live updates via Firebase Realtime Database
- 🔄 **Real/Test Mode Toggle** - Switch between live and test data

### Dashboard Features
- 📡 **🟢 Real Data Mode** - Live sensor data from ESP32 weather stations
- 🧪 **🟠 Test Mode** - Generated test data for validation & testing
- 🎲 **Random Data Toggle** - Generate test data for UI testing
- 🗣️ **Bilingual Support** - English & Tagalog interface
- 🌡️ **Station-Specific Sensors** - Each location has unique sensor configurations

## Quick Start

**⚡ For the fastest setup, read [OPERATING_GUIDE.md](./OPERATING_GUIDE.md)**

## Hardware Setup

### ESP32 Weather Station Template

Use the included Arduino template to send real sensor data to Firebase:

📄 **[ESP32_WEATHER_STATION_TEMPLATE.ino](./ESP32_WEATHER_STATION_TEMPLATE.ino)**

**What it does:**
- Reads 5 main sensors on all stations (temperature, humidity, rainfall, wind speed, wind direction)
- Reads station-specific extra sensors (pressure, solar radiation, soil moisture, UV index, visibility)
- Uploads data to Firebase `/weatherStations/{stationLocation}/` path every 30 seconds
- Supports 6 Luzon stations (Manila, Laguna, Pampanga, Cavite, Bulacan, Batangas)

**How to use:**
1. Download [ESP32_WEATHER_STATION_TEMPLATE.ino](./ESP32_WEATHER_STATION_TEMPLATE.ino)
2. Open in Arduino IDE
3. Configure WiFi credentials and Firebase host
4. Set `STATION_LOCATION` and enable/disable sensor flags per station
5. Connect your sensors to the defined GPIO pins
6. Upload to ESP32

**Example configuration:**
```cpp
// Manila station with Atmospheric Pressure and Solar Radiation sensors
const char* STATION_LOCATION = "manila";
#define HAS_ATMOSPHERIC_PRESSURE
#define HAS_SOLAR_RADIATION
```

---

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Backend**: Firebase Realtime Database
- **Frontend**: React 18 with Client Components
- **Hardware**: ESP32 microcontroller for sensor data
- **Internationalization**: Built-in EN/TL language support

## Installation & Configuration
   
   Create a `.env.local` file in the project root with your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

   **How to get these credentials:**
   1. Go to [Firebase Console](https://console.firebase.google.com/)
   2. Select your project
   3. Click ⚙️ Settings → Project Settings
   4. Copy the Web SDK configuration

4. **Set up Firebase Database Structure**
   
   Your Firebase Realtime Database should have this structure:
   ```json
   {
     "weatherStations": {
       "manila_1": {
         "stationName": "Manila Observatory",
         "region": "Metro Manila",
         "province": "Metro Manila",
         "municipality": "Manila",
         "temperature": 29.5,
         "humidity": 78,
         "pressure": 1013.2,
         "windSpeed": 12.5,
         "windDirection": "SW",
         "rainfall": 5.2,
         "timestamp": 1702400000000,
         "location": {
           "latitude": 14.6349,
           "longitude": 121.0388
         }
       },
       "cebu_1": {
         "stationName": "Mactan Airport",
         "region": "Central Visayas",
         "province": "Cebu",
         "municipality": "Lapu-Lapu",
         "temperature": 28.8,
         "humidity": 82,
         "pressure": 1012.8,
         "windSpeed": 15.3,
         "windDirection": "SE",
         "rainfall": 0.0,
         "timestamp": 1702400000000,
         "location": {
           "latitude": 10.3157,
           "longitude": 124.0022
         }
       }
     }
   }
   ```

### Running the Application

**Development Mode:**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

**Production Build:**
```bash
npm run build
npm start
```

## Features Explained

### Real-time Updates
The dashboard subscribes to Firebase Realtime Database changes. When weather data from PAGASA or partner agencies is updated, the dashboard automatically reflects the changes without page refresh.

### Weather Cards
Each weather station displays:
- 🌤️ **Weather Icon** - Visual representation of current conditions
- 🌡️ **Temperature** - Color-coded by temperature range (Philippine-specific ranges)
- 💧 **Humidity** - Visual progress bar with high humidity alerts
- 🔽 **Pressure** - Atmospheric pressure (important for typhoon tracking)
- 💨 **Wind** - Speed and direction with typhoon risk assessment
- 🌧️ **Rainfall** - Heavy rain warnings (>50mm is significant)
- 📍 **Location** - Geographic coordinates for each station

### Regional Filtering
Filter weather stations by Philippine regions:
- **Luzon** 🏔️ - Metro Manila, Central Luzon, Calabarzon, Ilocos, Cagayan Valley, Cordillera, Bicol
- **Visayas** 🏝️ - Eastern Visayas, Western Visayas, Central Visayas
- **Mindanao** 🌴 - Davao, Soccsksargen, Zamboanga, Bangsamoro

### Weather Alerts
Smart alerts based on Philippine weather patterns:

| Alert Type | Threshold | Indicator |
|-----------|-----------|-----------|
| 🚨 Typhoon Risk | Wind > 25 m/s | Red warning |
| 🥵 Extreme Heat | Temp > 38°C | Red warning |
| 🌊 High Humidity | Humidity > 85% | Yellow warning |
| 💧 Heavy Rainfall | Rainfall > 50mm | Yellow warning |
| ⛈️ Low Pressure | Pressure < 1000 hPa | Orange warning |

### Monsoon Season Tracking

The app automatically indicates the monsoon season:
- **Habagat (Southwest Monsoon)** 💨 - June to September (Rainy Season)
- **Amihan (Northeast Monsoon)** 🌬️ - December to February (Cool & Dry)
- **Transition Periods** 🌤️ - March-May & October-November (Variable)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with Philippine branding
│   ├── page.tsx                # Main page with Firebase integration
│   └── globals.css             # Global styles
├── components/
│   ├── WeatherDashboard.tsx    # Main dashboard with language toggle
│   ├── WeatherCard.tsx         # Individual weather station card
│   ├── RegionFilter.tsx        # Philippine region filter
│   ├── LoadingSpinner.tsx      # Loading state
│   └── ErrorMessage.tsx        # Error display
├── lib/
│   ├── firebase.ts             # Firebase initialization
│   └── weatherUtils.ts         # Philippine weather calculations
└── types/
    └── weather.ts              # TypeScript interfaces
```

## Customization

### Adding More Regions
Edit `src/components/RegionFilter.tsx` to add more Philippine regions:
```typescript
const PHILIPPINE_REGIONS = {
  'Your Region': '🏖️',
  // Add more regions...
};
```

### Changing Temperature Thresholds
Edit `src/components/WeatherCard.tsx`:
```typescript
const getTemperatureColor = (temp: number) => {
  if (temp < 20) return 'text-blue-600';  // Cold
  if (temp < 28) return 'text-green-600'; // Comfortable (Philippine optimal)
  if (temp < 35) return 'text-orange-600'; // Hot
  return 'text-red-600';                  // Extreme heat
};
```

### Styling & Theming
- **Colors**: Edit `tailwind.config.ts` for custom color schemes
- **Animations**: Add custom animations in `src/app/globals.css`
- **Components**: Modify individual components in `src/components/`

## Firebase Realtime Database Rules

For a public weather monitoring system:
```json
{
  "rules": {
    "weatherStations": {
      ".read": true,
      ".write": "auth != null || root.child('admin').child(auth.uid).val() === true",
      "$stationId": {
        ".validate": "newData.hasChildren(['temperature', 'humidity', 'pressure', 'windSpeed'])"
      }
    }
  }
}
```

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Other Platforms (Netlify, AWS, etc.)
1. Build: `npm run build`
2. Deploy the `.next` folder and `public` folder
3. Set environment variables on your hosting platform
4. Ensure Node.js 18+ is available

## Data Integration with PAGASA

To integrate with PAGASA (Philippine Atmospheric, Geophysical and Astronomical Services Administration):

1. Contact PAGASA for AWS data access
2. Set up a backend service to fetch and store data in Firebase
3. Format data according to the Firebase structure above
4. Schedule regular updates (every 5-15 minutes recommended)

**Sample Node.js backend integration:**
```javascript
const admin = require('firebase-admin');
const axios = require('axios');

// Fetch from PAGASA API and update Firebase
async function updateWeatherData() {
  const response = await axios.get('https://pagasa-api.example.com/stations');
  const db = admin.database();
  
  for (const station of response.data) {
    await db.ref(`weatherStations/${station.id}`).update({
      temperature: station.temp,
      humidity: station.humidity,
      pressure: station.pressure,
      // ... other fields
      timestamp: Date.now()
    });
  }
}

setInterval(updateWeatherData, 600000); // Update every 10 minutes
```

## Troubleshooting

**No data showing?**
- Verify Firebase credentials in `.env.local`
- Check that Firebase Realtime Database is enabled
- Ensure database structure matches the expected format
- Check browser console for error messages

**Slow updates?**
- Verify Firebase database URL is correct
- Check network connectivity
- Consider data pagination for large datasets

**Language not changing?**
- Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
- Check browser console for JavaScript errors

**Regional filtering not working?**
- Ensure weather data includes `region` field
- Verify region names match `PHILIPPINE_REGIONS` in RegionFilter.tsx

## Contributing

Contributions are welcome! Areas for improvement:
- Historical data visualization and trends
- Weather forecasting integration
- Alerts and notifications system
- Mobile app version
- Support for additional weather stations
- Machine learning-based anomaly detection
- Integration with other weather APIs (OpenWeatherMap, NOAA)

## License

MIT License - Feel free to use this project for educational and operational purposes.

## Support & References

- **Firebase Documentation**: https://firebase.google.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **PAGASA**: https://www.pagasa.dost.gov.ph
- **Philippine Geographic Information System**: https://psa.gov.ph

## Acknowledgments

Built for Philippine meteorological monitoring and disaster risk reduction initiatives. Special thanks to PAGASA and all AWS operators across the Philippines.

---

**For weather emergencies in the Philippines, always refer to official PAGASA advisories and your local disaster risk reduction office.**

🌤️ **Stay Weather Aware! Manatiling Alerto sa Panahon!** ☔
#   A W S  
 