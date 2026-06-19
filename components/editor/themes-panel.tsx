'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

interface ThemesPanelProps {
  resumeId: string;
  onThemeApply?: (theme: Theme) => void;
}

export function ThemesPanel({ resumeId, onThemeApply }: ThemesPanelProps) {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const res = await fetch('/api/themes');
      if (!res.ok) throw new Error('Failed to fetch themes');
      const data = await res.json();
      setThemes(data.data);
      if (data.data.length > 0) {
        setSelectedTheme(data.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = async () => {
    if (!selectedTheme) return;

    setApplying(true);
    try {
      const response = await fetch('/api/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId,
          themeId: selectedTheme,
        }),
      });

      if (!response.ok) throw new Error('Failed to apply theme');

      const theme = themes.find((t) => t.id === selectedTheme);
      if (theme && onThemeApply) {
        onThemeApply(theme);
      }
    } catch (error) {
      console.error('Error applying theme:', error);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-slate-600 dark:text-slate-400">Loading themes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 flex items-center gap-2 font-semibold">
          <Palette className="h-4 w-4" />
          Theme Presets
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Choose from 6 professional themes
        </p>
      </div>

      <div className="grid gap-3">
        {themes.map((theme) => (
          <label
            key={theme.id}
            className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all ${
              selectedTheme === theme.id
                ? 'border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
            }`}
          >
            <input
              type="radio"
              name="theme"
              value={theme.id}
              checked={selectedTheme === theme.id}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="sr-only"
            />
            <div className="flex items-center gap-3">
              {/* Color preview */}
              <div className="flex gap-1">
                {[
                  theme.colors.primary,
                  theme.colors.secondary,
                  theme.colors.accent,
                ].map((color, idx) => (
                  <div
                    key={idx}
                    className="h-6 w-6 rounded border border-slate-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div>
                <p className="font-medium text-sm">{theme.name}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {theme.fonts.heading} / {theme.fonts.body}
                </p>
              </div>
            </div>
          </label>
        ))}
      </div>

      <Button
        onClick={applyTheme}
        disabled={applying}
        className="w-full"
      >
        {applying ? 'Applying...' : 'Apply Theme'}
      </Button>
    </div>
  );
}
