'use client';

import SearchBar from '@/components/ui/SearchBar';

export default function HeroSection() {
  return (
    <section className="py-24 px-4 text-center">
      <h1 className="font-heading font-bold text-4xl md:text-5xl text-text-primary mb-4 tracking-tight animate-fade-in-up">
        Turn Census data into<br />client-ready reports
      </h1>
      <p className="text-text-secondary text-lg mb-10 max-w-xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '60ms' }}>
        Enter a ZIP code. Get professional demographics in 15 seconds.
        Export a polished PDF for your next client package.
      </p>
      <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: '120ms' }}>
        <SearchBar size="lg" />
      </div>
      <p className="text-text-secondary/60 text-sm mt-4 animate-fade-in-up" style={{ animationDelay: '180ms' }}>
        Free to use — no signup required
      </p>
    </section>
  );
}
