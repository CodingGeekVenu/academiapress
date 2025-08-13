/**
 * Test Email Script
 * 
 * This script tests the email functionality by sending a test email
 * through the Supabase Edge Function.
 * 
 * Usage: node scripts/test-email.js [recipient-email]
 * If no recipient email is provided, it will default to test@example.com
 */

require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

// Function to test the email functionality
async function testEmail() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local');
    process.exit(1);
  }

  // Get recipient email from command line arguments or use default
  const recipientEmail = process.argv[2] || 'test@example.com';
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(recipientEmail)) {
    console.error(`Error: Invalid email format: ${recipientEmail}`);
    console.log('Usage: node scripts/test-email.js [recipient-email]');
    process.exit(1);
  }
  
  console.log(`Sending test email to ${recipientEmail}...`);
  
  try {
    // Construct the URL for the Supabase Edge Function
    const functionUrl = `${supabaseUrl}/functions/v1/send-email`;
    
    console.log(`Calling Edge Function: ${functionUrl}`);
    
    // Call the Supabase Edge Function directly
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        to: recipientEmail,
        subject: 'Test Email from Academic Platform',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
            <div style="background: #002147; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
              <h1 style="margin: 0;">AcademiaPress</h1>
              <h2 style="margin: 10px 0 0 0;">Test Email</h2>
            </div>
            <div style="padding: 20px;">
              <p>This is a test email from the Academic Platform.</p>
              <p>If you're receiving this, the email functionality is working correctly!</p>
              
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Email Details:</strong></p>
                <ul>
                  <li>Recipient: ${recipientEmail}</li>
                  <li>Sent: ${new Date().toLocaleString()}</li>
                  <li>Environment: ${process.env.NODE_ENV || 'development'}</li>
                </ul>
              </div>
              
              <p>Best regards,<br>The AcademiaPress Team</p>
            </div>
            <div style="padding: 15px; background: #f5f5f5; font-size: 12px; color: #666; border-radius: 0 0 5px 5px;">
              This is an automated message. Please do not reply to this email.
            </div>
          </div>
        `,
        template_type: 'test'
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Email sent successfully!');
      console.log('Response:', JSON.stringify(result, null, 2));
    } else {
      console.error('❌ Failed to send email');
      console.error('Status:', response.status);
      console.error('Response:', JSON.stringify(result, null, 2));
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error testing email functionality:', error.message);
    process.exit(1);
  }
}

// Run the test
testEmail();