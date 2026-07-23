interface ProgressBarProps {
  value: number;
  max: number;
}

export const ProgressBar = ({ value, max }: ProgressBarProps) => {
  const percent = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));

  return (
    <div className="w-full h-1 bg-grey-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-primary-400 rounded-full transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};
