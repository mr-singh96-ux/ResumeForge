'use client';

import { useState } from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import type { Resume } from '@/types';

interface EditorPanelProps {
  resume: Resume;
  onUpdate: (updates: Partial<Resume>) => void;
}

export function EditorPanel({ resume, onUpdate }: EditorPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['personal', 'professional'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updateContent = (section: string, value: any) => {
    onUpdate({
      content: {
        ...resume.content,
        [section]: value,
      },
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 space-y-4">
      {/* Personal Information */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900">
        <button
          onClick={() => toggleSection('personal')}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Personal Information
          </h3>
          <ChevronDown
            className={`w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform ${
              expandedSections.has('personal') ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.has('personal') && (
          <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
            <input
              type="text"
              placeholder="Full Name"
              defaultValue={resume.content.personal.fullName}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              defaultValue={resume.content.personal.email}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              placeholder="Phone"
              defaultValue={resume.content.personal.phone}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Location"
              defaultValue={resume.content.personal.location}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Professional Summary */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900">
        <button
          onClick={() => toggleSection('professional')}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Professional Summary
          </h3>
          <ChevronDown
            className={`w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform ${
              expandedSections.has('professional') ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.has('professional') && (
          <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
            <input
              type="text"
              placeholder="Professional Headline"
              defaultValue={resume.content.professional.headline}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Write a brief professional summary"
              defaultValue={resume.content.professional.summary}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors font-semibold text-sm">
              <Plus className="w-4 h-4" />
              AI Generate Summary
            </button>
          </div>
        )}
      </div>

      {/* Work Experience */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900">
        <button
          onClick={() => toggleSection('experience')}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Work Experience
          </h3>
          <ChevronDown
            className={`w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform ${
              expandedSections.has('experience') ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.has('experience') && (
          <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
            {resume.content.experience.length === 0 ? (
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-600 transition-colors font-semibold">
                <Plus className="w-4 h-4" />
                Add Experience
              </button>
            ) : (
              <div className="space-y-4">
                {resume.content.experience.map((exp, idx) => (
                  <div key={idx} className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {exp.position}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {exp.company}
                        </p>
                      </div>
                      <button className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900">
        <button
          onClick={() => toggleSection('skills')}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Skills
          </h3>
          <ChevronDown
            className={`w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform ${
              expandedSections.has('skills') ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.has('skills') && (
          <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex flex-wrap gap-2">
              {resume.content.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold"
                >
                  {skill.name}
                </span>
              ))}
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-semibold text-sm">
              <Plus className="w-4 h-4" />
              AI Generate Skills
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
