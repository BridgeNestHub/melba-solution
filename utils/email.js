const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: process.env.EMAIL_USER && process.env.EMAIL_PASS ? {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  } : undefined
});

// Send contact form email
const sendContactForm = async (formData) => {
  const { name, email, phone, company, service, budget, message, timeline } = formData;
  
  const serviceNames = {
    'web-development': 'Web Development',
    'branding': 'Branding & Design',
    'digital-marketing': 'Digital Marketing',
    'ecommerce': 'E-commerce Solutions',
    'consultation': 'Consultation'
  };

  const budgetRanges = {
    'under-5k': 'Under $5,000',
    '5k-15k': '$5,000 - $15,000',
    '15k-50k': '$15,000 - $50,000',
    'over-50k': 'Over $50,000'
  };

  const timelineOptions = {
    'asap': 'ASAP',
    '1-3-months': '1-3 months',
    '3-6-months': '3-6 months',
    'flexible': 'Flexible'
  };

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2f5fda; color: white; padding: 20px; text-align: center;">
        <h1>New Contact Form Submission</h1>
      </div>
      
      <div style="padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #333;">Contact Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${email}</td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${phone}</td>
          </tr>
          ` : ''}
          ${company ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Company:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${company}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Service:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${serviceNames[service] || service}</td>
          </tr>
          ${budget ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Budget:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${budgetRanges[budget] || budget}</td>
          </tr>
          ` : ''}
          ${timeline ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Timeline:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${timelineOptions[timeline] || timeline}</td>
          </tr>
          ` : ''}
        </table>
        
        <h3 style="color: #333; margin-top: 20px;">Message:</h3>
        <div style="background-color: white; padding: 15px; border-left: 4px solid #2f5fda; margin-top: 10px;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #e8f4fd; border-radius: 5px;">
          <p style="margin: 0; color: #666;">
            <strong>Submitted:</strong> ${new Date().toLocaleString()}<br>
            <strong>IP Address:</strong> ${process.env.NODE_ENV === 'development' ? 'localhost' : 'N/A'}
          </p>
        </div>
      </div>
      
      <div style="background-color: #333; color: white; padding: 15px; text-align: center;">
        <p style="margin: 0;">Robe Digital Agency - Contact Form System</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"Robe Digital Agency" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER || 'hello@robeglobal.com',
    subject: `New Contact Form: ${serviceNames[service] || service} - ${name}`,
    html: emailHtml,
    replyTo: email
  };

  // Send confirmation email to client
  const clientMailOptions = {
    from: `"Robe Digital Agency" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Thank you for contacting Robe Digital Agency',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2f5fda; color: white; padding: 20px; text-align: center;">
          <h1>Thank You, ${name}!</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Thank you for reaching out to Robe Digital Agency. We've received your inquiry about <strong>${serviceNames[service] || service}</strong> and will get back to you within 24 hours.</p>
          
          <p>Here's a summary of your submission:</p>
          <ul>
            <li><strong>Service:</strong> ${serviceNames[service] || service}</li>
            ${budget ? `<li><strong>Budget:</strong> ${budgetRanges[budget] || budget}</li>` : ''}
            ${timeline ? `<li><strong>Timeline:</strong> ${timelineOptions[timeline] || timeline}</li>` : ''}
          </ul>
          
          <p>In the meantime, feel free to:</p>
          <ul>
            <li>Check out our <a href="http://localhost:3000/portfolio" style="color: #2f5fda;">portfolio</a></li>
            <li>Read our <a href="http://localhost:3000/testimonials" style="color: #2f5fda;">client testimonials</a></li>
            <li>Learn more about our <a href="http://localhost:3000/services" style="color: #2f5fda;">services</a></li>
          </ul>
          
          <p>Best regards,<br>The Robe Digital Agency Team</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px; text-align: center; color: #666;">
          <p style="margin: 0;">
            📧 hello@robeglobal.com | 📞 +1 (555) 123-4567<br>
            <a href="http://localhost:3000" style="color: #2f5fda;">www.robeglobal.com</a>
          </p>
        </div>
      </div>
    `
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      await transporter.sendMail(clientMailOptions);
      console.log('Contact form emails sent successfully');
    } else {
      console.log('Email not configured - contact form data logged:', { name, email, service });
    }
  } catch (error) {
    console.error('Error sending contact form emails:', error);
    throw error;
  }
};

// Add to newsletter
const addToNewsletter = async (email) => {
  // In production, you would integrate with your newsletter service
  // (Mailchimp, ConvertKit, etc.)
  console.log(`Adding ${email} to newsletter`);
  
  // For now, just send a welcome email
  const welcomeEmail = {
    from: `"Robe Digital Agency" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Robe Digital Agency Newsletter!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2f5fda; color: white; padding: 20px; text-align: center;">
          <h1>Welcome to Our Newsletter!</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Thank you for subscribing to the Robe Digital Agency newsletter!</p>
          
          <p>You'll now receive:</p>
          <ul>
            <li>Digital marketing tips and strategies</li>
            <li>Web development best practices</li>
            <li>Industry insights and trends</li>
            <li>Exclusive offers and updates</li>
          </ul>
          
          <p>Stay tuned for valuable content that will help grow your business!</p>
          
          <p>Best regards,<br>The Robe Digital Agency Team</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px; text-align: center; color: #666;">
          <p style="margin: 0;">
            If you no longer wish to receive these emails, you can 
            <a href="#" style="color: #2f5fda;">unsubscribe here</a>
          </p>
        </div>
      </div>
    `
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(welcomeEmail);
      console.log('Newsletter welcome email sent');
    } else {
      console.log('Email not configured - newsletter subscription logged:', email);
    }
  } catch (error) {
    console.error('Error sending newsletter welcome email:', error);
    throw error;
  }
};

module.exports = {
  sendContactForm,
  addToNewsletter
};