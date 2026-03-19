'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DashboardShell from '@/components/features/dashboard/DashboardShell';
import SkeletonCard from '@/components/ui/SkeletonCard';
import ErrorCard from '@/components/ui/ErrorCard';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import type { Report, CensusData } from '@/lib/types';
import { getAuthHeaders } from '@/lib/api/supabase';
import { emptyZipInfo } from '@/lib/api/zippopotam';

export default function SavedReportPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadReport() {
    setLoading(true);
    setError('');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/reports/${params.id}`, { headers });
      if (!res.ok) throw new Error('Report not found');
      const data = await res.json();
      setReport(data);
    } catch {
      setError('Failed to load report.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadReport(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDelete() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/reports/${params.id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error('Delete failed');
      showToast('Report deleted', 'success');
      router.push('/dashboard');
    } catch {
      showToast('Failed to delete report', 'error');
    }
  }

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {error && !loading && (
          <ErrorCard message={error} onRetry={loadReport} />
        )}

        {report && !loading && !error && (
          <>
            <div className="flex justify-end gap-2 mb-4">
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                Delete Report
              </Button>
            </div>
            <DashboardShell
              zipInfo={{ ...emptyZipInfo(report.zip_code), city: report.city, state: report.state }}
              censusData={report.data_snapshot as CensusData}
            />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
