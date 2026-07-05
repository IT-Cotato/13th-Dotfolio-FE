interface TagProps {
  label: string;
}

export const Tag = ({ label }: TagProps) => (
  <span className="inline-flex items-center max-w-16.5 px-3 py-1 rounded-xl bg-grey-700 text-label3-sb text-grey-0 truncate">
    {label}
  </span>
);
