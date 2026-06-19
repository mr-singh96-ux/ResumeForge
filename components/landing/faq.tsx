'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Is ResumeForge AI really free?',
    answer:
      'Yes! You can create one resume, download 3 times per month, and access 5 free templates at no cost. Our Pro plans start at ₹199/month for unlimited resumes and downloads.',
  },
  {
    question: 'How does the AI help with my resume?',
    answer:
      'Our AI analyzes your experience and suggests professional summaries, achievement descriptions, and skills based on best practices for your industry. It also provides ATS optimization tips.',
  },
  {
    question: 'Can I download my resume in multiple formats?',
    answer:
      'Yes! You can download as PDF or DOCX. PDF is recommended for ATS compatibility and visual consistency.',
  },
  {
    question: 'Is my data safe and private?',
    answer:
      'Absolutely. We use bank-level encryption to protect your data. Your information is never shared with third parties and stored securely in our servers.',
  },
  {
    question: 'Can I edit my resume after creation?',
    answer:
      'Of course! You have full control over your resume. Edit any section anytime and regenerate suggestions with our AI as needed.',
  },
  {
    question: 'What does ATS optimization mean?',
    answer:
      'ATS (Applicant Tracking System) is software used by companies to filter resumes. Our AI formats your resume to ensure it passes ATS screening and reaches human recruiters.',
  },
];

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Everything you need to know about ResumeForge AI
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900/50 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <span className="text-lg font-semibold text-slate-900 dark:text-white text-left">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-blue-600 flex-shrink-0 transition-transform ${
                    openIdx === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIdx === idx && (
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
                  <p className="text-slate-600 dark:text-slate-400">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
