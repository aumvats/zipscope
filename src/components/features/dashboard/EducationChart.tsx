'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { EducationLevel } from '@/lib/types';

interface EducationChartProps {
  levels: EducationLevel[];
}

const COLORS = ['#EF4444', '#F59E0B', '#14B8A6', '#0D9488'];

export default function EducationChart({ levels }: EducationChartProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 transition-shadow duration-normal hover:shadow-md">
      <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-4">
        Educational Attainment
      </h3>
      <p className="text-xs text-text-secondary mb-2">% of population 25+</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={levels}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
            >
              {levels.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value}%`, '']}
              contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, color: '#64748B' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
