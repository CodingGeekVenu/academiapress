// scripts/supabase-link.js
const { execSync } = require('child_process');

// Get project reference from command line arguments
const args = process.argv.slice(2);
let projectRef = '';

// Check if the first argument is the project reference directly
if (args.length > 0 && !args[0].startsWith('--')) {
  projectRef = args[0];
} else {
  // Parse arguments to find project reference with --project-ref flag
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--project-ref' && i + 1 < args.length) {
      projectRef = args[i + 1];
      break;
    }
  }
}

if (!projectRef) {
  console.error('Error: Project reference is required.');
  console.error('Usage: npm run supabase:link -- <project-ref>');
  console.error('   or: npm run supabase:link -- --project-ref <project-ref>');
  process.exit(1);
}

console.log(`Linking to Supabase project: ${projectRef}`);

try {
  // Run the supabase link command using npx
  execSync(`npx supabase link --project-ref ${projectRef}`, {
    stdio: 'inherit'
  });
  console.log('Successfully linked to Supabase project!');
} catch (error) {
  console.error('Error linking to Supabase project:', error.message);
  process.exit(1);
}