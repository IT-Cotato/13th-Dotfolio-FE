import type { ReactNode } from "react";

interface AuthFormIntroProps {
  title?: string;
  children: ReactNode;
}

export function AuthFormIntro({ title, children }: AuthFormIntroProps) {
  return (
    <div className="flex w-full flex-col items-start justify-center gap-2 self-stretch">
      {title && <h1 className="self-stretch text-header text-grey-900">{title}</h1>}
      <div className="text-body1-md text-grey-600">{children}</div>
    </div>
  );
}
