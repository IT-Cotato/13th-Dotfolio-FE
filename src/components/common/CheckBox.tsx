import CheckIcon from "@/assets/checkicon.svg";

interface CheckboxProps {
  checked: boolean;
  id: string;
  onChange: (checked: boolean) => void;
}

export function Checkbox({ checked, id, onChange }: CheckboxProps) {
  return (
    <>
      <input
        checked={checked}
        className="sr-only"
        id={id}
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span
        aria-hidden="true"
        className={`w-5 h-5 py-[5px] px-[3px] rounded-[4px] border flex items-center justify-center transition-colors ${
          checked
            ? "bg-primary-500 border-primary-500"
            : "bg-white border-grey-200"
        }`}
      >
        {checked && (
          <CheckIcon className="w-[11.454px] h-[8.315px] shrink-0 text-white" />
        )}
      </span>
    </>
  );
}
