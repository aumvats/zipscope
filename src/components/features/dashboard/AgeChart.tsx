'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { AgeGroup } from '@/lib/types';
import { formatNumber } from '@/lib/utils/formatters';

interface AgeChartProps {
  ageGroups: AgeGroup[];
}

export default function AgeChart({ ageGroups }: AgeChartProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 transition-shadow duration-normal hover:shadow-md">
      <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-4">
        Age Distribution
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ageGroups} layout="vertical" margin={{ left: 10, right: 20 }}>
            <XAxis type="number" tickFormatter={v => formatNumber(v)} tick={{ fontSize: 11, fill: '#64748B' }} />
            <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: '#64748B' }} width={70} />
            <Tooltip
              formatter={(value) => [formatNumber(Number(value)), 'Population']}
              contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {ageGroups.map((_, i) => (
                <Cell key={i} fill="#0D9488" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
