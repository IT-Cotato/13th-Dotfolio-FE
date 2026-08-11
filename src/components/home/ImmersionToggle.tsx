import { useState } from 'react';

interface ImmersionToggleProps {
  defaultOn?: boolean;
}

export const ImmersionToggle = ({ defaultOn = false }: ImmersionToggleProps) => {
  const [isOn, setIsOn] = useState(defaultOn);

  return (
    <button
      type="button"
      aria-pressed={isOn}
      onClick={() => setIsOn(!isOn)}
      className={`flex items-center gap-1 rounded-full p-0.75 cursor-pointer transition-colors ${
        isOn
          ? 'flex-row-reverse pl-3 bg-toggle-on'
          : 'pr-3 bg-grey-400'
      }`}
    >
      <div className="w-7 h-7 rounded-full bg-white shrink-0" />
      <span className="text-sub2-sb text-white">몰입모드</span>
    </button>
  );
};
