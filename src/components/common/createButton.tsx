import AddIcon from '@/assets/add.svg';

interface PrimaryButtonProps {
  label: string;
  onClick?: () => void;
}

export const PrimaryButton = ({ label, onClick }: PrimaryButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-primary-gradient text-white rounded-[12px] pl-3.5 pr-5 py-2.5 text-sub1-sb cursor-pointer"
    >
      <span className="p-1.5"><AddIcon className="w-5 h-5" /></span>
      <span>{label}</span>
    </button>
  );
};
