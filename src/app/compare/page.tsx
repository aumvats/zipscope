'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CompareInput from '@/components/features/compare/CompareInput';
import CompareTable from '@/components/features/compare/CompareTable';
import SkeletonCard from '@/components/ui/SkeletonCard';
import ErrorCard from '@/components/ui/ErrorCard';
import type { CensusData, ZipInfo } from '@/lib/types';

interface CompareData {
  zip1Info: ZipInfo;
  zip2Info: ZipInfo;
  zip1Data: CensusData;
  zip2Data: CensusData;
}

function CompareContent() {
  const searchParams = useSearchParams();
  const initialZip1 = searchParams.get('zip1') || '';
  const initialZip2 = searchParams.get('zip2') || '';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<CompareData | null>(null);

  const handleCompare = useCallback(async (zip1: string, zip2: string) => {
    setLoading(true);
    setError('');

    try {
      const [z1Info, z2Info, z1Data, z2Data] = await Promise.all([
        fetch(`/api/zip-info?zip=${zip1}`).then(r => r.json()),
        fetch(`/api/zip-info?zip=${zip2}`).then(r => r.json()),
        fetch(`/api/census?zip=${zip1}`).then(r => r.json()),
        fetch(`/api/census?zip=${zip2}`).then(r => r.json()),
      ]);

      if (z1Data.error) throw new Error(`Data unavailable for ZIP ${zip1}`);
      if (z2Data.error) throw new Error(`Data unavailable for ZIP ${zip2}`);

      setData({
        zip1Info: z1Info,
        zip2Info: z2Info,
        zip1Data: z1Data,
        zip2Data: z2Data,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comparison data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialZip1 && initialZip2 && /^\d{5}$/.test(initialZip1) && /^\d{5}$/.test(initialZip2)) {
      handleCompare(initialZip1, initialZip2);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="flex justify-center mb-8">
        <CompareInput
          defaultZip1={initialZip1}
          defaultZip2={initialZip2}
          onCompare={handleCompare}
          loading={loading}
        />
      </div>

      {loading && (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {error && !loading && (
        <ErrorCard message={error} onRetry={() => {
          const z1 = data?.zip1Info.zip || initialZip1;
          const z2 = data?.zip2Info.zip || initialZip2;
          if (z1 && z2) handleCompare(z1, z2);
        }} />
      )}

      {data && !loading && !error && (
        <CompareTable
          zip1Info={data.zip1Info}
          zip2Info={data.zip2Info}
          zip1Data={data.zip1Data}
          zip2Data={data.zip2Data}
        />
      )}

      {!data && !loading && !error && (
        <div className="text-center py-16 text-text-secondary">
          Enter two ZIP codes above to compare their demographics.
        </div>
      )}
    </>
  );
}

export default function ComparePage() {
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-text-primary mb-2 text-center">
          Compare ZIP Codes
        </h1>
        <p className="text-text-secondary text-center mb-8">
          See two locations side-by-side with color-coded difference indicators.
        </p>

        <Suspense fallback={
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        }>
          <CompareContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
