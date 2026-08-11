import { ImmersionToggle } from "@/components/home/ImmersionToggle";
import { ImmersionTimer } from "@/components/immersion/ImmersionTimer";

interface ImmersionRecordProps {
  focusMinutes: number;
}

export function ImmersionRecord({ focusMinutes }: ImmersionRecordProps) {
  return (
    <main className="bg-home-image relative min-h-svh w-full px-6 py-6">
      <div className="absolute inset-0 bg-[rgba(26,26,28,0.70)] backdrop-blur-[1.5px]" />
      <header className="relative flex w-full items-center justify-between">
        <ImmersionToggle defaultOn />
        <ImmersionTimer initialMinutes={focusMinutes} />
      </header>
    </main>
  );
}
