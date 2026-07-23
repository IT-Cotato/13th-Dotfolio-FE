interface TagProps {
  label: string;
  bgClassName: string;
  borderClassName: string;
  textClassName: string;
}

export const Tag = ({ label, bgClassName, borderClassName, textClassName }: TagProps) => (
  <span
    className={`inline-flex items-center w-fit px-3 py-1 rounded-lg border text-label3-sb ${bgClassName} ${borderClassName} ${textClassName}`}
  >
    {label}
  </span>
);
