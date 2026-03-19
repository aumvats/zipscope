import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DashboardShell from '@/components/features/dashboard/DashboardShell';
import ErrorCard from '@/components/ui/ErrorCard';
import { emptyZipInfo } from '@/lib/api/zippopotam';
import type { CensusData, ZipInfo } from '@/lib/types';

interface PageProps {
  params: { zip: string };
}

async function fetchFromAPI<T>(path: string): Promise<{ data?: T; error?: string }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}${path}`, { cache: 'no-store' });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { error: body.error || `Request failed with status ${res.status}` };
    }
    return { data: await res.json() };
  } catch {
    return { error: 'Failed to fetch data. Please try again.' };
  }
}

export async function generateMetadata({ params }: PageProps) {
  return {
    title: `ZIP ${params.zip} Demographics — ZipScope`,
    description: `Demographic report for ZIP code ${params.zip}: population, income, age, education, housing, and employment data.`,
  };
}

export default async function ZipDashboardPage({ params }: PageProps) {
  const { zip } = params;

  if (!/^\d{5}$/.test(zip)) {
    notFound();
  }

  const [zipInfoResult, censusResult] = await Promise.all([
    fetchFromAPI<ZipInfo>(`/api/zip-info?zip=${zip}`),
    fetchFromAPI<CensusData>(`/api/census?zip=${zip}`),
  ]);

  const zipInfo: ZipInfo = zipInfoResult.data || emptyZipInfo(zip);

  if (censusResult.error || !censusResult.data) {
    return (
      <>
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-12">
          <ErrorCard message={censusResult.error || 'Census data unavailable for this ZIP code.'} />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <DashboardShell zipInfo={zipInfo} censusData={censusResult.data} />
      </main>
      <Footer />
    </>
  );
}
