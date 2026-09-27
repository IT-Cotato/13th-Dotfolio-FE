import ArrowIcon from '@/assets/arrow.svg';
import ArrowForwardIcon from '@/assets/arrow_forward.svg';

interface CategoryHeaderProps {
  title: string;
  moreLabel?: string;
  onMoreClick?: () => void;
  onBack?: () => void;
  backIcon?: React.ReactNode;
  extra?: React.ReactNode;
}

export const CategoryHeader = ({ title, moreLabel, onMoreClick, onBack, backIcon, extra }: CategoryHeaderProps) => (
  <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex min-w-0 items-start gap-2 sm:items-center">
      {onBack && (
        <button type="button" onClick={onBack} className="-ml-3 flex size-11 shrink-0 cursor-pointer items-center justify-center sm:ml-0 sm:size-auto">
          {backIcon ?? <ArrowForwardIcon className="w-5 h-5 text-grey-900 rotate-180" />}
        </button>
      )}
      <span className="min-w-0 flex-1 break-words text-grey-900 text-title1">{title}</span>
    </div>
    {(extra || moreLabel) && (
      <div className="self-end sm:self-auto">
        {extra ?? (moreLabel && (
          <button
            type="button"
            onClick={onMoreClick}
            className="flex items-center gap-1 whitespace-nowrap text-grey-600 text-body2-md cursor-pointer"
          >
            {moreLabel}
            <ArrowIcon className="w-4 h-4 text-grey-400" />
          </button>
        ))}
      </div>
    )}
  </div>
);
