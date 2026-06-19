'use client';

import Link from 'next/link';
import { ArrowLeft, Download, Eye, Share2, Loader } from 'lucide-react';
import type { Resume } from '@/types';

interface EditorToolbarProps {
  resume: Resume;
  isSaving: boolean;
}

export function EditorToolbar({ resume, isSaving }: EditorToolbarProps) {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {resume.title}
          </h1>
          {isSaving && (
            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
              <Loader className="w-3 h-3 animate-spin" />
              Saving...
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors font-semibold text-sm">
          <Eye className="w-4 h-4" />
          Preview
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors font-semibold text-sm">
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:shadow-blue-600/50 transition-all font-semibold text-sm">
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    </header>
  );
}
