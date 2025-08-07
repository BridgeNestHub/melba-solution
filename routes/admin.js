const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

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
    title: 'Admin Login - Robe Digital Agency',
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
      title: 'Admin Login - Robe Digital Agency',
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
      title: 'Admin Login - Robe Digital Agency',
      currentPage: 'admin-login',
      error: 'Invalid username or password'
    });
  }
});

// Admin dashboard
router.get('/dashboard', requireAuth, (req, res) => {
  // In a real application, you would fetch this data from a database
  const dashboardData = {
    stats: {
      totalProjects: 156,
      activeProjects: 23,
      totalClients: 89,
      monthlyRevenue: '$45,230'
    },
    recentContacts: [
      {
        id: 1,
        name: 'John Smith',
        email: 'john@example.com',
        service: 'Web Development',
        date: '2025-01-15',
        status: 'new'
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah@company.com',
        service: 'Branding',
        date: '2025-01-14',
        status: 'contacted'
      },
      {
        id: 3,
        name: 'Mike Wilson',
        email: 'mike@business.com',
        service: 'Digital Marketing',
        date: '2025-01-13',
        status: 'proposal-sent'
      }
    ],
    recentProjects: [
      {
        id: 1,
        name: 'TechCorp Website Redesign',
        client: 'TechCorp Inc.',
        status: 'in-progress',
        progress: 75,
        deadline: '2025-02-15'
      },
      {
        id: 2,
        name: 'GreenLife Branding',
        client: 'GreenLife Co.',
        status: 'completed',
        progress: 100,
        deadline: '2025-01-10'
      }
    ]
  };

  res.render('admin/dashboard', {
    title: 'Admin Dashboard - Robe Digital Agency',
    currentPage: 'admin-dashboard',
    adminUser: req.session.adminUser,
    data: dashboardData
  });
});

// Admin contacts management
router.get('/contacts', requireAuth, (req, res) => {
  // In a real application, fetch from database with pagination
  const contacts = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      company: 'Smith Enterprises',
      service: 'Web Development',
      budget: '15k-50k',
      message: 'Looking for a complete website redesign...',
      date: '2025-01-15',
      status: 'new'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      phone: '+1 (555) 987-6543',
      company: 'Johnson & Associates',
      service: 'Branding',
      budget: '5k-15k',
      message: 'Need help with brand identity...',
      date: '2025-01-14',
      status: 'contacted'
    }
  ];

  res.render('admin/contacts', {
    title: 'Contact Management - Admin',
    currentPage: 'admin-contacts',
    adminUser: req.session.adminUser,
    contacts: contacts
  });
});

// Admin projects management
router.get('/projects', requireAuth, (req, res) => {
  const projects = [
    {
      id: 1,
      name: 'TechCorp Website Redesign',
      client: 'TechCorp Inc.',
      clientEmail: 'contact@techcorp.com',
      status: 'in-progress',
      progress: 75,
      startDate: '2024-12-01',
      deadline: '2025-02-15',
      budget: '$25,000',
      description: 'Complete website redesign with modern UI/UX'
    },
    {
      id: 2,
      name: 'GreenLife Branding',
      client: 'GreenLife Co.',
      clientEmail: 'info@greenlife.com',
      status: 'completed',
      progress: 100,
      startDate: '2024-11-15',
      deadline: '2025-01-10',
      budget: '$12,000',
      description: 'Brand identity design and marketing materials'
    }
  ];

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
  // Return dashboard statistics
  res.json({
    totalProjects: 156,
    activeProjects: 23,
    totalClients: 89,
    monthlyRevenue: 45230,
    conversionRate: 12.5,
    avgProjectValue: 18500
  });
});

router.put('/api/contact/:id/status', requireAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  // In production, update database
  res.json({ success: true, message: 'Contact status updated' });
});

router.put('/api/project/:id/progress', requireAuth, (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;
  
  // In production, update database
  res.json({ success: true, message: 'Project progress updated' });
});

module.exports = router;