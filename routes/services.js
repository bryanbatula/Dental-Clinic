const express = require('express');
const router = express.Router();
const Service = require('../models/service');

// List all services
router.get('/manage', async (req, res) => {
  try {
    const services = await Service.getAll();
    res.render('services/manage', { 
      title: 'Manage Services', 
      services, 
      user: req.session.user 
    });
  } catch (error) {
    console.error('Error loading services:', error);
    res.render('services/manage', {
      title: 'Manage Services',
      services: [],
      error: 'Failed to load services',
      user: req.session.user
    });
  }
});

// API endpoint for services data
router.get('/api/services', async (req, res) => {
  try {
    const services = await Service.getAll();
    res.json(services);
  } catch (error) {
    console.error('Error loading services API:', error);
    res.status(500).json({ error: 'Failed to load services' });
  }
});



// Show add service form
router.get('/add', async (req, res) => {
  res.render('services/add', { 
    title: 'Add Service', 
    user: req.session.user 
  });
});

// Handle add service
router.post('/add', async (req, res) => {
  try {
    const serviceData = {
      name: req.body.name,
      description: req.body.description,
      duration: parseInt(req.body.duration),
      price: parseFloat(req.body.price),
      category: req.body.category
    };
    
    await Service.create(serviceData);
    res.redirect('/services/manage');
  } catch (error) {
    console.error('Error creating service:', error);
    res.render('services/add', {
      title: 'Add Service',
      error: error.message || 'Failed to create service. Please check all fields.',
      user: req.session.user,
      formData: req.body
    });
  }
});

// Show edit service form
router.get('/edit/:id', async (req, res) => {
  try {
    const service = await Service.getById(req.params.id);
    if (!service) {
      return res.redirect('/services/manage');
    }
    res.render('services/edit', { 
      title: 'Edit Service', 
      service, 
      user: req.session.user 
    });
  } catch (error) {
    console.error('Error loading edit form:', error);
    res.redirect('/services/manage');
  }
});

// Handle edit service
router.post('/edit/:id', async (req, res) => {
  try {
    const serviceData = {
      name: req.body.name,
      description: req.body.description,
      duration: parseInt(req.body.duration),
      price: parseFloat(req.body.price),
      category: req.body.category
    };
    
    await Service.update(req.params.id, serviceData);
    res.redirect('/services/manage');
  } catch (error) {
    console.error('Error updating service:', error);
    const service = await Service.getById(req.params.id);
    res.render('services/edit', {
      title: 'Edit Service',
      service,
      error: error.message || 'Failed to update service. Please check all fields.',
      user: req.session.user,
      formData: req.body
    });
  }
});

// Handle delete service
router.post('/delete/:id', async (req, res) => {
  try {
    await Service.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// Get service details (API)
router.get('/api/services/:id', async (req, res) => {
  try {
    const service = await Service.getById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error getting service:', error);
    res.status(500).json({ error: 'Failed to get service details' });
  }
});

// Delete service (API)
router.delete('/api/services/:id', async (req, res) => {
  try {
    await Service.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

module.exports = router; 