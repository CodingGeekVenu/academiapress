code
Markdown
download
content_copy
expand_less

# 🎓 AcademiaPress - Advanced Academic Publishing Platform

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/YOUR_USERNAME/academiapress/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Node.js](https://img.shields.io/badge/Node.js-v18.0.0+-green.svg)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ECF8E.svg)](https://supabase.com/)

> A modern, AI-powered academic publishing platform with a glassmorphism design, dark mode support, and comprehensive analytics.

![AcademiaPress Platform](https://via.placeholder.com/1200x400/002147/FFFFFF?text=AcademiaPress+-+Advanced+Academic+Publishing+Platform)

---

## ✨ Features

### 🎨 **Modern UI/UX**
- **Glassmorphism Design**: Beautiful glass-effect cards and components with backdrop blur.
- **Complete Dark Mode**: Seamless light/dark theme switching with system preference detection.
- **Responsive Design**: Mobile-first approach working perfectly on all devices.
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions.
- **Professional Typography**: Inter font family with proper weight variations.

### 📊 **Analytics & Insights**
- **Submission Analytics**: Real-time insights into paper submissions with interactive charts.
- **Advanced Analytics Dashboard**: Revenue tracking, author performance, and platform metrics.
- **Author Performance Tracking**: Success rates, publication counts, and institutional data.
- **Revenue Analytics**: Financial insights with monthly trends and growth indicators.
- **Interactive Charts**: Recharts integration with responsive design and dark mode support.

### 🔍 **AI-Powered Tools**
- **Plagiarism Checker**: Advanced AI-powered plagiarism detection with similarity scoring.
- **Source Identification**: Comprehensive database scanning across academic sources.
- **Smart Recommendations**: AI-driven research suggestions and trend analysis.
- **Automated Processing**: Streamlined submission workflows with status tracking.

### 📚 **Core Functionality**
- **Paper Submission System**: Complete research paper submission with file upload support.
- **Conference Management**: Registration, scheduling, and networking features.
- **User Authentication**: Secure Supabase-powered authentication with profile management.
- **Real-time Updates**: Live data synchronization and status updates.
- **Institution Management**: University and research institution integration.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Supabase Account** - [Sign up free](https://supabase.com/)
- **Git** - [Download here](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/academiapress.git
cd academiapress
2. Install Dependencies
code
Bash
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
npm install
# or
yarn install
3. Environment Setup

Create a .env.local file in the root directory and add your credentials.

code
Env
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AcademiaPress

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
4. Database Setup

Create Supabase Project:

Visit Supabase and create a new project.

Copy your project URL and anon key into the .env.local file.

Run Database Migrations:

Copy and run the SQL scripts from /database/migrations/ in your Supabase SQL editor to create the necessary tables.

Enable Authentication:

Go to Authentication > Settings in your Supabase project dashboard.

Configure your preferred authentication providers (e.g., Email, Google, GitHub).

5. Run Development Server
code
Bash
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
npm run dev
# or
yarn dev

Open http://localhost:3000 to view the application.

📁 Project Structure
code
Code
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
academiapress/
├── src/
│   ├── app/                          # Next.js 13+ App Router
│   │   ├── globals.css              # Global styles and Tailwind
│   │   ├── layout.tsx               # Root layout with providers
│   │   ├── page.tsx                 # Landing page with hero section
│   │   ├── submit-paper/            # Paper submission pages
│   │   ├── analytics/               # Analytics dashboard
│   │   ├── plagiarism/              # Plagiarism checker
│   │   └── conferences/             # Conference management
│   ├── components/                   # Reusable React components
│   │   ├── AuthProvider.tsx         # Authentication context provider
│   │   ├── Header.tsx               # Navigation header with theme toggle
│   │   ├── Footer.tsx               # Footer component
│   │   ├── SubmissionDashboard.tsx  # Analytics dashboard component
│   │   ├── PlagiarismChecker.tsx    # Plagiarism detection interface
│   │   ├── AdvancedAnalytics.tsx    # Comprehensive analytics
│   │   ├── PaperSubmissionForm.tsx  # Paper submission form
│   │   ├── ConferenceCard.tsx       # Conference display cards
│   │   └── Toast.tsx                # Notification system
│   ├── contexts/                     # React contexts
│   │   └── ThemeContext.tsx         # Dark/light theme management
│   ├── lib/                         # Utility libraries
│   │   ├── supabase.ts              # Supabase client configuration
│   │   ├── utils.ts                 # Helper functions
│   │   └── validations.ts           # Form validation schemas
│   └── styles/                      # Styling files
│       └── globals.css              # Global CSS with Tailwind directives
├── public/                          # Static assets
│   ├── favicon.ico                  # Favicon
│   ├── logo/                        # Logo assets
│   └── images/                      # Image assets
├── database/                        # Database schemas and migrations
│   ├── migrations/                  # SQL migration files
│   ├── schemas/                     # Database schema definitions
│   └── seed.sql                     # Sample data for testing
├── docs/                           # Documentation
│   ├── API.md                      # API documentation
│   ├── DEPLOYMENT.md               # Deployment guide
│   └── CONTRIBUTING.md             # Contributing guidelines
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── package.json                    # Project dependencies and scripts
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── next.config.js                  # Next.js configuration
🛠️ Available Scripts
code
Bash
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset database (development only)

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run end-to-end tests
🎨 Design System
Color Palette

Primary: #002147 (Navy Blue) - Main brand color

Secondary: #1e3a8a (Blue) - Secondary actions

Accent: #3b82f6 (Light Blue) - Highlights and links

Success: #10b981 (Green) - Success states

Warning: #f59e0b (Yellow) - Warning states

Error: #ef4444 (Red) - Error states

Typography

Font Family: Inter, system-ui, sans-serif

Weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold), 900 (black)

Scale: Following Tailwind's default type scale

Glassmorphism Components

All components feature glassmorphism design with:

backdrop-blur-xl for the glass effect

Semi-transparent backgrounds (bg-white/20, bg-slate-800/20)

Subtle borders (border-white/30, border-slate-700/40)

Hover effects with scale and shadow transitions

🌙 Dark Mode Implementation

The application includes comprehensive dark mode support.

Features

Automatic Detection: Respects system theme preference (prefers-color-scheme).

Manual Toggle: User can manually switch themes at any time.

Persistent Storage: Theme choice is saved in localStorage.

Component Theming: All UI components are properly themed for both modes.

Chart Theming: Analytics charts and visualizations adapt to the selected theme.

The theme context is managed in src/contexts/ThemeContext.tsx, providing state management, system preference detection, and theme switching functions.

📊 Analytics Components
Submission Dashboard (SubmissionDashboard.tsx)

Real-time Data: Live submission tracking and status updates.

Interactive Charts: Pie charts for status distribution (e.g., Draft, Submitted, In Review).

Trend Analysis: Line charts showing monthly submission trends.

Performance Metrics: Key metrics like success rates and average review times.

Plagiarism Checker (PlagiarismChecker.tsx)

AI-Powered Analysis: Advanced content scanning using machine learning models.

Similarity Scoring: Provides a percentage-based similarity score.

Source Identification: Cross-references content against a vast academic database.

File Support: Handles .pdf, .doc, .docx, and .txt file formats.

Advanced Analytics (AdvancedAnalytics.tsx)

Revenue Analytics: Tracks financial performance with customizable date ranges.

Author Performance: Monitors publication success metrics by author and institution.

Platform Insights: Provides usage statistics, user growth, and other platform trends.

Export Capabilities: Allows users to export data and reports.

🔧 Configuration
Environment Variables

Create a .env.local file with these variables:

code
Env
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
# Required - Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Required - App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AcademiaPress

# Optional - Analytics and Features
NEXT_PUBLIC_ANALYTICS_ID=your-google-analytics-id
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PLAGIARISM=true
NEXT_PUBLIC_MAX_FILE_SIZE=5242880 # (in bytes, e.g., 5MB)
Supabase Database Schema

Below are the core SQL tables. You can find the full migration scripts in /database/migrations/.

code
SQL
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
-- User profiles linked to Supabase auth
CREATE TABLE user_profiles (
  id uuid references auth.users not null primary key,
  email text,
  first_name text,
  last_name text,
  institution text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Article submissions
CREATE TABLE article_submissions (
  id bigint generated by default as identity primary key,
  title text not null,
  abstract text,
  content text,
  status text default 'draft', -- e.g., draft, submitted, in_review, published, rejected
  user_id uuid references user_profiles(id),
  submitted_at timestamp with time zone default timezone('utc'::text, now())
);

-- Conferences
CREATE TABLE conferences (
  id bigint generated by default as identity primary key,
  title text not null,
  description text,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  location text,
  registration_fee numeric,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

Important: Remember to enable Row Level Security (RLS) on all tables and create appropriate policies for user access.

🚀 Deployment
Vercel (Recommended)

Push your code to a Git repository (e.g., GitHub).

Import your project into Vercel.

Add all environment variables from .env.local to the Vercel project settings.

Update NEXT_PUBLIC_APP_URL to your production domain.

Deploy!

Self-Hosted

Build Application:

code
Bash
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
npm run build

Start the Server:

code
Bash
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
npm start

Process Manager:
Use a process manager like PM2 for better stability and management.

code
Bash
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
npm install -g pm2
pm2 start npm --name "academiapress" -- start

Reverse Proxy:
Configure a reverse proxy like Nginx or Apache to handle requests and manage SSL.

🔐 Security Features

Authentication: Secure JWT-based authentication via Supabase Auth.

Row Level Security: Database-level access control ensures users can only access their own data.

Input Validation: Comprehensive form validation on both client and server sides.

File Upload Security: Strict checks on file types and sizes.

CSRF Protection: Built-in protection from Next.js.

Environment Variables: Secure management of keys and configuration.

🤝 Contributing

We welcome contributions! Please check out the CONTRIBUTING.md file for detailed guidelines.

Quick Guide

Fork the repository.

Create a new feature branch: git checkout -b feature/amazing-feature.

Make your changes and add tests.

Commit your changes: git commit -m 'feat: Add amazing feature'.

Push to the branch: git push origin feature/amazing-feature.

Open a Pull Request.

🐛 Troubleshooting
Common Issues

"Module not found" errors:
Delete node_modules and package-lock.json and reinstall with npm install.

Database connection issues:
Verify Supabase URL and key in .env.local and check your project's RLS policies.

Build failures:
Run npm run type-check and npm run lint to catch errors before building.

Getting Help

📧 Email: support@academiapress.com

💬 Discord: Join our community

🐛 Issues: GitHub Issues

📈 Roadmap

Mobile App: React Native application for iOS and Android.

Advanced AI: GPT integration for research assistance and abstract generation.

Collaboration Tools: Real-time collaborative editing for papers.

Multi-language Support: Internationalization (i18n) for global reach.

API Marketplace: Allow third-party integrations and plugins.

📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

Built with ❤️ for the academic community.

Empowering researchers, scholars, and institutions worldwide with modern publishing technology.

code
Code
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
