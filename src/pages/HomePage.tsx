import PageWrapper from '../components/layout/PageWrapper';
import HeroSection from '../components/home/HeroSection';
import MarqueeTicker from '../components/home/MarqueeTicker';
import FeaturedProducts from '../components/home/FeaturedProducts';
import BrandStoryStrip from '../components/home/BrandStoryStrip';
import Testimonials from '../components/home/Testimonials';
import InstagramGrid from '../components/home/InstagramGrid';

export default function HomePage() {
  return (
    <PageWrapper dotPattern="none">
      <HeroSection />
      <MarqueeTicker />
      <FeaturedProducts />
      <BrandStoryStrip />
      <Testimonials />
      <InstagramGrid />
    </PageWrapper>
  );
}
