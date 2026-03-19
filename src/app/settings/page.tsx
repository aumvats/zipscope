'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-heading font-bold text-2xl text-text-primary mb-8">Account Settings</h1>

        <div className="bg-surface border border-border rounded-lg p-6 space-y-6 animate-fade-in-up">
          <div>
            <label className="text-sm font-medium text-text-secondary">Email</label>
            <p className="text-text-primary mt-1">Sign in to view your account details.</p>
          </div>

          <div>
            <label className="text-sm font-medium text-text-secondary">Current Plan</label>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-heading font-semibold text-text-primary">Free</span>
              <a href="/pricing" className="text-primary text-sm hover:underline transition-colors duration-fast">Upgrade</a>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <Button variant="secondary" onClick={() => {
              // Supabase signout would go here
              window.location.href = '/';
            }}>
              Sign Out
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
