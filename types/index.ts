// User types
export interface User {
  id: string;
  email: string;
  name: string;
  clerkId: string;
  profileImage?: string;
  subscription: 'free' | 'monthly' | 'yearly';
  createdAt: string;
  updatedAt: string;
}

// Subscription types
export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  razorpaySubscriptionId?: string;
}

// Resume types
export interface Resume {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  content: ResumeContent;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
}

export interface ResumeContent {
  personal: PersonalInfo;
  professional: ProfessionalSummary;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  languages: Language[];
  volunteering: VolunteerExperience[];
  references: Reference[];
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  portfolio?: string;
  github?: string;
  profileImage?: string;
}

export interface ProfessionalSummary {
  headline: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrentlyWorking: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  grade?: string;
  activities?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  endorsements?: number;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  link?: string;
}

export interface Language {
  id: string;
  language: string;
  proficiency: 'basic' | 'intermediate' | 'fluent' | 'native';
}

export interface VolunteerExperience {
  id: string;
  role: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
}

// Template types
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  isPremium: boolean;
  thumbnail: string;
  preview: string;
  layout: TemplateLayout;
  colors: TemplateColors;
}

export interface TemplateLayout {
  columns: 1 | 2 | 3;
  spacing: 'compact' | 'normal' | 'spacious';
  fontSize: 'small' | 'medium' | 'large';
}

export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

// Payment types
export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  plan: 'monthly' | 'yearly';
  createdAt: string;
  updatedAt: string;
}

// Download tracking
export interface Download {
  id: string;
  userId: string;
  resumeId: string;
  format: 'pdf' | 'docx';
  createdAt: string;
}

// AI Usage tracking
export interface AIUsage {
  id: string;
  userId: string;
  feature: 'summary' | 'achievement' | 'skills' | 'ats' | 'cover_letter' | 'linkedin';
  tokensUsed: number;
  createdAt: string;
}

// Resume Analysis
export interface ResumeAnalysis {
  id: string;
  userId: string;
  resumeId?: string;
  uploadedFileName?: string;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  atsScore: number;
  atsIssues: string[];
  keywordMatches: string[];
  missingKeywords: string[];
  createdAt: string;
  updatedAt: string;
}

// Job Matcher
export interface JobMatch {
  id: string;
  userId: string;
  resumeId: string;
  jobTitle: string;
  jobDescription: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  createdAt: string;
}

// Resume Version History
export interface ResumeVersion {
  id: string;
  resumeId: string;
  userId: string;
  content: ResumeContent;
  versionNumber: number;
  changeDescription?: string;
  createdAt: string;
}

// Theme Settings
export interface ResumeTheme {
  id: string;
  userId: string;
  resumeId: string;
  themeId: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: 'compact' | 'normal' | 'spacious';
  createdAt: string;
}

// Cover Letter
export interface CoverLetter {
  id: string;
  userId: string;
  resumeId?: string;
  jobTitle: string;
  companyName: string;
  content: string;
  isAIGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

// LinkedIn Profile Data
export interface LinkedInProfile {
  id: string;
  userId: string;
  headline: string;
  summary: string;
  experience: string[];
  skills: string[];
  recommendations: string[];
  createdAt: string;
  updatedAt: string;
}

// Referral Message
export interface ReferralMessage {
  id: string;
  userId: string;
  recipientRole?: string;
  companyName?: string;
  content: string;
  isAIGenerated: boolean;
  createdAt: string;
}

// Referral & Affiliate Data
export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  referralCode: string;
  status: 'pending' | 'active' | 'completed';
  rewardEarned: number;
  bonusMonthsEarned: number;
  createdAt: string;
  completedAt?: string;
}

// Chat conversation
export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  feature: 'resume_help' | 'job_search' | 'interview' | 'general';
  createdAt: string;
}

// Contact messages
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
