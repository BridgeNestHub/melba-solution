const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');
const { testEmailConfig } = require('./utils/email');

// Trust proxy - CRITICAL for Railway and other cloud platforms
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// PRODUCTION-READY Session Configuration
const MongoStore = require('connect-mongo');

app.use(session({
  secret: process.env.SESSION_SECRET || 'robe-digital-agency-secret-key',
  resave: false,
  saveUninitialized: false,
  store: process.env.NODE_ENV === 'production' ? MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }) : undefined,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  },
  name: 'melba.sid'
}));

// Routes
app.use('/', indexRoutes);
app.use('/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('pages/404', {
    title: '404 - Page Not Found',
    currentPage: '404'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('pages/error', {
    title: '500 - Server Error',
    currentPage: 'error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.listen(PORT, async () => {
  console.log(`🚀 Robe Digital Agency server running on port ${PORT}`);
  console.log(`📱 Visit: http://localhost:${PORT}`);
  console.log(`🔒 Secure cookies: ${process.env.NODE_ENV === 'production'}`);
  console.log(`🛡️  Trust proxy: enabled`);
  
  // Test email configuration with timeout
  console.log('\n📧 Testing email configuration...');
  try {
    const emailWorking = await Promise.race([
      testEmailConfig(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
    ]);
    if (emailWorking) {
      console.log(`📧 Email service ready: ${process.env.EMAIL_USER}`);
      console.log(`📬 Contact emails will be sent to: ${process.env.CONTACT_EMAIL}`);
    }
  } catch (error) {
    console.log('⚠️  Email test timeout - service will work when forms are submitted');
  }
});

module.exports = app;