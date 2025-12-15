# Initial Deployment Guide - Complete Setup

**From zero to deployed in one complete workflow.**

This guide takes you through every step needed to deploy the Philippine Weather Station Dashboard from scratch.

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] A computer (Windows/Mac/Linux)
- [ ] Internet connection
- [ ] A GitHub account (https://github.com)
- [ ] A Vercel account (https://vercel.com) - optional for web deployment
- [ ] ~30 minutes for complete setup

---

## Phase 1: Firebase Project Setup (10 minutes)

### Step 1.1: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click **"Create a project"**
3. Enter project name: `weather-dashboard`
4. Accept terms and click **"Continue"**
5. Disable Google Analytics (optional)
6. Click **"Create project"**
7. Wait for project to initialize (~30 seconds)

### Step 1.2: Enable Realtime Database

1. In Firebase console, click **"Realtime Database"** (left menu)
2. Click **"Create Database"**
3. Select region: **Asia-Southeast1** (Singapore - closest to Philippines)
4. Choose security rules: **Start in test mode** (for now)
5. Click **"Enable"**

### Step 1.3: Get Your Database URL

1. In Realtime Database, copy the database URL from top
   - Format: `https://YOUR-PROJECT-rtdb.asia-southeast1.firebasedatabase.app`
2. Save this for Step 1.5

### Step 1.4: Get API Credentials

1. Go to **Project Settings** (gear icon, top right)
2. Click **"Service accounts"** tab
3. Click **"Generate new private key"**
4. File downloads (keep safe - this is your admin credential)
5. Click **"Web API Key"** section
6. Copy these 7 values:
   ```
   - apiKey
   - authDomain
   - databaseURL (you already have this)
   - projectId
   - storageBucket
   - messagingSenderId
   - appId
   ```

### Step 1.5: Create .env.local File

Create a file named `.env.local` in your project root with these values:

```env
# Paste your values from Step 1.4
NEXT_PUBLIC_FIREBASE_API_KEY=your_apiKey_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_authDomain_here
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://YOUR-PROJECT-rtdb.asia-southeast1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_projectId_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storageBucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messagingSenderId_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_appId_here
NEXT_PUBLIC_NEWS_API_KEY=832889aa8c2d470ca438dfd09ca80277
```

### Step 1.6: Initialize Database Structure

In Firebase console, go to **Realtime Database** and manually create this structure:

```
weatherStations
├── manila
│   ├── stationName: "Manila Weather Station"
│   ├── municipality: "Manila"
│   └── temperature: 28.5

testWeatherStations
├── manila
│   ├── stationName: "Manila Weather Station"
│   └── temperature: 26.8
```

Or run this command after `npm install`:
```bash
node scripts/generate-initial-data.js
node scripts/generate-test-data.js
```

---

## Phase 2: Local Testing (10 minutes)

### Step 2.1: Install Project

```bash
# Navigate to project directory
cd /path/to/weather-dashboard

# Install dependencies
npm install
```

**Expected output:** "added X packages" (no errors)

### Step 2.2: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 15.5.9
- Environments: .env.local
- Listening on port 3000
```

### Step 2.3: Verify Dashboard

1. Open browser: http://localhost:3000
2. Should see 6 station cards (Manila, Laguna, Pampanga, Cavite, Bulacan, Batangas)
3. Check that data displays (temperature, humidity, etc.)
4. Click 🟠 "Test Mode" button - should show different data
5. Click 🎲 "Random" button - data should update every 5 seconds
6. Click 🟢 "Real Data" - returns to live sensor data

**If data doesn't show:**
- Check browser console (F12) for Firebase errors
- Verify `.env.local` values are correct
- Verify database has test data (from Step 1.6)

### Step 2.4: Test ESP32 Code Customizer

1. On dashboard, scroll to **🤖 ESP32 Panel**
2. Click **"Customize Sensors"**
3. Select **"Manila"** from dropdown
4. Check sensors: Pressure, Solar Radiation
5. Click **"Download Code"**
6. Should download `Manila_Weather_Station.ino` with station location pre-filled

**If download fails:**
- Check browser console for errors
- Verify Firebase is accessible

---

## Phase 3: Deploy to Vercel (Optional, 5 minutes)

### Step 3.1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial: Weather Station Dashboard"

# Go to GitHub.com and create new repository
# Name it: weather-dashboard
# Copy the remote URL

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/weather-dashboard.git
git branch -M main
git push -u origin main
```

### Step 3.2: Deploy to Vercel

1. Go to https://vercel.com
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your `weather-dashboard` repo
5. Click **"Import"**
6. Vercel detects Next.js automatically ✓
7. Click **"Continue"**

### Step 3.3: Add Environment Variables

Before clicking "Deploy", add your `.env.local` values:

1. Click **"Environment Variables"**
2. Add each variable:
   - NEXT_PUBLIC_FIREBASE_API_KEY
   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   - NEXT_PUBLIC_FIREBASE_DATABASE_URL
   - NEXT_PUBLIC_FIREBASE_PROJECT_ID
   - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   - NEXT_PUBLIC_FIREBASE_APP_ID
   - NEXT_PUBLIC_NEWS_API_KEY

3. Click **"Deploy"**
4. Wait ~2 minutes for build
5. Get your live URL (e.g., `weather-dashboard-xyz.vercel.app`)

### Step 3.4: Verify Production Deployment

1. Visit your Vercel URL
2. Verify same features work as localhost:3000
3. Check that data loads correctly
4. Test Real/Test mode toggle

---

## Phase 4: Raspberry Pi Deployment (Optional, 20 minutes)

### Step 4.1: Prepare Raspberry Pi

```bash
# Connect to Pi via SSH
ssh pi@YOUR_PI_IP

# Update system
sudo apt-get update
sudo apt-get upgrade -y
```

### Step 4.2: Clone Project

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/weather-dashboard.git
cd weather-dashboard
```

### Step 4.3: Copy Firebase Credentials

On your computer:
```bash
# Copy .env.local to Pi
scp .env.local pi@YOUR_PI_IP:~/weather-dashboard/
```

Or manually create `.env.local` on Pi with same values.

### Step 4.4: Run Installation Script

```bash
# On Pi
cd ~/weather-dashboard
bash rpi/install.sh
```

This script automatically:
- ✓ Updates system packages
- ✓ Installs Node.js
- ✓ Installs Python + PyQt5
- ✓ Installs npm dependencies
- ✓ Creates autostart desktop entry

**Expected time:** 5-10 minutes

### Step 4.5: Start GUI Application

```bash
python3 rpi/gui_app.py
```

**Expected output:**
```
Starting PyQt5 GUI Application...
Starting Node.js server on port 3000...
Loading dashboard...
[✓ Server running on http://localhost:3000]
```

A window opens with embedded dashboard.

### Step 4.6: Verify Pi Deployment

1. GUI window displays dashboard
2. All 6 stations visible
3. Data updates in real-time
4. Real/Test toggle works
5. ESP32 code customizer works

**If GUI doesn't appear:**
- Check Pi has display connected
- Verify PyQt5 installed: `python3 -c "import PyQt5"`
- Check logs: SSH to Pi and check error messages

### Step 4.7: Setup Autostart (Optional)

Make dashboard start automatically on Pi boot:

```bash
# On Pi
systemctl --user enable weather-dashboard
```

Or manually start:
```bash
python3 ~/weather-dashboard/rpi/gui_app.py &
```

---

## Phase 5: ESP32 Hardware Setup (Optional, varies)

### Step 5.1: Prepare ESP32

1. Connect ESP32 to your computer via USB
2. Open Arduino IDE
3. Install "Arduino ESP32" board:
   - Boards Manager → Search "esp32" → Install

### Step 5.2: Download Custom Code

1. Go to your deployed dashboard (localhost:3000 or Vercel URL)
2. Scroll to **🤖 ESP32 Panel**
3. Select your station (e.g., "Manila")
4. Check the sensors your hardware has
5. Click **"Download Code"**
6. File downloads (e.g., `Manila_Weather_Station.ino`)

### Step 5.3: Configure & Upload

1. Open downloaded `.ino` file in Arduino IDE
2. Edit WiFi credentials (top of file):
   ```cpp
   const char* ssid = "YOUR_WIFI_SSID";
   const char* password = "YOUR_WIFI_PASSWORD";
   ```
3. Add Firebase credentials (if using real data):
   ```cpp
   const char* firebaseAuth = "YOUR_DATABASE_SECRET";
   ```
4. Select Board: **ESP32 Dev Module**
5. Select Port: (your USB port)
6. Click **Upload** ▶
7. Wait for upload to complete

### Step 5.4: Verify Data Flow

1. Open Serial Monitor (Arduino IDE)
2. Should see: `✓ Connected to WiFi` and `✓ Data uploaded`
3. In Firebase console, check `/weatherStations/LOCATION/` for data
4. In dashboard, switch to 🟢 "Real Data" - should show ESP32 values

---

## Complete Verification Checklist

After all phases:

### Web App
- [ ] Local: http://localhost:3000 shows all 6 stations
- [ ] Real/Test toggle works
- [ ] Random data generator works
- [ ] Language toggle (EN/TL) works
- [ ] Arduino code downloads

### Vercel (if deployed)
- [ ] URL accessible from anywhere
- [ ] Data loads on production URL
- [ ] All features work same as local

### Raspberry Pi (if deployed)
- [ ] GUI window opens
- [ ] Dashboard embedded in window
- [ ] System tray icon works
- [ ] Data updates in real-time

### Firebase
- [ ] `/weatherStations/` has 6 location folders
- [ ] `/testWeatherStations/` has test data
- [ ] Both update when toggling modes
- [ ] No errors in Firebase console

### ESP32 (if deployed)
- [ ] Serial monitor shows "Data uploaded"
- [ ] Firebase shows real sensor values
- [ ] Data updates every 30 seconds
- [ ] Correct location in database path

---

## Troubleshooting

### "Firebase Error: Cannot read properties of undefined"
**Solution:** Check `.env.local` values are correct and file is in project root

### "Port 3000 already in use"
**Solution:** Kill existing process
```bash
# Windows
Stop-Process -Name node -Force

# Mac/Linux
pkill -f "node"
```

### "ModuleNotFoundError: No module named 'PyQt5'"
**Solution:** Install PyQt5
```bash
pip3 install PyQt5 PyQtWebEngine
```

### "No data showing on dashboard"
**Solution:** 
1. Check Firebase connection in browser console (F12)
2. Verify database has data: Firebase console → Realtime Database
3. Run data generators: `node scripts/generate-initial-data.js`

### ESP32 won't connect to WiFi
**Solution:**
1. Check WiFi SSID and password in code
2. Verify ESP32 supports 2.4GHz (not 5GHz)
3. Check serial monitor for error details

---

## Next Steps After Deployment

1. **Set up ESP32 devices** - Configure one for each location
2. **Enable Firebase security rules** - Lock down database access
3. **Configure monitoring** - Set up alerts for sensor failures
4. **Backup database** - Export data regularly
5. **Update documentation** - Add any custom modifications

---

## Support & Resources

- **Firebase Docs:** https://firebase.google.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Raspberry Pi Docs:** https://www.raspberrypi.org/documentation
- **Arduino IDE:** https://www.arduino.cc/en/software

---

**Congratulations! Your weather dashboard is now deployed and operational.** 🎉

