const express = require('express');
const router = express.Router();
const Treatment = require('../models/treatment');
const Client = require('../models/client');

// List all treatment records with pagination and search
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    const searchTerm = req.query.search || '';
    
    const result = await Treatment.getAllPaginatedWithSearch(page, limit, searchTerm);
    const summary = await Treatment.getOverallSummary();
    
    res.render('treatments/list', { 
      title: 'Treatment Records', 
      treatments: result.treatments,
      pagination: result.pagination,
      searchTerm: result.searchTerm,
      summary,
      error: null,
      user: req.session.user 
    });
  } catch (error) {
    console.error('Error loading treatment records:', error);
    res.render('treatments/list', { 
      title: 'Treatment Records', 
      treatments: [], 
      pagination: { currentPage: 1, totalPages: 0, totalItems: 0, hasNext: false, hasPrev: false },
      searchTerm: req.query.search || '',
      summary: { totalTreatments: 0, totalCharges: 0, totalPaid: 0, totalBalance: 0, totalClients: 0 },
      error: 'Failed to load treatment records', 
      user: req.session.user 
    });
  }
});

// Show add treatment form
router.get('/add', async (req, res) => {
  try {
    const clients = await Client.getAll();
    const clientId = req.query.client_id || null;
    res.render('treatments/add', { 
      title: 'Add Treatment Record', 
      clients,
      selectedClientId: clientId,
      error: null,
      formData: null,
      user: req.session.user 
    });
  } catch (error) {
    console.error('Error loading add treatment form:', error);
    res.redirect('/treatments');
  }
});

// Handle add treatment
router.post('/add', async (req, res) => {
  try {
    await Treatment.create(req.body);
    res.redirect('/treatments');
  } catch (error) {
    console.error('Error creating treatment record:', error);
    const clients = await Client.getAll();
    res.render('treatments/add', {
      title: 'Add Treatment Record',
      clients,
      selectedClientId: req.body.clientId,
      error: 'Failed to create treatment record. Please check your input and try again.',
      formData: req.body,
      user: req.session.user
    });
  }
});

// Show treatment details
router.get('/view/:id', async (req, res) => {
  try {
    const treatment = await Treatment.getById(req.params.id);
    if (!treatment) {
      return res.status(404).render('404', { title: 'Treatment Record Not Found', user: req.session.user });
    }
    res.render('treatments/view', { 
      title: 'Treatment Details', 
      treatment,
      error: null,
      user: req.session.user 
    });
  } catch (error) {
    console.error('Error loading treatment details:', error);
    res.redirect('/treatments');
  }
});

// Show edit treatment form
router.get('/edit/:id', async (req, res) => {
  try {
    const treatment = await Treatment.getById(req.params.id);
    const clients = await Client.getAll();
    if (!treatment) {
      return res.status(404).render('404', { title: 'Treatment Record Not Found', user: req.session.user });
    }
    res.render('treatments/edit', { 
      title: 'Edit Treatment Record', 
      treatment, 
      clients,
      error: null,
      user: req.session.user 
    });
  } catch (error) {
    console.error('Error loading treatment for edit:', error);
    res.redirect('/treatments');
  }
});

// Handle edit treatment
router.post('/edit/:id', async (req, res) => {
  try {
    await Treatment.update(req.params.id, req.body);
    res.redirect('/treatments');
  } catch (error) {
    console.error('Error updating treatment record:', error);
    const treatment = await Treatment.getById(req.params.id);
    const clients = await Client.getAll();
    res.render('treatments/edit', {
      title: 'Edit Treatment Record',
      treatment,
      clients,
      error: 'Failed to update treatment record. Please check your input and try again.',
      user: req.session.user
    });
  }
});

// Handle payment addition
router.post('/payment/:id', async (req, res) => {
  try {
    const { amount, notes } = req.body;
    
    // Validate payment amount
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      const errorMessage = 'Payment amount must be a valid number greater than 0';
      
      // Check if this is an AJAX request or form submission
      if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
        return res.status(400).json({
          success: false,
          message: errorMessage
        });
      } else {
        // Form submission - redirect back with error
        const treatment = await Treatment.getById(req.params.id);
        return res.render('treatments/view', {
          title: 'Treatment Details',
          treatment,
          error: errorMessage,
          user: req.session.user
        });
      }
    }
    
    // Validate treatment ID
    const treatmentId = parseInt(req.params.id);
    if (!treatmentId || isNaN(treatmentId)) {
      const errorMessage = 'Invalid treatment record ID';
      
      if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
        return res.status(400).json({
          success: false,
          message: errorMessage
        });
      } else {
        return res.redirect('/treatments');
      }
    }
    
    // Process the payment
    const updatedTreatment = await Treatment.addPayment(treatmentId, parseFloat(amount), notes || null);
    
    // Check if this is an AJAX request or form submission
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
      // AJAX request - return JSON
      res.json({
        success: true,
        message: 'Payment processed successfully',
        treatment: updatedTreatment
      });
    } else {
      // Form submission - redirect to treatment view
      res.redirect(`/treatments/view/${treatmentId}`);
    }
    
  } catch (error) {
    console.error('Error adding payment:', error);
    
    const errorMessage = error.message || 'Failed to process payment. Please try again.';
    
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
      res.status(500).json({
        success: false,
        message: errorMessage
      });
    } else {
      // Form submission - render view with error
      try {
        const treatment = await Treatment.getById(req.params.id);
        res.render('treatments/view', {
          title: 'Treatment Details',
          treatment,
          error: errorMessage,
          user: req.session.user
        });
      } catch (viewError) {
        res.redirect('/treatments');
      }
    }
  }
});

// Get treatments for a specific client (API endpoint)
router.get('/client/:clientId', async (req, res) => {
  try {
    const treatments = await Treatment.getByClientId(req.params.clientId);
    const summary = await Treatment.getClientSummary(req.params.clientId);
    res.json({ treatments, summary });
  } catch (error) {
    console.error('Error loading client treatments:', error);
    res.status(500).json({ error: 'Failed to load treatments' });
  }
});

// Handle delete treatment
router.post('/delete/:id', async (req, res) => {
  try {
    const treatmentId = parseInt(req.params.id);
    if (!treatmentId || isNaN(treatmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid treatment record ID'
      });
    }

    await Treatment.delete(treatmentId);
    
    res.json({
      success: true,
      message: 'Treatment record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting treatment record:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete treatment record. Please try again.'
    });
  }
});

module.exports = router; 