import AddIcon from '@/assets/add.svg';

interface PrimaryButtonProps {
  label: string;
  onClick?: () => void;
  size?: 'md' | 'sm';
}

const SIZE_CLASSES: Record<'md' | 'sm', string> = {
  md: 'pl-3.5 pr-5 py-2.5 text-sub1-sb',
  sm: 'pl-3 pr-4 py-2 text-sub2-sb',
};

export const PrimaryButton = ({ label, onClick, size = 'md' }: PrimaryButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 bg-primary-gradient text-white rounded-[12px] cursor-pointer ${SIZE_CLASSES[size]}`}
    >
      <span className="p-1.5"><AddIcon className="w-5 h-5" /></span>
      <span>{label}</span>
    </button>
  );
};
