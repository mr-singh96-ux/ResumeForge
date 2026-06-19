'use client';

import { Sparkles, Zap, BarChart3, Download, Lock, Smartphone } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Suggestions',
    description: 'Get intelligent recommendations for professional summaries, achievements, and skills from our advanced AI.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Create a polished resume in minutes, not hours. Start from scratch or import your LinkedIn profile.',
  },
  {
    icon: BarChart3,
    title: 'ATS Optimization',
    description: 'Our resumes are optimized for Applicant Tracking Systems. Get tips to improve your resume score.',
  },
  {
    icon: Download,
    title: 'Multiple Formats',
    description: 'Download your resume as PDF or DOCX. Export directly to job applications with one click.',
  },
  {
    icon: Lock,
    title: 'Your Data is Safe',
    description: 'Bank-level encryption protects your personal information. Your data never leaves your control.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Edit your resume anywhere, anytime. Full mobile support for on-the-go edits.',
  },
];

export function Features() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Powerful features designed for your success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
