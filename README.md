# Clinic Management System

A web-based clinic management system built with Node.js, Express, EJS, and PostgreSQL. It can also run as a desktop application via Electron.

---

## Features

- **Dashboard** — Overview of clinic activity
- **Clients** — Add, view, edit, and manage patient records
- **Appointments** — Schedule appointments with a list and calendar view
- **Treatments** — Record and track treatment history per patient
- **Services** — Manage the clinic's list of dental services and categories
- **Reminders** — Manage patient reminders
- **Reports & Analytics** — View clinic analytics and reports
- **Authentication** — Secure login system with session-based auth
- **Desktop App** — Can be packaged and launched as a desktop app via Electron

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express 5 |
| Templating | EJS |
| Database | PostgreSQL |
| Auth | bcrypt, express-session, connect-pg-simple |
| Desktop | Electron |
| Dev Tool | nodemon |

---

## Prerequisites

Before setting up, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher recommended)
- npm (comes with Node.js)

---

## Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Clinic-v1
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgres://<user>:<password>@localhost:5432/<database_name>
SESSION_SECRET=your_secret_key_here
```

Example:

```env
DATABASE_URL=postgres://postgres:1234@localhost:5432/clinic
SESSION_SECRET=somesecretkey
```

### 4. Create the database

Open pgAdmin or psql and create the database:

```sql
CREATE DATABASE clinic;
```

### 5. Run database migrations

Run the init script to set up the initial tables:

```bash
npm run init-db
```

Then apply all remaining migrations in order from the `config/migrations/` folder:

```
001_create_services.sql
002_add_analytics_columns.sql
003_add_dental_chart.sql
004_create_treatment_records.sql
005_add_dentist_notes_to_treatments.sql
006_add_category_to_services.sql
007_increase_tooth_number_field_size.sql
008_make_description_optional.sql
009_make_email_optional.sql
```

You can run each one in psql:

```bash
psql -U postgres -d clinic -f config/migrations/002_add_analytics_columns.sql
```

Repeat for each migration file in order.

### 6. Seed the admin user

```bash
node scripts/seedAdmin.js
```

This creates the default admin account. See `admin.md` for credentials and how to change them.

---

## Running the App

### Web (development)

```bash
npm run dev
```

### Web (production)

```bash
npm start
```

The app will be available at: `http://localhost:3000`

---

## Project Structure

```
Clinic-v1/
├── config/
│   ├── db.js                  # PostgreSQL connection pool
│   ├── init-db.js             # Database initializer
│   └── migrations/            # SQL migration files
├── electron/                  # Electron desktop app setup
│   ├── main.js
│   ├── preload.js
│   └── ...
├── models/                    # Database model helpers
│   ├── appointment.js
│   ├── client.js
│   ├── service.js
│   ├── treatment.js
│   └── user.js
├── public/
│   └── js/                    # Client-side JavaScript
│       ├── analytics.js
│       ├── calendar.js
│       ├── dashboard.js
│       ├── reminders.js
│       └── services.js
├── routes/                    # Express route handlers
│   ├── auth.js
│   ├── appointments.js
│   ├── clients.js
│   ├── main.js
│   ├── reminders.js
│   ├── reports.js
│   ├── services.js
│   └── treatments.js
├── scripts/
│   ├── seedAdmin.js           # Create initial admin user
│   └── updateUsername.js      # Update admin username
├── src/
│   └── server.js              # App entry point
├── views/                     # EJS templates
│   ├── appointments/
│   ├── auth/
│   ├── clients/
│   ├── reminders/
│   ├── reports/
│   ├── services/
│   ├── treatments/
│   ├── dashboard.ejs
│   └── 404.ejs
├── .env                       # Environment variables (not committed)
├── admin.md                   # Guide for changing admin credentials
├── package.json
└── README.md
```

---

## Desktop App (Electron)

The app can be launched as a standalone desktop application using Electron.

### Install Electron dependencies

```bash
npm run install-electron
```

### Run in development

```bash
npm run electron-dev
```

### Run in production

```bash
npm run electron
```

### Build installer

```bash
npm run build-desktop
```

For more details, see `electron/README.md`.

### Windows Silent Launch

Double-click `electron/Launch Clinic App.vbs` to start the desktop app without any terminal window.

---

## Admin Credentials

See `admin.md` for the full step-by-step guide on how to change the admin username and password.

Default credentials after seeding:

| Field | Value |
|---|---|
| Username | `DENTAL` |
| Password | `admin123` |

---

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start the server in production mode |
| `npm run dev` | Start the server with nodemon (auto-restart) |
| `npm run init-db` | Initialize the database schema |
| `npm run electron` | Run the Electron desktop app |
| `npm run electron-dev` | Run Electron in development mode |
| `npm run build-desktop` | Build the Electron installer |
| `npm run install-electron` | Install Electron dependencies |
| `node scripts/seedAdmin.js` | Seed the admin user |
| `node scripts/updateUsername.js` | Update the admin username |
