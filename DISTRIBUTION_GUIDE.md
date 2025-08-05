# 📋 Clinic Management System - Complete Distribution Guide

## 🖥️ For the Main Developer (You)

### Prerequisites Required
1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Choose "LTS" version
   - This includes npm automatically

2. **PostgreSQL with pgAdmin**
   - Download from: https://www.postgresql.org/download/
   - pgAdmin comes bundled with PostgreSQL
   - Remember your database password during installation

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

### Initial Project Setup

#### Step 1: Install Dependencies
```bash
# Navigate to your project folder
cd /path/to/your/Clinic

# Install main project dependencies
npm install

# Install Electron dependencies
npm run install-electron
```

#### Step 2: Database Setup
1. **Start PostgreSQL Service**
   - Windows: Start "PostgreSQL" service from Services
   - Or: Start pgAdmin and it will auto-start PostgreSQL

2. **Create Database**
   - Open pgAdmin
   - Right-click "Databases" → "Create" → "Database"
   - Name: `clinic_db` (or your preferred name)

3. **Configure Environment**
   - Create `.env` file in project root:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/clinic_db
   SESSION_SECRET=your_secret_key_here
   PORT=3000
   ```
   - Replace `username`, `password`, `clinic_db` with your actual values

4. **Initialize Database**
   ```bash
   npm run init-db
   ```

#### Step 3: Test Your Setup
```bash
# Test web version
npm start
# Visit: http://localhost:3000

# Test desktop version
npm run electron-dev
```

#### Step 4: Create Desktop Shortcut (Optional)
```bash
# Double-click this file in Windows Explorer:
electron/create-desktop-shortcut.vbs
```

## 📦 Building for Distribution

### Step 1: Build Desktop Installer
```bash
# Build for Windows (creates .exe installer)
npm run build-desktop

# Or build for specific platforms:
cd electron
npm run build-win    # Windows
npm run build-mac    # macOS  
npm run build-linux  # Linux
```

### Step 2: Locate Distribution Files
After building, find files in:
```
electron/dist/
├── Clinic Management System Setup 1.0.0.exe  # Installer
└── win-unpacked/                              # Portable version
```

## 🚀 For Recipients (Other Laptops/Desktops)

### Option A: Using the Installer (Recommended)

#### Prerequisites for Recipients
1. **Node.js** (v16 or higher)
   - Download: https://nodejs.org/
   - Choose "LTS" version

2. **PostgreSQL with pgAdmin** 
   - Download: https://www.postgresql.org/download/
   - During installation, remember the password for user `postgres`

#### Installation Steps
1. **Install Prerequisites**
   - Install Node.js first
   - Install PostgreSQL with pgAdmin

2. **Run the App Installer**
   - Double-click `Clinic Management System Setup 1.0.0.exe`
   - Follow installation wizard
   - App will be installed and ready to use

3. **Database Setup**
   - Open pgAdmin
   - Create database: `clinic_db`
   - Create `.env` file in app folder with database connection
   - Run database initialization (see database setup below)

### Option B: Using Project Folder (Development)

#### Prerequisites for Recipients
Same as Option A (Node.js + PostgreSQL)

#### Installation Steps
1. **Copy Project Folder**
   - Copy entire "Clinic" folder to recipient's computer

2. **Install Dependencies**
   ```bash
   cd Clinic
   npm install
   npm run install-electron
   ```

3. **Database Setup** (see section below)

4. **Launch App**
   - Double-click: `electron/Launch Clinic App.vbs`
   - Or create desktop shortcut: `electron/create-desktop-shortcut.vbs`

## 🗄️ Database Setup for Recipients

### Method 1: Database Backup/Restore (With Data)

#### On Your Computer (Sender):
1. **Create Database Backup**
   - Open pgAdmin
   - Right-click your database → "Backup..."
   - Choose format: "Custom"
   - Save as: `clinic_backup.backup`

2. **Include in Distribution**
   - Send this backup file with your app

#### On Recipient's Computer:
1. **Create Empty Database**
   - Open pgAdmin
   - Create database: `clinic_db`

2. **Restore Backup**
   - Right-click `clinic_db` → "Restore..."
   - Select your `clinic_backup.backup` file
   - Click "Restore"

3. **Configure Connection**
   - Create `.env` file in app root:
   ```env
   DATABASE_URL=postgresql://postgres:their_password@localhost:5432/clinic_db
   SESSION_SECRET=your_secret_key_here
   PORT=3000
   ```

### Method 2: Fresh Database (No Data)

#### On Recipient's Computer:
1. **Create Database**
   - Open pgAdmin
   - Create database: `clinic_db`

2. **Configure Environment**
   - Create `.env` file:
   ```env
   DATABASE_URL=postgresql://postgres:their_password@localhost:5432/clinic_db
   SESSION_SECRET=your_secret_key_here
   PORT=3000
   ```

3. **Initialize Fresh Database**
   ```bash
   npm run init-db
   ```

## 📋 Distribution Checklist

### For You (Main Developer):
- [ ] Node.js installed
- [ ] PostgreSQL + pgAdmin installed
- [ ] Project dependencies installed (`npm install`)
- [ ] Electron dependencies installed (`npm run install-electron`)
- [ ] Database created and configured
- [ ] Environment variables set (`.env` file)
- [ ] App tested (both web and desktop versions)
- [ ] Desktop installer built (`npm run build-desktop`)

### For Recipients:
- [ ] Node.js installed
- [ ] PostgreSQL + pgAdmin installed  
- [ ] App installed (via installer or project folder)
- [ ] Database created
- [ ] Database restored (if using backup) or initialized (if fresh)
- [ ] Environment variables configured (`.env` file)
- [ ] App launches successfully

## 🔧 Troubleshooting

### Common Issues:

**"Port 3000 already in use"**
- Close any running instances of the app
- Change PORT in `.env` file to 3001, 3002, etc.

**"Database connection failed"**
- Check PostgreSQL service is running
- Verify credentials in `.env` file
- Test connection in pgAdmin

**"Module not found" errors**
- Run `npm install` in project root
- Run `npm install` in `electron/` folder

**Desktop app won't start**
- Ensure Node.js is installed
- Check console for errors (run `npm run electron-dev`)
- Verify all dependencies are installed

## 📂 What to Share

### Complete Package:
1. **Installer File**: `electron/dist/Clinic Management System Setup 1.0.0.exe`
2. **Database Backup**: `clinic_backup.backup` (if sharing data)
3. **Instructions**: This guide or simplified version
4. **Environment Template**: Sample `.env` file with placeholders

### Quick Share (Development):
1. **Project Folder**: Entire "Clinic" directory
2. **Database Backup**: `clinic_backup.backup` (optional)
3. **Setup Instructions**: This guide

## 📞 Support

If recipients encounter issues:
1. Check Node.js and PostgreSQL are properly installed
2. Verify database credentials and connection
3. Ensure all dependencies are installed
4. Check Windows Defender/Antivirus isn't blocking the app
5. Try running `npm run electron-dev` to see detailed error messages 