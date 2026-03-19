import { formatNumber, formatPercent } from '@/lib/utils/formatters';
import { NATIONAL_AVERAGES } from '@/lib/utils/nationalAverages';
import Badge from '@/components/ui/Badge';

interface EmploymentCardProps {
  employmentRate: number;
  employed: number;
  unemployed: number;
}

export default function EmploymentCard({ employmentRate, employed, unemployed }: EmploymentCardProps) {
  const diff = employmentRate - NATIONAL_AVERAGES.employmentRate;

  return (
    <div className="bg-surface border border-border rounded-lg p-6 transition-shadow duration-normal hover:shadow-md">
      <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-1">
        Employment
      </h3>
      <div className="flex items-baseline gap-3">
        <span className="font-heading font-bold text-3xl text-text-primary">
          {formatPercent(employmentRate)}
        </span>
        <Badge value={diff} unit="percent" />
      </div>
      <p className="mt-1 text-sm text-text-secondary">
        vs. national {formatPercent(NATIONAL_AVERAGES.employmentRate)}
      </p>
      <div className="mt-3 flex gap-6 text-sm text-text-secondary">
        <span>{formatNumber(employed)} employed</span>
        <span>{formatNumber(unemployed)} unemployed</span>
      </div>
    </div>
  );
}
