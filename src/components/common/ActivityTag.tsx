interface ActivityTagProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export const ActivityTag = ({ label, selected = false, onClick }: ActivityTagProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex shrink-0 items-center justify-center px-3 py-2 rounded-xl text-body2-md text-grey-900 transition-colors cursor-pointer ${
      selected
        ? 'border-[1.5px] border-primary-500 bg-primary-50 text-primary-500'
        : 'border border-grey-100 bg-white'
    }`}
  >
    {label}
  </button>
);
