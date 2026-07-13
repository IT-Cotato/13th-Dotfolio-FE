interface TagProps {
  label: string;
}

export const Tag = ({ label }: TagProps) => (
  <span className="inline-flex items-center max-w-full w-fit px-3 py-1 rounded-xl bg-grey-700 text-label3-sb text-grey-0 truncate">
    {label}
  </span>
);
