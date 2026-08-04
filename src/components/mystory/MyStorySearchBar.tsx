import MyStorySearchIcon from '@/assets/mystory_search.svg';

interface MyStorySearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function MyStorySearchBar({ query, onQueryChange, onSubmit, disabled = false }: MyStorySearchBarProps) {
  return (
    <div className="flex gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-3 h-12 rounded-[14px] border border-grey-100 bg-white px-4 text-grey-400">
        <MyStorySearchIcon className="size-6 shrink-0" />
        <input
          value={query}
          onChange={event => onQueryChange(event.target.value)}
          onKeyDown={event => event.key === 'Enter' && !disabled && onSubmit()}
          placeholder="활동명, 태그, 기록 내용으로 검색해 보세요."
          className="min-w-0 flex-1 bg-transparent outline-none text-body3-md text-grey-900 placeholder:text-grey-400"
        />
      </div>
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled}
        className={`h-12 w-[68px] shrink-0 rounded-[14px] px-5 text-label2-sb text-white transition-colors ${
          disabled ? 'cursor-not-allowed bg-grey-300' : 'cursor-pointer bg-primary-500 hover:bg-primary-400'
        }`}
      >
        검색
      </button>
    </div>
  );
}
