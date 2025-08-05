# 🏥 Clinic Management System - Quick Setup Guide

## What You Need to Install First

### 1. Download and Install Node.js
- Go to: https://nodejs.org/
- Download the **LTS version** (recommended)
- Run the installer and accept all defaults
- This installs Node.js and npm together

### 2. Download and Install PostgreSQL
- Go to: https://www.postgresql.org/download/
- Download for your operating system
- **Important:** Remember the password you set for user `postgres`
- pgAdmin will be installed automatically

## Setting Up the App

### Option 1: Using the Installer (Easiest)
1. **Run the installer file** you received: `Clinic Management System Setup 1.0.0.exe`
2. **Follow the installation wizard**
3. **Continue to Database Setup below**

### Option 2: Using the Project Folder
1. **Copy the "Clinic" folder** to your computer (e.g., Desktop)
2. **Open Command Prompt** in the Clinic folder:
   - Right-click in the folder → "Open in Terminal" (Windows 11)
   - Or hold Shift + Right-click → "Open PowerShell window here"
3. **Install dependencies**:
   ```
   npm install
   npm run install-electron
   ```

## Database Setup

### Step 1: Create the Database
1. **Open pgAdmin** (search for it in Start menu)
2. **Enter your postgres password** when prompted
3. **Create a new database**:
   - Right-click "Databases" → "Create" → "Database"
   - Name: `clinic_db`
   - Click "Save"

### Step 2: Configure Database Connection
1. **Copy the environment template**:
   - Copy `env-template.txt` and rename it to `.env`
   - Or create a new file called `.env` in the main project folder

2. **Edit the .env file** with your details:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/clinic_db
   SESSION_SECRET=clinic_secret_key_change_this
   PORT=3000
   ```
   - Replace `YOUR_PASSWORD` with the password you set during PostgreSQL installation

### Step 3: Initialize the Database (Choose One)

#### Option A: With Sample Data (if you received a backup file)
1. **Restore the database backup**:
   - In pgAdmin, right-click your `clinic_db` → "Restore..."
   - Select the `.backup` file you received
   - Click "Restore"

#### Option B: Fresh Database (no data)
1. **Open Command Prompt** in the project folder
2. **Run initialization**:
   ```
   npm run init-db
   ```

## Running the App

### Desktop App (Recommended)
1. **Create desktop shortcut** (one-time setup):
   - Double-click: `electron/create-desktop-shortcut.vbs`
   
2. **Launch the app**:
   - Double-click the desktop shortcut "Clinic Management System"
   - Or double-click: `electron/Launch Clinic App.vbs`

### Web Version (Alternative)
1. **Start the server**:
   ```
   npm start
   ```
2. **Open browser** and go to: http://localhost:3000

## 🎉 You're Done!

The app should now open and be ready to use. If you encounter any issues, check the troubleshooting section in the main distribution guide.

## Quick Troubleshooting

**App won't start?**
- Make sure PostgreSQL is running (check pgAdmin)
- Verify your `.env` file has the correct password
- Try: `npm run electron-dev` to see error messages

**Database connection error?**
- Double-check the password in your `.env` file
- Make sure the database name is `clinic_db`
- Restart PostgreSQL service if needed

**Need help?** Contact the person who sent you this app! 