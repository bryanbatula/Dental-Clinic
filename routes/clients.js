const express = require('express');
const router = express.Router();
const Client = require('../models/client');

// List all clients with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Items per page
    
    const result = await Client.getAllPaginated(page, limit);
    
    res.render('clients/list', { 
      title: 'Clients', 
      clients: result.clients,
      pagination: result.pagination,
      user: req.session.user 
    });
  } catch (error) {
    console.error('Error loading clients:', error);
    res.render('clients/list', { 
      title: 'Clients', 
      clients: [], 
      pagination: { currentPage: 1, totalPages: 0, totalItems: 0, hasNext: false, hasPrev: false },
      error: 'Failed to load clients', 
      user: req.session.user 
    });
  }
});

// Show add client form
router.get('/add', (req, res) => {
  res.render('clients/add', { title: 'Add Client', user: req.session.user });
});

// Handle add client
router.post('/add', async (req, res) => {
  try {
    await Client.create(req.body);
    res.redirect('/clients');
  } catch (error) {
    console.error('Error creating client:', error);
    res.render('clients/add', {
      title: 'Add Client',
      error: 'Failed to create client. Please check your input and try again.',
      formData: req.body,
      user: req.session.user
    });
  }
});

// Show client details with appointment history
router.get('/view/:id', async (req, res) => {
  try {
    const { client, appointments } = await Client.getWithAppointments(req.params.id);
    if (!client) {
      return res.status(404).render('404', { title: 'Client Not Found', user: req.session.user });
    }
    res.render('clients/view', { 
      title: 'Client Details', 
      client, 
      appointments,
      user: req.session.user 
    });
  } catch (error) {
    console.error('Error loading client details:', error);
    res.redirect('/clients');
  }
});

// Show edit client form
router.get('/edit/:id', async (req, res) => {
  try {
    const client = await Client.getById(req.params.id);
    if (!client) {
      return res.status(404).render('404', { title: 'Client Not Found', user: req.session.user });
    }
    res.render('clients/edit', { title: 'Edit Client', client, user: req.session.user });
  } catch (error) {
    console.error('Error loading client for edit:', error);
    res.redirect('/clients');
  }
});

// Handle edit client
router.post('/edit/:id', async (req, res) => {
  try {
    await Client.update(req.params.id, req.body);
    res.redirect('/clients');
  } catch (error) {
    console.error('Error updating client:', error);
    const client = await Client.getById(req.params.id);
    res.render('clients/edit', {
      title: 'Edit Client',
      client,
      error: 'Failed to update client. Please check your input and try again.',
      user: req.session.user
    });
  }
});

// Handle delete client
router.post('/delete/:id', async (req, res) => {
  try {
    await Client.delete(req.params.id);
    res.redirect('/clients');
  } catch (error) {
    console.error('Error deleting client:', error);
    res.redirect('/clients');
  }
});

module.exports = router; 