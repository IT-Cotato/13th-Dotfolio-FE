import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface AuthFormProps extends Omit<
  ComponentPropsWithoutRef<"form">,
  "children" | "className"
> {
  children: ReactNode;
  bottomPadding?: "default" | "none";
}

export function AuthForm({
  children,
  bottomPadding = "default",
  ...formProps
}: AuthFormProps) {
  return (
    <form
      className={`flex w-full max-w-[463px] flex-col items-center gap-8 px-6 pt-6 ${
        bottomPadding === "none" ? "pb-0" : "pb-6"
      }`}
      {...formProps}
    >
      {children}
    </form>
  );
}
