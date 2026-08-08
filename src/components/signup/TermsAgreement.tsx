import { Checkbox } from "@/components/common/CheckBox";

interface TermsAgreementProps {
  isOptionalAgreed: boolean;
  isRequiredAgreed: boolean;
  onOptionalAgreedChange: (isAgreed: boolean) => void;
  onRequiredAgreedChange: (isAgreed: boolean) => void;
}

interface AgreementCheckboxProps {
  checked: boolean;
  children: string;
  id: string;
  onChange: (checked: boolean) => void;
  variant: "all" | "default";
}

function AgreementCheckbox({
  checked,
  children,
  id,
  onChange,
  variant,
}: AgreementCheckboxProps) {
  return (
    <label className="flex items-center gap-2 self-stretch" htmlFor={id}>
      <Checkbox checked={checked} id={id} onChange={onChange} />
      <span
        className={
          variant === "all"
            ? "text-sub2-sb text-grey-900"
            : "text-body2-md text-grey-700"
        }
      >
        {children}
      </span>
    </label>
  );
}

export function TermsAgreement({
  isOptionalAgreed,
  isRequiredAgreed,
  onOptionalAgreedChange,
  onRequiredAgreedChange,
}: TermsAgreementProps) {
  const isAllAgreed = isRequiredAgreed && isOptionalAgreed;

  const handleAllAgreementChange = (isAgreed: boolean) => {
    onRequiredAgreedChange(isAgreed);
    onOptionalAgreedChange(isAgreed);
  };

  return (
    <section
      className="flex flex-col items-start gap-4 self-stretch"
      aria-labelledby="terms-agreement-title"
    >
      <h2 className="text-sub2-sb text-grey-900" id="terms-agreement-title">
        약관동의
      </h2>

      <AgreementCheckbox
        checked={isAllAgreed}
        id="signup-terms-all"
        onChange={handleAllAgreementChange}
        variant="all"
      >
        모두 동의합니다.
      </AgreementCheckbox>

      <div className="h-px self-stretch bg-grey-100" />

      <div className="flex flex-col items-start gap-3 self-stretch">
        <div className="flex items-center justify-between self-stretch">
          <AgreementCheckbox
            checked={isRequiredAgreed}
            id="signup-terms-required"
            onChange={onRequiredAgreedChange}
            variant="default"
          >
            개인정보 수집 및 이용에 대한 동의(필수)
          </AgreementCheckbox>
          <button
            className="shrink-0 text-body3-md text-grey-500 underline"
            type="button"
          >
            약관보기
          </button>
        </div>

        <AgreementCheckbox
          checked={isOptionalAgreed}
          id="signup-terms-optional"
          onChange={onOptionalAgreedChange}
          variant="default"
        >
          이벤트 수신 동의 (선택)
        </AgreementCheckbox>
      </div>
    </section>
  );
}
