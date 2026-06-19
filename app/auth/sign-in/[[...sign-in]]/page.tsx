import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            ResumeForge AI
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Sign in to your account
          </p>
        </div>

        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
              card: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg',
              headerTitle: 'text-slate-900 dark:text-white',
              headerSubtitle: 'text-slate-600 dark:text-slate-400',
              socialButtonsBlockButton: 'border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
              dividerLine: 'bg-slate-200 dark:bg-slate-800',
              dividerText: 'text-slate-600 dark:text-slate-400',
              footerActionLink: 'text-blue-600 hover:text-blue-700',
            },
          }}
        />
      </div>
    </div>
  );
  
}
