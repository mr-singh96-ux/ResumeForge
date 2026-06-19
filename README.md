# ResumeForge AI - AI-Powered Resume Builder

A comprehensive, production-ready SaaS platform for creating professional, ATS-optimized resumes with AI assistance. Specifically designed for Indian job seekers with support for Razorpay payments and Gemini AI.

## Features

- **AI-Powered Resume Generation**: Intelligent suggestions for summaries, achievements, and skills
- **30+ Professional Templates**: Modern, minimalist, executive, creative, technical, and academic designs
- **Drag-Drop Editor**: Intuitive resume editor with real-time preview
- **ATS Optimization**: Ensure your resume passes Applicant Tracking Systems
- **PDF Export**: Download resumes in PDF format with download limits for free users
- **User Authentication**: Secure Clerk-based authentication
- **Subscription Management**: Free, Pro Monthly (₹199), and Pro Yearly (₹1,499) plans
- **Google Sheets Backend**: All data stored securely in Google Sheets
- **Mobile Responsive**: Full mobile support for on-the-go editing

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Shadcn UI
- **Authentication**: Clerk
- **Backend**: Next.js API Routes
- **Database**: Google Sheets (via Google Apps Script Web App)
- **AI**: Google Gemini API
- **Payments**: Razorpay
- **File Storage**: ImageKit for profile images
- **PDF Generation**: jsPDF
- **Deployment**: Vercel

## Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── contact/           # Contact form submissions
│   │   ├── resumes/           # Resume CRUD operations
│   │   ├── user/              # User profile management
│   │   └── webhooks/clerk/    # Clerk webhook for user sync
│   ├── auth/                  # Clerk auth pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── contact/               # Contact page
│   ├── dashboard/             # Dashboard layout and pages
│   │   ├── templates/         # Template gallery
│   │   └── page.tsx           # Resume list
│   ├── editor/                # Resume editor
│   │   └── [id]/              # Editor page
│   ├── privacy/               # Privacy policy
│   ├── terms/                 # Terms of service
│   ├── layout.tsx             # Root layout with Clerk provider
│   └── page.tsx               # Landing page
├── components/
│   ├── dashboard/             # Dashboard components
│   │   ├── sidebar.tsx
│   │   └── topbar.tsx
│   ├── editor/                # Editor components
│   │   ├── editor-panel.tsx
│   │   ├── resume-preview.tsx
│   │   └── toolbar.tsx
│   └── landing/               # Landing page components
│       ├── faq.tsx
│       ├── features.tsx
│       ├── footer.tsx
│       ├── header.tsx
│       ├── hero.tsx
│       └── pricing.tsx
├── lib/
│   ├── auth/
│   │   └── clerk.ts           # Clerk utilities
│   ├── services/
│   │   └── sheets.ts          # Google Sheets API wrapper
│   └── utils/
│       └── helpers.ts         # Utility functions
├── types/
│   └── index.ts               # TypeScript type definitions
└── middleware.ts              # Clerk authentication middleware
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
CLERK_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Google Sheets API
GOOGLE_APPS_SCRIPT_URL=your_apps_script_url

# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd resumeforge-ai
pnpm install
```

### 2. Configure Clerk

1. Create a Clerk account at https://clerk.com
2. Create a new application
3. Copy your API keys to `.env.local`
4. Configure webhook for user events (POST to `/api/webhooks/clerk`)

### 3. Set Up Google Sheets Backend

1. Create a Google Apps Script project
2. Deploy as a web app accessible to anyone
3. Your script should handle:
   - User CRUD operations
   - Resume CRUD operations
   - Subscription management
   - Payment tracking
   - Download tracking
   - Contact messages

### 4. Configure Gemini API

1. Create a project in Google Cloud Console
2. Enable the Generative AI API
3. Create an API key
4. Add to `.env.local`

### 5. Set Up Razorpay

1. Create a Razorpay account
2. Get your API keys from the dashboard
3. Add to `.env.local`

### 6. Configure ImageKit (Optional)

1. Create an ImageKit account
2. Get your public key, private key, and URL endpoint
3. Add to `.env.local`

### 7. Deploy to Vercel

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Then redeploy
vercel --prod
```

## API Endpoints

### Resumes
- `GET /api/resumes` - List user resumes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes/[id]` - Get resume details
- `PUT /api/resumes/[id]` - Update resume
- `DELETE /api/resumes/[id]` - Delete resume
- `POST /api/resumes/[id]/export` - Export as PDF

### User
- `GET /api/user` - Get current user
- `PUT /api/user` - Update user profile

### Contact
- `POST /api/contact` - Submit contact form

### Webhooks
- `POST /api/webhooks/clerk` - Clerk user events

## Database Schema (Google Sheets)

The application uses the following Google Sheets:

1. **Users** - User profiles and subscription info
2. **Resumes** - Resume content and metadata
3. **Subscriptions** - Active subscriptions
4. **Payments** - Payment history
5. **Downloads** - Download tracking for usage limits
6. **Templates** - Resume templates
7. **AIUsage** - Track AI feature usage
8. **ContactMessages** - Contact form submissions

## Features Breakdown

### Authentication
- Clerk-based user authentication
- Automatic user sync to Google Sheets via webhooks
- Session management and protected routes

### Dashboard
- View all created resumes
- Resume management (edit, delete, duplicate)
- Template gallery with filtering
- User statistics and analytics

### Resume Editor
- Drag-drop resume sections
- Real-time preview
- AI-powered suggestions for content
- Support for 11 resume sections:
  - Personal Information
  - Professional Summary
  - Work Experience
  - Education
  - Skills
  - Certifications
  - Projects
  - Languages
  - Volunteering
  - References
  - Custom Sections

### Export & Download
- PDF export with professional formatting
- Download limit enforcement (3/month for free, unlimited for pro)
- DOCX export (future)

### Payments
- Razorpay integration for INR payments
- Three subscription tiers
- Webhook handling for payment events
- Invoice generation

### AI Features
- Professional summary generation
- Achievement description suggestions
- Skill extraction and suggestions
- ATS optimization tips
- Cover letter generation
- LinkedIn summary generation

## Performance Optimizations

- Server-side rendering for landing page
- Image optimization with ImageKit
- Lazy loading components
- Database query optimization
- Caching strategies
- Code splitting and dynamic imports

## Security Features

- Clerk-handled password hashing and session management
- Row-level security in Google Sheets via webhooks
- HTTPS enforcement
- CSRF protection
- XSS prevention through React's built-in sanitization
- Rate limiting on API routes
- Environment variable management

## Testing

```bash
# Run tests
pnpm test

# Run with coverage
pnpm test:coverage

# E2E tests
pnpm test:e2e
```

## Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Clerk webhook configured
- [ ] Google Apps Script deployed
- [ ] Gemini API key active
- [ ] Razorpay keys configured
- [ ] ImageKit configured (if using)
- [ ] Database schemas created in Google Sheets
- [ ] Custom domain configured
- [ ] SSL/TLS certificate installed
- [ ] Monitoring and logging set up
- [ ] Backup strategy in place

## Troubleshooting

### Clerk Authentication Issues
- Verify webhook is returning 200 status
- Check CORS settings
- Ensure environment variables are correct

### Google Sheets Integration
- Test API endpoint manually with curl
- Verify service account permissions
- Check if sheet exists and is accessible

### PDF Export Not Working
- Check jsPDF version compatibility
- Verify resume data structure
- Check browser console for errors

### Razorpay Payment Failures
- Verify key IDs in Vercel
- Test with Razorpay test keys first
- Check webhook configuration

## Future Enhancements

- LinkedIn profile import
- Cover letter builder
- Job application tracker
- Interview preparation tools
- Resume analytics and ATS scoring
- Collaborative editing
- Template marketplace
- Bulk resume export
- Mobile app
- Offline support

## License

This project is proprietary and confidential.

## Support

For support, email support@resumeforge.ai or visit https://resumeforge.ai/contact

## Contributors

Built with Next.js, Clerk, Google Sheets, and Vercel.

```
build-resumeforge-ai-platform
├─ app
│  ├─ api
│  │  ├─ analyzer
│  │  │  └─ resume
│  │  │     └─ route.ts
│  │  ├─ chat
│  │  │  └─ route.ts
│  │  ├─ contact
│  │  │  └─ route.ts
│  │  ├─ cover-letter
│  │  │  ├─ generate
│  │  │  │  └─ route.ts
│  │  │  ├─ route.ts
│  │  │  └─ [id]
│  │  │     └─ route.ts
│  │  ├─ matcher
│  │  │  └─ job
│  │  │     └─ route.ts
│  │  ├─ resumes
│  │  │  ├─ route.ts
│  │  │  └─ [id]
│  │  │     ├─ export
│  │  │     │  └─ route.ts
│  │  │     ├─ route.ts
│  │  │     └─ versions
│  │  │        ├─ route.ts
│  │  │        └─ [versionId]
│  │  │           └─ restore
│  │  │              └─ route.ts
│  │  ├─ themes
│  │  │  └─ route.ts
│  │  ├─ user
│  │  │  └─ route.ts
│  │  └─ webhooks
│  │     └─ clerk
│  │        └─ route.ts
│  ├─ auth
│  │  ├─ sign-in
│  │  │  └─ [[...sign-in]]
│  │  │     └─ page.tsx
│  │  └─ sign-up
│  │     └─ [[...sign-up]]
│  │        └─ page.tsx
│  ├─ contact
│  │  └─ page.tsx
│  ├─ dashboard
│  │  ├─ analyzer
│  │  │  └─ page.tsx
│  │  ├─ chat
│  │  │  └─ page.tsx
│  │  ├─ cover-letters
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ matcher
│  │  │  └─ page.tsx
│  │  ├─ page.tsx
│  │  └─ templates
│  │     └─ page.tsx
│  ├─ editor
│  │  └─ [id]
│  │     ├─ layout.tsx
│  │     └─ page.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ privacy
│  │  └─ page.tsx
│  └─ terms
│     └─ page.tsx
├─ ARCHITECTURE.md
├─ components
│  ├─ dashboard
│  │  ├─ sidebar.tsx
│  │  └─ topbar.tsx
│  ├─ editor
│  │  ├─ editor-panel.tsx
│  │  ├─ resume-preview.tsx
│  │  ├─ themes-panel.tsx
│  │  └─ toolbar.tsx
│  ├─ landing
│  │  ├─ faq.tsx
│  │  ├─ features.tsx
│  │  ├─ footer.tsx
│  │  ├─ header.tsx
│  │  ├─ hero.tsx
│  │  └─ pricing.tsx
│  └─ ui
│     └─ button.tsx
├─ components.json
├─ DEPLOYMENT.md
├─ DOCS_INDEX.md
├─ FEATURE_COMPARISON.md
├─ IMPLEMENTATION_CHECKLIST.md
├─ INTEGRATION_GUIDE.md
├─ lib
│  ├─ auth
│  │  └─ clerk.ts
│  ├─ services
│  │  └─ sheets.ts
│  ├─ utils
│  │  └─ helpers.ts
│  └─ utils.ts
├─ middleware.ts
├─ next-env.d.ts
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ pnpm-lock.yaml
├─ postcss.config.mjs
├─ PREMIUM_BUILD_SUMMARY.md
├─ PREMIUM_FEATURES.md
├─ PROJECT_SUMMARY.md
├─ public
│  ├─ apple-icon.png
│  ├─ icon-dark-32x32.png
│  ├─ icon-light-32x32.png
│  ├─ icon.svg
│  ├─ placeholder-logo.png
│  ├─ placeholder-logo.svg
│  ├─ placeholder-user.jpg
│  ├─ placeholder.jpg
│  └─ placeholder.svg
├─ README.md
├─ setup.sh
├─ tsconfig.json
└─ types
   └─ index.ts

```
```
build-resumeforge-ai-platform
├─ app
│  ├─ api
│  │  ├─ analyzer
│  │  │  └─ resume
│  │  │     └─ route.ts
│  │  ├─ chat
│  │  │  └─ route.ts
│  │  ├─ contact
│  │  │  └─ route.ts
│  │  ├─ cover-letter
│  │  │  ├─ generate
│  │  │  │  └─ route.ts
│  │  │  ├─ route.ts
│  │  │  └─ [id]
│  │  │     └─ route.ts
│  │  ├─ matcher
│  │  │  └─ job
│  │  │     └─ route.ts
│  │  ├─ resumes
│  │  │  ├─ route.ts
│  │  │  └─ [id]
│  │  │     ├─ export
│  │  │     │  └─ route.ts
│  │  │     ├─ route.ts
│  │  │     └─ versions
│  │  │        ├─ route.ts
│  │  │        └─ [versionId]
│  │  │           └─ restore
│  │  │              └─ route.ts
│  │  ├─ themes
│  │  │  └─ route.ts
│  │  ├─ user
│  │  │  └─ route.ts
│  │  └─ webhooks
│  │     └─ clerk
│  │        └─ route.ts
│  ├─ auth
│  │  ├─ sign-in
│  │  │  └─ [[...sign-in]]
│  │  │     └─ page.tsx
│  │  └─ sign-up
│  │     └─ [[...sign-up]]
│  │        └─ page.tsx
│  ├─ contact
│  │  └─ page.tsx
│  ├─ dashboard
│  │  ├─ analyzer
│  │  │  └─ page.tsx
│  │  ├─ chat
│  │  │  └─ page.tsx
│  │  ├─ cover-letters
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ matcher
│  │  │  └─ page.tsx
│  │  ├─ page.tsx
│  │  └─ templates
│  │     └─ page.tsx
│  ├─ editor
│  │  └─ [id]
│  │     ├─ layout.tsx
│  │     └─ page.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ privacy
│  │  └─ page.tsx
│  └─ terms
│     └─ page.tsx
├─ ARCHITECTURE.md
├─ components
│  ├─ dashboard
│  │  ├─ analytics
│  │  │  └─ page.tsx
│  │  ├─ settings
│  │  │  └─ page.tsx
│  │  ├─ sidebar.tsx
│  │  └─ topbar.tsx
│  ├─ editor
│  │  ├─ editor-panel.tsx
│  │  ├─ resume-preview.tsx
│  │  ├─ themes-panel.tsx
│  │  └─ toolbar.tsx
│  ├─ landing
│  │  ├─ faq.tsx
│  │  ├─ features.tsx
│  │  ├─ footer.tsx
│  │  ├─ header.tsx
│  │  ├─ hero.tsx
│  │  └─ pricing.tsx
│  └─ ui
│     └─ button.tsx
├─ components.json
├─ DEPLOYMENT.md
├─ DOCS_INDEX.md
├─ FEATURE_COMPARISON.md
├─ IMPLEMENTATION_CHECKLIST.md
├─ INTEGRATION_GUIDE.md
├─ lib
│  ├─ auth
│  │  └─ clerk.ts
│  ├─ services
│  │  └─ sheets.ts
│  ├─ utils
│  │  └─ helpers.ts
│  └─ utils.ts
├─ middleware.ts
├─ next-env.d.ts
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ pnpm-lock.yaml
├─ postcss.config.mjs
├─ PREMIUM_BUILD_SUMMARY.md
├─ PREMIUM_FEATURES.md
├─ PROJECT_SUMMARY.md
├─ public
│  ├─ apple-icon.png
│  ├─ icon-dark-32x32.png
│  ├─ icon-light-32x32.png
│  ├─ icon.svg
│  ├─ placeholder-logo.png
│  ├─ placeholder-logo.svg
│  ├─ placeholder-user.jpg
│  ├─ placeholder.jpg
│  └─ placeholder.svg
├─ README.md
├─ setup.sh
├─ tsconfig.json
└─ types
   └─ index.ts

```