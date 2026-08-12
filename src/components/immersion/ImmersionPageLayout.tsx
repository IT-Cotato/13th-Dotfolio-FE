import type { ReactNode } from "react";

interface ImmersionPageLayoutProps {
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
}

export function ImmersionPageLayout({
  children,
  className = "",
  overlayClassName = "bg-[rgba(26,26,28,0.70)]",
}: ImmersionPageLayoutProps) {
  return (
    <main className={`bg-home-image relative min-h-svh w-full ${className}`}>
      <div
        className={`absolute inset-0 backdrop-blur-[1.5px] ${overlayClassName}`}
      />
      {children}
    </main>
  );
}
