import { Hero } from "@/components/home/hero";
import { About } from "@/components/home/about";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { HowWeWork } from "@/components/home/how-we-work";
import { FAQ } from "@/components/home/faq";
import { CTASection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <WhyChooseUs />
      <HowWeWork />
      <FAQ />
      <CTASection />
    </>
  );
}
