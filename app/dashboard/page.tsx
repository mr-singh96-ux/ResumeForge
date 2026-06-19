'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Download, Copy, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { Resume } from '@/types';

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user's resumes
    const fetchResumes = async () => {
      try {
        setLoading(true);
        // TODO: Call API to fetch resumes
        setResumes([]);
      } catch (error) {
        console.error('Error fetching resumes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            My Resumes
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Create, edit, and manage your resumes
          </p>
        </div>
        <Link
          href="/dashboard/create"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:shadow-blue-600/50 transition-all font-semibold"
        >
          <Plus className="w-5 h-5" />
          New Resume
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin">
            <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-700 border-t-blue-600 rounded-full" />
          </div>
        </div>
      ) : resumes.length === 0 ? (
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-12 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
              <Edit2 className="w-8 h-8 text-slate-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No resumes yet
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Create your first resume to get started
          </p>
          <Link
            href="/dashboard/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            Create Your First Resume
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-1">
                    {resume.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Updated{' '}
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Link
                  href={`/editor/${resume.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-semibold"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Link>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-semibold">
                  <Download className="w-4 h-4" />
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-semibold">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-semibold">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
