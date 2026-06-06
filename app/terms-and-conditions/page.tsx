import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms & Conditions for Varona Academy',
};

const TermsAndConditionsPage = () => {
  return (
    <main className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-card rounded-2xl shadow-sm border border-border p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Terms & Conditions</h1>
        <p className="text-muted-foreground mb-8 pb-8 border-b border-border">
          Effective Date: December 01, 2025
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            Welcome to Varona Academy. These Terms & Conditions ("Terms") govern your use of Varona Academy's website and tutoring services. Please read them carefully before using our platform.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using Varona Academy, you agree to these Terms and our Privacy Policy. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Account Registration</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>You must provide accurate and complete information when creating an account.</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
              <li>You must be at least 13 years old (or 16 where applicable) to use Varona Academy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Use of Services</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Varona Academy provides online English tutoring and educational services.</li>
              <li>Users may connect with tutors for live video sessions.</li>
              <li>You agree to use Varona Academy only for lawful purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Payments</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Payment is required for booking lesson.</li>
              <li>All payments are processed securely through our third-party providers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. User Conduct</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Respectful communication is mandatory.</li>
              <li>Harassment, hate speech, or inappropriate content is strictly prohibited.</li>
              <li>Do not attempt to record or redistribute sessions without permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on Varona Academy (including text, images, videos, and trademarks) is owned by Varona Academy Inc. or its licensors. You may not reproduce or distribute it without permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              Varona Academy is not responsible for any indirect, incidental, or consequential damages arising from your use of the platform. Varona Academy does not guarantee any learning outcomes or performance results.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">8. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may suspend or terminate your account if you violate these Terms or engage in misuse. You can also close your account anytime through your settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">9. Modifications to Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may modify or discontinue any feature or service at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">10. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms are governed by the laws of the State of California, USA, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">11. Updates to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              Varona Academy may update these Terms from time to time. Continued use of the platform means you accept any revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">12. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about these Terms, please contact:
            </p>
            <div className="bg-muted/30 p-6 rounded-xl border border-border">
              <p className="font-semibold text-foreground">Varona Academy</p>
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

export default TermsAndConditionsPage;
