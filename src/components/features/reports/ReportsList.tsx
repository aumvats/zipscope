'use client';

import { useState, useEffect } from 'react';
import type { Report } from '@/lib/types';
import ReportCard from './ReportCard';
import SkeletonCard from '@/components/ui/SkeletonCard';
import ErrorCard from '@/components/ui/ErrorCard';
import { useToast } from '@/components/ui/Toast';
import { getAuthHeaders } from '@/lib/api/supabase';

export default function ReportsList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  async function loadReports() {
    setLoading(true);
    setError('');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/reports', { headers });
      if (!res.ok) throw new Error('Failed to load reports');
      const data = await res.json();
      setReports(data);
    } catch {
      setError('Failed to load your reports. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadReports(); }, []);

  async function handleDelete(id: string) {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/reports/${id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error();
      setReports(prev => prev.filter(r => r.id !== id));
      showToast('Report deleted', 'success');
    } catch {
      showToast('Failed to delete report', 'error');
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return <ErrorCard message={error} onRetry={loadReports} />;
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-12 h-12 mx-auto text-text-secondary/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        <p className="text-text-secondary mb-2">No saved reports yet.</p>
        <p className="text-sm text-text-secondary/70">Search for a ZIP code and click &quot;Save Report&quot; to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map(r => (
        <ReportCard key={r.id} report={r} onDelete={handleDelete} />
      ))}
    </div>
  );
}
