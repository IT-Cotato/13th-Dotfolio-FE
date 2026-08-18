import CheckIcon from "@/assets/vector_check.svg";
import CheckIconWhite from "@/assets/vector_check_white.svg";

interface PasswordRequirementIndicatorProps {
  isSatisfied: boolean;
  children: string;
}

function PasswordRequirementIndicator({
  isSatisfied,
  children,
}: PasswordRequirementIndicatorProps) {
  return (
    <span
      className={`flex items-center gap-1.5 text-body3-r ${
        isSatisfied ? "text-primary-400" : "text-grey-500"
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex size-3.5 shrink-0 items-center justify-center rounded-full border px-1 py-[5px] ${
          isSatisfied
            ? "border-primary-400 bg-primary-400 text-grey-0"
            : "border-grey-400 text-grey-500"
        }`}
      >
        {isSatisfied ? (
          <CheckIconWhite className="shrink-0" />
        ) : (
          <CheckIcon className="shrink-0" />
        )}
      </span>
      {children}
    </span>
  );
}

interface PasswordRequirementListProps {
  hasValidLength: boolean;
  hasValidComposition: boolean;
}

export function PasswordRequirementList({
  hasValidLength,
  hasValidComposition,
}: PasswordRequirementListProps) {
  return (
    <div className="flex items-center gap-4 px-1">
      <PasswordRequirementIndicator isSatisfied={hasValidLength}>
        8~16자
      </PasswordRequirementIndicator>
      <PasswordRequirementIndicator isSatisfied={hasValidComposition}>
        영문/숫자/특수문자만 허용하며, 각각 1개 이상 포함
      </PasswordRequirementIndicator>
    </div>
  );
}

interface PasswordMatchIndicatorProps {
  isMatched: boolean;
}

export function PasswordMatchIndicator({
  isMatched,
}: PasswordMatchIndicatorProps) {
  return (
    <span
      className={`flex items-center gap-1.5 text-body3-r ${
        isMatched ? "text-primary-400" : "text-grey-500"
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex size-[18px] shrink-0 items-center justify-center rounded-full border px-1 py-[5px] ${
          isMatched
            ? "border-primary-400 bg-primary-400 text-grey-0"
            : "border-grey-500 text-grey-500"
        }`}
      >
        {isMatched ? (
          <CheckIconWhite className="shrink-0" />
        ) : (
          <CheckIcon className="shrink-0" />
        )}
      </span>
      동일한 비밀번호 입력
    </span>
  );
}
