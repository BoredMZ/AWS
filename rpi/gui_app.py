#!/usr/bin/env python3
"""
Philippine Weather Station Dashboard - Raspberry Pi GUI
A PyQt5-based GUI application for displaying real-time weather data
"""

import sys
import os
import subprocess
import time
import signal
from pathlib import Path
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QLabel, QProgressBar, QMessageBox, QSystemTrayIcon, QMenu
)
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtCore import QThread, pyqtSignal, Qt, QUrl, QTimer, QSize
from PyQt5.QtGui import QIcon, QColor, QFont
from PyQt5.QtWebEngineCore import QWebEnginePage


class ServerThread(QThread):
    """Background thread for running Next.js dev/prod server"""
    started = pyqtSignal()
    error = pyqtSignal(str)
    
    def __init__(self, project_path, is_production=False):
        super().__init__()
        self.project_path = project_path
        self.is_production = is_production
        self.process = None
        
    def run(self):
        try:
            os.chdir(self.project_path)
            
            # Install dependencies if needed
            if not os.path.exists(os.path.join(self.project_path, 'node_modules')):
                self.error.emit("Installing dependencies... This may take a few minutes.")
                subprocess.run(['npm', 'install'], check=True, capture_output=True)
            
            # Start server
            if self.is_production:
                subprocess.run(['npm', 'run', 'build'], check=True, capture_output=True)
                cmd = ['npm', 'run', 'start']
            else:
                cmd = ['npm', 'run', 'dev']
            
            self.process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            self.started.emit()
            
            # Keep the process running
            self.process.wait()
            
        except Exception as e:
            self.error.emit(f"Error starting server: {str(e)}")
    
    def stop(self):
        """Stop the server process"""
        if self.process:
            self.process.send_signal(signal.SIGTERM)
            try:
                self.process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.process.kill()


class WeatherDashboardGUI(QMainWindow):
    """Main GUI window for weather dashboard"""
    
    def __init__(self):
        super().__init__()
        self.server_thread = None
        self.server_ready = False
        self.init_ui()
        self.setup_tray()
        
    def init_ui(self):
        """Initialize the user interface"""
        self.setWindowTitle('Philippine Weather Station Dashboard')
        self.setGeometry(100, 100, 1400, 900)
        
        # Set icon
        try:
            self.setWindowIcon(QIcon('🇵🇭'))
        except:
            pass
        
        # Central widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        layout = QVBoxLayout()
        
        # Control panel
        control_layout = QHBoxLayout()
        
        self.status_label = QLabel('Initializing...')
        self.status_label.setStyleSheet("""
            color: #00d4ff;
            font-size: 12px;
            font-weight: bold;
            padding: 8px;
        """)
        control_layout.addWidget(self.status_label)
        
        self.progress_bar = QProgressBar()
        self.progress_bar.setMaximum(0)  # Indeterminate
        self.progress_bar.setStyleSheet("""
            QProgressBar {
                border: 1px solid #00d4ff;
                border-radius: 5px;
                background-color: #0a0e27;
            }
            QProgressBar::chunk {
                background-color: #00d4ff;
            }
        """)
        self.progress_bar.setMaximumWidth(300)
        control_layout.addWidget(self.progress_bar)
        
        self.refresh_btn = QPushButton('🔄 Refresh')
        self.refresh_btn.setStyleSheet("""
            QPushButton {
                background-color: #00d4ff;
                color: #0a0e27;
                border: none;
                border-radius: 5px;
                padding: 8px 16px;
                font-weight: bold;
                font-size: 11px;
            }
            QPushButton:hover {
                background-color: #00b8cc;
            }
        """)
        self.refresh_btn.clicked.connect(self.refresh_dashboard)
        control_layout.addWidget(self.refresh_btn)
        
        self.settings_btn = QPushButton('⚙️ Settings')
        self.settings_btn.setStyleSheet("""
            QPushButton {
                background-color: #1e3a5f;
                color: #00d4ff;
                border: 1px solid #00d4ff;
                border-radius: 5px;
                padding: 8px 16px;
                font-weight: bold;
                font-size: 11px;
            }
            QPushButton:hover {
                background-color: #253d66;
            }
        """)
        self.settings_btn.clicked.connect(self.show_settings)
        control_layout.addWidget(self.settings_btn)
        
        layout.addLayout(control_layout)
        
        # Web view for dashboard
        self.web_view = QWebEngineView()
        self.web_view.setStyleSheet("""
            QWebEngineView {
                background-color: #0a0e27;
                border: none;
            }
        """)
        layout.addWidget(self.web_view)
        
        central_widget.setLayout(layout)
        
        # Apply dark theme
        self.setStyleSheet("""
            QMainWindow {
                background-color: #0a0e27;
            }
            QWidget {
                background-color: #0a0e27;
                color: #00d4ff;
            }
            QLabel {
                color: #00d4ff;
            }
        """)
        
        # Start server
        self.start_server()
        
        # Timer to check if server is ready
        self.check_timer = QTimer()
        self.check_timer.timeout.connect(self.check_server_ready)
        self.check_timer.start(1000)  # Check every second
        
    def setup_tray(self):
        """Setup system tray icon"""
        self.tray_icon = QSystemTrayIcon(self)
        
        tray_menu = QMenu()
        show_action = tray_menu.addAction("Show")
        show_action.triggered.connect(self.showNormal)
        
        exit_action = tray_menu.addAction("Exit")
        exit_action.triggered.connect(self.close_application)
        
        self.tray_icon.setContextMenu(tray_menu)
        self.tray_icon.show()
    
    def start_server(self):
        """Start the Next.js server in background"""
        project_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
        self.server_thread = ServerThread(project_path, is_production=False)
        self.server_thread.started.connect(self.on_server_started)
        self.server_thread.error.connect(self.on_server_error)
        self.server_thread.start()
        
        self.status_label.setText('📡 Starting server...')
    
    def check_server_ready(self):
        """Check if server is ready and load dashboard"""
        if not self.server_ready:
            try:
                from urllib.request import urlopen
                urlopen('http://localhost:3000', timeout=1)
                self.server_ready = True
                self.load_dashboard()
            except:
                pass
    
    def load_dashboard(self):
        """Load the weather dashboard"""
        self.web_view.load(QUrl('http://localhost:3000'))
        self.status_label.setText('✅ Dashboard loaded successfully')
        self.progress_bar.setMaximum(100)
        self.progress_bar.setValue(100)
        self.check_timer.stop()
    
    def on_server_started(self):
        """Called when server successfully starts"""
        self.status_label.setText('🚀 Server started, loading dashboard...')
    
    def on_server_error(self, error_msg):
        """Handle server errors"""
        self.status_label.setText(f'❌ {error_msg}')
        QMessageBox.warning(self, 'Server Error', error_msg)
    
    def refresh_dashboard(self):
        """Refresh the dashboard"""
        self.web_view.reload()
    
    def show_settings(self):
        """Show settings dialog"""
        QMessageBox.information(
            self,
            'Settings',
            'Philippine Weather Station Dashboard v1.0\n\n'
            'Features:\n'
            '• Real-time weather data from Firebase\n'
            '• 15+ Philippine regions\n'
            '• Live news integration\n'
            '• Bilingual support (English/Tagalog)\n'
            '• Glassmorphism dark theme\n\n'
            'Server: http://localhost:3000'
        )
    
    def changeEvent(self, event):
        """Handle window state changes"""
        if event.type() == 2:  # QEvent.WindowStateChange
            if self.windowState() & Qt.WindowMinimized:
                self.hide()
                event.ignore()
    
    def closeEvent(self, event):
        """Handle window close"""
        if self.tray_icon.isVisible():
            self.hide()
            event.ignore()
        else:
            self.close_application()
    
    def close_application(self):
        """Close application and cleanup"""
        if self.server_thread:
            self.server_thread.stop()
            self.server_thread.wait()
        
        QApplication.quit()


def main():
    """Main entry point"""
    app = QApplication(sys.argv)
    
    # Set application style
    app.setStyle('Fusion')
    
    window = WeatherDashboardGUI()
    window.show()
    
    sys.exit(app.exec_())


if __name__ == '__main__':
    main()
