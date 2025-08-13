# 🎓 AcademiaPress - Advanced Academic Publishing Platform

> A modern, AI-powered academic publishing platform with glassmorphism design, dark mode support, and comprehensive analytics.

## ✨ Features

### 🎨 **Modern UI/UX**
- **Glassmorphism Design**: Beautiful glass-effect cards and components with backdrop blur
- **Complete Dark Mode**: Seamless light/dark theme switching with system preference detection
- **Responsive Design**: Mobile-first approach working perfectly on all devices
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Professional Typography**: Inter font family with proper weight variations

### 📊 **Analytics & Insights**
- **Submission Analytics**: Real-time insights into paper submissions with interactive charts
- **Advanced Analytics Dashboard**: Revenue tracking, author performance, and platform metrics
- **Author Performance Tracking**: Success rates, publication counts, and institutional data
- **Revenue Analytics**: Financial insights with monthly trends and growth indicators
- **Interactive Charts**: Recharts integration with responsive design and dark mode support

### 🔍 **AI-Powered Tools**
- **Plagiarism Checker**: Advanced AI-powered plagiarism detection with similarity scoring
- **Source Identification**: Comprehensive database scanning across academic sources
- **Smart Recommendations**: AI-driven research suggestions and trend analysis
- **Automated Processing**: Streamlined submission workflows with status tracking

### 📚 **Core Functionality**
- **Paper Submission System**: Complete research paper submission with file upload support
- **Conference Management**: Registration, scheduling, and networking features
- **User Authentication**: Secure Supabase-powered authentication with profile management
- **Real-time Updates**: Live data synchronization and status updates
- **Institution Management**: University and research institution integration

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Supabase Account** - [Sign up free](https://supabase.com/)
- **Git** - [Download here](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd academiapress
```

> **Important**: Remember to replace all placeholder values (e.g., `your_supabase_project_url`, `your_supabase_anon_key`, `your-username`, `your-repo-name`, etc.) with your actual project details.

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AcademiaPress

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### 4. Database Setup

1. **Create Supabase Project**:
   - Visit [Supabase](https://supabase.com/) and create a new project
   - Copy your project URL and anon key

2. **Run Database Migrations**:
   ```sql
   -- Copy and run the SQL scripts from /database/migrations/
   -- in your Supabase SQL editor
   ```

3. **Enable Authentication**:
   - Go to Authentication > Settings in Supabase
   - Configure your preferred auth providers

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📋 Project Structure

```
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
```

## 🛠️ Available Scripts

```bash
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
```

## 🎨 Design System

### Color Palette
- **Primary**: `#002147` (Navy Blue) - Main brand color
- **Secondary**: `#1e3a8a` (Blue) - Secondary actions
- **Accent**: `#3b82f6` (Light Blue) - Highlights and links
- **Success**: `#10b981` (Green) - Success states
- **Warning**: `#f59e0b` (Yellow) - Warning states
- **Error**: `#ef4444` (Red) - Error states

### Typography
- **Font Family**: Inter, system-ui, sans-serif
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold), 900 (black)
- **Scale**: Following Tailwind's default type scale

### Glassmorphism Components
All components feature glassmorphism design with:
- `backdrop-blur-xl` for glass effect
- Semi-transparent backgrounds (`bg-white/20`, `bg-slate-800/20`)
- Subtle borders (`border-white/30`, `border-slate-700/40`)
- Hover effects with scale and shadow transitions

## 🌙 Dark Mode Implementation

The application includes comprehensive dark mode support:

### Features
- **Automatic Detection**: Respects system theme preference
- **Manual Toggle**: User can manually switch themes
- **Persistent Storage**: Theme choice saved in localStorage
- **Component Theming**: All components properly themed
- **Chart Theming**: Analytics charts adapt to theme

### Theme Context
Located in `src/contexts/ThemeContext.tsx`, providing:
- Theme state management
- System preference detection
- Local storage persistence
- Theme switching functions

## 📊 Analytics Components

### Submission Dashboard (`SubmissionDashboard.tsx`)
- **Real-time Data**: Live submission tracking
- **Interactive Charts**: Pie charts for status distribution
- **Trend Analysis**: Monthly submission trends
- **Performance Metrics**: Success rates and timing
- **Responsive Design**: Works on all screen sizes

### Plagiarism Checker (`PlagiarismChecker.tsx`)
- **AI-Powered Analysis**: Advanced content scanning
- **Similarity Scoring**: Percentage-based similarity detection
- **Source Identification**: Academic database cross-referencing
- **Detailed Reports**: Comprehensive similarity analysis
- **File Support**: PDF, DOC, DOCX, TXT file formats

### Advanced Analytics (`AdvancedAnalytics.tsx`)
- **Revenue Analytics**: Financial performance tracking
- **Author Performance**: Publication success metrics
- **Platform Insights**: Usage statistics and trends
- **Interactive Visualizations**: Multiple chart types
- **Export Capabilities**: Data export functionality

## 🔧 Configuration

### Environment Variables

Create `.env.local` with these required variables:

```env
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
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
```

### Supabase Setup

1. **Database Tables**:
   ```sql
   -- User profiles
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
     status text default 'draft',
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
   ```

2. **Row Level Security (RLS)**:
   - Enable RLS on all tables
   - Create appropriate policies for user access

3. **Authentication**:
   - Enable email/password authentication
   - Configure OAuth providers if needed
   - Set up email templates

### Theme Customization

Modify `src/contexts/ThemeContext.tsx` to customize themes:

```javascript
const themes = {
  light: {
    primary: '#002147',
    secondary: '#1e3a8a',
    background: '#ffffff',
    // ... other theme variables
  },
  dark: {
    primary: '#3b82f6',
    secondary: '#60a5fa',
    background: '#0f172a',
    // ... other theme variables
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**:
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Environment Variables**:
   - Add all environment variables in Vercel dashboard
   - Update `NEXT_PUBLIC_APP_URL` to your domain

3. **Custom Domain**:
   - Add domain in Vercel project settings
   - Update DNS records as instructed

### Netlify Alternative

1. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `out`

2. **Environment Variables**:
   - Add variables in Netlify dashboard
   - Ensure all `NEXT_PUBLIC_` variables are set

### Self-Hosted

1. **Build Application**:
   ```bash
   npm run build
   npm start
   ```

2. **Process Manager**:
   ```bash
   # Using PM2
   npm install -g pm2
   pm2 start npm -- start
   ```

3. **Reverse Proxy**:
   - Configure Nginx or Apache
   - Set up SSL certificates

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permissions system
- **Data Encryption**: Sensitive data encryption at rest
- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: API request throttling to prevent abuse

## 🧪 Testing

### Unit Tests
```bash
npm run test
npm run test:watch
npm run test:coverage
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
npm run test:e2e:headed
```

## 📱 Mobile Responsiveness

- **Mobile-First Design**: Optimized for mobile devices
- **Touch-Friendly**: Large touch targets and intuitive gestures
- **Progressive Web App**: PWA capabilities for mobile installation
- **Offline Support**: Basic offline functionality
- **Performance**: Optimized for mobile networks

## 🔍 SEO & Performance

- **Next.js SEO**: Built-in SEO optimization
- **Meta Tags**: Proper meta tags for social sharing
- **Sitemap**: Auto-generated sitemap
- **Performance**: Lighthouse score optimization
- **Core Web Vitals**: Optimized for Google's metrics

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `npm run test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write meaningful commit messages
- Add JSDoc comments for functions
- Include tests for new features

### Pull Request Process
1. Ensure your PR description clearly describes the problem and solution
2. Include screenshots for UI changes
3. Update documentation if needed
4. Request review from maintainers

## 🐛 Troubleshooting

### Common Issues

**"Module not found" errors:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json  # Windows: rmdir /s node_modules & del package-lock.json
npm install
```

**Database connection issues:**
- Verify Supabase URL and key in `.env.local`
- Check Supabase project status and RLS policies
- Ensure database tables exist

**Build failures:**
- Run type checking: `npm run type-check`
- Check for ESLint errors: `npm run lint`
- Verify all environment variables are set

**Performance issues:**
- Enable Next.js analytics
- Check bundle analyzer: `npm run analyze`
- Optimize images and assets

### Getting Help

- 📧 **Email**: support@academiapress.com
- 💬 **Discord**: [Join our community](https://discord.gg/academiapress)
- 🐛 **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/academiapress/issues)
- 📖 **Documentation**: [Full Documentation](https://academiapress.com/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ Liability and warranty not provided

## 🙏 Acknowledgments

### Technologies Used
- **[Next.js](https://nextjs.org/)** - React framework for production
- **[React](https://reactjs.org/)** - Frontend JavaScript library
- **[TypeScript](https://typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Supabase](https://supabase.com/)** - Backend as a Service
- **[Framer Motion](https://framer.com/motion/)** - Animation library
- **[Heroicons](https://heroicons.com/)** - Beautiful SVG icons
- **[Recharts](https://recharts.org/)** - React charting library

### Special Thanks
- Academic community for feedback and requirements
- Open source contributors
- Beta testers and early adopters
- Design inspiration from leading academic platforms

## 📈 Roadmap

### Upcoming Features
- [ ] **Mobile App**: React Native mobile application
- [ ] **Advanced AI**: GPT integration for research assistance
- [ ] **Collaboration Tools**: Real-time collaborative editing
- [ ] **Video Conferencing**: Built-in conference calling
- [ ] **Blockchain Integration**: Publication verification
- [ ] **Multi-language Support**: Internationalization
- [ ] **API Marketplace**: Third-party integrations

### Version History
- **v1.0.0** - Initial release with core features
- **v1.1.0** - Dark mode and mobile improvements
- **v1.2.0** - Advanced analytics dashboard
- **v2.0.0** - AI-powered features and glassmorphism UI

---

**Built with ❤️ for the academic community**

*Empowering researchers, scholars, and institutions worldwide with modern publishing technology.*
