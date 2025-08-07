const { body } = require('express-validator');

// Contact form validation rules
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
    
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
    
  body('phone')
    .optional({ checkFalsy: true })
    .isMobilePhone('any', { strictMode: false })
    .withMessage('Please enter a valid phone number'),
    
  body('company')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name must be less than 100 characters'),
    
  body('service')
    .isIn(['web-development', 'branding', 'digital-marketing', 'ecommerce', 'consultation'])
    .withMessage('Please select a valid service'),
    
  body('budget')
    .optional({ checkFalsy: true })
    .isIn(['under-5k', '5k-15k', '15k-50k', 'over-50k'])
    .withMessage('Please select a valid budget range'),
    
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
    
  body('timeline')
    .optional({ checkFalsy: true })
    .isIn(['asap', '1-3-months', '3-6-months', 'flexible'])
    .withMessage('Please select a valid timeline')
];

// Newsletter validation
const newsletterValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address')
];

// Admin login validation
const adminLoginValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters'),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Password change validation
const passwordChangeValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
    
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    })
];

// Sanitize HTML input to prevent XSS
const sanitizeHtml = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validate file uploads
const validateFileUpload = (file, allowedTypes = [], maxSize = 5 * 1024 * 1024) => {
  const errors = [];
  
  if (!file) {
    errors.push('No file uploaded');
    return errors;
  }
  
  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
  }
  
  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
  }
  
  return errors;
};

// Rate limiting helper
const createRateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old requests
    for (const [key, timestamp] of requests.entries()) {
      if (timestamp < windowStart) {
        requests.delete(key);
      }
    }
    
    // Count requests from this IP
    const ipRequests = Array.from(requests.entries())
      .filter(([key]) => key.startsWith(ip))
      .length;
    
    if (ipRequests >= max) {
      return res.status(429).json({
        error: 'Too many requests, please try again later'
      });
    }
    
    requests.set(`${ip}-${now}`, now);
    next();
  };
};

module.exports = {
  contactValidation,
  newsletterValidation,
  adminLoginValidation,
  passwordChangeValidation,
  sanitizeHtml,
  validateFileUpload,
  createRateLimit
};