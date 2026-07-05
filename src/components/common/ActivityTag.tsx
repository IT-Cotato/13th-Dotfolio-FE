interface ActivityTagProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export const ActivityTag = ({ label, selected = false, onClick }: ActivityTagProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-center px-3 py-2 rounded-xl border text-body2-md text-grey-900 transition-colors cursor-pointer ${
      selected ? 'border-primary-500' : 'border-grey-100'
    }`}
  >
    {label}
  </button>
);
