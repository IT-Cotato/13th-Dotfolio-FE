import type { ReactNode } from "react";

interface ImmersionPageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function ImmersionPageLayout({
  children,
  className = "",
}: ImmersionPageLayoutProps) {
  return (
    <main className={`bg-home-image relative min-h-svh w-full ${className}`}>
      <div className="absolute inset-0 bg-[rgba(26,26,28,0.70)] backdrop-blur-[1.5px]" />
      {children}
    </main>
  );
}
