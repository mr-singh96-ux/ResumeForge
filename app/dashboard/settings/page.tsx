'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Settings</h1>

      <p className="text-slate-500 mb-8">
        Manage your account preferences.
      </p>

      <div className="bg-white dark:bg-slate-900 border rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">
            Full Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Kiratbir Singh"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Professional Headline
          </label>

          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Full Stack Developer"
          />
        </div>

        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">
          Save Changes
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border rounded-xl p-6 mt-6">
        <h2 className="font-semibold text-red-600 mb-4">
          Subscription
        </h2>

        <p className="mb-4">
          Current Plan: <strong>Free</strong>
        </p>

        <button className="bg-purple-600 text-white px-5 py-2 rounded-lg">
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
}