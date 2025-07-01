const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Main reports page
router.get('/', async (req, res) => {
  try {
    res.render('reports/analytics', { 
      title: 'Analytics & Reports', 
      user: req.session.user 
    });
  } catch (error) {
    console.error('Error loading reports:', error);
    res.render('reports/analytics', {
      title: 'Analytics & Reports',
      error: 'Failed to load reports',
      user: req.session.user
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

// API endpoint for appointment analytics
router.get('/api/appointments', async (req, res) => {
  try {
    const { period = '30', type = 'daily' } = req.query;
    const analytics = await getAppointmentAnalytics(period, type);
    res.json(analytics);
  } catch (error) {
    console.error('Error loading appointment analytics:', error);
    res.status(500).json({ error: 'Failed to load appointment analytics' });
  }
});

// API endpoint for revenue analytics
router.get('/api/revenue', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const revenue = await getRevenueAnalytics(period);
    res.json(revenue);
  } catch (error) {
    console.error('Error loading revenue analytics:', error);
    res.status(500).json({ error: 'Failed to load revenue analytics' });
  }
});

// API endpoint for service analytics
router.get('/api/services', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const services = await getServiceAnalytics(period);
    res.json(services);
  } catch (error) {
    console.error('Error loading service analytics:', error);
    res.status(500).json({ error: 'Failed to load service analytics' });
  }
});

// API endpoint for client analytics
router.get('/api/clients', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const clients = await getClientAnalytics(period);
    res.json(clients);
  } catch (error) {
    console.error('Error loading client analytics:', error);
    res.status(500).json({ error: 'Failed to load client analytics' });
  }
});

// API endpoint for performance metrics
router.get('/api/performance', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const performance = await getPerformanceMetrics(period);
    res.json(performance);
  } catch (error) {
    console.error('Error loading performance metrics:', error);
    res.status(500).json({ error: 'Failed to load performance metrics' });
  }
});

// Generate custom report
router.post('/api/generate-report', async (req, res) => {
  try {
    const { reportType, dateRange, filters } = req.body;
    const report = await generateCustomReport(reportType, dateRange, filters);
    res.json(report);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Helper functions for data analytics
async function getDashboardStats() {
  const queries = [
    // Total clients
    `SELECT COUNT(*) as total_clients FROM clients`,
    
    // Total appointments
    `SELECT COUNT(*) as total_appointments FROM appointments`,
    
    // This month's appointments
    `SELECT COUNT(*) as month_appointments 
     FROM appointments 
     WHERE DATE_TRUNC('month', appointment_time) = DATE_TRUNC('month', CURRENT_DATE)`,
    
    // Completed appointments this month
    `SELECT COUNT(*) as completed_appointments 
     FROM appointments 
     WHERE status = 'Completed' 
     AND DATE_TRUNC('month', appointment_time) = DATE_TRUNC('month', CURRENT_DATE)`,
    
    // Revenue this month (mock calculation based on service prices)
    `SELECT COALESCE(SUM(s.price), 0) as month_revenue
     FROM appointments a
     JOIN services s ON a.service = s.id
     WHERE a.status = 'Completed'
     AND DATE_TRUNC('month', a.appointment_time) = DATE_TRUNC('month', CURRENT_DATE)`,
     
    // Average appointments per day this month
    `SELECT COALESCE(COUNT(*) / EXTRACT(day FROM CURRENT_DATE), 0) as avg_daily_appointments
     FROM appointments 
     WHERE DATE_TRUNC('month', appointment_time) = DATE_TRUNC('month', CURRENT_DATE)`
  ];

  const results = await Promise.all(queries.map(query => pool.query(query)));
  
  return {
    totalClients: parseInt(results[0].rows[0].total_clients),
    totalAppointments: parseInt(results[1].rows[0].total_appointments),
    monthAppointments: parseInt(results[2].rows[0].month_appointments),
    completedAppointments: parseInt(results[3].rows[0].completed_appointments),
    monthRevenue: parseFloat(results[4].rows[0].month_revenue || 0),
    avgDailyAppointments: parseFloat(results[5].rows[0].avg_daily_appointments || 0)
  };
}

async function getAppointmentAnalytics(period, type) {
  let dateFormat, intervalType;
  
  switch (type) {
    case 'daily':
      dateFormat = 'YYYY-MM-DD';
      intervalType = 'day';
      break;
    case 'weekly':
      dateFormat = 'YYYY-"W"WW';
      intervalType = 'week';
      break;
    case 'monthly':
      dateFormat = 'YYYY-MM';
      intervalType = 'month';
      break;
    default:
      dateFormat = 'YYYY-MM-DD';
      intervalType = 'day';
  }

  const query = `
    SELECT 
      TO_CHAR(appointment_time, '${dateFormat}') as period,
      COUNT(*) as total,
      COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed,
      COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) as cancelled,
      COUNT(CASE WHEN status = 'Scheduled' THEN 1 END) as scheduled
    FROM appointments 
    WHERE appointment_time >= CURRENT_DATE - INTERVAL '${period} days'
    GROUP BY TO_CHAR(appointment_time, '${dateFormat}')
    ORDER BY period
  `;

  const result = await pool.query(query);
  return result.rows.map(row => ({
    period: row.period,
    total: parseInt(row.total),
    completed: parseInt(row.completed),
    cancelled: parseInt(row.cancelled),
    scheduled: parseInt(row.scheduled)
  }));
}

async function getRevenueAnalytics(period) {
  const query = `
    SELECT 
      TO_CHAR(a.appointment_time, 'YYYY-MM-DD') as date,
      COALESCE(SUM(s.price), 0) as revenue,
      COUNT(*) as appointments
    FROM appointments a
    JOIN services s ON a.service = s.id
    WHERE a.status = 'Completed'
    AND a.appointment_time >= CURRENT_DATE - INTERVAL '${period} days'
    GROUP BY TO_CHAR(a.appointment_time, 'YYYY-MM-DD')
    ORDER BY date
  `;

  const result = await pool.query(query);
  return result.rows.map(row => ({
    date: row.date,
    revenue: parseFloat(row.revenue),
    appointments: parseInt(row.appointments)
  }));
}

async function getServiceAnalytics(period) {
  const query = `
    SELECT 
      s.name,
      s.category,
      COUNT(*) as bookings,
      COALESCE(SUM(s.price), 0) as revenue,
      AVG(s.price) as avg_price
    FROM appointments a
    JOIN services s ON a.service = s.id
    WHERE a.appointment_time >= CURRENT_DATE - INTERVAL '${period} days'
    GROUP BY s.id, s.name, s.category
    ORDER BY bookings DESC
  `;

  const result = await pool.query(query);
  return result.rows.map(row => ({
    name: row.name,
    category: row.category,
    bookings: parseInt(row.bookings),
    revenue: parseFloat(row.revenue),
    avgPrice: parseFloat(row.avg_price)
  }));
}

async function getClientAnalytics(period) {
  const queries = [
    // New clients - now using the created_at column
    `SELECT COUNT(*) as new_clients 
     FROM clients 
     WHERE created_at >= CURRENT_DATE - INTERVAL '${period} days'`,
    
    // Client retention (clients with multiple appointments)
    `SELECT COUNT(DISTINCT client_id) as returning_clients
     FROM appointments a1
     WHERE EXISTS (
       SELECT 1 FROM appointments a2 
       WHERE a2.client_id = a1.client_id 
       AND a2.id != a1.id
       AND a2.appointment_time >= CURRENT_DATE - INTERVAL '${period} days'
     )
     AND a1.appointment_time >= CURRENT_DATE - INTERVAL '${period} days'`,
    
    // Top clients by appointments
    `SELECT c.name, COUNT(*) as appointment_count
     FROM appointments a
     JOIN clients c ON a.client_id = c.id
     WHERE a.appointment_time >= CURRENT_DATE - INTERVAL '${period} days'
     GROUP BY c.id, c.name
     ORDER BY appointment_count DESC
     LIMIT 10`
  ];

  const results = await Promise.all(queries.map(query => pool.query(query)));
  
  return {
    newClients: parseInt(results[0].rows[0].new_clients),
    returningClients: parseInt(results[1].rows[0].returning_clients),
    topClients: results[2].rows.map(row => ({
      name: row.name,
      appointmentCount: parseInt(row.appointment_count)
    }))
  };
}

async function getPerformanceMetrics(period) {
  const queries = [
    // Appointment completion rate
    `SELECT 
       COUNT(*) as total,
       COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed
     FROM appointments 
     WHERE appointment_time >= CURRENT_DATE - INTERVAL '${period} days'`,
    
    // Cancellation rate
    `SELECT 
       COUNT(*) as total,
       COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) as cancelled
     FROM appointments 
     WHERE appointment_time >= CURRENT_DATE - INTERVAL '${period} days'`,
    
    // Average appointments per day
    `SELECT COUNT(*) / ${period}::float as avg_daily_appointments
     FROM appointments 
     WHERE appointment_time >= CURRENT_DATE - INTERVAL '${period} days'`,
    
    // Peak hours analysis
    `SELECT 
       EXTRACT(hour FROM appointment_time) as hour,
       COUNT(*) as appointments
     FROM appointments 
     WHERE appointment_time >= CURRENT_DATE - INTERVAL '${period} days'
     GROUP BY EXTRACT(hour FROM appointment_time)
     ORDER BY appointments DESC
     LIMIT 3`
  ];

  const results = await Promise.all(queries.map(query => pool.query(query)));
  
  const total = parseInt(results[0].rows[0].total);
  const completed = parseInt(results[0].rows[0].completed);
  const cancelled = parseInt(results[1].rows[0].cancelled);
  
  return {
    completionRate: total > 0 ? (completed / total * 100).toFixed(1) : 0,
    cancellationRate: total > 0 ? (cancelled / total * 100).toFixed(1) : 0,
    avgDailyAppointments: parseFloat(results[2].rows[0].avg_daily_appointments || 0).toFixed(1),
    peakHours: results[3].rows.map(row => ({
      hour: parseInt(row.hour),
      appointments: parseInt(row.appointments)
    }))
  };
}

async function generateCustomReport(reportType, dateRange, filters) {
  // Implementation for custom report generation
  // This would be expanded based on specific requirements
  return {
    type: reportType,
    dateRange: dateRange,
    data: [],
    generated: new Date().toISOString()
  };
}

module.exports = router; 