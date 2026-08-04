import MyStoryDocsIcon from '@/assets/mystory_docs.svg';
import ArrowIcon from '@/assets/arrow.svg';
import { MyStorySearchEmptyState } from './MyStoryEmptyState';
import type { StoryRecord } from './myStoryTypes';

interface MyStorySearchResultsProps {
  query: string;
  results: StoryRecord[];
  onOpenDetail: (record: StoryRecord) => void;
}

export function MyStorySearchResults({ query, results, onOpenDetail }: MyStorySearchResultsProps) {
  if (!results.length) {
    return <MyStorySearchEmptyState query={query} />;
  }

  return (
    <div>
      <h1 className="mb-6 flex items-center gap-2 text-title3 text-grey-800">
        <MyStoryDocsIcon className="h-[18px] w-[15px] shrink-0" />
        ‘{query}’ 검색 결과 <span className="text-body3-r text-grey-500">({results.length}개)</span>
      </h1>
      <div className="flex flex-col gap-4">
        {results.map(record => (
          <button
            type="button"
            onClick={() => onOpenDetail(record)}
            key={record.title}
            className="rounded-2xl border border-grey-100 px-6 py-4 text-left cursor-pointer hover:border-primary-200 hover:shadow-[0_8px_24px_rgba(47,82,235,.06)] transition-all"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <span className="inline-block rounded-full bg-grey-600 px-3 py-1 text-label3-md text-white"># 경영 데이터분석 워크샵</span>
                <p className="mt-3 text-body2-md text-grey-800">
                  {highlight(record.title, query)}
                  <span className="ml-4 text-body3-r text-grey-500">{record.date}</span>
                </p>
                <p className="mt-2 truncate text-body3-r text-grey-500">{highlight(record.content, query)}</p>
                <span className="mt-4 inline-block rounded-lg border border-primary-100 bg-category-purple-bg px-3 py-1 text-label3-md text-category-purple-text">협업 · 갈등</span>
              </div>
              <ArrowIcon className="mt-2 size-4 shrink-0 text-grey-400" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function highlight(text: string, query: string) {
  const parts = text.split(query);
  if (parts.length === 1) return text;
  return parts.flatMap((part, index) => index === parts.length - 1
    ? [part]
    : [part, <mark key={`${part}-${index}`} className="bg-transparent text-primary-500">{query}</mark>]);
}
