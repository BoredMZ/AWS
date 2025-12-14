# Philippine Weather Station Dashboard - Raspberry Pi 4+ GUI

A complete PyQt5-based desktop application for displaying real-time Philippine weather data on Raspberry Pi 4+.

## Features

✅ **Desktop GUI Application**
- PyQt5-based interface
- System tray integration
- Fullscreen support
- Dark glassmorphism theme
- Real-time status updates

✅ **Embedded Weather Dashboard**
- Next.js web interface
- Firebase real-time data (Dual paths)
- 6 Luzon regions (Manila, Laguna, Pampanga, Cavite, Bulacan, Batangas)
- Bilingual support (English/Tagalog)
- Real/Test mode toggle for data validation
- Weather alerts and calculations
- Station-specific sensor configurations

✅ **Raspberry Pi Optimized**
- Lightweight PyQt5 interface
- Efficient resource usage
- Automatic server management
- System tray minimization
- Autostart capability

## Hardware Requirements

- **Raspberry Pi 4** (2GB+ RAM recommended, 4GB+ optimal)
- **microSD Card**: 32GB+ Class 10
- **Power Supply**: 5V/3A or higher
- **Network**: WiFi or Ethernet connection

## Software Requirements

- **OS**: Raspberry Pi OS (Bullseye or later)
- **Python**: 3.9+
- **Node.js**: 18.x or later
- **npm**: 9.x or later

## Installation

### 1. Prepare Raspberry Pi

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install required packages
sudo apt-get install -y build-essential python3-dev python3-pip git curl
```

### 2. Clone/Transfer Project

```bash
git clone <your-repo-url> weather-dashboard
cd weather-dashboard
```

Or transfer the project directly:

```bash
rsync -avz --delete ./ pi@192.168.1.x:/home/pi/weather-dashboard/
```

### 3. Run Installation Script

```bash
cd rpi
chmod +x install.sh
./install.sh
```

Or manual installation:

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python packages
pip3 install -r rpi/requirements.txt

# Install project dependencies
npm install
```

## Usage

### Quick Start

```bash
python3 rpi/gui_app.py
```

### Run as Fullscreen Kiosk

```bash
python3 rpi/gui_app.py --fullscreen
```

### Enable Autostart on Boot

#### Option 1: Using systemd (Recommended)

```bash
# Copy service file
cp rpi/weather-dashboard.service ~/.config/systemd/user/

# Enable and start
systemctl --user daemon-reload
systemctl --user enable weather-dashboard
systemctl --user start weather-dashboard

# Check status
systemctl --user status weather-dashboard
```

#### Option 2: Using .desktop file (GUI Autostart)

The installation script creates `~/.config/autostart/weather-dashboard.desktop`

## Configuration

### Environment Variables

Create a `.env.local` file with your Firebase credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# News API (Optional)
NEXT_PUBLIC_NEWS_API_KEY=your_newsapi_key
```

### Firebase Data Structure

The dashboard uses **two separate Firebase paths** for real and test data:

```
Firebase Database (asia-southeast1)
├── /weatherStations/              # 🟢 Real data from ESP32 devices
│   ├── manila          → 28.5°C + Atmospheric Pressure, Solar Radiation
│   ├── laguna          → 28.2°C + Soil Moisture
│   ├── pampanga        → 30.2°C + UV Index, Visibility
│   ├── cavite          → 29.1°C + (main sensors only)
│   ├── bulacan         → 27.5°C + Soil Moisture, Atmospheric Pressure
│   └── batangas        → 29.5°C + UV Index
│
└── /testWeatherStations/          # 🟠 Test data for validation
    ├── manila, laguna, ...        (same structure, different values)
```

**Mode Toggle Button** (in UI):
- 🟢 **Real Data**: Displays live data from `/weatherStations/` path
- 🟠 **Test Mode**: Displays test data from `/testWeatherStations/` path + Random toggle

### Server Port

By default, the server runs on `http://localhost:3000`. To change:

```bash
# Edit gui_app.py and change the port in load_dashboard()
```

## Features

### Main GUI Window

- **Status Bar**: Real-time server status
- **Progress Bar**: Loading indicator
- **Refresh Button**: Reload dashboard
- **Settings Button**: Application info
- **System Tray**: Minimize/restore window
- **Web View**: Embedded dashboard display

### Dashboard Features

- Real-time weather stations
- Collapsible region filters
- Live news with thumbnails
- Weather alerts
- Bilingual interface (EN/TL)
- Responsive design
- Dark glassmorphism theme

## Troubleshooting

### Port Already in Use

```bash
# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

### PyQt5 Not Found

```bash
# Install PyQt5 from Raspberry Pi repositories
sudo apt-get install -y python3-pyqt5 python3-pyqt5.qtwebengine
```

### Server Not Starting

```bash
# Check Node.js installation
node --version
npm --version

# Install dependencies
npm install

# Test server manually
npm run dev
```

### Display Issues

If running via SSH:

```bash
# Export display
export DISPLAY=:0
python3 rpi/gui_app.py
```

### Fonts Not Rendering

```bash
# Install font support
sudo apt-get install -y fonts-dejavu fonts-liberation
```

## Performance Optimization

### For 2GB RAM Pi

```bash
# Reduce Node.js memory
export NODE_OPTIONS="--max-old-space-size=512"
python3 rpi/gui_app.py
```

### Disable Unnecessary Services

```bash
# Disable unused services to free RAM
sudo systemctl disable bluetooth
sudo systemctl disable avahi-daemon
```

### Enable GPU Acceleration

```bash
# Edit /boot/config.txt
sudo nano /boot/config.txt
# Add: gpu_mem=256
sudo reboot
```

## File Structure

```
weather-dashboard/
├── rpi/
│   ├── gui_app.py                 # Main PyQt5 application
│   ├── install.sh                 # Installation script
│   ├── requirements.txt            # Python dependencies
│   ├── weather-dashboard.service  # systemd service file
│   └── README.md                   # This file
├── src/
│   ├── app/                        # Next.js app directory
│   ├── components/                 # React components
│   ├── lib/                        # Utilities and services
│   └── types/                      # TypeScript definitions
├── .env.local                      # Environment variables
├── next.config.ts                  # Next.js config
├── tailwind.config.ts              # Tailwind CSS config
└── package.json                    # Node.js dependencies
```

## Security Considerations

1. **Restrict Network Access**: Use firewall rules
   ```bash
   sudo ufw allow 3000/tcp
   ```

2. **HTTPS Setup**: Use reverse proxy (nginx)
   ```bash
   sudo apt-get install -y nginx
   # Configure nginx with SSL
   ```

3. **API Keys**: Keep `.env.local` secure
   ```bash
   chmod 600 .env.local
   ```

## Remote Management

### SSH Access

```bash
# Connect remotely
ssh pi@192.168.1.x

# View logs
systemctl --user logs -f weather-dashboard
```

### Web Dashboard Only

If you don't want the GUI:

```bash
# Run just the server
npm run dev

# Access at http://192.168.1.x:3000
```

## Updates

To update the project:

```bash
cd weather-dashboard
git pull origin main
npm install
npm run build

# Restart service
systemctl --user restart weather-dashboard
```

## License

MIT License - See LICENSE file for details

## Support

For issues and feature requests, please visit:
- GitHub Issues: [your-repo]/issues
- Documentation: [your-wiki]/

## Credits

- **Dashboard**: Next.js + React + Tailwind CSS
- **Server**: Node.js + Firebase
- **GUI**: PyQt5
- **Optimization**: Raspberry Pi Foundation

---

**Happy Weather Monitoring! 🇵🇭**
