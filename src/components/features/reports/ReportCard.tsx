'use client';

import Link from 'next/link';
import type { Report } from '@/lib/types';
import Button from '@/components/ui/Button';

interface ReportCardProps {
  report: Report;
  onDelete: (id: string) => void;
}

export default function ReportCard({ report, onDelete }: ReportCardProps) {
  const location = [report.city, report.state].filter(Boolean).join(', ');
  const title = location ? `${location} (${report.zip_code})` : `ZIP ${report.zip_code}`;
  const date = new Date(report.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between gap-4 transition-shadow duration-normal hover:shadow-sm">
      <div className="min-w-0">
        <Link href={`/reports/${report.id}`} className="font-heading font-semibold text-text-primary hover:text-primary transition-colors duration-fast">
          {title}
        </Link>
        <div className="flex items-center gap-3 mt-1 text-sm text-text-secondary">
          <span>{date}</span>
          <span className="capitalize px-2 py-0.5 bg-bg rounded text-xs">
            {report.report_type}
          </span>
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <Link href={`/reports/${report.id}`}>
          <Button variant="secondary" size="sm">View</Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={() => onDelete(report.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}
