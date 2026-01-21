import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeatureCards from '@/components/FeatureCards';
import ProductGallerySection from '@/components/ProductGallerySection';
import FeaturedCollection from '@/components/FeaturedCollection';
import FAQ from '@/components/FAQ';
import ReadyToCTA from '@/components/ReadyToCTA';
import Footer from '@/components/Footer';

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <FeatureCards />
      <ProductGallerySection />
      <FeaturedCollection />
      <FAQ />
      <ReadyToCTA />
      <Footer />
    </div>
  );
}
