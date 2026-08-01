import PageWrapper from '../components/layout/PageWrapper';
import HeroSection from '../components/home/HeroSection';
import MarqueeTicker from '../components/home/MarqueeTicker';
import FeaturedProducts from '../components/home/FeaturedProducts';
import BrandStoryStrip from '../components/home/BrandStoryStrip';

export default function HomePage() {
  return (
    <PageWrapper dotPattern="none">
      <HeroSection />
      <MarqueeTicker />
      <FeaturedProducts />
      <BrandStoryStrip />
    </PageWrapper>
  );
}
