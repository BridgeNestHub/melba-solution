# Robe Digital Agency Website

A modern, responsive website for Robe Digital Agency built with Node.js, Express, and EJS templating. The website showcases digital transformation services and includes both public pages and an admin panel for managing contacts and projects.

## 🚀 Features

### Public Website
- **Responsive Design** - Works perfectly on all devices
- **Modern UI/UX** - Clean, professional design with smooth animations
- **Contact Forms** - Validated contact forms with email notifications
- **Portfolio Showcase** - Interactive portfolio with filtering
- **Service Pages** - Detailed service descriptions with tabs
- **Testimonials** - Client success stories and reviews
- **Chat Widget** - Interactive chat functionality
- **Newsletter Subscription** - Email newsletter signup
- **SEO Optimized** - Meta tags, structured data, and semantic HTML

### Admin Panel
- **Secure Login** - Session-based authentication
- **Dashboard** - Overview of key metrics and recent activity
- **Contact Management** - View and manage contact form submissions
- **Project Management** - Track project progress and status
- **Settings** - Admin account management
- **Responsive Admin UI** - Mobile-friendly admin interface

## 🛠️ Technology Stack

- **Backend:** Node.js, Express.js
- **Templating:** EJS (Embedded JavaScript)
- **Styling:** CSS3 with CSS Variables, Flexbox, and Grid
- **JavaScript:** ES6+ for client-side functionality
- **Email:** Nodemailer for contact forms and notifications
- **Security:** Helmet, Express Validator, Session management
- **Icons:** Font Awesome
- **Fonts:** Google Fonts (Inter)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Email account for SMTP (Gmail, etc.) - optional for contact forms

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd melba-solution
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   SESSION_SECRET=your-super-secret-session-key
   
   # Email Configuration (optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Admin Credentials
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Website: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## 📁 Project Structure

```
robe-website/
├── app.js                    # Main Express application
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables
├── public/                   # Static assets
│   ├── css/                  # Stylesheets
│   ├── js/                   # Client-side JavaScript
│   └── images/               # Images and media
├── routes/                   # Express routes
│   ├── index.js             # Public routes
│   └── admin.js             # Admin routes
├── views/                    # EJS templates
│   ├── partials/            # Reusable components
│   ├── pages/               # Public pages
│   └── admin/               # Admin pages
├── utils/                    # Utility functions
│   ├── email.js             # Email functionality
│   └── validation.js        # Form validation
└── models/                   # Database models (future)
```

## 🎨 Customization

### Colors & Branding
Edit the CSS variables in `/public/css/style.css`:
```css
:root {
  --primary-color: #2f5fda;     /* Main brand color */
  --primary-dark: #1e3ea8;      /* Darker variant */
  --secondary-color: #ff6b6b;   /* Accent color */
  /* ... other variables */
}
```

### Content
- **Logo:** Replace `/public/images/logo1.png` with your logo
- **Images:** Update images in `/public/images/` directory
- **Text Content:** Edit EJS templates in `/views/pages/`
- **Services:** Modify service information in templates
- **Contact Info:** Update contact details in footer and contact page

### Email Templates
Customize email templates in `/utils/email.js`:
- Contact form notifications
- Newsletter welcome emails
- Auto-response emails

## 🔐 Admin Panel

### Default Login
- **URL:** http://localhost:3000/admin
- **Username:** admin (configurable in .env)
- **Password:** admin123 (configurable in .env)

### Features
- **Dashboard:** Overview of contacts, projects, and statistics
- **Contacts:** Manage contact form submissions
- **Projects:** Track project progress and status
- **Settings:** Change admin password and preferences

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the app password in your `.env` file

### Other Email Providers
Update the SMTP settings in `.env`:
```env
EMAIL_HOST=your-smtp-host.com
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-password
```

## 🚀 Deployment

### Development
```bash
npm run dev  # Uses nodemon for auto-restart
```

### Production
```bash
npm start    # Standard Node.js start
```

### Hosting Options
- **Heroku:** Easy deployment with git
- **DigitalOcean:** VPS hosting
- **AWS EC2:** Scalable cloud hosting
- **Vercel/Netlify:** For static builds (requires modification)

### Environment Variables for Production
Make sure to set these in your hosting platform:
- `NODE_ENV=production`
- `SESSION_SECRET=your-production-secret`
- Email configuration variables
- Admin credentials

## 🔧 Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests (to be implemented)
```

## 📱 Responsive Design

The website is fully responsive and tested on:
- **Desktop:** 1920px and above
- **Laptop:** 1024px - 1919px
- **Tablet:** 768px - 1023px
- **Mobile:** 320px - 767px

## 🔒 Security Features

- **Helmet:** Security headers
- **CORS:** Cross-origin resource sharing protection
- **Session Management:** Secure session handling
- **Input Validation:** Server-side form validation
- **XSS Protection:** Input sanitization
- **CSRF Protection:** (can be added with csurf middleware)

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **Email not sending**
   - Check SMTP credentials in `.env`
   - Verify Gmail app password setup
   - Check firewall/network restrictions

3. **Admin login not working**
   - Verify credentials in `.env` file
   - Clear browser cookies/session
   - Check console for errors

4. **Images not loading**
   - Ensure images are in `/public/images/`
   - Check file paths in templates
   - Verify Express static middleware setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- **Email:** hello@robeglobal.com
- **Phone:** +1 (555) 123-4567
- **Website:** [www.robeglobal.com](http://localhost:3000)

## 🔄 Version History

- **v1.0.0** - Initial release with full website and admin panel
- **v1.1.0** - Added email functionality and improved admin dashboard
- **v1.2.0** - Enhanced security and mobile responsiveness

---

**Built with ❤️ by Robe Digital Agency**