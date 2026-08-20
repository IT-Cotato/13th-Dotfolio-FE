import { useEffect, useRef, useState } from 'react';
import VectorDownIcon from '@/assets/vector_down.svg';
import VectorUpIcon from '@/assets/vector_up.svg';

interface ActivityTagDropdownProps {
  tags: string[];
  selectedTag: string;
  onChange: (tag: string) => void;
}

export const ActivityTagDropdown = ({ tags, selectedTag, onChange }: ActivityTagDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const select = (tag: string) => {
    onChange(tag);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-11 w-[141px] items-center gap-4 rounded-xl border border-grey-100 bg-white py-2.5 pl-4 pr-3 text-body2-md text-grey-900"
      >
        <span className="min-w-0 flex-1 truncate text-left" title={selectedTag || '활동 태그별'}>
          {selectedTag || '활동 태그별'}
        </span>
        <span className="shrink-0">{isOpen ? <VectorUpIcon /> : <VectorDownIcon />}</span>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="활동 태그별 메모 보기"
          className={`absolute left-0 top-[52px] z-20 flex w-[184px] flex-col overflow-hidden rounded-2xl border border-grey-100 bg-white px-1.5 shadow-[0_0_30px_rgba(22,53,164,0.08)] ${
            tags.length === 0 ? 'h-[72px] justify-center' : 'gap-2 pb-2 pt-1'
          }`}
        >
          <button
            type="button"
            role="option"
            aria-selected={!selectedTag}
            onClick={() => select('')}
            className="min-h-[38px] p-2 text-left text-body2-md text-grey-900"
          >
            전체보기
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              role="option"
              aria-selected={selectedTag === tag}
              onClick={() => select(tag)}
              className="min-h-[38px] truncate p-2 text-left text-body2-md text-grey-900"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
