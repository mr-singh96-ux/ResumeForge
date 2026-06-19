'use client';

import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-transparent blur-3xl -z-10" />

      <div className="text-center max-w-4xl mx-auto">
        <div className="inline-block mb-6">
          <span className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4" />
            AI-Powered Resume Creation
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6 leading-tight">
          Create Your Perfect Resume <br className="hidden md:block" /> in Minutes
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          ResumeForge AI uses advanced AI to generate professional, ATS-optimized resumes tailored for Indian job market. Stand out from the crowd with intelligent suggestions and premium templates.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/auth/sign-up"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 group"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="px-8 py-3 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-full font-semibold hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
            Watch Demo
          </button>
        </div>

        <div className="text-slate-600 dark:text-slate-400 text-sm mb-12">
          Free forever • No credit card required
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto pt-12 border-t border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">50K+</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Resumes Created</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">92%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">ATS Pass Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">30+ </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Templates</div>
          </div>
        </div>
      </div>
    </section>
  );
}
