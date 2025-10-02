import HeroSection from '@/components/home/HeroSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import AboutSection from '@/components/home/AboutSection'
import StatsSection from '@/components/home/StatsSection'
import ReviewsSection from '@/components/home/ReviewsSection'
import IntroVideo from '@/components/home/IntroVideo'

export const revalidate = 60 // Revalidate every 60 seconds

export default function HomePage() {
  return (
    <>
      <IntroVideo />
      
      <HeroSection />
      <FeaturedProducts />
      <AboutSection />
      <StatsSection />
      <ReviewsSection />
    </>
  )
}
