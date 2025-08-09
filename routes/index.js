const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const emailService = require('../utils/email');
const dataStore = require('../utils/dataStore');

// Home page
router.get('/', (req, res) => {
  const successMessage = req.query.success === 'consultation' 
    ? 'Thank you for your consultation request! We\'ll contact you within 24 hours to schedule your free consultation.'
    : null;
    
  res.render('pages/index', {
    title: 'MelbaSolution- Digital Transformation Agency | Home',
    currentPage: 'home',
    metaDescription: 'MelbaSolutionDigital Agency - We help local businesses transform into global brands through comprehensive digital solutions including web development, branding, and digital marketing.',
    successMessage: successMessage,
    errors: [],
    formData: {}
  });
});

// About page
router.get('/about', (req, res) => {
  res.render('pages/about', {
    title: 'About Us - MelbaSolutionDigital Agency',
    currentPage: 'about',
    metaDescription: 'Learn about MelbaSolutionDigital Agency, our mission, values, and the team behind transforming local businesses into global brands.'
  });
});

// Services page
router.get('/services', (req, res) => {
  const successMessage = req.query.success === 'package-quote' 
    ? 'Thank you! Your quote request has been submitted. We\'ll contact you within 24 hours with a detailed proposal.'
    : null;
    
  res.render('pages/services', {
    title: 'Our Services - MelbaSolutionDigital Agency',
    currentPage: 'services',
    metaDescription: 'Discover our comprehensive digital services: web development, branding, digital marketing, and e-commerce solutions.',
    successMessage: successMessage,
    errors: [],
    formData: {}
  });
});

// Portfolio page
router.get('/portfolio', (req, res) => {
  res.render('pages/portfolio', {
    title: 'Portfolio - MelbaSolutionDigital Agency',
    currentPage: 'portfolio',
    metaDescription: 'View our portfolio of successful digital transformation projects and case studies from various industries.'
  });
});

// Testimonials page
router.get('/testimonials', (req, res) => {
  const successMessage = req.query.success === 'transformation' 
    ? 'Thank you! Your transformation request has been submitted. Our team will contact you within 24 hours to discuss your digital transformation journey.'
    : null;
    
  res.render('pages/testimonials', {
    title: 'Client Testimonials - MelbaSolutionDigital Agency',
    currentPage: 'testimonials',
    metaDescription: 'Read what our clients say about their experience working with MelbaSolutionDigital Agency and their business transformation results.',
    successMessage: successMessage,
    errors: [],
    formData: {}
  });
});

// Contact page
router.get('/contact', (req, res) => {
  const successMessage = req.query.success === 'contact' 
    ? 'Thank you for your message! We\'ll get back to you within 24 hours.'
    : null;
    
  res.render('pages/contact', {
    title: 'Contact Us - MelbaSolutionDigital Agency',
    currentPage: 'contact',
    metaDescription: 'Get in touch with MelbaSolutionDigital Agency. Let\'s discuss how we can help transform your business digitally.',
    successMessage: successMessage,
    errors: [],
    formData: {}
  });
});

// Package quote form submission - UPDATED FOR MONGODB
router.post('/package-quote', [
  body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters long'),
  body('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters long'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address'),
  body('phone').optional({ checkFalsy: true }).isMobilePhone().withMessage('Please enter a valid phone number'),
  body('company').optional({ checkFalsy: true }).trim(),
  body('website').optional({ checkFalsy: true }).isURL().withMessage('Please enter a valid website URL'),
  body('package').isIn(['Starter', 'Professional', 'Enterprise']).withMessage('Please select a valid package'),
  body('price').trim().notEmpty().withMessage('Package price is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Project description must be at least 10 characters long'),
  body('timeline').optional().isIn(['ASAP', '1-2 weeks', '1 month', '2-3 months', 'Flexible']).withMessage('Please select a valid timeline'),
  body('budget').optional().isIn(['Under $5,000', '$5,000 - $10,000', '$10,000 - $25,000', '$25,000+']).withMessage('Please select a valid budget range')
], async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('pages/services', {
      title: 'Our Services - MelbaSolutionDigital Agency',
      currentPage: 'services',
      metaDescription: 'Discover our comprehensive digital services: web development, branding, digital marketing, and e-commerce solutions.',
      errors: errors.array(),
      formData: req.body
    });
  }

  try {
    // Store in MongoDB - UPDATED TO USE AWAIT
    await dataStore.addContact({
      name: `${req.body.firstName} ${req.body.lastName}`,
      email: req.body.email,
      phone: req.body.phone,
      company: req.body.company,
      website: req.body.website,
      service: 'Package Quote',
      budget: req.body.budget,
      timeline: req.body.timeline,
      message: req.body.message,
      source: 'Package Quote',
      packageType: req.body.package,
      price: req.body.price
    });
    
    // Send package quote email
    await emailService.sendPackageQuote(req.body);
    
    // Redirect to prevent form resubmission on refresh
    res.redirect('/services?success=package-quote');
  } catch (error) {
    console.error('Package quote error:', error);
    
    // Return to services page with error
    res.render('pages/services', {
      title: 'Our Services - MelbaSolutionDigital Agency',
      currentPage: 'services',
      metaDescription: 'Discover our comprehensive digital services: web development, branding, digital marketing, and e-commerce solutions.',
      errors: [{ msg: 'Sorry, there was an error sending your request. Please try again.' }],
      formData: req.body
    });
  }
});

// Transformation form submission - UPDATED FOR MONGODB
router.post('/transformation', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address'),
  body('phone').optional().isMobilePhone().withMessage('Please enter a valid phone number'),
  body('company').trim().isLength({ min: 2 }).withMessage('Business name must be at least 2 characters long'),
  body('industry').isIn(['Technology', 'Healthcare', 'E-commerce', 'Education', 'Finance', 'Real Estate', 'Manufacturing', 'Other']).withMessage('Please select a valid industry'),
  body('goals').optional().trim(),
  body('budget').optional().isIn(['Under $5,000', '$5,000 - $15,000', '$15,000 - $50,000', '$50,000+']).withMessage('Please select a valid budget range'),
  body('timeline').optional().isIn(['ASAP', '1-3 months', '3-6 months', '6+ months']).withMessage('Please select a valid timeline'),
  body('message').trim().isLength({ min: 10 }).withMessage('Transformation vision must be at least 10 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Return to testimonials page with errors
    return res.render('pages/testimonials', {
      title: 'Client Testimonials - MelbaSolutionDigital Agency',
      currentPage: 'testimonials',
      metaDescription: 'Read what our clients say about their experience working with MelbaSolutionDigital Agency and their business transformation results.',
      errors: errors.array(),
      formData: req.body
    });
  }

  try {
    // Store in MongoDB - UPDATED TO USE AWAIT
    await dataStore.addContact({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      company: req.body.company,
      service: 'Digital Transformation',
      budget: req.body.budget,
      timeline: req.body.timeline,
      message: req.body.message,
      source: 'Transformation Request',
      industry: req.body.industry,
      goals: req.body.goals,
      website: req.body.website
    });
    
    // Send transformation email
    await emailService.sendTransformationForm(req.body);
    
    // Redirect to prevent form resubmission on refresh
    res.redirect('/testimonials?success=transformation');
  } catch (error) {
    console.error('Transformation form error:', error);
    
    // Return to testimonials page with error
    res.render('pages/testimonials', {
      title: 'Client Testimonials - MelbaSolutionDigital Agency',
      currentPage: 'testimonials',
      metaDescription: 'Read what our clients say about their experience working with MelbaSolutionDigital Agency and their business transformation results.',
      errors: [{ msg: 'Sorry, there was an error sending your request. Please try again.' }],
      formData: req.body
    });
  }
});

// Contact form submission - UPDATED FOR MONGODB
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
      title: 'Contact Us - MelbaSolutionDigital Agency',
      currentPage: 'contact',
      metaDescription: 'Get in touch with MelbaSolutionDigital Agency. Let\'s discuss how we can help transform your business digitally.',
      errors: errors.array(),
      formData: req.body
    });
  }

  try {
    // Store in MongoDB - UPDATED TO USE AWAIT
    await dataStore.addContact({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      company: req.body.company,
      service: req.body.service,
      budget: req.body.budget,
      timeline: req.body.timeline,
      message: req.body.message,
      source: 'Contact Form'
    });
    
    // Send email notification
    await emailService.sendContactForm(req.body);
    
    // Redirect to prevent form resubmission on refresh
    res.redirect('/contact?success=contact');
  } catch (error) {
    console.error('Contact form error:', error);
    res.render('pages/contact', {
      title: 'Contact Us - MelbaSolutionDigital Agency',
      currentPage: 'contact',
      metaDescription: 'Get in touch with MelbaSolutionDigital Agency. Let\'s discuss how we can help transform your business digitally.',
      errors: [{ msg: 'Sorry, there was an error sending your message. Please try again.' }],
      formData: req.body
    });
  }
});

// Consultation form submission - UPDATED FOR MONGODB
router.post('/consultation', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address'),
  body('phone').optional({ checkFalsy: true }).isMobilePhone().withMessage('Please enter a valid phone number'),
  body('company').optional({ checkFalsy: true }).trim(),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('pages/index', {
      title: 'MelbaSolution- Digital Transformation Agency | Home',
      currentPage: 'home',
      metaDescription: 'MelbaSolutionDigital Agency - We help local businesses transform into global brands through comprehensive digital solutions including web development, branding, and digital marketing.',
      errors: errors.array(),
      formData: req.body
    });
  }

  try {
    // Store in MongoDB - UPDATED TO USE AWAIT
    await dataStore.addContact({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      company: req.body.company,
      service: 'Consultation',
      message: req.body.message,
      source: 'Consultation Request'
    });
    
    // Send consultation email
    await emailService.sendContactForm(req.body);
    
    // Redirect to prevent form resubmission on refresh
    res.redirect('/?success=consultation');
  } catch (error) {
    console.error('Consultation form error:', error);
    
    // Return to home page with error
    res.render('pages/index', {
      title: 'MelbaSolution- Digital Transformation Agency | Home',
      currentPage: 'home',
      metaDescription: 'MelbaSolutionDigital Agency - We help local businesses transform into global brands through comprehensive digital solutions including web development, branding, and digital marketing.',
      errors: [{ msg: 'Sorry, there was an error sending your request. Please try again.' }],
      formData: req.body
    });
  }
});

// Newsletter subscription - UPDATED FOR MONGODB
router.post('/newsletter', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address')
], async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.json({ success: false, message: 'Please enter a valid email address' });
  }

  try {
    // Store in MongoDB - UPDATED TO USE AWAIT
    await dataStore.addNewsletter(req.body.email);
    
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
    return "You can reach us at contact@melbaSolution.com or +1 (206) 240-9455. Would you like me to connect you with our team?";
  }
  
  if (lowerMessage.includes('portfolio') || lowerMessage.includes('work')) {
    return "You can view our portfolio at /portfolio. We've helped 100+ businesses transform digitally. What industry are you in?";
  }
  
  return "Thanks for your message! How can I help you with your digital transformation needs today?";
}

module.exports = router;