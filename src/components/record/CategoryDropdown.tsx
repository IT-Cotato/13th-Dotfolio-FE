import { useEffect, useRef, useState } from 'react';
import ArrowIcon from '@/assets/arrow.svg';

interface CategoryDropdownOption {
  id: string;
  label: string;
}

interface CategoryDropdownProps {
  options: CategoryDropdownOption[];
  value: string;
  onChange: (id: string) => void;
}

export const CategoryDropdown = ({ options, value, onChange }: CategoryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(option => option.id === value);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-4 px-4 py-2.5 rounded-xl border border-grey-100 bg-grey-0 text-grey-900 text-body2-md cursor-pointer"
      >
        {selected?.label}
        <span className={`px-1 py-2 transition-transform ${isOpen ? '-rotate-90' : 'rotate-90'}`}>
          <ArrowIcon className="w-4 h-4 text-grey-400" />
        </span>
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-10 min-w-full bg-white rounded-2xl border border-grey-100 shadow-[0_0_30px_0_rgba(22,53,164,0.08)] py-2 flex flex-col">
          {options.map(option => (
            <button
              key={option.id}
              type="button"
              onClick={() => { onChange(option.id); setIsOpen(false); }}
              className="text-left px-4 py-2 text-body2-md text-grey-900 hover:bg-grey-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
