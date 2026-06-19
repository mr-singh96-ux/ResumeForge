'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    description: 'Perfect for getting started',
    features: [
      '1 Resume',
      '5 Free Templates',
      'Basic AI Suggestions',
      '3 PDF Downloads/Month',
      'Basic ATS Check',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Pro Monthly',
    price: '₹199',
    period: '/month',
    description: 'For serious job seekers',
    features: [
      'Unlimited Resumes',
      'All 30+ Premium Templates',
      'Advanced AI Features',
      'Unlimited Downloads',
      'Cover Letter Generator',
      'LinkedIn Summary Generator',
      'Priority Support',
    ],
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    name: 'Pro Yearly',
    price: '₹1,499',
    period: '/year',
    description: 'Best value - Save 40%',
    features: [
      'Everything in Pro Monthly',
      'Save 40% vs Monthly',
      'Annual Discount',
      'Exclusive Templates',
      'Priority Email Support',
      'Bonus: Interview Tips Guide',
    ],
    cta: 'Get Yearly Plan',
    featured: false,
  },
];

export function Pricing() {
  return (
    <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Choose the plan that works for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-8 transition-all ${
                plan.featured
                  ? 'bg-white dark:bg-slate-800 border-2 border-blue-600 shadow-2xl shadow-blue-600/20 scale-105'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg'
              }`}
            >
              {plan.featured && (
                <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-semibold mb-4">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                {plan.description}
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-slate-600 dark:text-slate-400 ml-2">
                    {plan.period}
                  </span>
                )}
              </div>

              <Link
                href="/auth/sign-up"
                className={`block w-full py-3 rounded-lg font-semibold transition-all mb-8 text-center ${
                  plan.featured
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-600/50'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {plan.cta}
              </Link>

              <div className="space-y-4">
                {plan.features.map((feature, fidx) => (
                  <div key={fidx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
