export default function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-surface border border-border rounded-lg p-6 animate-pulse ${className}`}>
      <div className="h-4 bg-border/60 rounded w-1/3 mb-4" />
      <div className="h-8 bg-border/60 rounded w-2/3 mb-3" />
      <div className="h-3 bg-border/60 rounded w-1/2" />
    </div>
  );
}
