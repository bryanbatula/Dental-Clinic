require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Database pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Static files
app.use(express.static(path.join(__dirname, '../public')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session setup
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: 'session',
    }),
    secret: process.env.SESSION_SECRET || 'clinic_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  })
);

// Routes
const mainRoutes = require('../routes/main');
const clientsRoutes = require('../routes/clients');
const appointmentsRoutes = require('../routes/appointments');
const servicesRoutes = require('../routes/services');
const remindersRoutes = require('../routes/reminders');
const reportsRoutes = require('../routes/reports');
const treatmentsRoutes = require('../routes/treatments');
const authRoutes = require('../routes/auth');
app.use('/', mainRoutes);
app.use(authRoutes);

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

app.use('/clients', requireAuth, clientsRoutes);
app.use('/appointments', requireAuth, appointmentsRoutes);
app.use('/services', requireAuth, servicesRoutes);
app.use('/reminders', requireAuth, remindersRoutes);
app.use('/reports', requireAuth, reportsRoutes);
app.use('/treatments', requireAuth, treatmentsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 