# Deployment Guide

Complete setup instructions for Firebase, Vercel, ESP32, and Raspberry Pi.

---

## 📋 Prerequisites

- [ ] Computer (Windows/Mac/Linux)
- [ ] GitHub account (https://github.com)
- [ ] Vercel account (https://vercel.com) - optional
- [ ] ~1 hour for full setup

---

## Firebase Setup (5 minutes)

### 1. Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click **"Create a project"**
3. Name: `weather-dashboard`
4. Accept terms, click **"Create project"**

### 2. Enable Realtime Database

1. Click **"Realtime Database"** (left menu)
2. Click **"Create Database"**
3. Region: **Asia-Southeast1**
4. Start in **test mode**
5. Click **"Enable"**

### 3. Get Your Credentials

1. Go to **Project Settings** (⚙️ icon, top right)
2. Click **"Web API Key"** section
3. Copy these 7 values:
   - apiKey
   - authDomain
   - databaseURL (from Realtime Database)
   - projectId
   - storageBucket
   - messagingSenderId
   - appId

### 4. Create .env.local File

In project root, create `.env.local`:

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

### 5. Initialize Database

In Firebase console, create this structure in Realtime Database:

```
weatherStations
├── manila
│   └── stationName: "Manila Weather Station"
testWeatherStations
├── manila
│   └── stationName: "Manila Weather Station"
```

---

## Local Testing (10 minutes)

### 1. Install & Run

```bash
npm install
npm run dev
```

### 2. Test Dashboard

- Open http://localhost:3000
- Should see 6 stations: Manila, Laguna, Pampanga, Cavite, Bulacan, Batangas
- Click 🟠 "Test Mode" - random data appears
- Click 🟢 "Real Data" - returns to live data
- Click 🤖 "ESP32" - download Arduino code

**If no data appears:**
- Check browser console (F12) for Firebase errors
- Verify `.env.local` credentials
- Verify database has initial data

---

## Deploy to Vercel (Optional, 5 minutes)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial: Weather Station Dashboard"

# Create repo at GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/weather-dashboard.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to https://vercel.com
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your `weather-dashboard` repo
5. Click **"Import"**

### 3. Add Environment Variables

1. Click **"Environment Variables"**
2. Add all 8 variables from your `.env.local`
3. Click **"Deploy"**
4. Wait ~2 minutes for build

**Result:** Live URL like `weather-dashboard-xyz.vercel.app`

---

## Deploy to Raspberry Pi (Optional, 20 minutes)

### 1. Prepare Pi

```bash
# SSH into Pi
ssh pi@YOUR_PI_IP

# Update system
sudo apt-get update
sudo apt-get upgrade -y
```

### 2. Clone & Install

```bash
# Clone project
git clone https://github.com/YOUR_USERNAME/weather-dashboard.git
cd weather-dashboard

# Copy credentials
scp .env.local pi@YOUR_PI_IP:~/weather-dashboard/

# Run install script (handles all dependencies)
bash rpi/install.sh
```

### 3. Start GUI Application

```bash
python3 rpi/gui_app.py
```

Dashboard launches in fullscreen window.

**Or use kiosk mode** (minimal, for wall display):

```bash
python3 rpi/kiosk_app.py
```

**For autostart on boot:**

```bash
systemctl --user enable weather-dashboard
```

---

## ESP32 Hardware Setup (Optional, 1 hour)

### 1. Prepare ESP32

1. Connect ESP32 to computer via USB
2. Open Arduino IDE
3. Install ESP32 board:
   - Tools → Boards Manager → Search "esp32" → Install

### 2. Download Custom Code

1. Go to dashboard (http://localhost:3000 or Vercel URL)
2. Click 🤖 **ESP32 Panel**
3. Click **"Customize Sensors"**
4. Select your station (e.g., "Manila")
5. Select sensors (if any)
6. Click **"🔧 Customize Components"** (optional)
7. Select rainfall & wind sensors
8. Click **"🎯 Customize Audience"** (optional)
9. Select target audience
10. Click **"Download Code"**

### 3. Configure & Upload

1. Open downloaded `.ino` file in Arduino IDE
2. Fill WiFi credentials (top of file):
   ```cpp
   const char* ssid = "YOUR_WIFI_SSID";
   const char* password = "YOUR_WIFI_PASSWORD";
   ```
3. Fill Firebase database secret:
   ```cpp
   const char* firebaseAuth = "YOUR_DATABASE_SECRET";
   ```
4. Select Board: **ESP32 Dev Module**
5. Click **Upload** ▶

### 4. Verify Data

1. Open Serial Monitor (Arduino IDE)
2. Should see: `✓ Connected to WiFi` and `✓ Data uploaded`
3. Check Firebase: `/weatherStations/{location}/` should have data
4. Check dashboard: 🟢 "Real Data" mode should show ESP32 values

---

## Troubleshooting

### Firebase Connection Error
**Problem:** "Cannot read properties of undefined"  
**Solution:** Verify `.env.local` credentials are correct

### Port 3000 Already in Use
**Solution:**
```bash
# Windows
Stop-Process -Name node -Force

# Mac/Linux
pkill -f "node"
```

### No Data on Dashboard
**Solution:**
1. Check Firebase console for data
2. Verify `.env.local` in project root
3. Restart dev server: `npm run dev`

### PyQt5 Not Found
**Solution:**
```bash
pip3 install PyQt5 PyQtWebEngine
```

### ESP32 Won't Upload
**Solution:**
1. Check USB cable is connected
2. Verify port selected (Tools → Port)
3. Install CP210x driver if needed

---

## Next Steps

1. Set up multiple ESP32 devices (one per location)
2. Configure Firebase security rules
3. Enable NewsAPI (optional, for live news)
4. Set up monitoring and alerts
5. Backup database regularly

---

## Support

- Firebase: https://firebase.google.com/docs
- Next.js: https://nextjs.org/docs
- Arduino IDE: https://www.arduino.cc
- Raspberry Pi: https://www.raspberrypi.org
