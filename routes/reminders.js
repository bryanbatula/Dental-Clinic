const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');

// List all reminders
router.get('/', async (req, res) => {
  try {
    // Get upcoming appointments for reminders
    const upcomingAppointments = await Appointment.getUpcoming();
    res.render('reminders/manage', { 
      title: 'Manage Reminders', 
      appointments: upcomingAppointments,
      user: req.session.user 
    });
  } catch (error) {
    console.error('Error loading reminders:', error);
    res.render('reminders/manage', {
      title: 'Manage Reminders',
      appointments: [],
      error: 'Failed to load reminders',
      user: req.session.user
    });
  }
});

// API endpoint for reminders data
router.get('/api/reminders', async (req, res) => {
  try {
    const upcomingAppointments = await Appointment.getUpcoming();
    res.json(upcomingAppointments);
  } catch (error) {
    console.error('Error loading reminders API:', error);
    res.status(500).json({ error: 'Failed to load reminders' });
  }
});

// API endpoint for pending reminders count
router.get('/api/pending-count', async (req, res) => {
  try {
    const upcomingAppointments = await Appointment.getUpcoming();
    const pendingCount = upcomingAppointments.length;
    res.json({ pendingReminders: pendingCount });
  } catch (error) {
    console.error('Error loading pending reminders count:', error);
    res.status(500).json({ error: 'Failed to load pending reminders count' });
  }
});

// API endpoint for reminder settings
router.get('/api/settings', async (req, res) => {
  try {
    // Mock reminder settings - in a real app, this would come from database
    const settings = {
      emailEnabled: true,
      smsEnabled: false,
      defaultDaysBefore: 1,
      defaultHoursBefore: 24,
      autoSend: true,
      businessHours: {
        start: '09:00',
        end: '17:00'
      }
    };
    res.json(settings);
  } catch (error) {
    console.error('Error loading reminder settings:', error);
    res.status(500).json({ error: 'Failed to load settings' });
  }
});

// Update reminder settings
router.post('/api/settings', async (req, res) => {
  try {
    // In a real app, this would save to database
    const settings = req.body;
    console.log('Updated reminder settings:', settings);
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating reminder settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Send reminder for specific appointment
router.post('/send/:appointmentId', async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const { type, message } = req.body; // type: 'email' or 'sms'
    
    // In a real app, this would integrate with email/SMS services
    console.log(`Sending ${type} reminder for appointment ${appointmentId}:`, message);
    
    // Mock successful send
    res.json({ 
      success: true, 
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} reminder sent successfully` 
    });
  } catch (error) {
    console.error('Error sending reminder:', error);
    res.status(500).json({ error: 'Failed to send reminder' });
  }
});

// Schedule reminder for appointment
router.post('/schedule/:appointmentId', async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const { reminderTime, type, message } = req.body;
    
    // In a real app, this would schedule the reminder in a job queue
    console.log(`Scheduling ${type} reminder for appointment ${appointmentId} at ${reminderTime}:`, message);
    
    res.json({ 
      success: true, 
      message: 'Reminder scheduled successfully' 
    });
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    res.status(500).json({ error: 'Failed to schedule reminder' });
  }
});

// Get reminder history
router.get('/api/history', async (req, res) => {
  try {
    // Mock reminder history - in a real app, this would come from database
    const history = [
      {
        id: 1,
        appointmentId: 1,
        clientName: 'John Doe',
        type: 'email',
        sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        status: 'sent',
        message: 'Reminder: You have an appointment tomorrow at 2:00 PM'
      },
      {
        id: 2,
        appointmentId: 2,
        clientName: 'Jane Smith',
        type: 'sms',
        sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: 'sent',
        message: 'Hi Jane, your dental appointment is in 2 hours.'
      }
    ];
    res.json(history);
  } catch (error) {
    console.error('Error loading reminder history:', error);
    res.status(500).json({ error: 'Failed to load reminder history' });
  }
});

// Cancel scheduled reminder
router.delete('/cancel/:appointmentId', async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    
    // In a real app, this would cancel the scheduled reminder
    console.log(`Cancelling reminder for appointment ${appointmentId}`);
    
    res.json({ 
      success: true, 
      message: 'Reminder cancelled successfully' 
    });
  } catch (error) {
    console.error('Error cancelling reminder:', error);
    res.status(500).json({ error: 'Failed to cancel reminder' });
  }
});

module.exports = router; 