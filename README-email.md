# Academic Platform Email Functionality

## Overview

This README provides a quick guide to setting up and using the email functionality in the Academic Platform. For more detailed documentation, please refer to the following files:

- [Email Functionality Documentation](./docs/email-functionality.md)
- [Supabase Setup Guide](./docs/supabase-setup.md)

## Quick Start

### 1. Set Up Environment Variables

Create or update your `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
```

### 2. Set Up Supabase CLI

```bash
# Login to Supabase
npm run supabase:login

# Link to your Supabase project
npm run supabase:link:project
```

### 3. Deploy the Email Function

```bash
npm run supabase:deploy:email
```

### 4. Test the Email Functionality

```bash
npm run test:email your-email@example.com
```

## Available Scripts

- `npm run supabase:login` - Log in to Supabase
- `npm run supabase:link:project` - Link to your Supabase project
- `npm run supabase:deploy:email` - Deploy the send-email function
- `npm run supabase:functions:serve` - Serve Edge Functions locally
- `npm run test:email [email]` - Test the email functionality

## Sending Emails in Your Code

```typescript
import { sendNotification } from '@/lib/notifications';

await sendNotification(
  'recipient@example.com',
  'submission_received',
  {
    author_name: 'John Doe',
    title: 'Research Paper Title',
    submission_id: '12345',
    field_of_study: 'Computer Science',
    submitted_date: '2023-08-15'
  }
);
```

## Troubleshooting

If you encounter any issues, please check:

1. Your environment variables are correctly set
2. You're logged in to Supabase CLI
3. Your project is correctly linked
4. The Supabase Edge Function logs for any errors

For more detailed troubleshooting, refer to the [Email Functionality Documentation](./docs/email-functionality.md).