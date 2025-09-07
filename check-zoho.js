#!/usr/bin/env node

require('dotenv').config();
const nodemailer = require('nodemailer');

async function checkZoho() {
  console.log('🔍 Checking Zoho Email Configuration');
  console.log('=====================================');
  
  console.log('Email User:', process.env.EMAIL_USER);
  console.log('Email Host:', process.env.EMAIL_HOST);
  console.log('Email Port:', process.env.EMAIL_PORT);
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    },
    debug: true,
    logger: true
  });

  try {
    console.log('\n🔌 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    console.log('\n📧 Sending test email...');
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Test Email from Railway',
      text: 'This is a test email to verify Zoho SMTP works on Railway.'
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', result.messageId);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('Error Code:', error.code);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 SOLUTION: You need to use an App Password for Zoho:');
      console.log('1. Go to Zoho Mail Settings');
      console.log('2. Security → App Passwords');
      console.log('3. Generate new app password');
      console.log('4. Use that password in EMAIL_PASSWORD');
    }
  }
}

checkZoho().catch(console.error);