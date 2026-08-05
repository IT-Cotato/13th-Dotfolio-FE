import type { ReactNode } from "react";

interface AuthFormFieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
}

export function AuthFormField({
  label,
  htmlFor,
  children,
}: AuthFormFieldProps) {
  return (
    <section className="flex flex-col items-start gap-2 self-stretch">
      <label className="text-sub2-sb text-grey-900" htmlFor={htmlFor}>
        {label}<span className="ml-0.5 text-error-text">*</span>
      </label>
      {children}
    </section>
  );
}
