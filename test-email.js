#!/usr/bin/env node

require('dotenv').config();
const { testEmailConfig, sendContactForm } = require('./utils/email');

async function testEmail() {
  console.log('🧪 Testing Email Configuration for Railway + Zoho');
  console.log('================================================');
  
  // Test 1: Verify SMTP connection
  console.log('\n1. Testing SMTP connection...');
  const isConnected = await testEmailConfig();
  
  if (!isConnected) {
    console.log('❌ SMTP connection failed. Check your .env configuration:');
    console.log('   EMAIL_HOST=smtp.zoho.com');
    console.log('   EMAIL_PORT=587');
    console.log('   EMAIL_SECURE=false');
    console.log('   EMAIL_USER=contact@melbasolution.com');
    console.log('   EMAIL_PASSWORD=your-zoho-password');
    console.log('   CONTACT_EMAIL=contact@melbasolution.com');
    return;
  }
  
  // Test 2: Send test contact form
  console.log('\n2. Testing contact form email...');
  try {
    const testFormData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      company: 'Test Company',
      service: 'web-development',
      budget: '5k-15k',
      timeline: '1-3-months',
      message: 'This is a test message to verify email functionality works correctly with Railway deployment and Zoho email service.'
    };
    
    await sendContactForm(testFormData);
    console.log('✅ Test email sent successfully!');
    console.log(`📧 Admin notification sent to: ${process.env.CONTACT_EMAIL}`);
    console.log(`📧 Confirmation email sent to: ${testFormData.email}`);
    
  } catch (error) {
    console.log('❌ Test email failed:', error.message);
  }
  
  console.log('\n🎉 Email test completed!');
}

testEmail().catch(console.error);