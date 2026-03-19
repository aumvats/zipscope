import type { CensusData, ZipInfo } from '@/lib/types';
import CompareRow from './CompareRow';

interface CompareTableProps {
  zip1Info: ZipInfo;
  zip2Info: ZipInfo;
  zip1Data: CensusData;
  zip2Data: CensusData;
}

export default function CompareTable({ zip1Info, zip2Info, zip1Data, zip2Data }: CompareTableProps) {
  const zip1Label = [zip1Info.city, zip1Info.state].filter(Boolean).join(', ') || `ZIP ${zip1Info.zip}`;
  const zip2Label = [zip2Info.city, zip2Info.state].filter(Boolean).join(', ') || `ZIP ${zip2Info.zip}`;

  return (
    <div className="bg-surface border border-border rounded-lg p-6 animate-fade-in-up">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 pb-4 border-b-2 border-border mb-2">
        <div className="text-right">
          <h2 className="font-heading font-semibold text-lg text-text-primary">{zip1Label}</h2>
          <p className="text-sm text-text-secondary">{zip1Info.zip}</p>
        </div>
        <div className="text-center min-w-[120px] text-sm font-medium text-text-secondary">vs.</div>
        <div className="text-left">
          <h2 className="font-heading font-semibold text-lg text-text-primary">{zip2Label}</h2>
          <p className="text-sm text-text-secondary">{zip2Info.zip}</p>
        </div>
      </div>

      <CompareRow label="Population" zip1Value={zip1Data.totalPopulation} zip2Value={zip2Data.totalPopulation} format="number" />
      <CompareRow label="Median Income" zip1Value={zip1Data.medianHouseholdIncome} zip2Value={zip2Data.medianHouseholdIncome} format="currency" />
      <CompareRow label="Home Value" zip1Value={zip1Data.medianHomeValue} zip2Value={zip2Data.medianHomeValue} format="currency" />
      <CompareRow label="Median Rent" zip1Value={zip1Data.medianRent} zip2Value={zip2Data.medianRent} format="currency" />
      <CompareRow label="Employment Rate" zip1Value={zip1Data.employmentRate} zip2Value={zip2Data.employmentRate} format="percent" />
      <CompareRow label="Employed" zip1Value={zip1Data.employed} zip2Value={zip2Data.employed} format="number" />
    </div>
  );
}
