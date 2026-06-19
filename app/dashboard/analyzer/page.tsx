'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Upload, Zap } from 'lucide-react';

interface AnalysisResult {
  id: string;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  atsScore: number;
  atsIssues: string[];
  keywordMatches: string[];
  missingKeywords: string[];
  createdAt: string;
}

export default function AnalyzerPage() {
  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setError('');
    }
  };

  const analyzeResume = async () => {
    if (!file) {
      setError('Please select a file to analyze');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const text = await file.text();

      const response = await fetch('/api/analyzer/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploadedFile: {
            name: file.name,
            content: text,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resume Analyzer</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Upload your resume to get AI-powered feedback and ATS optimization tips
        </p>
      </div>

      <div className="grid gap-8">
        {/* Upload Section */}
        <div className="rounded-lg border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900">
              <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="resume-upload"
            />
            <label htmlFor="resume-upload" className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>Select Resume ({file?.name || 'Click to upload'})</span>
              </Button>
            </label>
            <p className="text-sm text-slate-500">PDF, DOC, DOCX, or TXT • Max 5MB</p>
            <Button
              onClick={analyzeResume}
              disabled={!file || loading}
              className="mt-4 w-full"
            >
              {loading ? 'Analyzing...' : 'Analyze Resume'}
            </Button>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Scores */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Overall Score</p>
                    <p className="text-3xl font-bold">{analysis.overallScore}/100</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {analysis.overallScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">ATS Score</p>
                    <p className="text-3xl font-bold">{analysis.atsScore}/100</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {analysis.atsScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths */}
            {analysis.strengths.length > 0 && (
              <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Areas for Improvement */}
            {analysis.improvements.length > 0 && (
              <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 flex items-center gap-2 font-semibold">
                  <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  Areas to Improve
                </h3>
                <ul className="space-y-2">
                  {analysis.improvements.map((improvement, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-600 dark:bg-yellow-400" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ATS Issues */}
            {analysis.atsIssues.length > 0 && (
              <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 flex items-center gap-2 font-semibold">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  ATS Compatibility Issues
                </h3>
                <ul className="space-y-2">
                  {analysis.atsIssues.map((issue, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-400" />
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Keywords */}
            {analysis.keywordMatches.length > 0 && (
              <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 font-semibold">Matched Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordMatches.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Keywords */}
            {analysis.missingKeywords.length > 0 && (
              <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 font-semibold">Recommended Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
