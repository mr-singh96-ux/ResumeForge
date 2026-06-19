# ResumeForge AI - Deployment Guide

This guide walks through setting up and deploying ResumeForge AI to production on Vercel.

## Prerequisites

- Node.js 18+ and pnpm
- Vercel account
- Clerk account
- Google Cloud project with Apps Script API enabled
- Gemini API key
- Razorpay account
- ImageKit account (optional but recommended)

## Step 1: Local Development Setup

### 1.1 Clone and Install

```bash
git clone <your-repo>
cd resumeforge-ai
pnpm install
```

### 1.2 Environment Configuration

Copy `.env.local.example` to `.env.local` and fill in all required variables:

```bash
cp .env.local.example .env.local
```

### 1.3 Clerk Setup

1. Go to https://clerk.com and create an account
2. Create a new application
3. Copy your `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
4. In Clerk Dashboard:
   - Go to Settings > API Keys
   - Copy both keys to `.env.local`
5. Set up Webhooks:
   - Go to Settings > Webhooks
   - Add webhook for user events
   - Endpoint: `http://localhost:3000/api/webhooks/clerk`
   - Subscribe to: `user.created`, `user.updated`, `user.deleted`

### 1.4 Google Apps Script Backend

Create a Google Apps Script project with the following structure:

```javascript
// Code.gs - Deploy as Web App (accessible to anyone)

function doGet(e) {
  const action = e.parameter.action;
  
  switch(action) {
    case 'getUser':
      return getUser(e);
    case 'createUser':
      return createUser(e);
    case 'getUserResumes':
      return getUserResumes(e);
    // ... implement all other actions
    default:
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Unknown action'
      })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  return doGet(e);
}

// Database functions
function getUser(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Users');
  const data = sheet.getDataRange().getValues();
  // Implement logic
}

// Add more functions for each CRUD operation
```

### 1.5 Start Development Server

```bash
pnpm dev
```

Visit http://localhost:3000 to see the landing page.

## Step 2: Pre-Deployment Checklist

- [ ] All environment variables configured locally
- [ ] Clerk webhook tested and working
- [ ] Google Apps Script deployed and accessible
- [ ] Gemini API key tested
- [ ] Razorpay test keys configured
- [ ] All pages load without errors
- [ ] Authentication flow works
- [ ] Resume creation/editing works
- [ ] PDF export works
- [ ] Mobile responsive design verified

## Step 3: Deploy to Vercel

### 3.1 Create Vercel Project

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

Follow the prompts to:
- Link to GitHub repository (recommended)
- Set project name
- Confirm build settings

### 3.2 Set Environment Variables

In Vercel Dashboard:

1. Go to Settings > Environment Variables
2. Add all variables from `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = your_value
CLERK_SECRET_KEY = your_value
CLERK_WEBHOOK_SECRET = your_value
NEXT_PUBLIC_CLERK_SIGN_IN_URL = /auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL = /auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = /dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = /dashboard
GOOGLE_APPS_SCRIPT_URL = your_url
GEMINI_API_KEY = your_key
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY = your_key
IMAGEKIT_PRIVATE_KEY = your_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT = your_endpoint
RAZORPAY_KEY_ID = your_id
RAZORPAY_KEY_SECRET = your_secret
NEXT_PUBLIC_APP_URL = https://your-domain.com
```

### 3.3 Configure Clerk Webhook

1. Go to Clerk Dashboard > Settings > Webhooks
2. Add new webhook:
   - Endpoint: `https://your-vercel-domain.com/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`, `user.deleted`
3. Test webhook to ensure it's working

### 3.4 Deploy

```bash
vercel --prod
```

## Step 4: Post-Deployment Setup

### 4.1 Verify Deployment

1. Visit your Vercel URL
2. Test the following:
   - Landing page loads
   - Sign up works
   - Dashboard displays
   - Resume creation works
   - PDF export functions
   - All links work

### 4.2 Configure Custom Domain (Optional)

In Vercel Dashboard:

1. Go to Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Enable auto-refresh for SSL certificate

### 4.3 Set Up Monitoring

```bash
# Install Vercel Analytics
pnpm add @vercel/analytics
```

Add to layout.tsx:
```typescript
import { Analytics } from '@vercel/analytics/next';

// In component:
<Analytics />
```

### 4.4 Enable Edge Functions (Optional)

Configure edge locations in `vercel.json`:
```json
{
  "functions": {
    "api/**": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

## Step 5: Configure Payments

### 5.1 Razorpay Setup

1. Create account at https://razorpay.com
2. In dashboard, get API keys
3. Update environment variables
4. Set up test mode first:
   - Use test keys
   - Create test subscription
   - Verify webhook

### 5.2 Create Payment Plans

In Razorpay Dashboard:

1. Go to Plans
2. Create plans:
   - Free: ₹0 (manual)
   - Monthly: ₹199
   - Yearly: ₹1,499

### 5.3 Webhook Configuration

1. Go to Settings > Webhooks
2. Add endpoint: `https://your-domain.com/api/payments/webhook`
3. Subscribe to events:
   - `subscription.activated`
   - `subscription.paid`
   - `subscription.halted`
   - `subscription.cancelled`

## Step 6: Database Setup

### 6.1 Create Google Sheet

1. Create a new Google Sheet
2. Create tabs for:
   - Users
   - Resumes
   - Subscriptions
   - Payments
   - Downloads
   - Templates
   - AIUsage
   - ContactMessages

### 6.2 Set Up Service Account (Recommended)

For production, use a service account:

1. Create service account in Google Cloud Console
2. Create key and download JSON
3. Share Google Sheet with service account email
4. Update Apps Script to use service account authentication

### 6.3 Initialize Data

Run initialization script to populate:
- Default templates
- Sample data (for testing)

## Step 7: Performance Optimization

### 7.1 Enable Caching

Add caching headers in `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/api/**",
      "headers": [
        { "key": "Cache-Control", "value": "max-age=60" }
      ]
    },
    {
      "source": "/(.*\\.(js|css|ttf|otf|woff|woff2))",
      "headers": [
        { "key": "Cache-Control", "value": "max-age=31536000" }
      ]
    }
  ]
}
```

### 7.2 Enable Compression

Vercel automatically compresses responses - verify in browser DevTools.

### 7.3 Database Query Optimization

- Index frequently queried columns in Google Sheets
- Limit results returned from APIs
- Implement pagination

## Step 8: Security Hardening

### 8.1 Rate Limiting

Implement rate limiting for API routes:

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'),
});
```

### 8.2 CORS Configuration

```typescript
const allowedOrigins = [
  'https://your-domain.com',
  'https://www.your-domain.com',
];

export function setCORSHeaders(response: Response) {
  const origin = request.headers.get('origin');
  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  return response;
}
```

### 8.3 Content Security Policy

Add CSP headers in `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' ..."
        }
      ]
    }
  ]
}
```

### 8.4 Environment Variable Rotation

Regularly rotate sensitive keys:
- Regenerate Clerk webhook secret
- Rotate Razorpay API keys
- Refresh Gemini API key

## Step 9: Monitoring & Logging

### 9.1 Set Up Error Tracking

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### 9.2 Enable Analytics

- Vercel Analytics for performance
- Clerk analytics for authentication
- Custom analytics for business metrics

### 9.3 Set Up Alerts

Configure alerts for:
- API errors (500+)
- Failed deployments
- Unusual traffic patterns
- Payment processing failures

## Troubleshooting

### Build Failures

```bash
# Clear Vercel cache
vercel env pull
rm -rf .next
pnpm install
pnpm build
```

### Authentication Issues

- Verify Clerk webhook is returning 200
- Check webhook logs in Clerk Dashboard
- Ensure environment variables match

### API Errors

- Check Google Apps Script logs
- Verify service account permissions
- Test API endpoints with curl

### Payment Issues

- Verify Razorpay keys are correct
- Check webhook endpoint is accessible
- Review Razorpay logs

## Rollback Procedure

If deployment has critical issues:

```bash
# Revert to previous deployment
vercel rollback

# Or redeploy specific version
vercel --prod --force
```

## Maintenance

### Regular Tasks

- **Weekly**: Review error logs and fix bugs
- **Monthly**: Update dependencies, review security
- **Quarterly**: Database cleanup, analytics review
- **Annually**: Penetration testing, security audit

### Backup Strategy

- Backup Google Sheets daily
- Export critical data weekly
- Archive old deployments

## Support & Escalation

For issues:

1. Check Vercel Dashboard for status
2. Review error logs
3. Test locally to reproduce
4. Contact Vercel support if infrastructure issue
5. Contact Clerk/Razorpay support for their services

## Next Steps

After successful deployment:

1. Monitor analytics and error logs
2. Collect user feedback
3. Plan feature roadmap
4. Scale infrastructure as needed
5. Market the product

---

For detailed documentation, refer to:
- [Vercel Docs](https://vercel.com/docs)
- [Clerk Docs](https://clerk.com/docs)
- [Razorpay Docs](https://razorpay.com/docs/)
- [Google Apps Script Docs](https://developers.google.com/apps-script)
