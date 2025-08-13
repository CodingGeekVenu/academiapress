# Email Functionality Documentation

## Overview

This document provides a comprehensive guide to the email functionality in the Academic Platform. The platform uses [Resend](https://resend.com) as the email service provider and Supabase Edge Functions to handle the email sending logic.

## Architecture

The email system consists of the following components:

1. **Supabase Edge Function**: A serverless function that handles the email sending logic
2. **Resend API**: The email service provider used to send emails
3. **Notification Library**: A client-side library that provides an interface for sending emails with templates

## Setup and Configuration

### Prerequisites

- A Supabase account and project
- A Resend account and API key
- Node.js and npm installed

### Environment Variables

The following environment variables are required:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
```

### Supabase CLI Setup

The Supabase CLI is required to deploy and manage Edge Functions. Follow these steps to set it up:

1. Install the Supabase CLI as a dev dependency:
   ```bash
   npm install supabase --save-dev
   ```

2. Log in to Supabase:
   ```bash
   npm run supabase:login
   ```

3. Link to your Supabase project:
   ```bash
   npm run supabase:link:project
   ```

### Deploying the Email Function

To deploy the send-email function to your Supabase project:

```bash
npm run supabase:deploy:email
```

This script will:
- Deploy the send-email function
- Set the RESEND_API_KEY secret in your Supabase project

## Usage

### Sending Emails

To send an email, use the `sendNotification` function from `src/lib/notifications.ts`:

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

### Available Email Templates

The following email templates are available:

1. `submission_received` - Sent when a new submission is received
2. `status_update` - Sent when the status of a submission changes

### Adding New Templates

To add a new email template:

1. Open `src/lib/notifications.ts`
2. Add your template to the `EMAIL_TEMPLATES` object:

```typescript
const EMAIL_TEMPLATES: Record<string, NotificationTemplate> = {
  // Existing templates...
  
  new_template: {
    type: 'new_template',
    subject: 'Your Subject with {variable}',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <!-- Your HTML template here -->
        <p>Hello {name},</p>
        <p>Your custom message here.</p>
      </div>
    `
  }
};
```

3. Update the `NotificationTemplate` type to include your new template type:

```typescript
export interface NotificationTemplate {
  type: 'submission_received' | 'status_update' | 'new_template'; // Add your new type here
  subject: string;
  template: string;
}
```

## Testing

### Testing Locally

To test the email functionality locally:

1. Start the Supabase Edge Functions locally:
   ```bash
   npm run supabase:functions:serve
   ```

2. Run the test script:
   ```bash
   npm run test:email [recipient-email]
   ```

   If no recipient email is provided, it will default to `test@example.com`.

### Troubleshooting

#### Common Issues

1. **Missing API Key**: Ensure the RESEND_API_KEY is set in both your local .env.local file and in the Supabase secrets.

2. **Function Deployment Failure**: Make sure you're logged in to Supabase and your project is linked correctly.

3. **Email Not Sending**: Check the Supabase Edge Function logs for any errors.

#### Viewing Logs

To view the logs for the send-email function:

```bash
npx supabase functions logs send-email
```

## Security Considerations

- The RESEND_API_KEY should never be exposed to the client-side code
- All email sending logic should be handled by the Supabase Edge Function
- Validate email addresses before sending emails to prevent abuse
- Use rate limiting to prevent spam

## Resources

- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Resend API Documentation](https://resend.com/docs/api-reference/introduction)
- [Email Template Best Practices](https://www.litmus.com/blog/email-design-best-practices/)