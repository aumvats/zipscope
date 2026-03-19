'use client';

import Button from './Button';

interface ErrorCardProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorCard({
  message = 'Something went wrong. Please try again.',
  onRetry,
  className = '',
}: ErrorCardProps) {
  return (
    <div className={`bg-surface border border-error/20 rounded-lg p-6 text-center animate-fade-in ${className}`}>
      <div className="text-error text-2xl mb-3">
        <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      </div>
      <p className="text-text-secondary text-[15px] mb-4">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
