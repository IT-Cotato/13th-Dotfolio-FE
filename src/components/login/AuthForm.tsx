import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface AuthFormProps extends Omit<
  ComponentPropsWithoutRef<"form">,
  "children" | "className"
> {
  children: ReactNode; // 내용을 강제하고자 함
}

export function AuthForm({ children, ...formProps }: AuthFormProps) {
  return (
    <form
      className="flex w-full max-w-[463px] flex-col items-center gap-8 p-6"
      {...formProps}
    >
      {children}
    </form>
  );
}
