import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ReportsList from '@/components/features/reports/ReportsList';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export const metadata = {
  title: 'My Reports — ZipScope',
};

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-2xl text-text-primary">My Reports</h1>
            <p className="text-sm text-text-secondary mt-1">Your saved demographic reports</p>
          </div>
          <Link href="/">
            <Button>New Search</Button>
          </Link>
        </div>
        <ReportsList />
      </main>
      <Footer />
    </>
  );
}
