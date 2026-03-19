import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="text-center max-w-md">
        <div className="font-heading font-bold text-6xl text-primary mb-4">404</div>
        <h1 className="font-heading font-bold text-2xl text-text-primary mb-2">Page not found</h1>
        <p className="text-text-secondary mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
        >
          Go to homepage
        </Link>
      </div>
    </div>
  );
}
