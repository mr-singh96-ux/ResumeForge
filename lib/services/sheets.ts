import axios from 'axios';
import type {
  User,
  Resume,
  Subscription,
  Payment,
  Download,
  Template,
  AIUsage,
  ContactMessage,
  ResumeAnalysis,
  JobMatch,
  ResumeVersion,
  ResumeTheme,
  CoverLetter,
  LinkedInProfile,
  ReferralMessage,
  Referral,
  ChatMessage,
} from '@/types';

const SHEETS_API_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

interface SheetResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class SheetsService {
  private baseURL = SHEETS_API_URL;

  async request<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<T> {
  try {
    const url = `${this.baseURL}?action=${endpoint}`;

    const response =
      method === 'GET'
        ? await axios.get(url)
        : await axios.post(url, {
            action: endpoint,
            ...data,
          });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Request failed');
    }

    return response.data.data;
  } catch (error) {
    console.error('[Sheets] Error:', error);
    throw error;
  }
}

  // User operations
  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.request('createUser', 'POST', user);
  }

  async getUser(clerkId: string): Promise<User | null> {
    try {
      return await this.request(`getUser`, 'GET');
    } catch {
      return null;
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      return await this.request(`getUserById`, 'POST', { userId });
    } catch {
      return null;
    }
  }

  async updateUser(clerkId: string, updates: Partial<User>): Promise<User> {
    return this.request('updateUser', 'PUT', { clerkId, updates });
  }

  async deleteUser(clerkId: string): Promise<boolean> {
    const result = await this.request('deleteUser', 'DELETE', { clerkId });
    return result;
  }

  // Resume operations
  async createResume(resume: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>): Promise<Resume> {
    return this.request('createResume', 'POST', resume);
  }

  async getResume(resumeId: string): Promise<Resume | null> {
    try {
      return await this.request('getResume', 'POST', { resumeId });
    } catch {
      return null;
    }
  }

  async getUserResumes(userId: string): Promise<Resume[]> {
    try {
      return await this.request('getUserResumes', 'POST', { userId });
    } catch {
      return [];
    }
  }

  async updateResume(resumeId: string, updates: Partial<Resume>): Promise<Resume> {
    return this.request('updateResume', 'PUT', { resumeId, updates });
  }

  async deleteResume(resumeId: string): Promise<boolean> {
    const result = await this.request('deleteResume', 'DELETE', { resumeId });
    return result;
  }

  async duplicateResume(resumeId: string, newTitle: string): Promise<Resume> {
    return this.request('duplicateResume', 'POST', { resumeId, newTitle });
  }

  // Subscription operations
  async createSubscription(
    subscription: Omit<Subscription, 'id'>
  ): Promise<Subscription> {
    return this.request('createSubscription', 'POST', subscription);
  }

  async getSubscription(userId: string): Promise<Subscription | null> {
    try {
      return await this.request('getSubscription', 'POST', { userId });
    } catch {
      return null;
    }
  }

  async updateSubscription(userId: string, updates: Partial<Subscription>): Promise<Subscription> {
    return this.request('updateSubscription', 'PUT', { userId, updates });
  }

  async cancelSubscription(userId: string): Promise<boolean> {
    const result = await this.request('cancelSubscription', 'DELETE', { userId });
    return result;
  }

  // Payment operations
  async createPayment(payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    return this.request('createPayment', 'POST', payment);
  }

  async getPayment(paymentId: string): Promise<Payment | null> {
    try {
      return await this.request('getPayment', 'POST', { paymentId });
    } catch {
      return null;
    }
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    try {
      return await this.request('getUserPayments', 'POST', { userId });
    } catch {
      return [];
    }
  }

  async updatePayment(paymentId: string, updates: Partial<Payment>): Promise<Payment> {
    return this.request('updatePayment', 'PUT', { paymentId, updates });
  }

  // Download tracking
  async recordDownload(
    download: Omit<Download, 'id' | 'createdAt'>
  ): Promise<Download> {
    return this.request('recordDownload', 'POST', download);
  }

  async getDownloadCount(userId: string, period: 'month' | 'all' = 'month'): Promise<number> {
    try {
      const result = await this.request('getDownloadCount', 'POST', { userId, period });
      return result as number;
    } catch {
      return 0;
    }
  }

  // Template operations
  async getTemplates(): Promise<Template[]> {
    try {
      return await this.request('getTemplates');
    } catch {
      return [];
    }
  }

  async getTemplate(templateId: string): Promise<Template | null> {
    try {
      return await this.request('getTemplate', 'POST', { templateId });
    } catch {
      return null;
    }
  }

  async createTemplate(template: Omit<Template, 'id'>): Promise<Template> {
    return this.request('createTemplate', 'POST', template);
  }

  async updateTemplate(templateId: string, updates: Partial<Template>): Promise<Template> {
    return this.request('updateTemplate', 'PUT', { templateId, updates });
  }

  // AI Usage tracking
  async recordAIUsage(
    usage: Omit<AIUsage, 'id' | 'createdAt'>
  ): Promise<AIUsage> {
    return this.request('recordAIUsage', 'POST', usage);
  }

  async getAIUsage(userId: string, feature?: string): Promise<AIUsage[]> {
    try {
      return await this.request('getAIUsage', 'POST', { userId, feature });
    } catch {
      return [];
    }
  }

  // Contact messages
  async createContactMessage(
    message: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>
  ): Promise<ContactMessage> {
    return this.request('createContactMessage', 'POST', message);
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    try {
      return await this.request('getContactMessages');
    } catch {
      return [];
    }
  }

  async updateContactMessage(
    messageId: string,
    status: ContactMessage['status']
  ): Promise<ContactMessage> {
    return this.request('updateContactMessage', 'PUT', { messageId, status });
  }

  // Analytics
  async getAnalytics(): Promise<any> {
    try {
      return await this.request('getAnalytics');
    } catch {
      return null;
    }
  }

  // Resume Analysis
  async createResumeAnalysis(analysis: Omit<ResumeAnalysis, 'id' | 'createdAt' | 'updatedAt'>): Promise<ResumeAnalysis> {
    return this.request('createResumeAnalysis', 'POST', analysis);
  }

  async getResumeAnalysis(analysisId: string): Promise<ResumeAnalysis | null> {
    try {
      return await this.request('getResumeAnalysis', 'POST', { analysisId });
    } catch {
      return null;
    }
  }

  async getUserAnalyses(userId: string): Promise<ResumeAnalysis[]> {
    try {
      return await this.request('getUserAnalyses', 'POST', { userId });
    } catch {
      return [];
    }
  }

  // Job Matcher
  async createJobMatch(match: Omit<JobMatch, 'id' | 'createdAt'>): Promise<JobMatch> {
    return this.request('createJobMatch', 'POST', match);
  }

  async getJobMatches(userId: string): Promise<JobMatch[]> {
    try {
      return await this.request('getJobMatches', 'POST', { userId });
    } catch {
      return [];
    }
  }

  // Resume Version History
  async createResumeVersion(version: Omit<ResumeVersion, 'id'>): Promise<ResumeVersion> {
    return this.request('createResumeVersion', 'POST', version);
  }

  async getResumeVersions(resumeId: string): Promise<ResumeVersion[]> {
    try {
      return await this.request('getResumeVersions', 'POST', { resumeId });
    } catch {
      return [];
    }
  }

  async restoreResumeVersion(versionId: string): Promise<Resume> {
    return this.request('restoreResumeVersion', 'POST', { versionId });
  }

  // Themes
  async getAvailableThemes(): Promise<ResumeTheme[]> {
    try {
      return await this.request('getAvailableThemes');
    } catch {
      return [];
    }
  }

  async createCustomTheme(theme: Omit<ResumeTheme, 'id' | 'createdAt'>): Promise<ResumeTheme> {
    return this.request('createCustomTheme', 'POST', theme);
  }

  async applyTheme(resumeId: string, themeId: string): Promise<ResumeTheme> {
    return this.request('applyTheme', 'POST', { resumeId, themeId });
  }

  // Cover Letters
  async createCoverLetter(letter: Omit<CoverLetter, 'id' | 'createdAt' | 'updatedAt'>): Promise<CoverLetter> {
    return this.request('createCoverLetter', 'POST', letter);
  }

  async getCoverLetters(userId: string): Promise<CoverLetter[]> {
    try {
      return await this.request('getCoverLetters', 'POST', { userId });
    } catch {
      return [];
    }
  }

  async updateCoverLetter(letterId: string, updates: Partial<CoverLetter>): Promise<CoverLetter> {
    return this.request('updateCoverLetter', 'PUT', { letterId, updates });
  }

  async deleteCoverLetter(letterId: string): Promise<boolean> {
    const result = await this.request('deleteCoverLetter', 'DELETE', { letterId });
    return result;
  }

  // LinkedIn Profile
  async createLinkedInProfile(profile: Omit<LinkedInProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<LinkedInProfile> {
    return this.request('createLinkedInProfile', 'POST', profile);
  }

  async getLinkedInProfile(userId: string): Promise<LinkedInProfile | null> {
    try {
      return await this.request('getLinkedInProfile', 'POST', { userId });
    } catch {
      return null;
    }
  }

  async updateLinkedInProfile(profileId: string, updates: Partial<LinkedInProfile>): Promise<LinkedInProfile> {
    return this.request('updateLinkedInProfile', 'PUT', { profileId, updates });
  }

  // Referral Messages
  async createReferralMessage(message: Omit<ReferralMessage, 'id' | 'createdAt'>): Promise<ReferralMessage> {
    return this.request('createReferralMessage', 'POST', message);
  }

  async getReferralMessages(userId: string): Promise<ReferralMessage[]> {
    try {
      return await this.request('getReferralMessages', 'POST', { userId });
    } catch {
      return [];
    }
  }

  // Referrals
  async createReferral(referral: Omit<Referral, 'id'>): Promise<Referral> {
    return this.request('createReferral', 'POST', referral);
  }

  async getReferralCode(userId: string): Promise<string> {
    try {
      const result = await this.request('getReferralCode', 'POST', { userId });
      return result as string;
    } catch {
      return '';
    }
  }

  async getReferrals(userId: string): Promise<Referral[]> {
    try {
      return await this.request('getReferrals', 'POST', { userId });
    } catch {
      return [];
    }
  }

  async claimReferralReward(referralId: string): Promise<Referral> {
    return this.request('claimReferralReward', 'POST', { referralId });
  }

  // Chat Messages
  async createChatMessage(message: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<ChatMessage> {
    return this.request('createChatMessage', 'POST', message);
  }

  async getChatHistory(userId: string, feature: ChatMessage['feature']): Promise<ChatMessage[]> {
    try {
      return await this.request('getChatHistory', 'POST', { userId, feature });
    } catch {
      return [];
    }
  }
}

export const sheetsService = new SheetsService();
