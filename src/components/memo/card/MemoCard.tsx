import type { MemoData } from '../types';
import { MemoMoreMenu } from './MemoMoreMenu';
import DdayIcon from '@/assets/memo_dday.svg';
import FileIcon from '@/assets/memo_file.svg';
import CheckIcon from '@/assets/memo_check.svg';
import StarIcon from '@/assets/memo_star.svg';

interface MemoCardProps {
  memo: MemoData;
  onDelete: () => void;
  onToggleImportant: () => void;
  onMove: () => void;
  selected: boolean;
  selectionMode: boolean;
  onSelect: (selected: boolean) => void;
  onOpen: () => void;
}

export const MemoCard = ({ memo, onDelete, onToggleImportant, onMove, selected, selectionMode, onSelect, onOpen }: MemoCardProps) => (
  <article
    className={`group relative flex min-h-[266px] w-[266px] max-h-[454px] shrink-0 cursor-pointer overflow-visible rounded-[20px] ${selected ? 'bg-primary-gradient p-0.5 shadow-[0_0_30px_rgba(22,53,164,0.08)]' : `border ${memo.isImportant ? 'border-primary-100' : 'border-grey-100'}`}`}
  >
    <button
      type="button"
      aria-label={`${memo.title || '제목 없는 메모'} 상세보기`}
      onClick={onOpen}
      className="absolute inset-0 z-0 rounded-[20px] outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
    />
    <div className={`pointer-events-none relative z-10 flex min-h-0 flex-1 flex-col overflow-visible ${selected ? 'rounded-[18px]' : 'rounded-[19px]'} ${memo.isImportant ? 'bg-primary-50' : 'bg-white'}`}>
    <label className="peer group/check pointer-events-auto absolute left-0 top-0 z-20 h-[54px] w-11 cursor-pointer">
      <span className="sr-only">메모 선택</span>
      <input
        type="checkbox"
        checked={selected}
        onChange={(event) => onSelect(event.target.checked)}
        className="peer/checkbox absolute inset-0 cursor-pointer opacity-0"
      />
      <span className={`absolute left-4 top-[17px] flex h-5 w-5 items-center justify-center rounded-[4px] border transition-opacity peer-focus-visible/checkbox:ring-2 peer-focus-visible/checkbox:ring-primary-500 peer-focus-visible/checkbox:ring-offset-2 ${selected ? 'border-primary-500 bg-primary-500 opacity-100' : `border-grey-100 bg-white ${selectionMode ? 'opacity-100' : 'opacity-0 group-hover/check:opacity-100 peer-focus-visible/checkbox:opacity-100'}`}`}>
        {selected && <CheckIcon />}
      </span>
    </label>
    <header className={`flex h-[52px] shrink-0 items-center rounded-t-[18px] border-b px-4 text-body3-md transition-[padding] peer-hover:pl-11 ${selected || selectionMode ? 'pl-11' : ''} ${memo.isImportant ? 'border-primary-100 text-primary-500' : 'border-grey-100 text-grey-600'}`}>
      <time>{memo.createdAt}</time>
      <span className={`ml-2 flex h-[22px] w-[62px] shrink-0 items-center rounded-[100px] border border-grey-100 bg-white py-px pl-1 pr-2 text-label3-md ${memo.isImportant ? 'text-primary-500' : 'text-grey-600'}`}>
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
          <DdayIcon className="h-2.5 w-[7px]" />
        </span>
        <span className="whitespace-nowrap">{memo.dDay}</span>
      </span>
      <div className="pointer-events-auto ml-auto">
        <MemoMoreMenu isImportant={!!memo.isImportant} emphasized={selected} onToggleImportant={onToggleImportant} onDelete={onDelete} onMove={onMove} align="right" />
      </div>
    </header>

    <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
      {memo.title && (
        <h2 className={`flex items-center gap-1 text-sub1-sb ${memo.isImportant ? 'text-primary-500' : 'text-grey-950'}`}>
          {memo.isImportant && (
            <StarIcon className="h-4 w-4 shrink-0 [&_path]:fill-[#FFB516] [&_path]:stroke-[#FFB516]" />
          )}
          {memo.title}
        </h2>
      )}
      {memo.tag && (
        <span className={`w-fit max-w-full truncate rounded-full px-3 py-1 text-label3-sb text-white ${memo.isImportant ? 'bg-primary-gradient' : 'bg-grey-500'}`}>
          # {memo.tag}
        </span>
      )}
      <p className={`memo-card-text min-h-0 overflow-hidden text-body-reading2-md ${memo.isImportant ? 'text-primary-500' : 'text-grey-900'}`}>{memo.memo}</p>
      {!!memo.attachmentCount && (
        <span className={`mt-auto flex items-center justify-end gap-2 text-label3-md ${memo.isImportant ? 'text-primary-400' : 'text-grey-600'}`}>
          <FileIcon /> 첨부파일 {memo.attachmentCount}개
        </span>
      )}
    </div>
    </div>
  </article>
);
