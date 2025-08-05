# Clinic Management System - Desktop Setup Guide

Your clinic management system now supports both web and desktop applications!

## 🚀 Quick Start for Desktop App

### 1. Install Dependencies
```bash
# Install main project dependencies
npm install

# Install Electron dependencies
npm run install-electron
```

### 2. Run Desktop App
```bash
# Development mode (with debugging)
npm run electron-dev

# Production mode
npm run electron
```

### 3. Windows Quick Start
**Silent Launch (No Command Prompt):**
Double-click `electron/Launch Clinic App.vbs` to start the app without any visible windows.

**Alternative Options:**
- `electron/start-desktop-silent.vbs` - Technical filename version
- `electron/start-desktop.bat` - Shows command prompt (for troubleshooting)

### 4. Create Desktop Shortcut
Double-click `electron/create-desktop-shortcut.vbs` to automatically create a desktop shortcut.

The shortcut will:
- ✅ Appear on your desktop as "Clinic Management System"
- ✅ Use your custom clinic icon
- ✅ Launch silently without command prompt
- ✅ Work from anywhere on your computer

## 📦 Building for Distribution

### Build Installer for Current Platform
```bash
npm run build-desktop
```

### Build for Specific Platforms
```bash
# From the electron folder:
cd electron

# Windows installer
npm run build-win

# macOS installer  
npm run build-mac

# Linux AppImage
npm run build-linux
```

## 📁 Project Structure

```
Clinic/
├── electron/                        # Desktop app configuration
│   ├── main.js                     # Main Electron process
│   ├── preload.js                  # Security preload script
│   ├── package.json                # Electron-specific config
│   ├── Launch Clinic App.vbs       # Silent launcher (user-friendly)
│   ├── start-desktop-silent.vbs    # Silent launcher (technical)
│   ├── start-desktop.bat           # Launcher with command prompt
│   ├── create-desktop-shortcut.vbs # Creates desktop shortcut
│   └── README.md                   # Detailed Electron docs
├── src/                            # Your existing web app
├── models/                         # Database models
├── routes/                         # API routes
├── views/                          # EJS templates
└── assets/                         # Static assets (icons, styles, etc.)
```

## 🔧 Features

- **Native Desktop App**: Runs as a standalone application
- **Same Codebase**: Uses your existing Express.js backend
- **Custom Icon**: Uses `assets/icons/a.ico` as the app icon
- **Auto-Start Server**: Automatically starts the backend when launching
- **Security**: Context isolation and sandboxed renderer
- **Cross-Platform**: Builds for Windows, macOS, and Linux

## 📤 Sharing with Other Computers

1. Build the installer: `npm run build-desktop`
2. Share the installer file from `electron/dist/`
3. Recipients just run the installer - no setup needed!

## 🌐 Web Version Still Available

Your original web version still works:
```bash
npm start          # Start web server
npm run dev        # Start with nodemon
```

## 🆘 Need Help?

- Check `electron/README.md` for detailed documentation
- Ensure your database is running and accessible
- Verify port 3000 is available
- Check console for error messages 