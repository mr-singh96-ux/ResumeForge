import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ResumeForge AI - AI-Powered Resume Builder',
  description: 'Create professional, ATS-optimized resumes in minutes with AI assistance. Perfect for Indian job seekers.',
  keywords: 'resume builder, AI resume, ATS-optimized, job application, India',
  authors: [{ name: 'ResumeForge AI' }],
  openGraph: {
    title: 'ResumeForge AI - AI-Powered Resume Builder',
    description: 'Create professional, ATS-optimized resumes with AI assistance',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
  <html
    lang="en"
    className={`${geistSans.variable} ${geistMono.variable} bg-white dark:bg-slate-950`}
  >
    <body className="font-sans antialiased">
      <ClerkProvider>
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </ClerkProvider>
    </body>
  </html>
);
}
