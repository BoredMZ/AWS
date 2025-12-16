# Complete Setup Guide

**15-60 minutes to production** • Firebase • Vercel • ESP32 • Raspberry Pi

---

## ✅ Prerequisites

- [ ] Computer (Windows/Mac/Linux)
- [ ] GitHub account (https://github.com)
- [ ] Vercel account (optional, https://vercel.com)
- [ ] ~1 hour for full setup

---

## 📦 Step 1: Firebase Setup (5 minutes)

### 1.1 Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click **"Create a project"**
3. Name: `weather-dashboard`
4. Accept terms → **"Create project"**

### 1.2 Enable Realtime Database

1. Left menu → **"Realtime Database"**
2. Click **"Create Database"**
3. Region: **Asia-Southeast1**
4. Start in **test mode**
5. Click **"Enable"**

### 1.3 Get Credentials

1. **Project Settings** (⚙️ top right)
2. Copy these 8 values:
   - apiKey
   - authDomain
   - databaseURL
   - projectId
   - storageBucket
   - messagingSenderId
   - appId
   - (Plus: Keep database secret for ESP32)

### 1.4 Create .env.local

In project root, create file named `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_apiKey_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_authDomain_here
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://YOUR-PROJECT-rtdb.asia-southeast1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_projectId_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storageBucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messagingSenderId_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_appId_here
NEXT_PUBLIC_NEWS_API_KEY=832889aa8c2d470ca438dfd09ca80277
```

### 1.5 Initialize Database Structure

In Firebase Console → Realtime Database, create:

```
weatherStations/
├── manila/
│   └── stationName: "Manila Weather Station"
testWeatherStations/
└── manila/
    └── stationName: "Manila Weather Station"
```

---

## 🚀 Step 2: Local Testing (10 minutes)

### 2.1 Install & Run

```bash
npm install
npm run dev
```

### 2.2 Verification Checklist

**Dashboard Loads:**
- [ ] Browser: http://localhost:3000
- [ ] 6 station cards visible (Manila, Laguna, Pampanga, Cavite, Bulacan, Batangas)
- [ ] No errors in console (F12)

**Real Data Mode (🟢):**
- [ ] Click 🟢 **Real Data** button
- [ ] Data displays (temperature, humidity, etc.)
- [ ] No "undefined" values
- [ ] Data updates every 30 seconds

**Test Data Mode (🟠):**
- [ ] Click 🟠 **Test Mode** button
- [ ] Different data appears instantly
- [ ] Random numbers update every 5 seconds
- [ ] Toggle back to 🟢 Real Data works

**Station Selection:**
- [ ] Click each station card
- [ ] Station details display correctly
- [ ] Weather data specific to location

**Arduino Code Generator:**
- [ ] Click 🤖 **ESP32** button (bottom right)
- [ ] Panel opens smoothly
- [ ] Click **📥 Download JSON Credentials** → file downloads
- [ ] Click **Customize Sensors** → dropdown works
- [ ] Click 📥 **Download Code** → `.ino` file downloads (>10KB)

**Event Logging:**
- [ ] Click any station card
- [ ] Click **▼ Show Events & Logging**
- [ ] Click any quick button (📝 Observation, 🔧 Maintenance, etc.)
- [ ] Event appears in log below

**If data not appearing:**
- Check browser **Console (F12)** for Firebase errors
- Verify `.env.local` credentials
- Verify WiFi connectivity
- Restart: `npm run dev`

---

## ☁️ Step 3: Deploy to Vercel (Optional, 10 minutes)

### 3.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial: Weather Station Dashboard"

# Create repo at GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/weather-dashboard.git
git branch -M main
git push -u origin main
```

### 3.2 Deploy to Vercel

1. Go to https://vercel.com
2. **"Add New"** → **"Project"**
3. **"Import Git Repository"**
4. Select `weather-dashboard` repo
5. **"Import"**

### 3.3 Configure Environment

1. **Environment Variables**
2. Add all 8 variables from `.env.local`
3. **"Deploy"**

Wait ~2 minutes. Result: Live URL (e.g., `weather-dashboard-xyz.vercel.app`)

---

## 🍓 Step 4: Raspberry Pi GUI (Optional, 20 minutes)

### 4.1 Connect to Pi

```bash
ssh pi@YOUR_PI_IP
cd ~
```

### 4.2 Clone & Setup

```bash
git clone https://github.com/YOUR_USERNAME/weather-dashboard.git
cd weather-dashboard

# Copy credentials
scp .env.local pi@YOUR_PI_IP:~/weather-dashboard/

# Run installation (automatic)
bash rpi/install.sh
```

### 4.3 Launch GUI

**Full Dashboard:**
```bash
python3 rpi/gui_app.py
```

**Kiosk Mode (wall display):**
```bash
python3 rpi/kiosk_app.py
```

**Autostart on Boot:**
```bash
systemctl --user enable weather-dashboard
```

---

## 🔧 Step 5: ESP32 Hardware (Optional, 1 hour)

### 5.1 Prepare ESP32

1. Connect ESP32 to computer via **USB cable**
2. Open **Arduino IDE**
3. **Tools → Boards Manager**
4. Search: `esp32` → Install
5. **Tools → Board** → Select **"ESP32 Dev Module"**

### 5.2 Download Customized Code

1. Go to dashboard: http://localhost:3000 (or Vercel URL)
2. Click 🤖 **ESP32 Panel** (bottom right)
3. Click **"Customize Sensors"**
4. Select your **station** (Manila, Laguna, etc.)
5. Optionally select **sensors** (soil moisture, UV index, etc.)
6. Click **"🔧 Customize Components"** (optional)
   - Choose **rainfall sensor** (4 options)
   - Choose **wind sensor** (5 options)
   - Choose **water level sensor** (5 options - optional)
7. Click **"Download Code"** 📥

### 5.3 Configure & Upload

Open downloaded `.ino` file in Arduino IDE:

```cpp
// UPDATE THESE 3 SECTIONS:

// 1. WiFi Credentials (top of file)
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// 2. Firebase Configuration
const char* firebaseHost = "your-project.firebaseio.com";
const char* firebaseAuth = "YOUR_DATABASE_SECRET";  // From Firebase console

// 3. Station Info (verify correct)
const char* STATION_LOCATION = "manila";
const char* STATION_NAME = "Manila Weather Station";
const char* MUNICIPALITY = "Manila";
const char* PROVINCE = "Metro Manila";
```

**Upload:**
1. **Tools → Port** → Select your ESP32 port
2. Click **Upload** ▶
3. Wait for "Upload complete"

### 5.4 Verify Connection

1. **Tools → Serial Monitor**
2. Restart ESP32 (click button on board)
3. Should see:
   ```
   Starting up...
   ✓ Connected to WiFi
   IP: 192.168.x.x
   ✓ Data uploaded to Firebase
   ```

4. Check Firebase Console → Realtime Database → `/weatherStations/{location}/`
5. Check dashboard: 🟢 **Real Data** mode should show ESP32 values

---

## 🌐 Step 6: Multiple ESP32 Devices

Repeat **Step 5** for each location:
1. Select different **station** when downloading code
2. Adjust **WiFi credentials** if needed
3. Upload to next ESP32 board
4. Verify data appears for each location on dashboard

---

## 🎛️ Hardware Customization

### Available Sensor Options

**Rainfall Sensors (4):**
- Tip Bucket (0.254 mm/tip) ✅ default
- Reed Switch (0.2 mm/tip)
- Capacitive (0.5 mm)
- Optical (0.254 mm/tip)

**Wind Speed Sensors (5):**
- 3-Cup Anemometer (2.4 km/h/Hz) ✅ default
- Reed Switch (2.0 km/h/Hz)
- Hot Wire (1.0)
- Sonic Serial (highest accuracy)
- Propeller (1.8 km/h/Hz)

**Water Level Sensors (5) - NEW:**
- Ultrasonic (GPIO 22/23) ✅ default
- Capacitive (ADC2/GPIO 26)
- Float Switch (GPIO 25)
- Resistive Strips (ADC3/GPIO 27)
- Pressure-based (I2C/GPIO 21-22)

See **[HARDWARE_GUIDE.md](HARDWARE_GUIDE.md)** for pin diagrams and implementation examples.

---

## 📋 Troubleshooting

### Firebase Connection Failed
```
Error: "Cannot read properties of undefined"
Fix: Check .env.local file exists and credentials are correct
```

### No Data on Dashboard
```
Check:
1. Is .env.local in project root?
2. Firebase credentials correct?
3. Database initialized? (/weatherStations/ path exists)
4. Run: npm run dev (restart)
```

### Port 3000 Already In Use
```bash
# Windows
Stop-Process -Name node -Force

# Mac/Linux
pkill -f "node"
```

### ESP32 Won't Upload
```
1. Check USB cable (try different port)
2. Tools → Port → select correct port
3. Install CP210x driver if needed
4. Hold Boot button while uploading
```

### Raspberry Pi GUI Not Starting
```bash
# Install missing dependencies
pip3 install PyQt5 PyQtWebEngine requests

# Run with verbose output
python3 rpi/gui_app.py --verbose
```

---

## 📚 Documentation

| Guide | Purpose |
|-------|---------|
| [README.md](README.md) | Project overview & features |
| [HARDWARE_GUIDE.md](HARDWARE_GUIDE.md) | Sensors, Arduino, examples, wiring |
| [EVENT_LOGGING_GUIDE.md](EVENT_LOGGING_GUIDE.md) | Event system, logging, troubleshooting |

---

## 🎯 Next Steps

1. ✅ Set up all 6 stations with ESP32 sensors
2. ✅ Monitor data on web dashboard
3. ✅ Log events and maintenance
4. ✅ Set up Raspberry Pi display
5. ✅ Configure Firebase security rules (production)
6. ✅ Enable automated backups

---

## ✨ Features Included

- ✅ Real-time weather monitoring (6 locations)
- ✅ Customizable Arduino code generator
- ✅ Event logging system
- ✅ Firebase integration
- ✅ Bilingual interface (English/Tagalog)
- ✅ Test mode for development
- ✅ Raspberry Pi GUI
- ✅ Web dashboard
- ✅ Mobile responsive

---

## 📞 Support

- **Firebase:** https://firebase.google.com/docs
- **Next.js:** https://nextjs.org/docs
- **Arduino IDE:** https://www.arduino.cc
- **Raspberry Pi:** https://www.raspberrypi.org

**Built with ❤️ for Philippines weather monitoring**
