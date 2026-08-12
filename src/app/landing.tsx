import { HeroSection } from "@/components/landing/HeroSection";
import { ExperienceProblemSection } from "@/components/landing/ExperienceProblemSection";
import { PainPointsSection } from "@/components/landing/PainPointsSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { BrandStorySection } from "@/components/landing/BrandStorySection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function Landing() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-[#F6F8FC]">
      <main className="flex w-full flex-col items-center">
        <HeroSection />
        <ExperienceProblemSection />
        <PainPointsSection />
        <SolutionSection />
        <BrandStorySection />
      </main>
      <LandingFooter />
    </div>
  );
}
