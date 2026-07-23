interface StatusTagProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export const StatusTag = ({ label, selected = false, onClick }: StatusTagProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-full cursor-pointer transition-colors ${
      selected
        ? 'bg-grey-700 text-grey-0 text-sub2-sb'
        : 'border border-grey-100 bg-grey-0 text-grey-900 text-body2-md'
    }`}
  >
    {label}
  </button>
);
