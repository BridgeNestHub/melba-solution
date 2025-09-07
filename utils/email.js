const sgMail = require('@sendgrid/mail');

// Set the SendGrid API Key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send contact form email
const sendContactForm = async (formData) => {
  const { name, email, phone, company, service, budget, message, timeline } = formData;
  
  console.log('🔧 EMAIL DEBUG START');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Using SendGrid API');
  console.log('Has API Key:', !!process.env.SENDGRID_API_KEY);
  
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

  // SendGrid requires the `from` email to be a verified sender
  const mailOptions = {
    to: process.env.EMAIL_USER || 'contact@melbasolution.com',
    from: process.env.EMAIL_USER,
    subject: `New Contact Form: ${serviceNames[service] || service} - ${name}`,
    html: emailHtml,
  };

  const clientMailOptions = {
    to: email,
    from: process.env.EMAIL_USER,
    subject: 'Thank you for contacting MelbaSolution Digital Agency',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2f5fda; color: white; padding: 20px; text-align: center;">
          <h1>Thank You, ${name}!</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Thank you for reaching out to MelbaSolution Digital Agency. We've received your inquiry about <strong>${serviceNames[service] || service}</strong> and will get back to you within 24 hours.</p>
          
          <p>Best regards,<br>The MelbaSolution Digital Agency Team</p>
        </div>
      </div>
    `
  };

  try {
    if (process.env.SENDGRID_API_KEY) {
      console.log('📧 Sending admin email via SendGrid...');
      await sgMail.send(mailOptions);
      console.log('✅ Admin email sent successfully.');
      
      console.log('📧 Sending client email via SendGrid...');
      await sgMail.send(clientMailOptions);
      console.log('✅ Client email sent successfully.');
      
      console.log('🎉 All emails sent successfully');
    } else {
      console.log('❌ SendGrid API key is missing');
    }
  } catch (error) {
    console.error('💥 EMAIL ERROR DETAILS:');
    console.error('Error Type:', error.constructor.name);
    console.error('Error Message:', error.message);
    console.error('Full Error Object:', JSON.stringify(error, null, 2));
    if (error.response) {
      console.error('Error response body:', error.response.body);
    }
  }
  console.log('🔧 EMAIL DEBUG END');
};

const addToNewsletter = async (email) => {
  console.log(`Adding ${email} to newsletter`);
};

const sendPackageQuote = async (formData) => {
  console.log('📧 Package Quote: Sending emails...');
};

const sendTransformationForm = async (formData) => {
  console.log('📧 Transformation: Sending emails...');
};

module.exports = {
  sendContactForm,
  sendPackageQuote,
  sendTransformationForm,
  addToNewsletter
};