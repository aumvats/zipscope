interface BadgeProps {
  value: number;
  unit?: 'percent' | 'absolute';
  className?: string;
}

export default function Badge({ value, unit = 'percent', className = '' }: BadgeProps) {
  if (value === 0) return null;

  const isPositive = value > 0;
  const color = isPositive ? 'text-success bg-success/10' : 'text-error bg-error/10';
  const arrow = isPositive ? '\u2191' : '\u2193';
  const formatted = unit === 'percent'
    ? `${isPositive ? '+' : ''}${value.toFixed(1)}%`
    : `${isPositive ? '+' : ''}${Math.round(value).toLocaleString()}`;

  return (
    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${color} ${className}`}>
      {arrow} {formatted}
    </span>
  );
}
