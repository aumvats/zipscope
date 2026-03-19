'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  defaultValue?: string;
  size?: 'md' | 'lg';
  className?: string;
}

export default function SearchBar({ defaultValue = '', size = 'md', className = '' }: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState('');
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const zip = value.trim();

    if (!/^\d{5}$/.test(zip)) {
      setError("That doesn't look like a US ZIP code. Please enter 5 digits.");
      return;
    }

    setError('');
    router.push(`/search/${zip}`);
  }

  const isLarge = size === 'lg';

  return (
    <form onSubmit={handleSubmit} role="search" aria-label="ZIP code search" className={`w-full max-w-lg ${className}`}>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          maxLength={5}
          value={value}
          onChange={e => {
            setValue(e.target.value.replace(/\D/g, ''));
            if (error) setError('');
          }}
          aria-label="US ZIP code"
          placeholder="Enter a US ZIP code (e.g., 90210)"
          className={`w-full border rounded-lg font-body text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-fast ${
            error ? 'border-error' : 'border-border'
          } ${isLarge ? 'px-5 py-4 text-lg pr-24' : 'px-4 py-2.5 text-[15px] pr-20'}`}
        />
        <button
          type="submit"
          className={`absolute right-2 bg-primary text-white font-medium rounded-md hover:bg-primary/90 active:scale-[0.98] transition-all duration-fast ${
            isLarge ? 'top-2 px-4 py-2 text-base' : 'top-1.5 px-3 py-1.5 text-sm'
          }`}
        >
          Search
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-error">{error}</p>
      )}
    </form>
  );
}
