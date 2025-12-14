#!/usr/bin/env python3
"""
Production-optimized GUI for Raspberry Pi - Kiosk Mode
Minimal resource usage, fullscreen display
"""

import sys
import os
import subprocess
import time
import signal
from PyQt5.QtWidgets import QApplication, QMainWindow
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtCore import QThread, pyqtSignal, QUrl, QTimer
from PyQt5.QtGui import QIcon
from pathlib import Path


class ServerThread(QThread):
    """Lightweight server thread"""
    started = pyqtSignal()
    
    def __init__(self, project_path):
        super().__init__()
        self.project_path = project_path
        self.process = None
        
    def run(self):
        try:
            os.chdir(self.project_path)
            # Use production build for better performance
            self.process = subprocess.Popen(
                ['npm', 'run', 'start'],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            self.started.emit()
            self.process.wait()
        except Exception as e:
            print(f"Server error: {e}")
    
    def stop(self):
        if self.process:
            self.process.send_signal(signal.SIGTERM)
            try:
                self.process.wait(timeout=5)
            except:
                self.process.kill()


class KioskGUI(QMainWindow):
    """Minimal kiosk-mode GUI for Raspberry Pi"""
    
    def __init__(self, fullscreen=False):
        super().__init__()
        self.server_thread = None
        self.fullscreen_mode = fullscreen
        self.init_ui()
        
    def init_ui(self):
        """Initialize minimal UI"""
        self.setWindowTitle('Weather Dashboard')
        
        # Web view only - no controls
        self.web_view = QWebEngineView()
        self.setCentralWidget(self.web_view)
        
        # Fullscreen mode
        if self.fullscreen_mode:
            self.showFullScreen()
            self.setGeometry(0, 0, 1024, 768)  # Typical Pi display
        else:
            self.setGeometry(0, 0, 1024, 768)
        
        # Hide cursor after 3 seconds
        self.hide_cursor_timer = QTimer()
        self.hide_cursor_timer.timeout.connect(self.hide_cursor)
        
        # Start server
        project_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.server_thread = ServerThread(project_path)
        self.server_thread.started.connect(self.on_server_started)
        self.server_thread.start()
        
        # Check server every second
        self.check_timer = QTimer()
        self.check_timer.timeout.connect(self.check_server)
        self.check_timer.start(1000)
        
    def check_server(self):
        """Check if server is ready"""
        try:
            from urllib.request import urlopen
            urlopen('http://localhost:3000', timeout=1)
            self.load_dashboard()
            self.check_timer.stop()
        except:
            pass
    
    def load_dashboard(self):
        """Load dashboard when server ready"""
        self.web_view.load(QUrl('http://localhost:3000'))
    
    def on_server_started(self):
        """Server started"""
        print("✅ Server started")
    
    def hide_cursor(self):
        """Hide cursor"""
        from PyQt5.QtGui import QCursor
        QCursor().hide()
    
    def keyPressEvent(self, event):
        """Handle keyboard - ESC to exit"""
        if event.key() == 16777216:  # ESC key
            self.close_app()
    
    def close_app(self):
        """Clean exit"""
        if self.server_thread:
            self.server_thread.stop()
            self.server_thread.wait()
        QApplication.quit()


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Weather Dashboard Kiosk')
    parser.add_argument('--fullscreen', action='store_true', help='Run in fullscreen')
    parser.add_argument('--production', action='store_true', help='Use production build')
    args = parser.parse_args()
    
    app = QApplication(sys.argv)
    window = KioskGUI(fullscreen=args.fullscreen)
    window.show()
    
    sys.exit(app.exec_())


if __name__ == '__main__':
    main()
