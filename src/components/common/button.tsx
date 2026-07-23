interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
}

export const Button = ({ label, onClick, disabled = false, variant = 'primary' }: ButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`w-full h-13 flex px-5 py-2.5 items-center justify-center rounded-[14px] text-sub2-sb transition-all ${
      disabled
        ? variant === 'outline'
          ? 'border border-grey-300 bg-white text-grey-300 cursor-not-allowed'
          : 'bg-grey-300 cursor-not-allowed text-grey-0'
        : variant === 'outline'
        ? 'border border-primary-500 bg-white text-primary-500 cursor-pointer'
        : 'bg-primary-gradient text-grey-0 cursor-pointer'
    }`}
  >
    {label}
  </button>
);
