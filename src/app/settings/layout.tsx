import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account Settings — ZipScope',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
