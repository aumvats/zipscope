'use client';

import Link from 'next/link';
import SearchBar from '@/components/ui/SearchBar';

interface HeaderProps {
  showSearch?: boolean;
}

export default function Header({ showSearch = true }: HeaderProps) {
  return (
    <header className="bg-surface border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="font-heading font-bold text-xl text-primary flex-shrink-0 hover:opacity-80 transition-opacity duration-fast">
          ZipScope
        </Link>
        {showSearch && (
          <div className="hidden sm:block flex-1 max-w-md mx-4">
            <SearchBar size="md" />
          </div>
        )}
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/compare" className="text-text-secondary hover:text-text-primary transition-colors duration-fast">
            Compare
          </Link>
          <Link href="/pricing" className="text-text-secondary hover:text-text-primary transition-colors duration-fast">
            Pricing
          </Link>
          <Link href="/dashboard" className="text-text-secondary hover:text-text-primary transition-colors duration-fast">
            My Reports
          </Link>
        </nav>
      </div>
    </header>
  );
}
