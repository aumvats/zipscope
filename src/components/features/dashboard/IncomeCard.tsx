import { formatCurrency } from '@/lib/utils/formatters';
import { NATIONAL_AVERAGES } from '@/lib/utils/nationalAverages';
import Badge from '@/components/ui/Badge';

interface IncomeCardProps {
  medianIncome: number;
}

export default function IncomeCard({ medianIncome }: IncomeCardProps) {
  const diff = ((medianIncome - NATIONAL_AVERAGES.medianHouseholdIncome) / NATIONAL_AVERAGES.medianHouseholdIncome) * 100;

  return (
    <div className="bg-surface border border-border rounded-lg p-6 transition-shadow duration-normal hover:shadow-md">
      <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-1">
        Median Household Income
      </h3>
      <div className="flex items-baseline gap-3">
        <span className="font-heading font-bold text-3xl text-text-primary">
          {formatCurrency(medianIncome)}
        </span>
        <Badge value={diff} unit="percent" />
      </div>
      <p className="mt-2 text-sm text-text-secondary">
        vs. national median {formatCurrency(NATIONAL_AVERAGES.medianHouseholdIncome)}
      </p>
    </div>
  );
}
