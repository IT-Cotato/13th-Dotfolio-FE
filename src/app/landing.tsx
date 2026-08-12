import { HeroSection } from "@/components/landing/HeroSection";

export default function Landing() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-[#F6F8FC]">
      <main className="flex w-full flex-col items-center">
        <HeroSection />
      </main>
    </div>
  );
}
