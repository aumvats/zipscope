'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CensusData, ZipInfo } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import { createBrowserSupabaseClient } from '@/lib/api/supabase';
import dynamic from 'next/dynamic';
import PopulationCard from './PopulationCard';
import IncomeCard from './IncomeCard';
import HousingCard from './HousingCard';
import EmploymentCard from './EmploymentCard';

const AgeChart = dynamic(() => import('./AgeChart'), {
  loading: () => <div className="bg-surface border border-border rounded-lg p-6 h-80 animate-pulse" />,
});
const EducationChart = dynamic(() => import('./EducationChart'), {
  loading: () => <div className="bg-surface border border-border rounded-lg p-6 h-80 animate-pulse" />,
});

interface DashboardShellProps {
  zipInfo: ZipInfo;
  censusData: CensusData;
}

export default function DashboardShell({ zipInfo, censusData }: DashboardShellProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [exporting, setExporting] = useState(false);

  const location = [zipInfo.city, zipInfo.state].filter(Boolean).join(', ');
  const title = location ? `${location} ${zipInfo.zip}` : `ZIP ${zipInfo.zip}`;

  async function handleExportPDF() {
    setExporting(true);
    try {
      const res = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zip: zipInfo.zip,
          city: zipInfo.city,
          state: zipInfo.state,
          data: censusData,
        }),
      });
      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ZipScope-${location || zipInfo.zip}-Report.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('PDF downloaded successfully', 'success');
    } catch {
      showToast('Export failed. Please try again.', 'error');
    } finally {
      setExporting(false);
    }
  }

  async function handleSaveReport() {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        showToast('Sign in to save reports', 'info');
        return;
      }
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          zip_code: zipInfo.zip,
          city: zipInfo.city,
          state: zipInfo.state,
          data_snapshot: censusData,
          report_type: 'single',
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        showToast(data.error || 'Failed to save report', 'error');
        return;
      }
      showToast('Report saved!', 'success');
    } catch {
      showToast('Failed to save report', 'error');
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-text-primary">{title}</h1>
          <p className="text-sm text-text-secondary mt-1">
            Source: U.S. Census Bureau, ACS 5-Year Estimates
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push(`/compare?zip1=${zipInfo.zip}`)}
          >
            Compare
          </Button>
          <Button variant="secondary" size="sm" onClick={handleSaveReport}>
            Save Report
          </Button>
          <Button size="sm" onClick={handleExportPDF} disabled={exporting}>
            {exporting ? 'Generating...' : 'Export PDF'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-grid">
        <PopulationCard
          total={censusData.totalPopulation}
          maleTotal={censusData.maleTotal}
          femaleTotal={censusData.femaleTotal}
        />
        <IncomeCard medianIncome={censusData.medianHouseholdIncome} />
        <AgeChart ageGroups={censusData.ageGroups} />
        <EducationChart levels={censusData.educationLevels} />
        <HousingCard
          medianHomeValue={censusData.medianHomeValue}
          medianRent={censusData.medianRent}
        />
        <EmploymentCard
          employmentRate={censusData.employmentRate}
          employed={censusData.employed}
          unemployed={censusData.unemployed}
        />
      </div>
    </div>
  );
}
