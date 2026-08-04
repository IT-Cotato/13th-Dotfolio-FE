interface EmailInputProps {
  value: string;
  hasError?: boolean;
  errorMessage?: string;
  onChange: (email: string) => void;
}

export function EmailInput({
  value,
  hasError = false,
  errorMessage,
  onChange,
}: EmailInputProps) {
  return (
    <div className="flex flex-col items-start gap-1.5 self-stretch">
      <input
        aria-invalid={hasError}
        aria-label="이메일"
        autoComplete="email"
        className={`h-12 w-full rounded-[14px] border p-4 text-body2-md text-grey-900 outline-none placeholder:text-grey-400 ${
          hasError
            ? "border-error-border bg-error-bg"
            : "border-grey-100 bg-grey-0 focus:border-primary-500"
        }`}
        onChange={(event) => onChange(event.target.value)}
        placeholder="이메일 입력"
        type="email"
        value={value}
      />
      {errorMessage && (
        <p role="alert" className="flex-1 text-body3-r text-error-text">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
