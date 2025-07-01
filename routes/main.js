const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Home page - redirect to login if not authenticated, dashboard if authenticated
router.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  } else {
    return res.redirect('/login');
  }
});

// About page
router.get('/about', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('about', { title: 'About Us', user: req.session.user });
});

// Services page
router.get('/services', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('services', { title: 'Our Services', user: req.session.user });
});

// Contact page
router.get('/contact', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('contact', { title: 'Contact Us', user: req.session.user });
});

// Public home page (if needed for marketing/info purposes)
router.get('/home', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('home', { title: 'Dental Clinic - Home', user: req.session.user });
});

// Dashboard page (protected)
router.get('/dashboard', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  
  try {
    const stats = await getDashboardStats();
    res.render('dashboard', { 
      title: 'Dashboard', 
      user: req.session.user,
      stats: stats
    });
  } catch (error) {
    console.error('Error loading dashboard stats:', error);
    // Fallback to default stats if database query fails
    const defaultStats = {
      totalClients: 0,
      totalAppointments: 0,
      todayAppointments: 0,
      clientSatisfaction: 0,
      pendingReminders: 0
    };
    res.render('dashboard', { 
      title: 'Dashboard', 
      user: req.session.user,
      stats: defaultStats
    });
  }
});

// API endpoint for dashboard statistics
router.get('/api/dashboard-stats', async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Error loading dashboard stats:', error);
    res.status(500).json({ error: 'Failed to load dashboard statistics' });
  }
});

// Helper function for dashboard statistics
async function getDashboardStats() {
  const queries = [
    // Total clients
    `SELECT COUNT(*) as total_clients FROM clients`,
    
    // Total appointments
    `SELECT COUNT(*) as total_appointments FROM appointments`,
    
    // Today's appointments
    `SELECT COUNT(*) as today_appointments 
     FROM appointments 
     WHERE DATE(appointment_time) = CURRENT_DATE`,
    
    // Client satisfaction (based on completed vs cancelled ratio)
    `SELECT 
       COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed,
       COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) as cancelled,
       COUNT(*) as total
     FROM appointments 
     WHERE appointment_time >= CURRENT_DATE - INTERVAL '30 days'`,
    
    // Pending reminders (upcoming appointments in next 7 days that need reminders)
    `SELECT COUNT(*) as pending_reminders 
     FROM appointments 
     WHERE appointment_time BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
     AND status IN ('Scheduled', 'Confirmed')
     AND appointment_time > NOW()`
  ];

  const results = await Promise.all(queries.map(query => pool.query(query)));
  
  // Calculate client satisfaction as percentage of completed appointments
  const completedAppointments = parseInt(results[3].rows[0].completed || 0);
  const totalRecentAppointments = parseInt(results[3].rows[0].total || 0);
  const satisfactionRate = totalRecentAppointments > 0 
    ? Math.round((completedAppointments / totalRecentAppointments) * 100) 
    : 0;
  
  return {
    totalClients: parseInt(results[0].rows[0].total_clients),
    totalAppointments: parseInt(results[1].rows[0].total_appointments),
    todayAppointments: parseInt(results[2].rows[0].today_appointments),
    clientSatisfaction: satisfactionRate,
    pendingReminders: parseInt(results[4].rows[0].pending_reminders || 0)
  };
}

module.exports = router; 