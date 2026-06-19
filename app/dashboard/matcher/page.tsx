'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, TrendingUp, Zap } from 'lucide-react';

interface Resume {
  id: string;
  title: string;
}

interface MatchResult {
  id: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  createdAt: string;
}

export default function MatcherPage() {
  const { user } = useUser();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await fetch('/api/resumes');
      if (!res.ok) throw new Error('Failed to fetch resumes');
      const data = await res.json();
      setResumes(data.data || []);
    } catch (err) {
      console.error('Error fetching resumes:', err);
    }
  };

  const matchJob = async () => {
    if (!selectedResume || !jobTitle || !jobDescription) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/matcher/job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: selectedResume,
          jobTitle,
          jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Matching failed');
      }

      const data = await response.json();
      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Matching failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Description Matcher</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Match your resume against job descriptions to see how well you fit and what skills to develop
        </p>
      </div>

      <div className="grid gap-8">
        {/* Input Form */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-4">
            {/* Resume Selection */}
            <div>
              <label className="block text-sm font-medium">Select Resume</label>
              <select
                value={selectedResume}
                onChange={(e) => setSelectedResume(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
              >
                <option value="">Choose a resume...</option>
                {resumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium">Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium">Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={8}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
              />
            </div>

            <Button
              onClick={matchJob}
              disabled={!selectedResume || !jobTitle || !jobDescription || loading}
              className="w-full"
            >
              {loading ? 'Analyzing Match...' : 'Analyze Match'}
            </Button>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Match Score */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Overall Match Score</p>
                  <p className="text-3xl font-bold">{result.matchScore}%</p>
                </div>
                <div className="text-right">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {result.matchScore}%
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {result.matchScore >= 80
                  ? 'Great fit! You have most of the required skills.'
                  : result.matchScore >= 60
                  ? 'Good fit! Consider developing the missing skills.'
                  : 'Consider learning the missing skills before applying.'}
              </p>
            </div>

            {/* Matched Skills */}
            {result.matchedSkills.length > 0 && (
              <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Matched Skills ({result.matchedSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {result.missingSkills.length > 0 && (
              <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 flex items-center gap-2 font-semibold">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  Skills to Develop ({result.missingSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 flex items-center gap-2 font-semibold">
                  <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
