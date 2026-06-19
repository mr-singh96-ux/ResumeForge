'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, Download, Trash2 } from 'lucide-react';

interface CoverLetter {
  id: string;
  jobTitle: string;
  companyName: string;
  content: string;
  isAIGenerated: boolean;
  createdAt: string;
}

interface Resume {
  id: string;
  title: string;
}

export default function CoverLettersPage() {
  const { user } = useUser();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<CoverLetter | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResumes();
    fetchCoverLetters();
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

  const fetchCoverLetters = async () => {
    try {
      const res = await fetch('/api/cover-letter');
      if (!res.ok) throw new Error('Failed to fetch cover letters');
      const data = await res.json();
      setCoverLetters(data.data || []);
    } catch (err) {
      console.error('Error fetching cover letters:', err);
    }
  };

  const generateCoverLetter = async () => {
    if (!jobTitle || !companyName) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/cover-letter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: selectedResume,
          jobTitle,
          companyName,
          jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const data = await response.json();
      setSelectedLetter(data.data);
      setCoverLetters((prev) => [data.data, ...prev]);
      setJobTitle('');
      setCompanyName('');
      setJobDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const deleteCoverLetter = async (letterId: string) => {
    try {
      const res = await fetch(`/api/cover-letter/${letterId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      setCoverLetters((prev) => prev.filter((l) => l.id !== letterId));
      if (selectedLetter?.id === letterId) {
        setSelectedLetter(null);
      }
    } catch (err) {
      console.error('Error deleting cover letter:', err);
    }
  };

  const downloadCoverLetter = (letter: CoverLetter) => {
    const element = document.createElement('a');
    const file = new Blob([letter.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Cover_Letter_${letter.companyName}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex-1 space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cover Letter Generator</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Generate professional cover letters powered by AI
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 font-semibold">Generate New Cover Letter</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Resume (Optional)</label>
                <select
                  value={selectedResume}
                  onChange={(e) => setSelectedResume(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
                >
                  <option value="">None</option>
                  {resumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Job Title *</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Product Manager"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Company Name *</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., TechCorp Inc."
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Job Description (Optional)</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste job description for better personalization..."
                  rows={4}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
                />
              </div>

              <Button
                onClick={generateCoverLetter}
                disabled={loading || !jobTitle || !companyName}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Cover Letter'
                )}
              </Button>

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Display */}
        <div className="lg:col-span-2">
          {selectedLetter ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedLetter.companyName}</h2>
                    <p className="text-slate-600 dark:text-slate-400">{selectedLetter.jobTitle}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadCoverLetter(selectedLetter)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="prose max-w-none dark:prose-invert">
                  <div className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded bg-slate-50 p-4 text-sm dark:bg-slate-800">
                    {selectedLetter.content}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-900">
              <FileText className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-4 font-medium text-slate-600 dark:text-slate-400">
                Generate or select a cover letter to view
              </p>
            </div>
          )}

          {/* Recent Cover Letters */}
          {coverLetters.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-4 font-semibold">Recent Cover Letters</h3>
              <div className="space-y-2">
                {coverLetters.map((letter) => (
                  <div
                    key={letter.id}
                    className={`flex items-center justify-between rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                      selectedLetter?.id === letter.id
                        ? 'border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => setSelectedLetter(letter)}
                  >
                    <div>
                      <p className="font-medium">{letter.companyName}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {letter.jobTitle}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCoverLetter(letter.id);
                      }}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
