import Badge from '@/components/ui/Badge';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/formatters';

interface CompareRowProps {
  label: string;
  zip1Value: number;
  zip2Value: number;
  format: 'currency' | 'percent' | 'number';
}

function formatValue(value: number, format: 'currency' | 'percent' | 'number'): string {
  switch (format) {
    case 'currency': return formatCurrency(value);
    case 'percent': return formatPercent(value);
    case 'number': return formatNumber(value);
  }
}

export default function CompareRow({ label, zip1Value, zip2Value, format }: CompareRowProps) {
  const diff = zip1Value !== 0 ? ((zip2Value - zip1Value) / zip1Value) * 100 : 0;
  const zip1Higher = zip1Value > zip2Value;
  const zip2Higher = zip2Value > zip1Value;

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-3 border-b border-border last:border-b-0 transition-colors duration-fast hover:bg-bg/50">
      <div className={`text-right ${zip1Higher ? 'text-primary font-semibold' : 'text-text-secondary'}`}>
        {formatValue(zip1Value, format)}
      </div>
      <div className="text-center min-w-[120px]">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        {diff !== 0 && (
          <Badge value={diff} unit="percent" className="mt-1" />
        )}
      </div>
      <div className={`text-left ${zip2Higher ? 'text-primary font-semibold' : 'text-text-secondary'}`}>
        {formatValue(zip2Value, format)}
      </div>
    </div>
  );
}
