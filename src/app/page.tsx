import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/features/landing/HeroSection';
import FeatureGrid from '@/components/features/landing/FeatureGrid';
import SamplePDFPreview from '@/components/features/landing/SamplePDFPreview';

export default function HomePage() {
  return (
    <>
      <Header showSearch={false} />
      <main>
        <HeroSection />
        <FeatureGrid />
        <SamplePDFPreview />
      </main>
      <Footer />
    </>
  );
}
