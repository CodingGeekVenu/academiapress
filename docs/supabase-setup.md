# Supabase Setup Guide

## Overview

This document provides instructions for setting up and using Supabase in the Academic Platform project. The Supabase CLI is installed as a dev dependency in the project, and we've created npm scripts to make it easier to use.

## Prerequisites

- Node.js and npm installed
- Supabase account and project created

## Setup Instructions

### 1. Login to Supabase

To authenticate with Supabase, run:

```bash
npm run supabase:login
```

This will open a browser window where you can log in to your Supabase account and authorize the CLI.

### 2. Link to Your Supabase Project

To link your local project to your Supabase project, run:

```bash
npm run supabase:link -- --project-ref your-project-ref
```

Replace `your-project-ref` with your actual Supabase project reference ID. You can find this in the URL of your Supabase dashboard: `https://app.supabase.com/project/your-project-ref`.

### 3. Deploy Edge Functions

To deploy all Edge Functions to your Supabase project:

```bash
npm run supabase:functions:deploy
```

To deploy a specific function:

```bash
npm run supabase:functions:deploy -- function-name
```

For example, to deploy the send-email function:

```bash
npm run supabase:functions:deploy -- send-email
```

### 4. Test Edge Functions Locally

To serve and test your Edge Functions locally:

```bash
npm run supabase:functions:serve
```

## Environment Variables

When testing functions locally, you'll need to set up environment variables. Create a `.env.local` file in your project root with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
```

## Troubleshooting

### Command Not Found

If you see an error like "supabase is not recognized as a command", make sure you're using the npm scripts provided in this project. These scripts use `npx` to run the Supabase CLI from the local node_modules.

### Authentication Issues

If you encounter authentication issues, try running `npm run supabase:login` again to refresh your authentication token.

### Deployment Failures

If function deployment fails, check:

1. You're logged in to Supabase CLI
2. Your project is correctly linked
3. Your function code is valid
4. You have the necessary permissions in the Supabase project

## Additional Resources

- [Supabase CLI Documentation](https://supabase.com/docs/reference/cli)
- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)