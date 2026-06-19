'use client';

import { useState, useEffect } from 'react';
import { Lock, Plus } from 'lucide-react';
import Link from 'next/link';
import type { Template } from '@/types';

const SAMPLE_TEMPLATES: Template[] = [
  {
    id: '1',
    name: 'Modern Professional',
    description: 'Clean, modern design with blue accent colors',
    category: 'modern',
    isPremium: false,
    thumbnail: 'https://via.placeholder.com/300x400?text=Modern+Professional',
    preview: 'https://via.placeholder.com/600x800?text=Modern+Professional+Preview',
    layout: { columns: 2, spacing: 'normal', fontSize: 'medium' },
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#10b981',
      text: '#1f2937',
      background: '#ffffff',
    },
  },
  {
    id: '2',
    name: 'Minimalist',
    description: 'Simple and elegant, perfect for all industries',
    category: 'minimalist',
    isPremium: false,
    thumbnail: 'https://via.placeholder.com/300x400?text=Minimalist',
    preview: 'https://via.placeholder.com/600x800?text=Minimalist+Preview',
    layout: { columns: 1, spacing: 'compact', fontSize: 'small' },
    colors: {
      primary: '#000000',
      secondary: '#404040',
      accent: '#808080',
      text: '#1f2937',
      background: '#ffffff',
    },
  },
  {
    id: '3',
    name: 'Executive',
    description: 'Professional and sophisticated design',
    category: 'executive',
    isPremium: true,
    thumbnail: 'https://via.placeholder.com/300x400?text=Executive',
    preview: 'https://via.placeholder.com/600x800?text=Executive+Preview',
    layout: { columns: 2, spacing: 'spacious', fontSize: 'large' },
    colors: {
      primary: '#1f2937',
      secondary: '#374151',
      accent: '#fbbf24',
      text: '#111827',
      background: '#fafafa',
    },
  },
  {
    id: '4',
    name: 'Creative',
    description: 'For designers, creatives, and artists',
    category: 'creative',
    isPremium: true,
    thumbnail: 'https://via.placeholder.com/300x400?text=Creative',
    preview: 'https://via.placeholder.com/600x800?text=Creative+Preview',
    layout: { columns: 3, spacing: 'spacious', fontSize: 'medium' },
    colors: {
      primary: '#ec4899',
      secondary: '#db2777',
      accent: '#a21caf',
      text: '#1f2937',
      background: '#fce7f3',
    },
  },
  {
    id: '5',
    name: 'Technical',
    description: 'Perfect for developers and tech professionals',
    category: 'technical',
    isPremium: false,
    thumbnail: 'https://via.placeholder.com/300x400?text=Technical',
    preview: 'https://via.placeholder.com/600x800?text=Technical+Preview',
    layout: { columns: 2, spacing: 'normal', fontSize: 'medium' },
    colors: {
      primary: '#0f172a',
      secondary: '#1e293b',
      accent: '#06b6d4',
      text: '#0f172a',
      background: '#f8fafc',
    },
  },
  {
    id: '6',
    name: 'Academic',
    description: 'Ideal for students and educators',
    category: 'academic',
    isPremium: false,
    thumbnail: 'https://via.placeholder.com/300x400?text=Academic',
    preview: 'https://via.placeholder.com/600x800?text=Academic+Preview',
    layout: { columns: 1, spacing: 'normal', fontSize: 'medium' },
    colors: {
      primary: '#1e3a8a',
      secondary: '#1e40af',
      accent: '#0284c7',
      text: '#1f2937',
      background: '#ffffff',
    },
  },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(SAMPLE_TEMPLATES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'modern', label: 'Modern' },
    { id: 'minimalist', label: 'Minimalist' },
    { id: 'executive', label: 'Executive' },
    { id: 'creative', label: 'Creative' },
    { id: 'technical', label: 'Technical' },
    { id: 'academic', label: 'Academic' },
  ];

  const filteredTemplates =
    selectedCategory === 'all'
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Resume Templates
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Choose from {templates.length} professional templates
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg transition-colors font-semibold text-sm ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden hover:shadow-lg transition-all"
          >
            {/* Template Thumbnail */}
            <div className="relative aspect-[3/4] bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              {template.isPremium && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Pro
                </div>
              )}
            </div>

            {/* Template Info */}
            <div className="p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                {template.name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {template.description}
              </p>

              <Link
                href={`/dashboard/create?templateId=${template.id}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-semibold text-sm"
              >
                <Plus className="w-4 h-4" />
                Use Template
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
