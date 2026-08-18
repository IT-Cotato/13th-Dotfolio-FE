interface ReadonlyEmailProps {
  email: string;
}

export function ReadonlyEmail({ email }: ReadonlyEmailProps) {
  return (
    <div
      aria-label="이메일"
      className="flex h-12 w-full items-center justify-center self-stretch rounded-[14px] border border-grey-100 bg-grey-50 p-4 text-body-reading2-md text-center text-grey-900"
    >
      {email}
    </div>
  );
}
