# Clinic Management System - Desktop App

This folder contains the Electron configuration to run your clinic management system as a desktop application.

## Setup

1. **Install Electron dependencies:**
   ```bash
   npm run install-electron
   ```

2. **Make sure your main application dependencies are installed:**
   ```bash
   npm install
   ```

## Development

To run the desktop app in development mode:
```bash
npm run electron-dev
```

## Production

To run the desktop app:
```bash
npm run electron
```

## Silent Launch (No Command Prompt)

### Windows Silent Launchers
- **User-friendly:** Double-click `Launch Clinic App.vbs` 
- **Technical name:** Double-click `start-desktop-silent.vbs`

Both start the app without any command prompt windows.

### Manual Command (with visible command prompt)
Double-click `start-desktop.bat` if you want to see the installation/startup process.

## Create Desktop Shortcut

### Automatic Shortcut Creation
Double-click `create-desktop-shortcut.vbs` to automatically create a desktop shortcut with the clinic icon.

The shortcut will:
- Appear on your desktop as "Clinic Management System"
- Use the custom icon from `assets/icons/a.ico`
- Launch the app silently (no command prompt)
- Work from anywhere on your computer

## Building for Distribution

### Build for Current Platform
```bash
npm run build-desktop
```

### Build for Specific Platforms
```bash
# Windows
cd electron && npm run build-win

# macOS
cd electron && npm run build-mac

# Linux
cd electron && npm run build-linux
```

### Package without Installer (for testing)
```bash
npm run pack-desktop
```

## Distribution Files

After building, you'll find the distribution files in the `electron/dist` folder:

- **Windows**: `.exe` installer and unpacked files
- **macOS**: `.dmg` file
- **Linux**: `.AppImage` file

## Features

- ✅ Uses your existing Express server
- ✅ Includes application menu
- ✅ Custom icon from assets/icons/a.ico
- ✅ Window controls (minimize, maximize, close)
- ✅ Security-hardened (context isolation enabled)
- ✅ Auto-starts the backend server
- ✅ Clean shutdown handling

## Database Setup

The desktop app uses the same database configuration as your web application. Make sure your `.env` file is properly configured with your database connection string.

## Sharing with Other Laptops

1. Build the application using the build commands above
2. Share the installer file from the `electron/dist` folder
3. The recipient just needs to run the installer - no additional setup required!
4. Make sure the database is accessible from the target machine (update connection strings if needed)

## Troubleshooting

- If the app doesn't start, check that port 3000 is available
- Make sure your database is running and accessible
- Check the console for any error messages
- Verify that all dependencies are installed in both the main project and electron folder 