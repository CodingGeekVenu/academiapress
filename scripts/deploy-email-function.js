/**
 * Deploy Email Function Script
 * 
 * This script deploys the send-email function to Supabase and sets the RESEND_API_KEY secret.
 * 
 * Usage: node scripts/deploy-email-function.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to execute a command and return its output
function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    return { success: true, output };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      stdout: error.stdout,
      stderr: error.stderr 
    };
  }
}

// Check if .env.local exists and contains RESEND_API_KEY
const envPath = path.join(process.cwd(), '.env.local');
let resendApiKey = null;

console.log(`Checking for RESEND_API_KEY in ${envPath}...`);

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/RESEND_API_KEY\s*=\s*(.*)/);
  if (match && match[1]) {
    resendApiKey = match[1].trim();
    console.log('✅ RESEND_API_KEY found in .env.local');
  }
}

if (!resendApiKey) {
  console.error('❌ RESEND_API_KEY not found in .env.local');
  console.error('Please add RESEND_API_KEY=your_resend_api_key to your .env.local file');
  process.exit(1);
}

console.log('Deploying send-email function to Supabase...');

// Step 1: Deploy the send-email function
const deployResult = runCommand('npx supabase functions deploy send-email');

if (!deployResult.success) {
  console.error('❌ Failed to deploy send-email function:');
  console.error(deployResult.stderr || deployResult.error);
  console.error('\nPossible issues:');
  console.error('- Make sure you are logged in to Supabase (npm run supabase:login)');
  console.error('- Make sure your project is linked (npm run supabase:link:project)');
  console.error('- Check if the function directory exists at supabase/functions/send-email');
  process.exit(1);
}

console.log('✅ send-email function deployed successfully!');
console.log(deployResult.output);

// Step 2: Set the RESEND_API_KEY secret
console.log('\nSetting RESEND_API_KEY secret...');

// Properly escape the API key for command line
const escapedApiKey = resendApiKey.replace(/"/g, '\\"');
const secretResult = runCommand(`npx supabase secrets set RESEND_API_KEY="${escapedApiKey}"`);

if (!secretResult.success) {
  console.error('❌ Failed to set RESEND_API_KEY secret:');
  console.error(secretResult.stderr || secretResult.error);
  console.error('\nYou will need to set the secret manually:');
  console.error(`npx supabase secrets set RESEND_API_KEY="${escapedApiKey}"`);
  process.exit(1);
}

console.log('✅ RESEND_API_KEY secret set successfully!');
console.log(secretResult.output);

console.log('\n🎉 Email function deployment complete!');
console.log('You can now test the email functionality with:');
console.log('npm run test:email your-email@example.com');