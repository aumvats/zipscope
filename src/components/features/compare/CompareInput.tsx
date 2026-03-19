'use client';

import { useState, FormEvent } from 'react';
import Button from '@/components/ui/Button';

interface CompareInputProps {
  defaultZip1?: string;
  defaultZip2?: string;
  onCompare: (zip1: string, zip2: string) => void;
  loading?: boolean;
}

export default function CompareInput({ defaultZip1 = '', defaultZip2 = '', onCompare, loading }: CompareInputProps) {
  const [zip1, setZip1] = useState(defaultZip1);
  const [zip2, setZip2] = useState(defaultZip2);
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const z1 = zip1.trim();
    const z2 = zip2.trim();

    if (!/^\d{5}$/.test(z1) || !/^\d{5}$/.test(z2)) {
      setError('Please enter two valid 5-digit US ZIP codes.');
      return;
    }

    if (z1 === z2) {
      setError('Please enter two different ZIP codes.');
      return;
    }

    setError('');
    onCompare(z1, z2);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
      <input
        type="text"
        inputMode="numeric"
        maxLength={5}
        value={zip1}
        onChange={e => { setZip1(e.target.value.replace(/\D/g, '')); if (error) setError(''); }}
        placeholder="ZIP #1"
        className="w-32 px-4 py-2.5 border border-border rounded-lg text-center font-body text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-fast"
      />
      <span className="text-text-secondary font-medium">vs.</span>
      <input
        type="text"
        inputMode="numeric"
        maxLength={5}
        value={zip2}
        onChange={e => { setZip2(e.target.value.replace(/\D/g, '')); if (error) setError(''); }}
        placeholder="ZIP #2"
        className="w-32 px-4 py-2.5 border border-border rounded-lg text-center font-body text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-fast"
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Compare'}
      </Button>
      {error && <p className="text-sm text-error">{error}</p>}
    </form>
  );
}
