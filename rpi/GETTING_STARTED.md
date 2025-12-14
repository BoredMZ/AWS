# Getting Started - Starting Your Weather Dashboard

A complete, step-by-step guide to get your Raspberry Pi weather dashboard up and running.

## 📋 Before You Start

**What You Need:**
- Raspberry Pi 4 (2GB RAM minimum, 4GB recommended)
- Raspberry Pi OS (Bullseye or newer)
- SSH access enabled
- Internet connection
- ~500MB free storage space

**Have These Ready:**
- Firebase project credentials
- NewsAPI key
- Raspberry Pi IP address
- Computer with SSH client

---

## 🚀 Complete Startup Process

### Phase 1: Preparation (5 minutes)

#### 1.1 Get Your Raspberry Pi Ready

Connect to your Pi:
```bash
ssh pi@192.168.1.x
```

Update system packages:
```bash
sudo apt-get update
sudo apt-get upgrade -y
```

Check Pi specs:
```bash
uname -m          # Should show: aarch64
python3 --version # Should show: 3.9+
node --version    # If installed
```

#### 1.2 Find Your Pi's IP Address

```bash
hostname -I
```

Note this address. You'll need it to:
- Access dashboard remotely: `http://192.168.1.x:3000`
- SSH into Pi: `ssh pi@192.168.1.x`

---

### Phase 2: Transfer Project Files (2 minutes)

#### 2.1 Copy from Your Computer

From your development machine (Windows/Mac/Linux):

```bash
# Navigate to project directory
cd e:\PERSONAL_PROJECTS\AWS

# Copy entire project to Pi
scp -r . pi@192.168.1.x:/home/pi/weather-dashboard
```

#### 2.2 Verify Transfer

On your Raspberry Pi:
```bash
ls -la /home/pi/weather-dashboard
ls -la /home/pi/weather-dashboard/rpi
```

You should see: `gui_app.py`, `install.sh`, `kiosk_app.py`, etc.

---

### Phase 3: Automated Installation (10-15 minutes)

#### 3.1 Run the Installation Script

On your Raspberry Pi:
```bash
cd /home/pi/weather-dashboard/rpi
chmod +x install.sh
./install.sh
```

**What the script does (automatically):**
- ✅ Updates system packages
- ✅ Installs Node.js 18+ (if not present)
- ✅ Installs Python 3.9+ (if not present)
- ✅ Installs PyQt5 and dependencies
- ✅ Runs `npm install` in project root
- ✅ Creates `.env.local` with placeholders
- ✅ Sets up systemd service for autostart
- ✅ Creates desktop entry for GUI launcher

**Installation Output Example:**
```
[✓] Checking OS architecture...
[✓] Checking Raspberry Pi OS version...
[✓] Installing/updating system packages...
[✓] Installing Node.js...
[✓] Installing Python packages...
[✓] Running npm install...
[✓] Setting up systemd service...
[✓] Installation complete!
```

#### 3.2 Wait for Completion

The script takes 10-15 minutes. Let it finish completely—don't interrupt.

---

### Phase 4: Configuration (2 minutes)

#### 4.1 Add Your Credentials

The installer creates `.env.local`. Edit it with your credentials:

```bash
nano /home/pi/weather-dashboard/.env.local
```

Or on your computer, copy from your existing `.env.local`:
```bash
scp /path/to/.env.local pi@192.168.1.x:/home/pi/weather-dashboard/
```

**Required environment variables:**
```bash
# Firebase (Real + Test Data)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# News API (Optional)
NEXT_PUBLIC_NEWS_API_KEY=your_newsapi_key
```

**Firebase Data Paths:**
- Real data: `/weatherStations/` (from ESP32 devices)
- Test data: `/testWeatherStations/` (for validation)

#### 4.2 Verify Configuration

```bash
cat /home/pi/weather-dashboard/.env.local
```

Confirm all keys are present (no empty values).

---

### Phase 5: First Startup (1 minute)

#### 5.1 Option A: Manual Start (For Testing)

```bash
cd /home/pi/weather-dashboard/rpi
python3 gui_app.py
```

**Expected output:**
```
Starting PyQt5 GUI Application...
Starting Node.js server...
Server running on port 3000
Loading dashboard in GUI window...
```

GUI window should open on your display.

#### 5.2 Option B: Service Start (For Production)

```bash
systemctl --user start weather-dashboard
```

#### 5.3 Option C: Kiosk Mode (Fullscreen)

```bash
python3 kiosk_app.py
```

---

## ✅ Verification Checklist

After startup, verify everything works:

- [ ] GUI window appears
- [ ] Dashboard loads (may take 5-10 seconds on first run)
- [ ] All 6 Luzon stations display (Manila, Laguna, Pampanga, Cavite, Bulacan, Batangas)
- [ ] Weather data visible for each station
- [ ] 🟢 **Real Data** button shows live data from `/weatherStations/`
- [ ] 🟠 **Test Mode** button shows test data from `/testWeatherStations/`
- [ ] Can toggle between Real and Test mode
- [ ] **🎲 Random** button appears only in Test Mode
- [ ] Can toggle English/Tagalog
- [ ] Extra sensors display correctly (varies by station)
- [ ] Data updates in real-time

### Verify Backend Services

```bash
# Check if Node server is running
curl http://localhost:3000

# Check if PyQt app is running
ps aux | grep gui_app

# View Pi resource usage
htop
```

---

## 🔄 Startup Methods & When to Use Them

### 1. **Manual Start** (Development/Testing)
```bash
python3 gui_app.py
```
- **When:** Testing, debugging, development
- **Output:** Console logs visible
- **Auto-stop:** When you close the window
- **Auto-start on boot:** No

### 2. **Service Start** (Production/Autostart)
```bash
systemctl --user start weather-dashboard
systemctl --user enable weather-dashboard  # Enable autostart
```
- **When:** Production, 24/7 operation
- **Output:** Captured in journal logs
- **Auto-stop:** Only by systemctl stop
- **Auto-start on boot:** Yes (if enabled)

### 3. **Kiosk Mode** (Display Wall)
```bash
python3 kiosk_app.py
```
- **When:** Public display, information kiosk
- **Output:** Fullscreen, no window controls
- **Auto-stop:** Only by SSH kill command
- **Auto-start on boot:** Manual setup required

### 4. **SSH Remote Start**
```bash
ssh pi@192.168.1.x "cd weather-dashboard/rpi && python3 gui_app.py"
```
- **When:** Headless operation from another computer
- **Note:** Requires X11 forwarding or headless mode

---

## 🔍 Troubleshooting Common Issues

### Issue: GUI Window Doesn't Appear

**Symptom:** Script runs but no window opens

**Solutions:**
```bash
# Check DISPLAY variable
echo $DISPLAY

# Set display if needed (Pi connected to monitor)
export DISPLAY=:0
python3 gui_app.py

# If using SSH with X11 forwarding
ssh -X pi@192.168.1.x
cd weather-dashboard/rpi
python3 gui_app.py
```

---

### Issue: Port 3000 Already in Use

**Symptom:** "Address already in use" error

**Solutions:**
```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>

# Or find and restart npm
ps aux | grep "npm run dev"
kill -9 <PID>

# Restart application
python3 gui_app.py
```

---

### Issue: Dashboard Loads but Shows No Data

**Symptom:** White screen or "Loading..." persists

**Check these:**

```bash
# 1. Verify .env.local exists and is readable
cat /home/pi/weather-dashboard/.env.local

# 2. Check internet connection
ping 8.8.8.8

# 3. View backend logs
journalctl -u "npm" -f

# 4. Check if server started
curl http://localhost:3000

# 5. View browser console (in GUI app)
# Right-click → Inspect → Console tab
```

---

### Issue: Service Won't Start Automatically

**Symptom:** `systemctl --user enable` doesn't work on boot

**Solutions:**
```bash
# Enable user lingering (runs services when logged out)
sudo loginctl enable-linger pi

# Check service status
systemctl --user status weather-dashboard

# View service logs
journalctl --user-unit=weather-dashboard -f

# Manually check service file
cat ~/.config/systemd/user/weather-dashboard.service
```

---

### Issue: High CPU Usage / Performance Issues

**Symptom:** Pi runs hot, dashboard lags

**Investigate:**
```bash
# Check running processes
htop

# Kill unnecessary processes
killall node  # Stop Node server
killall npm

# Check disk space
df -h

# Reboot if needed
sudo reboot
```

---

### Issue: Can't Connect to Dashboard Remotely

**Symptom:** `http://192.168.1.x:3000` won't open from another computer

**Check:**
```bash
# Verify server is listening on all interfaces
netstat -tlnp | grep 3000

# Check firewall
sudo ufw status

# Allow port 3000 if needed
sudo ufw allow 3000

# Or allow specific IP
sudo ufw allow from 192.168.1.0/24 to any port 3000
```

---

## 📊 Monitoring Your Dashboard

### View Live Logs

```bash
# If running as service
journalctl --user-unit=weather-dashboard -f

# If running manually in terminal
# (Logs appear directly in console)
```

### Check System Resources

```bash
# CPU and memory usage
top

# More detailed view
htop

# Temperature
vcgencmd measure_temp
```

### Monitor Data Updates

```bash
# Check Firebase connectivity
curl https://your-project.firebaseio.com/.json?auth=your_token

# Check News API
curl "https://newsapi.org/v2/everything?q=weather" -H "Authorization: Bearer YOUR_KEY"
```

---

## 🎯 Next Steps After Startup

### 1. **Configure Autostart**
```bash
systemctl --user enable weather-dashboard
sudo loginctl enable-linger pi
```

### 2. **Set Up Remote Monitoring**
- Access dashboard: `http://192.168.1.x:3000`
- Set up SSH key-based auth for passwordless login

### 3. **Optimize Performance**
- Monitor resource usage regularly
- Adjust refresh rates if needed
- Clear logs periodically

### 4. **Schedule Maintenance**
- Weekly system updates: `sudo apt-get update && sudo apt-get upgrade`
- Monthly log cleanup: `journalctl --rotate && journalctl --vacuum-time=30d`
- Check Pi temperature regularly

---

## 📞 Getting Help

If you encounter issues:

1. **Check the logs:**
   ```bash
   journalctl --user-unit=weather-dashboard -n 50
   ```

2. **Review SETUP.md** for detailed configuration

3. **Check DEPLOYMENT.md** for production setup

4. **Review README.md** for complete feature documentation

---

## ✨ You're Ready!

Your weather dashboard is now running. 

**Quick access:**
- **GUI on Pi display:** Window appears automatically
- **Remote browser:** `http://192.168.1.x:3000`
- **Manage service:** `systemctl --user [start|stop|restart] weather-dashboard`
- **View logs:** `journalctl --user-unit=weather-dashboard -f`

Enjoy your Philippine weather dashboard! 🌤️
