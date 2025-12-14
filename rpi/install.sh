#!/bin/bash
# Installation script for Philippine Weather Dashboard on Raspberry Pi 4+
# This script sets up the environment and dependencies

echo "🇵🇭 Philippine Weather Station Dashboard - Raspberry Pi Setup"
echo "=================================================="

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js (if not already installed)
echo "📥 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python and PyQt5
echo "🐍 Installing Python dependencies..."
sudo apt-get install -y python3 python3-pip python3-pyqt5 python3-pyqt5.qtwebengine
pip3 install PyQt5 PyQtWebEngine

# Install project dependencies
echo "🔧 Installing project dependencies..."
cd "$(dirname "$0")/.."
npm install

# Create autostart directory if needed
mkdir -p ~/.config/autostart

# Create desktop entry for autostart (optional)
cat > ~/.config/autostart/weather-dashboard.desktop << EOF
[Desktop Entry]
Type=Application
Name=Weather Dashboard
Exec=/usr/bin/python3 $PWD/rpi/gui_app.py
Icon=weather-clear
Terminal=false
Categories=Utility;
EOF

echo ""
echo "✅ Installation complete!"
echo ""
echo "To start the dashboard:"
echo "  python3 ./rpi/gui_app.py"
echo ""
echo "Or to run at startup, use:"
echo "  systemctl --user enable weather-dashboard"
echo ""
