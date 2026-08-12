import { HeroSection } from "@/components/landing/HeroSection";
import { ExperienceProblemSection } from "@/components/landing/ExperienceProblemSection";
import { PainPointsSection } from "@/components/landing/PainPointsSection";

export default function Landing() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-[#F6F8FC]">
      <main className="flex w-full flex-col items-center">
        <HeroSection />
        <ExperienceProblemSection />
        <PainPointsSection />
      </main>
    </div>
  );
}
