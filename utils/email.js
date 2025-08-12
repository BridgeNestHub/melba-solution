const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: process.env.EMAIL_USER && process.env.EMAIL_PASSWORD ? {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
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
        <p style="margin: 0;">MelbaSolution Digital Agency - Contact Form System</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"MelbaSolution Digital Agency" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER || 'contact@melbasolution.com',
    subject: `New Contact Form: ${serviceNames[service] || service} - ${name}`,
    html: emailHtml,
    replyTo: email
  };

  // Send confirmation email to client
  const clientMailOptions = {
    from: `"MelbaSolution Digital Agency" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Thank you for contacting MelbaSolution Digital Agency',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2f5fda; color: white; padding: 20px; text-align: center;">
          <h1>Thank You, ${name}!</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Thank you for reaching out to MelbaSolution Digital Agency. We've received your inquiry about <strong>${serviceNames[service] || service}</strong> and will get back to you within 24 hours.</p>
          
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
          
          <p>Best regards,<br>The MelbaSolution Digital Agency Team</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px; text-align: center; color: #666;">
          <p style="margin: 0;">
            📧 contact@melbasolution.com | 📞 +1 (206) 240-9455<br>
            <a href="http://localhost:3000" style="color: #2f5fda;">www.melbasolution.com</a>
          </p>
        </div>
      </div>
    `
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
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
  
  // Send admin notification
  const adminNotification = {
    from: `"MelbaSolution Digital Agency" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER || 'contact@melbasolution.com',
    subject: 'New Newsletter Subscription',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2f5fda; color: white; padding: 20px; text-align: center;">
          <h1>New Newsletter Subscriber</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Subscription Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Subscribed:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${new Date().toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Source:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Website Footer</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #333; color: white; padding: 15px; text-align: center;">
          <p style="margin: 0;">MelbaSolution Digital Agency - Newsletter System</p>
        </div>
      </div>
    `
  };
  
  // Send welcome email to subscriber
  const welcomeEmail = {
    from: `"MelbaSolution Digital Agency" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to MelbaSolution Digital Agency Newsletter!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2f5fda; color: white; padding: 20px; text-align: center;">
          <h1>Welcome to Our Newsletter!</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Thank you for subscribing to the MelbaSolution Digital Agency newsletter!</p>
          
          <p>You'll now receive:</p>
          <ul>
            <li>Digital marketing tips and strategies</li>
            <li>Web development best practices</li>
            <li>Industry insights and trends</li>
            <li>Exclusive offers and updates</li>
          </ul>
          
          <p>Stay tuned for valuable content that will help grow your business!</p>
          
          <p>Best regards,<br>The MelbaSolution Digital Agency Team</p>
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
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      await transporter.sendMail(adminNotification);
      await transporter.sendMail(welcomeEmail);
      console.log('Newsletter emails sent successfully');
    } else {
      console.log('Email not configured - newsletter subscription logged:', email);
    }
  } catch (error) {
    console.error('Error sending newsletter emails:', error);
    throw error;
  }
};

// Send package quote email
const sendPackageQuote = async (formData) => {
  const { firstName, lastName, email, phone, company, website, package: packageType, price, message, timeline, budget } = formData;
  const fullName = `${firstName} ${lastName}`;
  
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2f5fda; color: white; padding: 20px; text-align: center;">
        <h1>New Package Quote Request</h1>
        <h2 style="margin: 10px 0; color: #fff;">${packageType} Package</h2>
      </div>
      
      <div style="padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="color: #2f5fda; margin: 0 0 10px 0;">Package Details</h3>
          <p style="margin: 5px 0;"><strong>Package:</strong> ${packageType}</p>
          <p style="margin: 5px 0;"><strong>Price Range:</strong> ${price}</p>
        </div>
        
        <h2 style="color: #333;">Client Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${fullName}</td>
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
          ${website ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Website:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="${website}" style="color: #2f5fda;">${website}</a></td>
          </tr>
          ` : ''}
          ${timeline ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Timeline:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${timeline}</td>
          </tr>
          ` : ''}
          ${budget ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Budget:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${budget}</td>
          </tr>
          ` : ''}
        </table>
        
        <h3 style="color: #333; margin-top: 20px;">Project Description:</h3>
        <div style="background-color: white; padding: 15px; border-left: 4px solid #2f5fda; margin-top: 10px;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #e8f4fd; border-radius: 5px;">
          <p style="margin: 0; color: #666;">
            <strong>Submitted:</strong> ${new Date().toLocaleString()}<br>
            <strong>Source:</strong> Package Selection Form
          </p>
        </div>
      </div>
      
      <div style="background-color: #333; color: white; padding: 15px; text-align: center;">
        <p style="margin: 0;">MelbaSolution Digital Agency - Package Quote System</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"MelbaSolution Digital Agency" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER || 'contact@melbasolution.com',
    subject: `Package Quote Request: ${packageType} - ${fullName}`,
    html: emailHtml,
    replyTo: email
  };

  // Send confirmation email to client
  const clientMailOptions = {
    from: `"MelbaSolution Digital Agency" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Quote Request Received - ${packageType} Package`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2f5fda; color: white; padding: 20px; text-align: center;">
          <h1>Thank You, ${firstName}!</h1>
          <p style="margin: 10px 0; font-size: 18px;">Your ${packageType} Package quote request has been received</p>
        </div>
        
        <div style="padding: 20px;">
          <p>Thank you for your interest in our <strong>${packageType} Package</strong> (${price}). We've received your quote request and our team will review your requirements.</p>
          
          <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #2f5fda; margin: 0 0 10px 0;">What happens next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Our team will review your project requirements</li>
              <li>We'll prepare a detailed proposal within 24-48 hours</li>
              <li>Schedule a consultation call to discuss your project</li>
              <li>Provide you with a customized quote and timeline</li>
            </ul>
          </div>
          
          <p><strong>Your Request Summary:</strong></p>
          <ul>
            <li><strong>Package:</strong> ${packageType}</li>
            <li><strong>Price Range:</strong> ${price}</li>
            ${timeline ? `<li><strong>Timeline:</strong> ${timeline}</li>` : ''}
            ${budget ? `<li><strong>Budget:</strong> ${budget}</li>` : ''}
          </ul>
          
          <p>In the meantime, feel free to:</p>
          <ul>
            <li>Check out our <a href="http://localhost:3000/portfolio" style="color: #2f5fda;">portfolio</a> for similar projects</li>
            <li>Read our <a href="http://localhost:3000/testimonials" style="color: #2f5fda;">client success stories</a></li>
            <li>Learn more about our <a href="http://localhost:3000/services" style="color: #2f5fda;">comprehensive services</a></li>
          </ul>
          
          <p>Best regards,<br>The MelbaSolution Digital Agency Team</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px; text-align: center; color: #666;">
          <p style="margin: 0;">
            📧 contact@melbasolution.com | 📞 +1 (206) 240-9455<br>
            <a href="http://localhost:3000" style="color: #2f5fda;">www.melbasolution.com</a>
          </p>
        </div>
      </div>
    `
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      await transporter.sendMail(mailOptions);
      await transporter.sendMail(clientMailOptions);
      console.log('Package quote emails sent successfully');
    } else {
      console.log('Email not configured - package quote logged:', { fullName, email, packageType, price });
    }
  } catch (error) {
    console.error('Error sending package quote emails:', error);
    throw error;
  }
};

// Send transformation form email
const sendTransformationForm = async (formData) => {
  const { name, email, phone, company, industry, goals, budget, timeline, message, website } = formData;
  
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2f5fda; color: white; padding: 20px; text-align: center;">
        <h1>🚀 New Digital Transformation Request</h1>
        <h2 style="margin: 10px 0; color: #fff;">Ready to Go Global!</h2>
      </div>
      
      <div style="padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="color: #2f5fda; margin: 0 0 10px 0;">🌍 Transformation Goals</h3>
          <p style="margin: 5px 0; font-weight: bold;">${goals || 'Not specified'}</p>
        </div>
        
        <h2 style="color: #333;">Business Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Business Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${company}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Industry:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${industry}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Contact Person:</td>
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
          ${website ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Current Website:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="${website}" style="color: #2f5fda;">${website}</a></td>
          </tr>
          ` : ''}
          ${budget ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Investment Budget:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${budget}</td>
          </tr>
          ` : ''}
          ${timeline ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Timeline:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${timeline}</td>
          </tr>
          ` : ''}
        </table>
        
        <h3 style="color: #333; margin-top: 20px;">🎯 Transformation Vision:</h3>
        <div style="background-color: white; padding: 15px; border-left: 4px solid #2f5fda; margin-top: 10px;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #e8f4fd; border-radius: 5px;">
          <p style="margin: 0; color: #666;">
            <strong>Submitted:</strong> ${new Date().toLocaleString()}<br>
            <strong>Source:</strong> Digital Transformation Form
          </p>
        </div>
      </div>
      
      <div style="background-color: #333; color: white; padding: 15px; text-align: center;">
        <p style="margin: 0;">MelbaSolution Digital Agency - Transformation Request System</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"MelbaSolution Digital Agency" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER || 'contact@melbasolution.com',
    subject: `🚀 Digital Transformation Request: ${company} (${industry})`,
    html: emailHtml,
    replyTo: email
  };

  // Send confirmation email to client
  const clientMailOptions = {
    from: `"MelbaSolution Digital Agency" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Welcome to Your Digital Transformation Journey, ${name}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2f5fda; color: white; padding: 20px; text-align: center;">
          <h1>🚀 Welcome, ${name}!</h1>
          <p style="margin: 10px 0; font-size: 18px;">Your transformation journey begins now</p>
        </div>
        
        <div style="padding: 20px;">
          <p>Thank you for choosing MelbaSolution to help transform <strong>${company}</strong> from a local business into a global brand!</p>
          
          <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #2f5fda; margin: 0 0 10px 0;">🌟 What happens next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Our transformation specialists will review your goals within 24 hours</li>
              <li>We'll schedule a strategy consultation call to discuss your vision</li>
              <li>Receive a customized transformation roadmap for global expansion</li>
              <li>Get a detailed proposal with timeline and investment breakdown</li>
            </ul>
          </div>
          
          <p><strong>Your Transformation Summary:</strong></p>
          <ul>
            <li><strong>Industry:</strong> ${industry}</li>
            <li><strong>Goals:</strong> ${goals || 'Custom transformation goals'}</li>
            ${budget ? `<li><strong>Investment Range:</strong> ${budget}</li>` : ''}
            ${timeline ? `<li><strong>Timeline:</strong> ${timeline}</li>` : ''}
          </ul>
          
          <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #2f5fda; margin: 0 0 10px 0;">🎯 Why Choose MelbaSolution?</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>250% average business growth for our clients</li>
              <li>Serving 25+ countries worldwide</li>
              <li>98% client retention rate</li>
              <li>Google & AWS certified partners</li>
            </ul>
          </div>
          
          <p>While you wait, explore our success stories:</p>
          <ul>
            <li>View our <a href="http://localhost:3000/portfolio" style="color: #2f5fda;">global transformation portfolio</a></li>
            <li>Read <a href="http://localhost:3000/testimonials" style="color: #2f5fda;">client success stories</a></li>
            <li>Learn about our <a href="http://localhost:3000/services" style="color: #2f5fda;">transformation services</a></li>
          </ul>
          
          <p>Ready to go global? We're here to make it happen!</p>
          
          <p>Best regards,<br>The MelbaSolution Transformation Team</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px; text-align: center; color: #666;">
          <p style="margin: 0;">
            📧 contact@melbasolution.com | 📞 +1 (206) 240-9455<br>
            <a href="http://localhost:3000" style="color: #2f5fda;">www.melbasolution.com</a>
          </p>
        </div>
      </div>
    `
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      await transporter.sendMail(mailOptions);
      await transporter.sendMail(clientMailOptions);
      console.log('Transformation form emails sent successfully');
    } else {
      console.log('Email not configured - transformation request logged:', { name, email, company, industry });
    }
  } catch (error) {
    console.error('Error sending transformation form emails:', error);
    throw error;
  }
};

module.exports = {
  sendContactForm,
  sendPackageQuote,
  sendTransformationForm,
  addToNewsletter
};