import type { ReactNode } from "react";
import { AuthBrandLogo } from "@/components/login/AuthBrandLogo";
import { LoginHeader } from "@/components/login/LoginHeader";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="w-full min-h-svh bg-home">
      <section className="flex min-h-svh overflow-hidden">
        <div className="flex w-full flex-col bg-grey-0 md:w-1/2">
          <LoginHeader />

          <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
            {children}
          </div>
        </div>

        <aside className="hidden w-1/2 items-center justify-center md:flex" aria-hidden="true">
          <AuthBrandLogo />
        </aside>
      </section>
    </main>
  );
}
