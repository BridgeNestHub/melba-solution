const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const emailService = require('../utils/email');

// Home page
router.get('/', (req, res) => {
  res.render('pages/index', {
    title: 'Robe - Digital Transformation Agency | Home',
    currentPage: 'home',
    metaDescription: 'Robe Digital Agency - We help local businesses transform into global brands through comprehensive digital solutions including web development, branding, and digital marketing.'
  });
});

// About page
router.get('/about', (req, res) => {
  res.render('pages/about', {
    title: 'About Us - Robe Digital Agency',
    currentPage: 'about',
    metaDescription: 'Learn about Robe Digital Agency, our mission, values, and the team behind transforming local businesses into global brands.'
  });
});

// Services page
router.get('/services', (req, res) => {
  res.render('pages/services', {
    title: 'Our Services - Robe Digital Agency',
    currentPage: 'services',
    metaDescription: 'Discover our comprehensive digital services: web development, branding, digital marketing, and e-commerce solutions.'
  });
});

// Portfolio page
router.get('/portfolio', (req, res) => {
  res.render('pages/portfolio', {
    title: 'Portfolio - Robe Digital Agency',
    currentPage: 'portfolio',
    metaDescription: 'View our portfolio of successful digital transformation projects and case studies from various industries.'
  });
});

// Testimonials page
router.get('/testimonials', (req, res) => {
  res.render('pages/testimonials', {
    title: 'Client Testimonials - Robe Digital Agency',
    currentPage: 'testimonials',
    metaDescription: 'Read what our clients say about their experience working with Robe Digital Agency and their business transformation results.'
  });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('pages/contact', {
    title: 'Contact Us - Robe Digital Agency',
    currentPage: 'contact',
    metaDescription: 'Get in touch with Robe Digital Agency. Let\'s discuss how we can help transform your business digitally.',
    errors: [],
    formData: {}
  });
});

// Contact form submission
router.post('/contact', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address'),
  body('phone').optional().isMobilePhone().withMessage('Please enter a valid phone number'),
  body('company').optional().trim(),
  body('service').isIn(['web-development', 'branding', 'digital-marketing', 'ecommerce', 'consultation']).withMessage('Please select a valid service'),
  body('budget').optional().isIn(['under-5k', '5k-15k', '15k-50k', 'over-50k']).withMessage('Please select a valid budget range'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters long'),
  body('timeline').optional().isIn(['asap', '1-3-months', '3-6-months', 'flexible']).withMessage('Please select a valid timeline')
], async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('pages/contact', {
      title: 'Contact Us - Robe Digital Agency',
      currentPage: 'contact',
      metaDescription: 'Get in touch with Robe Digital Agency. Let\'s discuss how we can help transform your business digitally.',
      errors: errors.array(),
      formData: req.body
    });
  }

  try {
    // Send email notification
    await emailService.sendContactForm(req.body);
    
    // Redirect with success message
    req.session.successMessage = 'Thank you for your message! We\'ll get back to you within 24 hours.';
    res.redirect('/contact-success');
  } catch (error) {
    console.error('Contact form error:', error);
    res.render('pages/contact', {
      title: 'Contact Us - Robe Digital Agency',
      currentPage: 'contact',
      metaDescription: 'Get in touch with Robe Digital Agency. Let\'s discuss how we can help transform your business digitally.',
      errors: [{ msg: 'Sorry, there was an error sending your message. Please try again.' }],
      formData: req.body
    });
  }
});

// Contact success page
router.get('/contact-success', (req, res) => {
  const successMessage = req.session.successMessage;
  req.session.successMessage = null;
  
  if (!successMessage) {
    return res.redirect('/contact');
  }
  
  res.render('pages/contact-success', {
    title: 'Message Sent - Robe Digital Agency',
    currentPage: 'contact',
    successMessage
  });
});

// Newsletter subscription
router.post('/newsletter', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address')
], async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.json({ success: false, message: 'Please enter a valid email address' });
  }

  try {
    // Add to newsletter (implement your newsletter service here)
    await emailService.addToNewsletter(req.body.email);
    res.json({ success: true, message: 'Successfully subscribed to our newsletter!' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.json({ success: false, message: 'Sorry, there was an error. Please try again.' });
  }
});

// API endpoint for chat responses
router.post('/api/chat', (req, res) => {
  const { message } = req.body;
  
  // Simple chat response logic (you can enhance this with AI/ML)
  const response = generateChatResponse(message);
  
  res.json({
    success: true,
    response: response,
    timestamp: new Date().toISOString()
  });
});

function generateChatResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('service') || lowerMessage.includes('offer')) {
    return "We offer web development, branding, digital marketing, and e-commerce solutions. Which service interests you most?";
  }
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return "Our pricing depends on project scope. Would you like to schedule a free consultation to discuss your specific needs?";
  }
  
  if (lowerMessage.includes('contact') || lowerMessage.includes('call')) {
    return "You can reach us at hello@robeglobal.com or +1 (555) 123-4567. Would you like me to connect you with our team?";
  }
  
  if (lowerMessage.includes('portfolio') || lowerMessage.includes('work')) {
    return "You can view our portfolio at /portfolio. We've helped 100+ businesses transform digitally. What industry are you in?";
  }
  
  return "Thanks for your message! How can I help you with your digital transformation needs today?";
}

module.exports = router;