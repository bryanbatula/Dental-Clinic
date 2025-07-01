const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');
const Client = require('../models/client');
const Service = require('../models/service');

// List all appointments with pagination and search
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Items per page
    const searchTerm = req.query.search || '';
    
    const result = await Appointment.getAllPaginatedWithSearch(page, limit, searchTerm);
    
    res.render('appointments/list', { 
      title: 'Appointments', 
      appointments: result.appointments,
      pagination: result.pagination,
      searchTerm: result.searchTerm,
      user: req.session.user 
    });
  } catch (error) {
    console.error('Error loading appointments:', error);
    res.render('appointments/list', { 
      title: 'Appointments', 
      appointments: [], 
      pagination: { currentPage: 1, totalPages: 0, totalItems: 0, hasNext: false, hasPrev: false },
      searchTerm: req.query.search || '',
      error: 'Failed to load appointments', 
      user: req.session.user 
    });
  }
});

// Calendar view
router.get('/calendar', async (req, res) => {
  try {
    const appointments = await Appointment.getAll();
    res.render('appointments/calendar', { 
      title: 'Calendar View', 
      appointments, 
      user: req.session.user 
    });
  } catch (error) {
    console.error('Error loading calendar:', error);
    res.render('appointments/calendar', {
      title: 'Calendar View',
      appointments: [],
      error: 'Failed to load calendar data',
      user: req.session.user
    });
  }
});

// API endpoint for calendar data
router.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.getAll();
    res.json(appointments);
  } catch (error) {
    console.error('Error loading appointments API:', error);
    res.status(500).json({ error: 'Failed to load appointments' });
  }
});

// Show add appointment form
router.get('/add', async (req, res) => {
  try {
    const clients = await Client.getAll();
    const services = await Service.getAll();
    console.log('Services loaded:', services);
    res.render('appointments/add', { 
      title: 'Add Appointment', 
      clients, 
      services,
      user: req.session.user 
    });
  } catch (error) {
    console.error('Error loading form data:', error);
    res.render('appointments/add', {
      title: 'Add Appointment',
      clients: [],
      services: [],
      error: 'Failed to load form data',
      user: req.session.user
    });
  }
});

// Handle add appointment
router.post('/add', async (req, res) => {
  try {
    console.log('Form data received:', req.body);
    console.log('Service ID from form:', req.body.service_id);
    console.log('Service ID type:', typeof req.body.service_id);
    
    // Check if service_id exists and is not empty
    if (!req.body.service_id || req.body.service_id === '') {
      throw new Error('Service must be selected');
    }
    
    const serviceId = parseInt(req.body.service_id);
    console.log('Parsed service ID:', serviceId);
    
    if (isNaN(serviceId)) {
      throw new Error('Invalid service selected');
    }
    
    const appointmentData = {
      client_id: parseInt(req.body.client_id),
      service: serviceId,
      appointment_time: req.body.appointment_time,
      notes: req.body.notes || '',
      status: req.body.status || 'Scheduled'
    };
    
    console.log('Final appointment data:', appointmentData);
    
    await Appointment.create(appointmentData);
    res.redirect('/appointments');
  } catch (error) {
    console.error('Error creating appointment:', error);
    const clients = await Client.getAll();
    const services = await Service.getAll();
    res.render('appointments/add', {
      title: 'Add Appointment',
      clients,
      services,
      error: error.message || 'Failed to create appointment. Please ensure all required fields are filled.',
      user: req.session.user,
      formData: req.body
    });
  }
});

// Show edit appointment form
router.get('/edit/:id', async (req, res) => {
  try {
    const appointment = await Appointment.getById(req.params.id);
    const clients = await Client.getAll();
    const services = await Service.getAll();
    res.render('appointments/edit', { 
      title: 'Edit Appointment', 
      appointment, 
      clients, 
      services,
      user: req.session.user 
    });
  } catch (error) {
    console.error('Error loading edit form:', error);
    res.redirect('/appointments');
  }
});

// Handle edit appointment
router.post('/edit/:id', async (req, res) => {
  try {
    console.log('Edit form data received:', req.body);
    
    if (!req.body.service_id || req.body.service_id === '') {
      throw new Error('Service must be selected');
    }
    
    const serviceId = parseInt(req.body.service_id);
    
    if (isNaN(serviceId)) {
      throw new Error('Invalid service selected');
    }
    
    const appointmentData = {
      client_id: parseInt(req.body.client_id),
      service: serviceId,
      appointment_time: req.body.appointment_time,
      notes: req.body.notes || '',
      status: req.body.status || 'Scheduled'
    };
    
    console.log('Final edit data:', appointmentData);
    
    await Appointment.update(req.params.id, appointmentData);
    res.redirect('/appointments');
  } catch (error) {
    console.error('Error updating appointment:', error);
    const appointment = await Appointment.getById(req.params.id);
    const clients = await Client.getAll();
    const services = await Service.getAll();
    res.render('appointments/edit', {
      title: 'Edit Appointment',
      appointment,
      clients,
      services,
      error: error.message || 'Failed to update appointment. Please ensure all required fields are filled.',
      user: req.session.user,
      formData: req.body
    });
  }
});

// Handle delete appointment
router.post('/delete/:id', async (req, res) => {
  try {
    await Appointment.delete(req.params.id);
    res.redirect('/appointments');
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.redirect('/appointments');
  }
});

module.exports = router; 