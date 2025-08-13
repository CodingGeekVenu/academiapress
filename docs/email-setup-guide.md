# Email Functionality Setup Guide

## Overview

This guide provides step-by-step instructions for setting up and using the email functionality in the Academic Platform. The platform uses [Resend](https://resend.com) as the email service provider and Supabase Edge Functions to handle the email sending logic.

## Prerequisites

Before you begin, make sure you have:

1. A Supabase account and project
2. A Resend account and API key
3. Node.js and npm installed
4. The Academic Platform codebase cloned to your local machine

## Setup Steps

### 1. Environment Variables

Create or update your `.env.local` file in the root of the project with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
```

Replace the placeholder values with your actual Supabase URL, anonymous key, and Resend API key.

### 2. Supabase CLI Setup

The project uses the Supabase CLI to deploy and manage Edge Functions. The CLI is already installed as a dev dependency, so you can use it through npm scripts.

#### Login to Supabase

```bash
npm run supabase:login
```

This will open a browser window for you to log in to your Supabase account.

#### Link to Your Supabase Project

```bash
npm run supabase:link:project
```

This will link your local project to your Supabase project.

### 3. Deploy the Email Function

To deploy the send-email function to your Supabase project:

```bash
npm run supabase:deploy:email
```

This script will:
- Deploy the send-email function
- Set the RESEND_API_KEY secret in your Supabase project

## Testing the Email Functionality

To test if the email functionality is working correctly:

```bash
npm run test:email your-email@example.com
```

Replace `your-email@example.com` with your actual email address. If the test is successful, you should receive a test email in your inbox.

## Using the Email Functionality in Your Code

To send emails from your application code, you can use the `sendNotification` function from the notifications library:

```typescript
import { sendNotification } from '@/lib/notifications';

await sendNotification(
  'recipient@example.com',
  'submission_received', // template type
  {
    author_name: 'John Doe',
    title: 'Research Paper Title',
    submission_id: '12345',
    field_of_study: 'Computer Science',
    submitted_date: '2023-08-15'
  }
);
```

## Available Email Templates

The platform includes several pre-defined email templates:

1. `submission_received` - Sent when a new submission is received
2. `status_update` - Sent when the status of a submission changes

Each template has a predefined subject and HTML structure with placeholders for dynamic content.

## Troubleshooting

### Common Issues

#### 1. Supabase CLI Not Found

If you encounter an error saying the Supabase CLI is not found, make sure you're using the npm scripts provided in the project:

```bash
npm run supabase:login
npm run supabase:link:project
npm run supabase:deploy:email
```

These scripts use `npx` to run the Supabase CLI from the local node_modules.

#### 2. Function Deployment Failure

If the function deployment fails, check:

- You're logged in to Supabase (`npm run supabase:login`)
- Your project is linked correctly (`npm run supabase:link:project`)
- The function directory exists at `supabase/functions/send-email`

#### 3. Email Not Sending

If the test email is not being sent, check:

- Your Resend API key is correct in `.env.local`
- The Resend API key is set as a secret in your Supabase project
- The Edge Function is deployed correctly

### Viewing Logs

To view the logs for the send-email function:

```bash
npx supabase functions logs send-email
```

This will show you any errors or issues with the function.

## Additional Resources

- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Resend API Documentation](https://resend.com/docs/api-reference/introduction)
- [Email Template Best Practices](https://www.litmus.com/blog/email-design-best-practices/)

## Security Considerations

- The RESEND_API_KEY should never be exposed to the client-side code
- All email sending logic should be handled by the Supabase Edge Function
- Validate email addresses before sending emails to prevent abuse
- Use rate limiting to prevent spam

## Next Steps

- Implement additional email templates for different use cases
- Add email tracking and analytics
- Implement email verification for user registration
- Set up scheduled emails for reminders and notifications