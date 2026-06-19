# ResumeForge AI - Architecture Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js Frontend App (React 19 + TypeScript)        │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Landing Page                                 │  │   │
│  │  │  - Hero Section                               │  │   │
│  │  │  - Features & Pricing                         │  │   │
│  │  │  - FAQ & Testimonials                         │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Dashboard                                     │  │   │
│  │  │  - Resume List                                │  │   │
│  │  │  - Template Gallery                           │  │   │
│  │  │  - User Settings                              │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Resume Editor                                │  │   │
│  │  │  - Editor Panel (Left)                        │  │   │
│  │  │  - Live Preview (Right)                       │  │   │
│  │  │  - AI Suggestions                             │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                  HTTP/HTTPS (REST API)
                           │
┌─────────────────────────────────────────────────────────────┐
│            VERCEL (Next.js API Routes + Edge)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Authentication & Middleware                        │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Clerk Authentication                         │  │   │
│  │  │  - Protected Routes                           │  │   │
│  │  │  - Session Management                         │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Layer (/api/*)                                │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │  Resumes API                                 │  │   │
│  │  │  - GET /resumes              [LIST]          │  │   │
│  │  │  - POST /resumes             [CREATE]        │  │   │
│  │  │  - GET /resumes/[id]         [READ]          │  │   │
│  │  │  - PUT /resumes/[id]         [UPDATE]        │  │   │
│  │  │  - DELETE /resumes/[id]      [DELETE]        │  │   │
│  │  │  - POST /resumes/[id]/export [PDF]           │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │  User API                                    │  │   │
│  │  │  - GET /user                                │  │   │
│  │  │  - PUT /user                                │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │  Webhook API                                 │  │   │
│  │  │  - POST /webhooks/clerk [User Events]       │  │   │
│  │  │  - POST /webhooks/razorpay [Payment Events] │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Service Layer                                      │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Data Service (Sheets Service)               │  │   │
│  │  │  - CRUD Operations                           │  │   │
│  │  │  - Data Transformation                       │  │   │
│  │  │  - Error Handling                            │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Utility Functions                            │  │   │
│  │  │  - Date Formatting                           │  │   │
│  │  │  - Text Processing                           │  │   │
│  │  │  - Validation                                │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
         │              │             │             │
         │              │             │             │
    HTTP │         HTTP │        HTTP │        HTTP │
         │              │             │             │
         ▼              ▼             ▼             ▼
    ┌────────┐   ┌──────────┐   ┌──────────┐   ┌────────┐
    │ Clerk  │   │ Google   │   │ Gemini   │   │Razorpay│
    │ Auth   │   │ Apps     │   │ API      │   │ API    │
    │        │   │ Script   │   │          │   │        │
    └────────┘   │ (Google  │   │          │   │        │
                 │ Sheets   │   │          │   │        │
                 │ Backend) │   │          │   │        │
                 └──────────┘   └──────────┘   └────────┘
                      │
                      ▼
                 ┌──────────┐
                 │ Google   │
                 │ Sheets   │
                 │ Database │
                 │          │
                 │ - Users  │
                 │ - Resumes│
                 │ - Subs   │
                 │ - Payments
                 │ - etc.   │
                 └──────────┘
```

## Detailed Component Architecture

### Frontend Architecture

```
app/
├── page.tsx (Landing)
│   └── components/landing/
│       ├── header.tsx
│       ├── hero.tsx
│       ├── features.tsx
│       ├── pricing.tsx
│       ├── faq.tsx
│       └── footer.tsx
│
├── auth/
│   ├── sign-in/
│   └── sign-up/
│
├── dashboard/
│   ├── layout.tsx (Dashboard Layout)
│   ├── page.tsx (Resume List)
│   ├── templates/page.tsx (Template Gallery)
│   └── components/dashboard/
│       ├── sidebar.tsx
│       └── topbar.tsx
│
└── editor/[id]/
    ├── page.tsx (Editor Page)
    └── components/editor/
        ├── toolbar.tsx
        ├── editor-panel.tsx
        ├── resume-preview.tsx
        └── ai-suggestions.tsx (Ready)
```

### Backend API Routes

```
api/
├── user/
│   └── route.ts (GET, PUT)
│
├── resumes/
│   ├── route.ts (GET, POST)
│   └── [id]/
│       ├── route.ts (GET, PUT, DELETE)
│       └── export/route.ts (PDF)
│
├── contact/
│   └── route.ts (POST)
│
├── webhooks/
│   ├── clerk/route.ts (User Events)
│   └── razorpay/route.ts (Payment Events)
│
└── (ai-endpoints - Ready for implementation)
    ├── generate-summary/route.ts
    ├── generate-achievements/route.ts
    ├── generate-skills/route.ts
    └── check-ats-score/route.ts
```

### Data Flow: Resume Creation

```
1. User clicks "Create Resume"
   │
2. Frontend navigates to /dashboard/create?templateId=X
   │
3. User selects template & enters title
   │
4. POST /api/resumes
   └── Payload:
       {
         title: "My Resume",
         templateId: "1",
         content: { personal: {...}, ... }
       }
   │
5. API Route (app/api/resumes/route.ts)
   └── Gets authenticated user via Clerk
   │
6. Calls sheetsService.createResume()
   │
7. Sheets Service makes HTTP call to Google Apps Script
   │
8. Google Apps Script
   └── Writes to "Resumes" sheet
   │
9. Returns resume object with ID
   │
10. API returns 201 with resume data
    │
11. Frontend redirects to /editor/{resumeId}
    │
12. Editor page fetches resume data
    │
13. User sees editor with their resume
```

### Data Flow: PDF Export

```
1. User clicks "Download" in editor
   │
2. POST /api/resumes/{id}/export
   │
3. API Route checks:
   ├── User is authenticated
   ├── User owns this resume
   └── Download limit not exceeded
   │
4. Gets subscription tier for download limits
   │
5. Records download in Google Sheets
   │
6. Generates PDF using jsPDF
   ├── Formats content
   ├── Applies styling
   └── Generates PDF blob
   │
7. Returns PDF file as attachment
   │
8. Browser downloads file as "{resume-title}.pdf"
```

### Data Flow: Authentication

```
1. User visits /auth/sign-up
   │
2. Clerk Sign-Up component renders
   │
3. User enters email & password
   │
4. Clerk validates & creates account
   │
5. Clerk sends webhook to Vercel
   └── POST /api/webhooks/clerk
       Payload: { type: "user.created", data: {...} }
   │
6. Webhook Handler
   ├── Extracts user data
   ├── Calls sheetsService.createUser()
   │
7. Google Apps Script
   └── Writes user to "Users" sheet
   │
8. User logged in and redirected to /dashboard
   │
9. Dashboard fetches user resumes via API
   │
10. User sees personalized dashboard
```

### Database Schema (Google Sheets)

```
┌─── Users ───────────────────────┐
│ id (Primary Key)               │
│ clerkId (FK to Clerk)          │
│ email                          │
│ name                           │
│ subscription (free/pro/yearly) │
│ createdAt                      │
└────────────────────────────────┘

┌─── Resumes ─────────────────────┐
│ id (Primary Key)               │
│ userId (FK to Users)           │
│ title                          │
│ templateId                     │
│ content (JSON)                 │
│ createdAt                      │
│ updatedAt                      │
│ isPinned                       │
└────────────────────────────────┘

┌─── Subscriptions ───────────────┐
│ id (Primary Key)               │
│ userId (FK to Users)           │
│ plan                           │
│ status                         │
│ startDate                      │
│ endDate                        │
│ razorpayId                     │
└────────────────────────────────┘

┌─── Payments ────────────────────┐
│ id (Primary Key)               │
│ userId (FK to Users)           │
│ amount                         │
│ razorpayPaymentId              │
│ razorpayOrderId                │
│ status                         │
│ createdAt                      │
└────────────────────────────────┘

┌─── Downloads ───────────────────┐
│ id (Primary Key)               │
│ userId (FK to Users)           │
│ resumeId (FK to Resumes)       │
│ format (pdf/docx)              │
│ createdAt                      │
└────────────────────────────────┘

┌─── Templates ───────────────────┐
│ id (Primary Key)               │
│ name                           │
│ category                       │
│ isPremium                      │
│ thumbnail                      │
│ colors (JSON)                  │
│ layout (JSON)                  │
└────────────────────────────────┘

┌─── AIUsage ─────────────────────┐
│ id (Primary Key)               │
│ userId (FK to Users)           │
│ feature (enum)                 │
│ tokensUsed                     │
│ createdAt                      │
└────────────────────────────────┘

┌─── ContactMessages ─────────────┐
│ id (Primary Key)               │
│ name                           │
│ email                          │
│ subject                        │
│ message                        │
│ status                         │
│ createdAt                      │
└────────────────────────────────┘
```

## Technology Stack & Justification

| Layer | Technology | Reason |
|-------|-----------|--------|
| **Frontend** | Next.js 16 | SSR, optimal performance, great DX |
| | React 19 | Latest features, stability, community |
| | TypeScript | Type safety, better DX, fewer bugs |
| | Tailwind CSS | Utility-first, consistent styling |
| | Shadcn UI | Accessible, unstyled components |
| **Authentication** | Clerk | Easy setup, webhooks, great UX |
| **Backend** | Next.js API | Monolithic, easy to deploy, integrated |
| **Database** | Google Sheets | Simple, no server setup, real-time collaboration |
| | Google Apps Script | Bridges Next.js and Sheets, flexible |
| **AI** | Google Gemini | Best price/performance, via API |
| **Payments** | Razorpay | India-focused, easy integration |
| **Images** | ImageKit | CDN, optimization, optional |
| **PDF** | jsPDF | Small bundle, client-side generation |
| **Deployment** | Vercel | Optimized for Next.js, great DX |

## Security Architecture

```
┌─────────────────────────────────────┐
│         User Request                │
└────────────┬────────────────────────┘
             │
    ┌────────▼────────┐
    │ middleware.ts   │ ← Route Protection
    │ (Clerk)         │
    └────────┬────────┘
             │
    ┌────────▼────────────────┐
    │ API Route Handler       │ ← Auth Check
    │ - Extract userId        │
    │ - Verify ownership      │
    └────────┬────────────────┘
             │
    ┌────────▼────────────────┐
    │ Input Validation        │ ← Sanitize
    │ - Schema validation     │
    │ - Type checking         │
    └────────┬────────────────┘
             │
    ┌────────▼────────────────┐
    │ Database Operation      │
    │ - parameterized queries │
    │ - user-scoped filters   │
    └────────┬────────────────┘
             │
    ┌────────▼────────────────┐
    │ Response Generation     │ ← Don't expose secrets
    │ - No sensitive data     │
    │ - Proper status codes   │
    └────────┬────────────────┘
             │
    ┌────────▼────────────────┐
    │ HTTPS Response          │
    │ (Vercel SSL/TLS)        │
    └─────────────────────────┘
```

## Scalability Considerations

### Current Setup (Start)
- Single Next.js instance on Vercel
- Google Sheets as database
- Direct API calls to Apps Script

### Phase 1 Optimization (1K-10K users)
- Enable ISR (Incremental Static Regeneration)
- Implement caching layer
- Database query optimization
- CDN for static assets (Vercel default)

### Phase 2 Scaling (10K-100K users)
- Migrate to dedicated database (PostgreSQL on Neon)
- Implement Redis caching
- Background jobs for heavy operations
- API rate limiting

### Phase 3 Enterprise (100K+ users)
- Multi-region deployment
- Database sharding
- Microservices architecture
- CDN for global distribution

## Monitoring & Observability

```
┌──────────────────────────────────┐
│    Vercel Analytics              │
│    - Page performance            │
│    - Core Web Vitals             │
│    - Error tracking              │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│    Application Logs              │
│    - API request logs            │
│    - Database operation logs     │
│    - Error logs                  │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│    Business Metrics              │
│    - Daily active users          │
│    - Resume creation rate        │
│    - Subscription conversions    │
│    - Feature usage               │
└──────────────────────────────────┘
```

## Deployment Pipeline

```
Git Push
   │
   ▼
GitHub Repository
   │
   ▼
Vercel Webhook
   │
   ▼
Build Phase
├── Install dependencies
├── Run TypeScript check
├── Build application
└── Create deployment
   │
   ▼
Preview Deployment
├── URL generated
├── Environment: staging
└── Manual testing allowed
   │
   ▼
(Manual Approval)
   │
   ▼
Production Deployment
├── Environment: production
├── Custom domain
└── SSL/TLS active
   │
   ▼
Health Checks
├── Smoke tests
├── Analytics tracking
└── Error monitoring
```

## Future Architecture Improvements

1. **Serverless Functions**
   - Offload heavy PDF generation to serverless functions
   - Email notifications via Cloud Functions

2. **Message Queue**
   - Use Upstash for background jobs
   - Batch processing for downloads

3. **Microservices**
   - Separate AI service
   - Separate payment service
   - Separate file service

4. **Advanced Caching**
   - Redis for session storage
   - CloudFront for CDN
   - Database query caching

5. **Real-time Features**
   - WebSocket for live collaboration
   - Real-time notifications
   - Activity feeds

---

This architecture is designed to be:
- **Simple** - Easy to understand and maintain
- **Scalable** - Can grow from 100 to 1M users
- **Secure** - Multiple layers of protection
- **Performant** - Optimized for speed
- **Maintainable** - Clean code and documentation
