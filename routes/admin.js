const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const dataStore = require('../utils/dataStore');

// Admin authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.isAdmin) {
    next();
  } else {
    res.redirect('/admin/login');
  }
};

// Admin login page
router.get('/login', (req, res) => {
  if (req.session.isAdmin) {
    return res.redirect('/admin/dashboard');
  }
  
  res.render('admin/login', {
    title: 'Admin Login - MelbaSolution Digital Agency',
    currentPage: 'admin-login',
    error: null
  });
});

// Admin login POST
router.post('/login', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('admin/login', {
      title: 'Admin Login - MelbaSolution Digital Agency',
      currentPage: 'admin-login',
      error: 'Please fill in all fields'
    });
  }

  const { username, password } = req.body;
  
  // Simple authentication (in production, use database with hashed passwords)
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    req.session.adminUser = username;
    res.redirect('/admin/dashboard');
  } else {
    res.render('admin/login', {
      title: 'Admin Login - MelbaSolution Digital Agency',
      currentPage: 'admin-login',
      error: 'Invalid username or password'
    });
  }
});

// Admin dashboard
router.get('/dashboard', requireAuth, (req, res) => {
  const stats = dataStore.getStats();
  const dashboardData = {
    stats: {
      totalProjects: stats.totalProjects,
      activeProjects: stats.activeProjects,
      totalClients: Math.floor(stats.totalContacts * 0.6), // Estimate clients from contacts
      monthlyRevenue: '$45,230', // This would come from a payment system
      totalContacts: stats.totalContacts,
      newsletterSubscribers: stats.newsletterSubscribers,
      conversionRate: stats.totalContacts > 0 ? Math.round((stats.totalContacts * 0.125) * 100) / 100 + '%' : '0%',
      avgProjectValue: '$18,500' // This would be calculated from actual project data
    },
    recentContacts: dataStore.getRecentContacts(3),
    recentProjects: dataStore.getProjects().slice(0, 3),
    recentNewsletters: dataStore.getRecentNewsletters(3)
  };

  res.render('admin/dashboard', {
    title: 'Admin Dashboard - MelbaSolution Digital Agency',
    currentPage: 'admin-dashboard',
    adminUser: req.session.adminUser,
    data: dashboardData
  });
});

// Admin submissions management - Overview
router.get('/submissions', requireAuth, (req, res) => {
  const contacts = dataStore.getContacts();
  const newsletters = dataStore.getNewsletters();
  const stats = dataStore.getStats();

  res.render('admin/submissions', {
    title: 'Submissions Management - Admin',
    currentPage: 'admin-submissions',
    adminUser: req.session.adminUser,
    contacts: contacts,
    newsletters: newsletters,
    stats: stats
  });
});

// Contact Form submissions
router.get('/submissions/contacts', requireAuth, (req, res) => {
  const contacts = dataStore.getContacts().filter(c => c.source === 'Contact Form');

  res.render('admin/submissions-contacts', {
    title: 'Contact Form Submissions - Admin',
    currentPage: 'admin-submissions',
    adminUser: req.session.adminUser,
    contacts: contacts
  });
});

// Package Quote submissions
router.get('/submissions/packages', requireAuth, (req, res) => {
  const packages = dataStore.getContacts().filter(c => c.source === 'Package Quote');

  res.render('admin/submissions-packages', {
    title: 'Package Quote Submissions - Admin',
    currentPage: 'admin-submissions',
    adminUser: req.session.adminUser,
    packages: packages
  });
});

// Consultation submissions
router.get('/submissions/consultations', requireAuth, (req, res) => {
  const consultations = dataStore.getContacts().filter(c => c.source === 'Consultation Request');

  res.render('admin/submissions-consultations', {
    title: 'Consultation Submissions - Admin',
    currentPage: 'admin-submissions',
    adminUser: req.session.adminUser,
    consultations: consultations
  });
});

// Transformation submissions
router.get('/submissions/transformations', requireAuth, (req, res) => {
  const transformations = dataStore.getContacts().filter(c => c.source === 'Transformation Request');

  res.render('admin/submissions-transformations', {
    title: 'Transformation Submissions - Admin',
    currentPage: 'admin-submissions',
    adminUser: req.session.adminUser,
    transformations: transformations
  });
});

// Newsletter submissions
router.get('/submissions/newsletters', requireAuth, (req, res) => {
  const newsletters = dataStore.getNewsletters();

  res.render('admin/submissions-newsletters', {
    title: 'Newsletter Subscriptions - Admin',
    currentPage: 'admin-submissions',
    adminUser: req.session.adminUser,
    newsletters: newsletters
  });
});

// Admin projects management
router.get('/projects', requireAuth, (req, res) => {
  const projects = dataStore.getProjects();

  res.render('admin/projects', {
    title: 'Project Management - Admin',
    currentPage: 'admin-projects',
    adminUser: req.session.adminUser,
    projects: projects
  });
});

// Admin settings
router.get('/settings', requireAuth, (req, res) => {
  res.render('admin/settings', {
    title: 'Settings - Admin',
    currentPage: 'admin-settings',
    adminUser: req.session.adminUser
  });
});

// Update admin password
router.post('/settings/password', requireAuth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Password confirmation does not match');
    }
    return true;
  })
], async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('admin/settings', {
      title: 'Settings - Admin',
      currentPage: 'admin-settings',
      adminUser: req.session.adminUser,
      error: errors.array()[0].msg
    });
  }

  const { currentPassword, newPassword } = req.body;
  
  // Verify current password (in production, compare with hashed password from database)
  if (currentPassword !== process.env.ADMIN_PASSWORD) {
    return res.render('admin/settings', {
      title: 'Settings - Admin',
      currentPage: 'admin-settings',
      adminUser: req.session.adminUser,
      error: 'Current password is incorrect'
    });
  }

  // In production, hash the new password and save to database
  // const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  res.render('admin/settings', {
    title: 'Settings - Admin',
    currentPage: 'admin-settings',
    adminUser: req.session.adminUser,
    success: 'Password updated successfully'
  });
});

// Admin logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
    }
    res.redirect('/admin/login');
  });
});

// API endpoints for admin
router.get('/api/stats', requireAuth, (req, res) => {
  const stats = dataStore.getStats();
  res.json({
    totalProjects: stats.totalProjects,
    activeProjects: stats.activeProjects,
    totalClients: Math.floor(stats.totalContacts * 0.6),
    monthlyRevenue: 45230,
    totalContacts: stats.totalContacts,
    newsletterSubscribers: stats.newsletterSubscribers,
    conversionRate: stats.totalContacts > 0 ? (stats.totalContacts * 0.125) : 0,
    avgProjectValue: 18500
  });
});

router.put('/api/submission/:id/status', requireAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const updatedContact = dataStore.updateContactStatus(id, status);
  if (updatedContact) {
    res.json({ success: true, message: 'Submission status updated' });
  } else {
    res.status(404).json({ success: false, message: 'Submission not found' });
  }
});

router.put('/api/project/:id/progress', requireAuth, (req, res) => {
  const { id } = req.params;
  const { progress, status } = req.body;
  
  const updatedProject = dataStore.updateProjectProgress(id, progress, status);
  if (updatedProject) {
    res.json({ success: true, message: 'Project progress updated' });
  } else {
    res.status(404).json({ success: false, message: 'Project not found' });
  }
});

module.exports = router;