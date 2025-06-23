const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Show login page
router.get('/login', (req, res) => {
  // If already logged in, redirect to dashboard
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('auth/login', { title: 'Login', error: null });
});

// Handle login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findByUsername(username);
  if (!user) {
    return res.render('auth/login', { title: 'Login', error: 'Invalid username or password.' });
  }
  const match = await User.comparePassword(password, user.password_hash);
  if (!match) {
    return res.render('auth/login', { title: 'Login', error: 'Invalid username or password.' });
  }
  req.session.user = { id: user.id, username: user.username, role: user.role };
  res.redirect('/dashboard');
});

// Handle logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Development route to clear session and force fresh start
router.get('/clear-session', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Session cleared successfully. You can now test the login flow.' });
  });
});

module.exports = router; 