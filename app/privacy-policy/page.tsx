import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Varona Academy',
};

const PrivacyPolicyPage = () => {
  return (
    <main className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-card rounded-2xl shadow-sm border border-border p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8 pb-8 border-b border-border">
          Effective Date: August 22, 2025
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            This Privacy Policy explains how Varona Academy ("Varona Academy", "we", "us", or "our") collects, uses, and shares your personal information when you use our website, mobile app, or related services. By using Varona Academy, you agree to this Privacy Policy.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Information you provide:</strong> name, email, photo, age, gender, language, payment info, and lesson data (messages, audio, video).</li>
              <li><strong className="text-foreground">Information from others:</strong> tutor notes, affiliate data, and social login info.</li>
              <li><strong className="text-foreground">Automatic data:</strong> IP address, device details, cookies, analytics, and limited biometric data for fraud prevention.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Provide and improve our tutoring services.</li>
              <li>Personalize lessons and content.</li>
              <li>Communicate with you about your account.</li>
              <li>Analyze usage and improve platform features.</li>
              <li>Prevent fraud and comply with law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. How We Share Information</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>With affiliates, service providers, and tutors.</li>
              <li>With analytics and advertising partners (Google, Meta).</li>
              <li>With legal authorities if required.</li>
              <li>In case of a business transfer or merger.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Cookies & Analytics</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use Google Analytics, Meta Pixel, and PostHog to improve user experience. You can opt out via NAI or DAA tools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use industry-standard safeguards, but no system is 100% secure. Protect your password and account credentials.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data is retained as long as necessary for service or legal obligations. You can delete your account at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. International Data Transfers</h2>
            <p className="text-muted-foreground leading-relaxed">
              Data is processed and stored in the United States. Using Varona Academy means you consent to this transfer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">8. Children’s Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              The main Varona Academy platform is not intended for children under 13 (or 16 where applicable). Varona Academy Kids has a separate privacy policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">9. Your Rights</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Access, correct, or delete your data.</li>
              <li>Opt out of marketing communications.</li>
              <li>Manage cookies and analytics preferences.</li>
              <li>Exercise region-specific rights (EEA, UK, Brazil, California, etc.).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">10. Updates</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. Continued use of Varona Academy constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions or requests, please contact us:
            </p>
            <div className="bg-muted/30 p-6 rounded-xl border border-border">
              <p className="font-semibold text-foreground">Varona Academy Inc.</p>
              <p className="text-muted-foreground mt-1">[ Your address ]</p>
              <button className="text-primary mt-4 font-medium hover:underline focus:outline-none">
                Contact Support
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;
