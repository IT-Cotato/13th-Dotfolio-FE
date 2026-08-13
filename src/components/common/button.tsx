interface ButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
  size?: 'default' | 'compact' | 'tip';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({ label, icon, onClick, disabled = false, variant = 'primary', size = 'default', className = '', type = 'button' }: ButtonProps) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center transition-all ${
      size === 'tip'
        ? 'text-label3-sb w-auto gap-1 rounded-xl py-1 pr-2 pl-3'
        : size === 'compact'
          ? 'text-sub2-sb w-auto gap-2 rounded-xl px-5 py-2.5'
          : 'text-sub2-sb h-13 w-full rounded-[14px] px-5 py-2.5'
    } ${
      disabled
        ? variant === 'outline'
          ? 'border border-grey-300 bg-white text-grey-300 cursor-not-allowed'
          : 'bg-grey-300 cursor-not-allowed text-grey-0'
        : variant === 'outline'
        ? 'border border-primary-500 bg-white text-primary-500 cursor-pointer'
        : 'bg-primary-gradient text-grey-0 cursor-pointer'
    } ${className}`}
  >
    {icon && <span className="mr-2 flex shrink-0 items-center justify-center">{icon}</span>}
    {label}
  </button>
);
