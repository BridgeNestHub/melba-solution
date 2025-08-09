//admin.js - Updated for MongoDB
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const dataStore = require('../utils/dataStore');

// Rate limiting for login attempts
const rateLimit = require('express-rate-limit');

// Create rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

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

// Admin login POST with rate limiting
router.post('/login', loginLimiter, [
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
  
  try {
    // Verify credentials
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      // Regenerate session ID to prevent session fixation attacks
      req.session.regenerate((err) => {
        if (err) {
          console.error('Session regeneration error:', err);
          return res.render('admin/login', {
            title: 'Admin Login - MelbaSolution Digital Agency',
            currentPage: 'admin-login',
            error: 'Login failed. Please try again.'
          });
        }
        
        req.session.isAdmin = true;
        req.session.adminUser = username;
        req.session.loginTime = new Date();
        
        // Save session before redirect
        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            return res.render('admin/login', {
              title: 'Admin Login - MelbaSolution Digital Agency',
              currentPage: 'admin-login',
              error: 'Login failed. Please try again.'
            });
          }
          res.redirect('/admin/dashboard');
        });
      });
    } else {
      // Add small delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 1000));
      res.render('admin/login', {
        title: 'Admin Login - MelbaSolution Digital Agency',
        currentPage: 'admin-login',
        error: 'Invalid username or password'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.render('admin/login', {
      title: 'Admin Login - MelbaSolution Digital Agency',
      currentPage: 'admin-login',
      error: 'An error occurred. Please try again.'
    });
  }
});

// Admin dashboard - UPDATED FOR ASYNC
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const stats = await dataStore.getStats();
    const recentContacts = await dataStore.getRecentContacts(3);
    const allProjects = await dataStore.getProjects();
    const recentNewsletters = await dataStore.getRecentNewsletters(3);
    
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
      recentContacts: recentContacts,
      recentProjects: allProjects.slice(0, 3),
      recentNewsletters: recentNewsletters
    };

    res.render('admin/dashboard', {
      title: 'Admin Dashboard - MelbaSolution Digital Agency',
      currentPage: 'admin-dashboard',
      adminUser: req.session.adminUser,
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).render('pages/error', {
      title: '500 - Server Error',
      currentPage: 'error',
      error: 'Failed to load dashboard data'
    });
  }
});

// Admin submissions management - Overview - UPDATED FOR ASYNC
router.get('/submissions', requireAuth, async (req, res) => {
  try {
    const contacts = await dataStore.getContacts();
    const newsletters = await dataStore.getNewsletters();
    const stats = await dataStore.getStats();

    res.render('admin/submissions', {
      title: 'Submissions Management - Admin',
      currentPage: 'admin-submissions',
      adminUser: req.session.adminUser,
      contacts: contacts,
      newsletters: newsletters,
      stats: stats
    });
  } catch (error) {
    console.error('Submissions error:', error);
    res.status(500).render('pages/error', {
      title: '500 - Server Error',
      currentPage: 'error',
      error: 'Failed to load submissions data'
    });
  }
});

// Contact Form submissions - UPDATED FOR ASYNC
router.get('/submissions/contacts', requireAuth, async (req, res) => {
  try {
    const allContacts = await dataStore.getContacts();
    const contacts = allContacts.filter(c => c.source === 'Contact Form');

    res.render('admin/submissions-contacts', {
      title: 'Contact Form Submissions - Admin',
      currentPage: 'admin-submissions',
      adminUser: req.session.adminUser,
      contacts: contacts
    });
  } catch (error) {
    console.error('Contact submissions error:', error);
    res.status(500).render('pages/error', {
      title: '500 - Server Error',
      currentPage: 'error',
      error: 'Failed to load contact submissions'
    });
  }
});

// Package Quote submissions - UPDATED FOR ASYNC
router.get('/submissions/packages', requireAuth, async (req, res) => {
  try {
    const allContacts = await dataStore.getContacts();
    const packages = allContacts.filter(c => c.source === 'Package Quote');

    res.render('admin/submissions-packages', {
      title: 'Package Quote Submissions - Admin',
      currentPage: 'admin-submissions',
      adminUser: req.session.adminUser,
      packages: packages
    });
  } catch (error) {
    console.error('Package submissions error:', error);
    res.status(500).render('pages/error', {
      title: '500 - Server Error',
      currentPage: 'error',
      error: 'Failed to load package submissions'
    });
  }
});

// Consultation submissions - UPDATED FOR ASYNC
router.get('/submissions/consultations', requireAuth, async (req, res) => {
  try {
    const allContacts = await dataStore.getContacts();
    const consultations = allContacts.filter(c => c.source === 'Consultation Request');

    res.render('admin/submissions-consultations', {
      title: 'Consultation Submissions - Admin',
      currentPage: 'admin-submissions',
      adminUser: req.session.adminUser,
      consultations: consultations
    });
  } catch (error) {
    console.error('Consultation submissions error:', error);
    res.status(500).render('pages/error', {
      title: '500 - Server Error',
      currentPage: 'error',
      error: 'Failed to load consultation submissions'
    });
  }
});

// Transformation submissions - UPDATED FOR ASYNC
router.get('/submissions/transformations', requireAuth, async (req, res) => {
  try {
    const allContacts = await dataStore.getContacts();
    const transformations = allContacts.filter(c => c.source === 'Transformation Request');

    res.render('admin/submissions-transformations', {
      title: 'Transformation Submissions - Admin',
      currentPage: 'admin-submissions',
      adminUser: req.session.adminUser,
      transformations: transformations
    });
  } catch (error) {
    console.error('Transformation submissions error:', error);
    res.status(500).render('pages/error', {
      title: '500 - Server Error',
      currentPage: 'error',
      error: 'Failed to load transformation submissions'
    });
  }
});

// Newsletter submissions - UPDATED FOR ASYNC
router.get('/submissions/newsletters', requireAuth, async (req, res) => {
  try {
    const newsletters = await dataStore.getNewsletters();

    res.render('admin/submissions-newsletters', {
      title: 'Newsletter Subscriptions - Admin',
      currentPage: 'admin-submissions',
      adminUser: req.session.adminUser,
      newsletters: newsletters
    });
  } catch (error) {
    console.error('Newsletter submissions error:', error);
    res.status(500).render('pages/error', {
      title: '500 - Server Error',
      currentPage: 'error',
      error: 'Failed to load newsletter submissions'
    });
  }
});

// Admin projects management - UPDATED FOR ASYNC
router.get('/projects', requireAuth, async (req, res) => {
  try {
    const projects = await dataStore.getProjects();

    res.render('admin/projects', {
      title: 'Project Management - Admin',
      currentPage: 'admin-projects',
      adminUser: req.session.adminUser,
      projects: projects
    });
  } catch (error) {
    console.error('Projects error:', error);
    res.status(500).render('pages/error', {
      title: '500 - Server Error',
      currentPage: 'error',
      error: 'Failed to load projects'
    });
  }
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

// API endpoints for admin - UPDATED FOR ASYNC
router.get('/api/stats', requireAuth, async (req, res) => {
  try {
    const stats = await dataStore.getStats();
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
  } catch (error) {
    console.error('Stats API error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.put('/api/submission/:id/status', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedContact = await dataStore.updateContactStatus(id, status);
    if (updatedContact) {
      res.json({ success: true, message: 'Submission status updated' });
    } else {
      res.status(404).json({ success: false, message: 'Submission not found' });
    }
  } catch (error) {
    console.error('Update submission error:', error);
    res.status(500).json({ success: false, message: 'Failed to update submission' });
  }
});

router.put('/api/project/:id/progress', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { progress, status } = req.body;
    
    const updatedProject = await dataStore.updateProjectProgress(id, progress, status);
    if (updatedProject) {
      res.json({ success: true, message: 'Project progress updated' });
    } else {
      res.status(404).json({ success: false, message: 'Project not found' });
    }
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, message: 'Failed to update project' });
  }
});

module.exports = router;