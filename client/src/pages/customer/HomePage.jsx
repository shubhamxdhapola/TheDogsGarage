import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/slices/product.slice.js';
import { fetchPets } from '../../redux/slices/pet.slice.js';
import { HeroSection } from '../../components/customer/HeroSection.jsx';
import { BrandPartnersSection } from '../../components/customer/BrandPartnersSection.jsx';
import { LiveStockCarousel } from '../../components/customer/LiveStockCarousel.jsx';
import { AnimatedHighlightsSection } from '../../components/customer/AnimatedHighlightsSection.jsx';
import { AccessoriesGrid } from '../../components/customer/AccessoriesGrid.jsx';
import { BrandStorySection } from '../../components/customer/BrandStorySection.jsx';
import { TrustStrip } from '../../components/common/TrustStrip.jsx';
import { AdoptionProcessSection } from '../../components/customer/AdoptionProcessSection.jsx';
import { TestimonialsSection } from '../../components/customer/TestimonialsSection.jsx';
import { ImageShowcaseSection } from '../../components/customer/ImageShowcaseSection.jsx';
import { CommunitySocialSection } from '../../components/customer/CommunitySocialSection.jsx';
import { ScrollReveal } from '../../components/reactbits/ScrollReveal.jsx';

export const HomePage = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 1 }));
    dispatch(fetchPets({ limit: 4 }));
  }, [dispatch]);

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-stone-900 selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden">
      {/* 1. Hero Section with 3D CircularGallery centerpiece */}
      <HeroSection />

      {/* 2. Logo Loop - Brands We Trust */}
      <ScrollReveal animation="fade-up" duration={0.6} viewportAmount={0.2}>
        <BrandPartnersSection />
      </ScrollReveal>

      {/* 3. Meet the Pets (1 Photo Per Pet Grid + GlareCard Hover Physics) */}
      <ScrollReveal animation="fade-up" duration={0.7} viewportAmount={0.15}>
        <LiveStockCarousel />
      </ScrollReveal>

      {/* 4. ReactBits Animated Highlights: Bidirectional ScrollVelocity & Bento Grid */}
      <ScrollReveal animation="fade-up" duration={0.7} viewportAmount={0.15}>
        <AnimatedHighlightsSection />
      </ScrollReveal>

      {/* 5. Signature Pick: The One They Love (Single Authentic Product) */}
      <ScrollReveal animation="fade-up" duration={0.7} viewportAmount={0.15}>
        <AccessoriesGrid products={products} />
      </ScrollReveal>

      {/* 6. Brand Story: More Than a Pet Store */}
      <ScrollReveal animation="fade-up" duration={0.75} viewportAmount={0.15}>
        <BrandStorySection />
      </ScrollReveal>

      {/* 7. Why The Dogs Garage: Built Around Better Pet Care */}
      <ScrollReveal animation="fade-up" duration={0.7} viewportAmount={0.15}>
        <TrustStrip />
      </ScrollReveal>

      {/* 8. Simple From Start to Home (3-Step Adoption & Ordering Journey) */}
      <ScrollReveal animation="fade-up" duration={0.7} viewportAmount={0.15}>
        <AdoptionProcessSection />
      </ScrollReveal>

      {/* 9. Loved by Pet Parents (3-Column Multi-Directional Auto Scroll) */}
      <ScrollReveal animation="fade-up" duration={0.75} viewportAmount={0.15}>
        <TestimonialsSection />
      </ScrollReveal>

      {/* 10. Life at The Dogs Garage (Infinite Scroll Reel) */}
      <ScrollReveal animation="fade-up" duration={0.7} viewportAmount={0.15}>
        <ImageShowcaseSection />
      </ScrollReveal>

      {/* 11. Social & Community Highlights (Instagram) */}
      <ScrollReveal animation="fade-up" duration={0.7} viewportAmount={0.15}>
        <CommunitySocialSection />
      </ScrollReveal>
    </div>
  );
};

export default HomePage;
