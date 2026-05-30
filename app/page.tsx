import HeroSection from '@/components/home/HeroSection'
import FeaturedDesigns from '@/components/home/FeaturedDesigns'
import HowItWorks from '@/components/home/HowItWorks'
import Testimonials from '@/components/home/Testimonials'
import CTASection from '@/components/home/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedDesigns />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </>
  )
}
