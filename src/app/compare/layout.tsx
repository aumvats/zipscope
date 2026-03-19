import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare ZIP Codes — ZipScope',
  description:
    'Compare demographics of two US ZIP codes side-by-side with color-coded difference indicators. Population, income, age, education, housing, and employment.',
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
