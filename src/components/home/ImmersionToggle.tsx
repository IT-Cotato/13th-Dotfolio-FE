import { useState } from 'react';

interface ImmersionToggleProps {
  defaultOn?: boolean;
  isOn?: boolean;
  onToggle?: (nextIsOn: boolean) => void;
}

export const ImmersionToggle = ({ defaultOn = false, isOn, onToggle }: ImmersionToggleProps) => {
  const [internalIsOn, setInternalIsOn] = useState(defaultOn);
  const resolvedIsOn = isOn ?? internalIsOn;

  const handleToggle = () => {
    const nextIsOn = !resolvedIsOn;

    if (isOn === undefined) {
      setInternalIsOn(nextIsOn);
    }

    onToggle?.(nextIsOn);
  };

  return (
    <button
      type="button"
      aria-pressed={resolvedIsOn}
      onClick={handleToggle}
      className={`flex items-center gap-1 rounded-full p-0.75 cursor-pointer transition-colors ${
        resolvedIsOn
          ? 'flex-row-reverse pl-3 bg-toggle-on'
          : 'pr-3 bg-grey-400'
      }`}
    >
      <div className="w-7 h-7 rounded-full bg-white shrink-0" />
      <span className="text-sub2-sb text-white">몰입모드</span>
    </button>
  );
};
