'use client';

import type { Resume } from '@/types';
import { formatDateShort } from '@/lib/utils/helpers';

interface ResumePreviewProps {
  resume: Resume;
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  const { content, templateId } = resume;
  const { personal, professional, experience, education, skills } = content;

  // Modern template - sample layout
  return (
    <div className="bg-white p-12 min-h-screen" style={{ fontFamily: 'Calibri, sans-serif' }}>
      {/* Header */}
      <div className="mb-6 border-b-2 border-blue-600 pb-4">
        <h1 className="text-4xl font-bold text-slate-900 mb-1">
          {personal.fullName || 'Your Name'}
        </h1>
        <p className="text-xl text-blue-600 font-semibold mb-3">
          {professional.headline || 'Professional Headline'}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-slate-700">
          {personal.email && (
            <span>{personal.email}</span>
          )}
          {personal.phone && (
            <span>{personal.phone}</span>
          )}
          {personal.location && (
            <span>{personal.location}</span>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {professional.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-2 border-b-2 border-slate-300 pb-1">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-slate-700 leading-relaxed">
            {professional.summary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3 border-b-2 border-slate-300 pb-1">
            WORK EXPERIENCE
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="font-bold text-slate-900">
                    {exp.position}
                  </h3>
                  <span className="text-sm text-slate-600">
                    {formatDateShort(exp.startDate)} -{' '}
                    {exp.isCurrentlyWorking
                      ? 'Present'
                      : formatDateShort(exp.endDate)}
                  </span>
                </div>
                <p className="text-slate-700 font-semibold">
                  {exp.company} • {exp.location}
                </p>
                <p className="text-slate-700 mt-1 whitespace-pre-wrap">
                  {exp.description}
                </p>
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside mt-2 text-slate-700 space-y-1">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx} className="text-sm">
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3 border-b-2 border-slate-300 pb-1">
            EDUCATION
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="font-bold text-slate-900">
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </h3>
                  <span className="text-sm text-slate-600">
                    {formatDateShort(edu.startDate)} -{' '}
                    {formatDateShort(edu.endDate)}
                  </span>
                </div>
                <p className="text-slate-700 font-semibold">
                  {edu.school}
                </p>
                {edu.grade && (
                  <p className="text-sm text-slate-600">
                    GPA: {edu.grade}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3 border-b-2 border-slate-300 pb-1">
            SKILLS
          </h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
