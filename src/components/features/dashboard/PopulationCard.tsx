import { formatNumber } from '@/lib/utils/formatters';

interface PopulationCardProps {
  total: number;
  maleTotal: number;
  femaleTotal: number;
}

export default function PopulationCard({ total, maleTotal, femaleTotal }: PopulationCardProps) {
  const malePercent = total > 0 ? Math.round((maleTotal / total) * 100) : 0;
  const femalePercent = total > 0 ? Math.round((femaleTotal / total) * 100) : 0;

  return (
    <div className="bg-surface border border-border rounded-lg p-6 transition-shadow duration-normal hover:shadow-md">
      <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-1">
        Total Population
      </h3>
      <div className="flex items-baseline gap-3">
        <span className="font-heading font-bold text-3xl text-text-primary">
          {formatNumber(total)}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-4 text-sm text-text-secondary">
        <span>{malePercent}% Male</span>
        <span>{femalePercent}% Female</span>
      </div>
      <div className="mt-2 h-2 rounded-full overflow-hidden bg-bg flex" role="img" aria-label={`Gender split: ${malePercent}% male, ${femalePercent}% female`}>
        <div className="bg-primary h-full" style={{ width: `${malePercent}%` }} />
        <div className="bg-accent h-full" style={{ width: `${femalePercent}%` }} />
      </div>
    </div>
  );
}
