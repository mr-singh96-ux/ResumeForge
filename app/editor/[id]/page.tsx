'use client';

import { useState, useEffect } from 'react';
import { EditorPanel } from '@/components/editor/editor-panel';
import { ResumePreview } from '@/components/editor/resume-preview';
import { EditorToolbar } from '@/components/editor/toolbar';
import type { Resume } from '@/types';

export default function EditorPage({ params }: { params: { id: string } }) {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/resumes/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch resume');
        const data = await response.json();
        setResume(data.data);
      } catch (error) {
        console.error('Error loading resume:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [params.id]);

  const handleUpdateResume = async (updates: Partial<Resume>) => {
    if (!resume) return;

    try {
      setIsSaving(true);
      const response = await fetch(`/api/resumes/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to save resume');
      const data = await response.json();
      setResume(data.data);
    } catch (error) {
      console.error('Error saving resume:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-blue-600 rounded-full" />
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Resume not found
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            The resume you&apos;re looking for doesn&apos;t exist or has been deleted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950">
      <EditorToolbar resume={resume} isSaving={isSaving} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Editor */}
        <div className="flex-1 overflow-y-auto border-r border-slate-200 dark:border-slate-800">
          <EditorPanel
            resume={resume}
            onUpdate={handleUpdateResume}
          />
        </div>

        {/* Right Panel - Preview */}
        <div className="hidden lg:block w-1/2 overflow-y-auto bg-white dark:bg-slate-900">
          <ResumePreview resume={resume} />
        </div>
      </div>
    </div>
  );
}
