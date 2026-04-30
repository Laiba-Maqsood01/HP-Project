import HeroSection from "../../components/home/HeroSection";
import FeatureSection from "../../components/home/FeatureSection";
import HowItWorksAccordion from "../../components/home/HowItWorksAccordion";
import TestimonialsSection from "../../components/testimonials/TestimonialsSection";
import StatsCTASection from "../../components/home/StatsCTASection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <HowItWorksAccordion />
      <TestimonialsSection />
      <StatsCTASection />
    </>
  );
};

export default Home;