import { useEffect, useRef, useState } from "react";
import ArrowDropDownIcon from "@/assets/arrow_drop_down.svg";
import { AuthFormField } from "@/components/login/AuthFormField";

const DOMAIN_OPTIONS = ["naver.com", "gmail.com", "kakao.com", "daum.com"];
const MOCK_REGISTERED_EMAIL = "cotato@gmail.com";

type EmailError = "format" | "duplicate" | null;

interface SignupEmailFieldProps {
  onValidityChange: (isValid: boolean) => void;
}

function getEmailError(localPart: string, domain: string): EmailError {
  const email = `${localPart.trim()}@${domain.trim()}`;

  if (!localPart.trim() || !domain.trim()) {
    return null;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "format";
  }

  return email.toLowerCase() === MOCK_REGISTERED_EMAIL ? "duplicate" : null;
}

export function SignupEmailField({ onValidityChange }: SignupEmailFieldProps) {
  const [localPart, setLocalPart] = useState("");
  const [domain, setDomain] = useState("");
  const [emailError, setEmailError] = useState<EmailError>(null);
  const [isDomainMenuOpen, setIsDomainMenuOpen] = useState(false);
  const domainInputRef = useRef<HTMLInputElement>(null);
  const hasError = emailError !== null;
  const isEmailValid =
    localPart.trim().length > 0 &&
    domain.trim().length > 0 &&
    getEmailError(localPart, domain) === null;

  useEffect(() => {
    onValidityChange(isEmailValid);
  }, [isEmailValid, onValidityChange]);

  const validateEmail = () => {
    setEmailError(getEmailError(localPart, domain));
  };

  const handleLocalPartChange = (value: string) => {
    setLocalPart(value);
    setEmailError(null);
  };

  const handleDomainChange = (value: string) => {
    setDomain(value);
    setEmailError(null);
  };

  const handleDomainSelect = (selectedDomain: string) => {
    setDomain(selectedDomain);
    setEmailError(getEmailError(localPart, selectedDomain));
    setIsDomainMenuOpen(false);

    if (!selectedDomain) {
      requestAnimationFrame(() => domainInputRef.current?.focus());
    }
  };

  const inputClassName = `h-12 w-0 min-w-0 box-border flex-[1_0_0] rounded-[14px] border p-4 text-body2-md text-grey-900 outline-none placeholder:text-grey-400 focus:border-primary-500 ${
    hasError ? "border-error-border bg-error-bg" : "border-grey-100 bg-grey-0"
  }`;

  return (
    <AuthFormField htmlFor="signup-email-local" label="이메일 아이디">
      <div className="flex flex-col items-start gap-2 self-stretch">
        <div className="flex items-center gap-2 self-stretch">
          <input
            aria-label="이메일 아이디"
            autoComplete="off"
            className={inputClassName}
            id="signup-email-local"
            onBlur={validateEmail}
            onChange={(event) => handleLocalPartChange(event.target.value)}
            placeholder="예: cotato"
            type="text"
            value={localPart}
          />
          <span aria-hidden="true" className="text-sub2-sb text-grey-400">
            @
          </span>
          <input
            aria-label="이메일 도메인"
            autoComplete="off"
            className={inputClassName}
            onBlur={validateEmail}
            onChange={(event) => handleDomainChange(event.target.value)}
            ref={domainInputRef}
            type="text"
            value={domain}
          />
          <div className="relative w-0 min-w-0 flex-[1_0_0] ">
            <button
              aria-controls="signup-domain-options"
              aria-expanded={isDomainMenuOpen}
              aria-haspopup="listbox"
              className="flex h-12 w-full items-center justify-between rounded-[14px] border border-grey-100 bg-grey-0 p-4 text-body-reading2-md text-grey-400"
              onClick={() => setIsDomainMenuOpen((isOpen) => !isOpen)}
              type="button"
            >
              선택
              <span className="flex size-6 shrink-0 flex-col items-center justify-center px-2 py-2.5">
                <ArrowDropDownIcon className="h-[5px] w-2.5 shrink-0" />
              </span>
            </button>

            {isDomainMenuOpen && (
              <div
                className="absolute left-0 top-[52px] z-10 flex w-36 flex-col items-start gap-1 rounded-2xl border border-grey-100 bg-grey-0 py-2 shadow-[0_0_30px_0_rgba(22,53,164,0.08)] "
                id="signup-domain-options"
                role="listbox"
              >
                <div className="flex flex-col items-start self-stretch px-1.5">
                  {DOMAIN_OPTIONS.map((domainOption) => (
                    <button
                      className="flex min-h-11 items-center gap-2 self-stretch rounded-[12px] bg-grey-0 py-2 pr-4 pl-2 text-left text-body2-md text-grey-900"
                      key={domainOption}
                      onClick={() => handleDomainSelect(domainOption)}
                      role="option"
                      type="button"
                    >
                      {domainOption}
                    </button>
                  ))}
                  <button
                    className="flex min-h-11 items-center gap-2 self-stretch rounded-[12px] bg-grey-0 py-2 pr-4 pl-2 text-left text-body2-md text-grey-900"
                    onClick={() => handleDomainSelect("")}
                    role="option"
                    type="button"
                  >
                    직접 입력
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {emailError && (
          <p role="alert" className="flex-1 text-body3-r text-error-text">
            {emailError === "format"
              ? "올바른 이메일 형식으로 입력해주세요. 예: cotato@gmail.com"
              : "이미 가입된 이메일 주소입니다. 다른 이메일을 입력해주세요."}
          </p>
        )}
      </div>
    </AuthFormField>
  );
}
