# Deployment Guide - Raspberry Pi Weather Dashboard

## 🎯 Deployment Options

### Option 1: Development Setup (Testing/Development)

```bash
python3 rpi/gui_app.py
```

**Pros:**
- Full controls and debugging
- System tray
- Easy to troubleshoot

**Cons:**
- Higher resource usage
- Dev server mode

### Option 2: Production Kiosk (Wall Display)

```bash
npm run build
python3 rpi/kiosk_app.py --fullscreen
```

**Pros:**
- Minimal interface
- Optimized performance
- Fullscreen display
- Perfect for dashboards

**Cons:**
- Limited controls
- Requires rebuild

### Option 3: Headless Server (Remote Access Only)

```bash
npm run build
npm run start
```

Access at: `http://192.168.1.x:3000`

**Pros:**
- No GUI overhead
- Web access from any device
- Better performance

**Cons:**
- No local display
- Requires browser access

## 📦 Pre-Deployment Checklist

- [ ] Firebase credentials in `.env.local`
- [ ] NewsAPI key configured
- [ ] Node.js 18+ installed
- [ ] Python 3.9+ with PyQt5
- [ ] Test on desktop first
- [ ] Build production version
- [ ] Configure autostart
- [ ] Test autostart
- [ ] Verify network access
- [ ] Set up monitoring

## 🚀 Production Deployment Steps

### 1. Prepare Raspberry Pi

```bash
# SSH into Pi
ssh pi@192.168.1.x

# Create directory
mkdir -p /home/pi/weather-dashboard
cd /home/pi/weather-dashboard

# Clone or transfer project
git clone <repo-url> .
# OR
rsync -avz --delete ~/weather-dashboard/ pi@192.168.1.x:/home/pi/weather-dashboard/
```

### 2. Install Dependencies

```bash
cd /home/pi/weather-dashboard

# Run installation script
cd rpi
chmod +x install.sh
./install.sh

# Or manual install
pip3 install -r requirements.txt
npm install
```

### 3. Configure Environment

```bash
# Copy and edit environment file
cp .env.local.example .env.local
nano .env.local

# Add your Firebase credentials
# Important: Ensure NEXT_PUBLIC_FIREBASE_DATABASE_URL points to correct Firebase instance
```

**Firebase Data Sources:**
- **Real Data**: `/weatherStations/` path (from ESP32 devices)
- **Test Data**: `/testWeatherStations/` path (for validation/testing)

### 4. Build for Production

```bash
npm run build
```

This creates optimized production bundle in `.next/`

### 5. Setup Autostart

#### Option A: Systemd Service (Recommended)

```bash
# Copy service file
cp rpi/weather-dashboard.service ~/.config/systemd/user/

# Enable and start
systemctl --user daemon-reload
systemctl --user enable weather-dashboard
systemctl --user start weather-dashboard

# Verify
systemctl --user status weather-dashboard
```

#### Option B: Crontab

```bash
# Edit crontab
crontab -e

# Add line (runs at boot):
@reboot python3 /home/pi/weather-dashboard/rpi/gui_app.py &
```

### 6. Test Deployment

```bash
# Check service status
systemctl --user status weather-dashboard

# View logs
journalctl --user-unit=weather-dashboard -f

# Test web access
curl http://localhost:3000
```

## 🔧 Production Optimization

### Memory Management

Edit `/boot/config.txt`:

```bash
sudo nano /boot/config.txt

# Add:
gpu_mem=256
dtoverlay=disable-bt
```

Reboot:

```bash
sudo reboot
```

### Reduce Background Services

```bash
# Disable Bluetooth
sudo systemctl disable bluetooth

# Disable WiFi power saving
sudo nano /etc/modprobe.d/brcmfmac.conf
# Add: options brcmfmac power_save=0

# Disable Avahi (mDNS)
sudo systemctl disable avahi-daemon
```

### Monitor Performance

```bash
# Check CPU/Memory
top

# Check disk usage
df -h

# Check temperature
vcgencmd measure_temp

# Monitor service
watch systemctl --user status weather-dashboard
```

## 🌐 Remote Access

### Local Network Only

Just use Pi's IP: `http://192.168.1.x:3000`

### Internet Access (Optional)

Setup nginx as reverse proxy:

```bash
# Install nginx
sudo apt-get install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/weather-dashboard

# Content:
server {
    listen 80;
    server_name weather-dashboard.local;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable config
sudo ln -s /etc/nginx/sites-available/weather-dashboard /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

## 📊 Monitoring & Maintenance

### Daily Checks

```bash
# Check service
systemctl --user status weather-dashboard

# View recent logs
journalctl --user-unit=weather-dashboard -n 50

# Check disk usage
df -h /home/pi
```

### Weekly Maintenance

```bash
# Update packages
sudo apt-get update
sudo apt-get upgrade -y

# Check Pi temperature
vcgencmd measure_temp

# Restart service
systemctl --user restart weather-dashboard
```

### Monthly Updates

```bash
# Update project
cd weather-dashboard
git pull origin main
npm install
npm run build

# Restart
systemctl --user restart weather-dashboard
```

## 🔍 Troubleshooting Production Issues

### Service won't start

```bash
# Check logs
journalctl --user-unit=weather-dashboard -n 100

# Check if port 3000 is free
lsof -i :3000

# Try running manually
python3 rpi/gui_app.py
```

### High memory usage

```bash
# Check process
ps aux | grep node

# Restart service
systemctl --user restart weather-dashboard

# Check build size
du -sh .next/
```

### No network connectivity

```bash
# Check network
ping 8.8.8.8

# Check WiFi
iwconfig

# Restart networking
sudo systemctl restart networking
```

### Dashboard loads slowly

```bash
# Check CPU
top

# Check disk I/O
iostat -x 1

# Consider production build
npm run build
python3 rpi/kiosk_app.py --fullscreen
```

## 📈 Performance Monitoring Script

Create `rpi/monitor.sh`:

```bash
#!/bin/bash
echo "=== Weather Dashboard Monitoring ==="
echo "Service Status:"
systemctl --user status weather-dashboard --no-pager
echo ""
echo "Memory Usage:"
free -h | grep Mem
echo ""
echo "Disk Usage:"
df -h | grep -E '^/dev'
echo ""
echo "Temperature:"
vcgencmd measure_temp
echo ""
echo "Recent Errors:"
journalctl --user-unit=weather-dashboard -n 10 --no-pager
```

Run:

```bash
chmod +x rpi/monitor.sh
./rpi/monitor.sh
```

## 🎓 Best Practices

1. **Always test locally first**
   - Set up on desktop
   - Test all features
   - Check performance

2. **Use production builds**
   - Run `npm run build`
   - Smaller bundle size
   - Better performance

3. **Monitor logs regularly**
   - Check `journalctl` output
   - Look for error patterns
   - Address early warnings

4. **Backup configuration**
   - Keep `.env.local` backed up
   - Version control project
   - Document any customizations

5. **Keep Pi updated**
   - Regular OS updates
   - Monthly maintenance
   - Monitor resources

## 📞 Support & Resources

- **Service Logs**: `journalctl --user-unit=weather-dashboard -f`
- **Server Logs**: `npm run dev` (for debugging)
- **System Info**: `uname -a`
- **Pi Health**: `vcgencmd measure_temp`

---

**Your deployment is ready! 🚀**

Next steps:
1. Follow Quick Start Guide (rpi/QUICKSTART.md)
2. Deploy to Raspberry Pi
3. Configure autostart
4. Monitor performance
