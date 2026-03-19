import { formatCurrency } from '@/lib/utils/formatters';
import { NATIONAL_AVERAGES } from '@/lib/utils/nationalAverages';
import Badge from '@/components/ui/Badge';

interface HousingCardProps {
  medianHomeValue: number;
  medianRent: number;
}

export default function HousingCard({ medianHomeValue, medianRent }: HousingCardProps) {
  const homeDiff = ((medianHomeValue - NATIONAL_AVERAGES.medianHomeValue) / NATIONAL_AVERAGES.medianHomeValue) * 100;
  const rentDiff = ((medianRent - NATIONAL_AVERAGES.medianRent) / NATIONAL_AVERAGES.medianRent) * 100;

  return (
    <div className="bg-surface border border-border rounded-lg p-6 transition-shadow duration-normal hover:shadow-md">
      <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-3">
        Housing
      </h3>
      <div className="space-y-4">
        <div>
          <p className="text-xs text-text-secondary mb-0.5">Median Home Value</p>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-bold text-2xl text-text-primary">
              {formatCurrency(medianHomeValue)}
            </span>
            <Badge value={homeDiff} unit="percent" />
          </div>
        </div>
        <div>
          <p className="text-xs text-text-secondary mb-0.5">Median Rent</p>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-bold text-2xl text-text-primary">
              {formatCurrency(medianRent)}<span className="text-base font-normal text-text-secondary">/mo</span>
            </span>
            <Badge value={rentDiff} unit="percent" />
          </div>
        </div>
      </div>
    </div>
  );
}
