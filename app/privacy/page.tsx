import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';

export default function PrivacyPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <Header />

      <div className="flex-1 py-20 px-4">
        <div className="max-w-3xl mx-auto prose prose-invert dark:prose-invert">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
            Privacy Policy
          </h1>

          <div className="space-y-6 text-slate-700 dark:text-slate-300">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Introduction
              </h2>
              <p>
                ResumeForge AI (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the
                ResumeForge AI website. This page informs you of our policies regarding the
                collection, use, and disclosure of personal data when you use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Information Collection and Use
              </h2>
              <p>
                We collect several different types of information for various purposes to
                provide and improve our service to you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Personal Information: Name, email address, phone number, location</li>
                <li>Usage Data: Browser type, IP address, pages visited, time spent</li>
                <li>Resume Content: Information you provide in your resume</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Data Protection
              </h2>
              <p>
                The security of your data is important to us but remember that no method of
                transmission over the Internet is 100% secure. While we strive to use
                commercially acceptable means to protect your Personal Information, we cannot
                guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Changes to This Privacy Policy
              </h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any
                changes by posting the new Privacy Policy on this page and updating the
                &quot;effective date&quot; at the top of this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at
                privacy@resumeforge.ai
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
