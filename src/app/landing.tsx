import { LandingHeader } from "@/components/landing/LandingHeader";

export default function Landing() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-[#F6F8FC]">
      <LandingHeader />
      <main className="flex w-full flex-col items-center" />
    </div>
  );
}
