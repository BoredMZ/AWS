# Deployment Verification Checklist

**Ensure everything is working correctly after deployment.**

---

## ✅ Local Testing Verification (10 minutes)

After `npm run dev`, verify these:

### Dashboard Loads
- [ ] Browser shows http://localhost:3000
- [ ] 6 station cards visible (Manila, Laguna, Pampanga, Cavite, Bulacan, Batangas)
- [ ] No console errors (F12 → Console tab)
- [ ] Page loads in <2 seconds

### Real Data Mode (🟢)
- [ ] Click 🟢 **Real Data** button
- [ ] Data displays for all stations
- [ ] Numbers show (temperature, humidity, etc.)
- [ ] No "undefined" or "null" values
- [ ] Data updates in real-time (watch for 30-second changes)

### Test Data Mode (🟠)
- [ ] Click 🟠 **Test Mode** button
- [ ] Different data appears instantly
- [ ] Random numbers update every 5 seconds
- [ ] Toggle back to 🟢 Real Data - original data returns
- [ ] Toggle multiple times - works smoothly

### Station Selection
- [ ] Click each station card
- [ ] Station details display (municipality, province)
- [ ] Weather data specific to that station
- [ ] News updates for that location
- [ ] Map marker shows correct location

### Arduino Code Generator
- [ ] Click 🤖 **ESP32** button (bottom right)
- [ ] Panel opens smoothly
- [ ] Click 📥 **Download JSON Credentials**
- [ ] File downloads (check Downloads folder)
- [ ] Click **Customize Sensors**
- [ ] Station dropdown works
- [ ] Sensor checkboxes appear
- [ ] Can select/deselect sensors
- [ ] Click 📥 **Download Code**
- [ ] `.ino` file downloads with station name
- [ ] File size > 5KB (has actual code)

### News Panel
- [ ] Click any station
- [ ] News panel displays at bottom
- [ ] Shows 3+ articles
- [ ] Has emoji, title, description
- [ ] Articles relevant to location

### Language Toggle (if available)
- [ ] EN text shows English
- [ ] TL text shows Tagalog
- [ ] Toggle works without errors

**If all checked:** ✅ **Local deployment is GOOD**

---

## ✅ Vercel Deployment Verification (5 minutes)

After deploying to Vercel, verify these:

### Live URL Works
- [ ] Visit your Vercel URL (e.g., `weather-dashboard-xyz.vercel.app`)
- [ ] Page loads completely
- [ ] No 404 or 500 errors
- [ ] Loading time <3 seconds

### Data Displays
- [ ] All 6 stations visible
- [ ] Real data appears (not "undefined")
- [ ] Test mode toggle works
- [ ] Data updates in real-time

### No Console Errors
- [ ] Open DevTools (F12)
- [ ] Console tab has no red errors
- [ ] Network tab shows all requests successful (green)
- [ ] Firebase connection shows in console

### Full Feature Test
- [ ] Click stations - details load
- [ ] Download Arduino code - file appears
- [ ] Test mode - data changes
- [ ] Real mode - data returns
- [ ] Language toggle works (if available)

### Performance Check
- [ ] Page responds quickly to clicks
- [ ] No lag when toggling modes
- [ ] Code downloads instantly
- [ ] No timeout errors

**If all checked:** ✅ **Vercel deployment is GOOD**

---

## ✅ Firebase Verification (5 minutes)

Verify data is flowing correctly:

### Database Structure
1. Go to Firebase Console
2. Select your project
3. Click **Realtime Database**
4. **Check these paths exist:**
   - [ ] `/weatherStations/` folder exists
   - [ ] `/weatherStations/manila/` has data
   - [ ] `/weatherStations/laguna/` has data
   - [ ] Other stations have data
   - [ ] `/testWeatherStations/` folder exists
   - [ ] Test data path has similar structure

### Data Format Check
In `/weatherStations/manila/`, you should see:
```
✓ stationName: "Manila Weather Station"
✓ municipality: "Manila"
✓ province: "Metro Manila"
✓ mainSensors:
  ✓ temperature: 25.5
  ✓ humidity: 60.5
  ✓ rainfall: 0.0
  ✓ windSpeed: 5.2
  ✓ windVane: "N"
✓ timestamp: "2024-12-16T10:30:00Z"
```

### Test Mode Data Check
- [ ] Switch to 🟠 Test Mode in dashboard
- [ ] New data appears in `/testWeatherStations/` in Firebase
- [ ] Values different from real data
- [ ] Switch to 🟢 Real Mode
- [ ] Data updates at `/weatherStations/` path

### Real-Time Updates
- [ ] In Firebase console, watch real path
- [ ] Data updates every 30 seconds
- [ ] Timestamp changes
- [ ] Values are reasonable (not all zeros)

**If all checked:** ✅ **Firebase is GOOD**

---

## ✅ Raspberry Pi Verification (10 minutes)

After running `bash rpi/install.sh` and launching app:

### Installation Success
```bash
# SSH into Pi and check:
python3 -c "import PyQt5"     # Should have no error
pip3 list | grep PyQt5        # Should show PyQt5 version
ls ~/weather-dashboard/       # Should show project files
```

### GUI App Launches
- [ ] Run: `python3 rpi/gui_app.py`
- [ ] GUI window appears
- [ ] Window has title bar
- [ ] Embedded dashboard visible
- [ ] No "ImportError" or crash

### Dashboard in GUI
- [ ] 6 stations visible inside window
- [ ] Real/Test toggle works
- [ ] Data displays and updates
- [ ] Can download Arduino code
- [ ] Buttons respond to clicks

### Kiosk App (optional)
- [ ] Run: `python3 rpi/kiosk_app.py`
- [ ] Fullscreen window opens
- [ ] Dashboard fills entire screen
- [ ] No visible UI elements (just dashboard)
- [ ] Press ESC to exit

### Server Management
- [ ] Check if Node.js server starts automatically
- [ ] Check logs for errors: `cat ~/.pm2/logs/weather-dashboard-error.log`
- [ ] Server should run on port 3000

### Autostart (optional)
```bash
# Check if service enabled:
systemctl --user is-enabled weather-dashboard
# Should output: enabled
```

**If all checked:** ✅ **Raspberry Pi is GOOD**

---

## ✅ ESP32 Verification (varies)

After uploading code to ESP32:

### Serial Monitor Check
1. Open Arduino IDE
2. Connect ESP32 via USB
3. Tools → Serial Monitor (115200 baud)
4. Reset ESP32 (press RST button)
5. Watch output for:
   - [ ] `Connecting to WiFi...`
   - [ ] `✓ Connected to WiFi`
   - [ ] `✓ Setup complete`
   - [ ] `✓ Data uploaded: XX.XC` (repeating every 30 sec)

### No Errors in Serial Output
- [ ] No "Firebase error" messages
- [ ] No "WiFi connection failed"
- [ ] No "Module not found"
- [ ] No timeout errors

### Firebase Data Check
1. Go to Firebase Console
2. Click **Realtime Database**
3. Navigate to `/weatherStations/[your-station]/`
4. Check:
   - [ ] Data appears in database
   - [ ] Data updates every 30 seconds
   - [ ] Timestamp is current
   - [ ] Temperature/humidity are real values (not zeros)
   - [ ] Wind speed is realistic

### Dashboard Updates
1. Go to web dashboard
2. Click 🟢 **Real Data** mode
3. Watch your station:
   - [ ] Values appear (not undefined)
   - [ ] Values update in real-time
   - [ ] Match Serial Monitor output
   - [ ] Different from Test Mode values

### Sensor Values Make Sense
- [ ] Temperature: 15-35°C (reasonable range)
- [ ] Humidity: 30-90% (realistic)
- [ ] Rainfall: 0+ mm (increases only with rain)
- [ ] Wind Speed: 0-50 km/h (reasonable)
- [ ] Wind Direction: N, NE, E, SE, S, SW, W, NW (cardinal)

**If all checked:** ✅ **ESP32 is GOOD**

---

## 🔍 Complete System Verification (15 minutes)

Run through entire flow end-to-end:

### 1. Web App
- [ ] Dashboard loads (local or Vercel)
- [ ] All 6 stations visible
- [ ] Real data displays
- [ ] Test mode works
- [ ] Toggle between modes smoothly

### 2. Arduino Code Generator
- [ ] Download code from dashboard
- [ ] Select different stations
- [ ] Select different sensors
- [ ] Select different components
- [ ] Select different audiences
- [ ] Each generates correct .ino file

### 3. Firebase Integration
- [ ] Real path has current data
- [ ] Test path has test data
- [ ] Paths are isolated
- [ ] Dashboard reflects both paths
- [ ] Timestamp updates every 30 seconds

### 4. Raspberry Pi (if deployed)
- [ ] GUI app launches
- [ ] Shows dashboard embedded
- [ ] Data updates
- [ ] Toggle modes

### 5. ESP32 (if deployed)
- [ ] Connects to WiFi
- [ ] Uploads to Firebase
- [ ] Data appears in real path
- [ ] Dashboard shows new data
- [ ] Serial monitor confirms uploads

### 6. User Workflows
- [ ] User can download Arduino code
- [ ] User can customize code (station, sensors, components, audience)
- [ ] User can test with demo data
- [ ] User can deploy to Vercel
- [ ] User can deploy to Raspberry Pi

**If all checked:** ✅ **FULL SYSTEM IS GOOD**

---

## ⚠️ If Something Fails

### Firebase Errors
**Error:** "Cannot read properties of undefined"

**Check:**
1. Is `.env.local` in project root?
2. Are all 8 variables filled in?
3. Are values correct (copy-pasted from Firebase)?
4. Did you restart dev server after adding `.env.local`?

**Fix:**
```bash
npm run dev  # Restart after .env.local changes
```

### No Data Showing
**Check:**
1. Firebase console - does `/weatherStations/` have data?
2. Click browser Console (F12) - any Firebase errors?
3. Network tab - all requests successful?

**Fix:**
```bash
# Run data generators manually
node scripts/generate-initial-data.js
node scripts/generate-test-data.js
```

### Vercel Deploy Failed
**Check:**
1. Did you add environment variables to Vercel settings?
2. Are all 8 variables added?
3. Did you trigger redeploy after adding variables?

**Fix:**
```bash
# In Vercel dashboard
Settings → Environment Variables
# Add all 8 from your .env.local
# Then click "Redeploy"
```

### Raspberry Pi GUI Won't Open
**Check:**
1. Is Pi display connected?
2. Is PyQt5 installed? `python3 -c "import PyQt5"`
3. Does project folder exist? `ls ~/weather-dashboard`

**Fix:**
```bash
pip3 install PyQt5 PyQtWebEngine
python3 rpi/gui_app.py
```

### ESP32 Won't Connect to WiFi
**Check:**
1. Is WiFi SSID correct (case-sensitive)?
2. Is WiFi password correct?
3. Does WiFi broadcast on 2.4GHz (not 5GHz)?

**Fix:**
```cpp
// In Arduino code, verify:
const char* ssid = "YOUR_EXACT_SSID";  // Case-sensitive!
const char* password = "YOUR_EXACT_PASSWORD";
```

---

## ✅ Sign-Off Checklist

You can say **"All is good"** when:

```
☑ Local dev server runs without errors
☑ Dashboard loads and shows all 6 stations
☑ Real/Test mode toggle works
☑ Arduino code generator works
☑ Can download customized code
☑ Firebase shows data in both paths
☑ Data updates in real-time
☑ Vercel deployment successful (if deployed)
☑ Raspberry Pi app launches (if deployed)
☑ ESP32 uploads data to Firebase (if deployed)
☑ Dashboard shows ESP32 data in real mode
```

**If all checkmarks:** 🎉 **DEPLOYMENT IS SUCCESSFUL**

---

## 📞 Quick Verification Commands

```bash
# Check Firebase connection
npm run dev
# Watch browser Console (F12) for Firebase messages

# Check local data
curl http://localhost:3000
# Should return HTML (no errors)

# Check if port 3000 is in use
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux

# Check ESP32 connection (in Arduino Serial Monitor)
# Look for: "✓ Data uploaded"

# Check Firebase database
# Firebase Console → Realtime Database
# Should see: /weatherStations/ and /testWeatherStations/

# Check Raspberry Pi
ssh pi@YOUR_PI_IP
python3 ~/weather-dashboard/rpi/gui_app.py
```

---

## 🎯 Summary

**After Deployment, Run Through:**

1. **Local Test** (10 min) - Verify code works locally
2. **Firebase Check** (5 min) - Verify data paths & structure
3. **Vercel Deploy** (5 min) - If deploying to cloud
4. **Raspberry Pi** (10 min) - If installing on Pi
5. **ESP32 Test** (varies) - If using hardware sensors

**All checks pass = You're good to go! 🎉**

