import { useState } from 'react';

export const ImmersionToggle = () => {
  const [isOn, setIsOn] = useState(false);

  return (
    <button
      onClick={() => setIsOn(!isOn)}
      className={`flex items-center gap-1 rounded-full p-0.75 pr-3 cursor-pointer transition-colors ${
        isOn ? 'bg-primary-gradient' : 'bg-grey-400'
      }`}
    >
      <div className="w-7 h-7 rounded-full bg-white shrink-0" />
      <span className="text-sub2-sb text-white">몰입모드</span>
    </button>
  );
};
