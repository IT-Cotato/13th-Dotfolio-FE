interface TagProps {
  label: string;
}

const MAX_LABEL_LENGTH = 7;

export const Tag = ({ label }: TagProps) => {
  const displayLabel = label.length > MAX_LABEL_LENGTH ? `${label.slice(0, MAX_LABEL_LENGTH)}…` : label;

  return (
    <span className="inline-flex items-center w-fit px-3 py-1 rounded-xl bg-grey-700 text-label3-sb text-grey-0">
      {displayLabel}
    </span>
  );
};
