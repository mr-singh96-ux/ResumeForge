# ResumeForge AI - Quick Integration Guide

## Premium Features Quick Start

This guide helps you quickly integrate all 6 premium features into your dashboard.

---

## 1. Update Sidebar Navigation

Add these links to your dashboard sidebar in `components/dashboard/sidebar.tsx`:

```tsx
<Link href="/dashboard/analyzer">
  <Sparkles className="h-5 w-5" />
  Resume Analyzer
</Link>
<Link href="/dashboard/matcher">
  <Target className="h-5 w-5" />
  Job Matcher
</Link>
<Link href="/dashboard/chat">
  <MessageCircle className="h-5 w-5" />
  AI Chat
</Link>
<Link href="/dashboard/cover-letters">
  <FileText className="h-5 w-5" />
  Cover Letters
</Link>
```

---

## 2. Update Editor with Themes Panel

In `app/editor/[id]/page.tsx`, add the themes panel:

```tsx
import { ThemesPanel } from '@/components/editor/themes-panel';

export default function EditorPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-4">
      {/* Editor left side */}
      <div className="lg:col-span-3">
        {/* Your editor components */}
      </div>
      
      {/* Themes panel on right */}
      <div className="lg:col-span-1">
        <ThemesPanel resumeId={resumeId} />
      </div>
    </div>
  );
}
```

---

## 3. Version History in Editor

Add version history modal to editor:

```tsx
import { useState } from 'react';

export default function EditorPage() {
  const [versions, setVersions] = useState([]);
  
  const fetchVersions = async () => {
    const res = await fetch(`/api/resumes/${resumeId}/versions`);
    const data = await res.json();
    setVersions(data.data);
  };
  
  const restoreVersion = async (versionId: string) => {
    const res = await fetch(`/api/resumes/${resumeId}/versions/${versionId}/restore`, {
      method: 'POST'
    });
    // Refresh resume content
  };
  
  return (
    <Button onClick={fetchVersions}>
      View History
    </Button>
  );
}
```

---

## 4. Create Version on Save

In your resume save handler:

```tsx
const saveResume = async (content: ResumeContent) => {
  // Save main resume
  await fetch(`/api/resumes/${resumeId}`, {
    method: 'PUT',
    body: JSON.stringify({ content })
  });
  
  // Create version entry
  await fetch(`/api/resumes/${resumeId}/versions`, {
    method: 'POST',
    body: JSON.stringify({
      content,
      changeDescription: 'Manual save'
    })
  });
};
```

---

## 5. Update Dashboard Overview

Add feature cards to main dashboard:

```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  <FeatureCard 
    title="Resume Analyzer"
    description="AI feedback on your resume"
    href="/dashboard/analyzer"
    icon={Sparkles}
  />
  <FeatureCard 
    title="Job Matcher"
    description="Find skill gaps for jobs"
    href="/dashboard/matcher"
    icon={Target}
  />
  <FeatureCard 
    title="AI Chat"
    description="Career advice anytime"
    href="/dashboard/chat"
    icon={MessageCircle}
  />
  <FeatureCard 
    title="Cover Letters"
    description="Generate professional letters"
    href="/dashboard/cover-letters"
    icon={FileText}
  />
  <FeatureCard 
    title="Themes"
    description="One-click resume styling"
    href="/dashboard/editor"
    icon={Palette}
  />
  <FeatureCard 
    title="History"
    description="Version control for resumes"
    href="/dashboard"
    icon={Clock}
  />
</div>
```

---

## 6. Environment Setup

Ensure these are in your `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key
GEMINI_API_KEY=your_gemini_key
NEXT_PUBLIC_APP_URL=your_app_url
GOOGLE_APPS_SCRIPT_URL=your_script_url
```

---

## 7. Testing Each Feature

### Test Resume Analyzer
```bash
curl -X POST http://localhost:3000/api/analyzer/resume \
  -H "Content-Type: application/json" \
  -d '{
    "resumeContent": "Your resume text..."
  }'
```

### Test Job Matcher
```bash
curl -X POST http://localhost:3000/api/matcher/job \
  -H "Content-Type: application/json" \
  -d '{
    "resumeId": "resume_id",
    "jobTitle": "Software Engineer",
    "jobDescription": "Job description..."
  }'
```

### Test Chat
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I improve my resume?",
    "feature": "resume_help"
  }'
```

### Test Cover Letter
```bash
curl -X POST http://localhost:3000/api/cover-letter/generate \
  -H "Content-Type: application/json" \
  -d '{
    "jobTitle": "Senior Engineer",
    "companyName": "Tech Company",
    "jobDescription": "Job description..."
  }'
```

### Test Themes
```bash
curl -X GET http://localhost:3000/api/themes
```

---

## 8. Database Schema Setup

Add these columns to your Google Sheets (via Google Apps Script):

### ResumeAnalyses Sheet
- id, userId, resumeId, uploadedFileName, overallScore, strengths, improvements, atsScore, atsIssues, keywordMatches, missingKeywords, createdAt, updatedAt

### JobMatches Sheet
- id, userId, resumeId, jobTitle, jobDescription, matchScore, matchedSkills, missingSkills, recommendations, createdAt

### ResumeVersions Sheet
- id, resumeId, userId, content (JSON), versionNumber, changeDescription, createdAt

### CoverLetters Sheet
- id, userId, resumeId, jobTitle, companyName, content, isAIGenerated, createdAt, updatedAt

### ChatMessages Sheet
- id, userId, role, content, feature, createdAt

---

## 9. Monetization Setup

Update pricing to include premium features:

```tsx
const plans = [
  {
    name: 'Free',
    price: 0,
    features: [
      'Resume Analyzer: 2/month',
      'Job Matcher: 1/month',
      'Chat: Limited',
      'Cover Letters: 1/month',
      '2 Themes'
    ]
  },
  {
    name: 'Pro Monthly',
    price: 99,
    features: [
      'Unlimited Resume Analyzer',
      'Unlimited Job Matcher',
      'Unlimited Chat',
      'Unlimited Cover Letters',
      'All 6 Themes',
      'Version History'
    ]
  }
];
```

---

## 10. Analytics Integration

Track feature usage in `lib/utils/helpers.ts`:

```tsx
export async function trackFeatureUsage(feature: string, userId: string) {
  await sheetsService.recordAIUsage({
    userId,
    feature,
    tokensUsed: 500
  });
}
```

---

## File Structure Reference

```
app/
├── api/
│   ├── analyzer/
│   │   └── resume/
│   │       └── route.ts
│   ├── matcher/
│   │   └── job/
│   │       └── route.ts
│   ├── chat/
│   │   └── route.ts
│   ├── cover-letter/
│   │   ├── route.ts
│   │   ├── generate/
│   │   │   └── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   ├── themes/
│   │   └── route.ts
│   └── resumes/
│       └── [id]/
│           └── versions/
│               ├── route.ts
│               └── [versionId]/
│                   └── restore/
│                       └── route.ts
└── dashboard/
    ├── analyzer/
    │   └── page.tsx
    ├── matcher/
    │   └── page.tsx
    ├── chat/
    │   └── page.tsx
    ├── cover-letters/
    │   └── page.tsx
    └── ...
```

---

## Common Issues & Solutions

### Issue: Gemini API not responding
**Solution**: Check GEMINI_API_KEY is set and valid in environment variables

### Issue: Version history not saving
**Solution**: Ensure Google Sheets ResumeVersions sheet exists and has proper columns

### Issue: Chat responses too generic
**Solution**: Update the system prompt in `/api/chat/route.ts` for more personalization

### Issue: Themes not applying to resume
**Solution**: Ensure resume preview component uses theme colors from state

---

## Performance Tips

1. **Cache Gemini responses** for 5 minutes
2. **Lazy load theme previews** only when panel opens
3. **Batch version history** queries
4. **Debounce chat input** before sending

---

## Next Phase Features (Future)

- LinkedIn Profile Optimizer
- Referral Message Generator
- Referral & Affiliate System
- Resume Marketplace
- Advanced Job Search Dashboard
- Interview Preparation Module

---

For detailed documentation of each feature, see `PREMIUM_FEATURES.md`
