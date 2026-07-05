interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button = ({ label, onClick, disabled = false }: ButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`w-full h-13 flex px-5 py-2.5 items-center justify-center rounded-[14px] text-sub2-sb text-grey-0 transition-all ${
      disabled ? 'bg-grey-300 cursor-not-allowed' : 'bg-primary-gradient cursor-pointer'
    }`}
  >
    {label}
  </button>
);
