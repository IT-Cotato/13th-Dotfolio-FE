import { useEffect, useState, type ReactNode } from "react";
import CloseIcon from "@/assets/close.svg";
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
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const isAllAgreed = isRequiredAgreed && isOptionalAgreed;

  useEffect(() => {
    if (!isTermsModalOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsTermsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTermsModalOpen]);

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
            onClick={() => setIsTermsModalOpen(true)}
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

      {isTermsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-grey-900/40 p-5"
          onClick={() => setIsTermsModalOpen(false)}
        >
          <section
            aria-labelledby="privacy-terms-title"
            aria-modal="true"
            className="flex max-h-[calc(100svh-40px)] w-full max-w-[500px] flex-col rounded-2xl bg-grey-0 p-6"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-center justify-between">
              <h2
                className="text-title1 text-grey-900"
                id="privacy-terms-title"
              >
                개인정보 수집·이용동의서
              </h2>
              <button
                aria-label="약관 닫기"
                className="text-grey-500"
                onClick={() => setIsTermsModalOpen(false)}
                type="button"
              >
                <CloseIcon className="size-4" />
              </button>
            </div>

            <div className="mt-6 overflow-y-auto pr-2 text-sub3-sb text-grey-700">
              <p>
                포트폴리오(이하 &apos;회사&apos;라고 합니다)는 개인정보보호법 등
                관련 법령상의 개인정보보호 규정을 준수하며 귀하의 개인정보보호에
                최선을 다하고 있습니다. 회사는 개인정보보호법에 근거하여 다음과
                같은 내용으로 개인정보를 수집 및 처리하고자 합니다.
              </p>
              <p className="mt-4">
                다음의 내용을 자세히 읽어보시고 모든 내용을 이해하신 후에 동의
                여부를 결정해주시기 바랍니다.
              </p>

              <TermsSection title="제1조(회원 가입을 위한 정보)">
                회사는 이용자의 회사 서비스에 대한 회원가입을 위하여 다음과 같은
                정보를 수집합니다.
                <br />
                [필수 수집 정보] : 이메일 주소, 비밀번호 및 이름
              </TermsSection>
              <TermsSection title="제2조(본인 인증을 위한 정보)">
                회사는 이용자의 본인인증을 위하여 다음과 같은 정보를 수집합니다.
                <br />
                [필수 수집 정보] : 휴대폰 번호, 이메일 주소, 이름 및 생년월일
              </TermsSection>
              <TermsSection title="제3조(회사 서비스 제공을 위한 정보)">
                회사는 이용자에게 회사의 서비스를 제공하기 위하여 다음과 같은
                정보를 수집합니다.
                <br />
                [필수 수집 정보] : 아이디, 이메일 주소 및 이름
              </TermsSection>
              <TermsSection title="제4조(서비스 이용 및 부정 이용 확인을 위한 정보)">
                회사는 이용자의 서비스 이용에 따른 통계∙분석 및 부정이용의
                확인∙분석을 위하여 다음과 같은 정보를 수집합니다. (부정이용이란
                회원탈퇴 후 재가입, 상품구매 후 구매취소 등을 반복적으로 행하는
                등 회사가 제공하는 할인쿠폰, 이벤트 혜택 등의 경제상 이익을
                불·편법적으로 수취하는 행위, 이용약관 등에서 금지하고 있는 행위,
                명의도용 등의 불·편법행위 등을 말합니다.)
                <br />
                [필수 수집 정보] : 서비스 이용기록 및 쿠키
              </TermsSection>
              <TermsSection title="제5조(기타 수집 정보)">
                회사는 아래와 같이 정보를 수집합니다.
                <ol className="mt-2 list-decimal pl-5">
                  <li>수집목적: 사용자 맞춤형 서비스 제공</li>
                  <li>수집정보: 관심 직무</li>
                </ol>
              </TermsSection>
              <TermsSection title="제6조(개인정보 보유 및 이용 기간)">
                <ol className="list-decimal pl-5">
                  <li>
                    수집한 개인정보는 수집·이용 동의일로부터 회원탈퇴시까지 보관
                    및 이용합니다.
                  </li>
                  <li>
                    개인정보 보유기간의 경과, 처리목적의 달성 등 개인정보가
                    불필요하게 되었을 때에는 지체없이 해당 개인정보를
                    파기합니다.
                  </li>
                </ol>
              </TermsSection>
              <TermsSection title="제7조(동의 거부 관리)">
                귀하는 본 안내에 따른 개인정보 수집·이용에 대하여 동의를 거부할
                권리가 있습니다. 다만, 귀하가 개인정보 동의를 거부하시는 경우에
                서비스 이용 중 일부 제한의 불이익이 발생할 수 있음을
                알려드립니다.
              </TermsSection>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

interface TermsSectionProps {
  title: string;
  children: ReactNode;
}

function TermsSection({ title, children }: TermsSectionProps) {
  return (
    <section className="mt-6">
      <h3 className="text-grey-900">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}
