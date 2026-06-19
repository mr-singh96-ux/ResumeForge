import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';

export default function TermsPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <Header />

      <div className="flex-1 py-20 px-4">
        <div className="max-w-3xl mx-auto prose prose-invert dark:prose-invert">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
            Terms of Service
          </h1>

          <div className="space-y-6 text-slate-700 dark:text-slate-300">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using ResumeForge AI, you accept and agree to be bound by
                the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                2. Use License
              </h2>
              <p>
                Permission is granted to temporarily download one copy of the materials
                (information or software) on ResumeForge AI for personal, non-commercial
                transitory viewing only. This is the grant of a license, not a transfer of
                title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on the site</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                3. Disclaimer
              </h2>
              <p>
                The materials on ResumeForge AI are provided for informational purposes only.
                We make no warranties, expressed or implied, and hereby disclaim and negate
                all other warranties including, without limitation, implied warranties or
                conditions of merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                4. Limitations
              </h2>
              <p>
                In no event shall ResumeForge AI or its suppliers be liable for any damages
                (including, without limitation, damages for loss of data or profit, or due to
                business interruption) arising out of the use or inability to use the
                materials on the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                5. Accuracy of Materials
              </h2>
              <p>
                The materials appearing on ResumeForge AI could include technical,
                typographical, or photographic errors. ResumeForge AI does not warrant that
                any of the materials on the site are accurate, complete, or current.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                6. Links
              </h2>
              <p>
                ResumeForge AI has not reviewed all of the sites linked to its website and is
                not responsible for the contents of any such linked site. The inclusion of any
                link does not imply endorsement by ResumeForge AI of the site. Use of any such
                linked website is at the user&apos;s own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                7. Modifications
              </h2>
              <p>
                ResumeForge AI may revise these terms of service for the website at any time
                without notice. By using this website, you are agreeing to be bound by the
                then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                8. Governing Law
              </h2>
              <p>
                These terms and conditions are governed by and construed in accordance with
                the laws of India, and you irrevocably submit to the exclusive jurisdiction
                of the courts in that location.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
