import ArrowIcon from '@/assets/arrow.svg';
import ArrowForwardIcon from '@/assets/arrow_forward.svg';

interface CategoryHeaderProps {
  title: string;
  moreLabel?: string;
  onMoreClick?: () => void;
  onBack?: () => void;
}

export const CategoryHeader = ({ title, moreLabel, onMoreClick, onBack }: CategoryHeaderProps) => (
  <div className="w-full flex items-center justify-between">
    <div className="flex items-center gap-2">
      {onBack && (
        <button type="button" onClick={onBack} className="cursor-pointer">
          <ArrowForwardIcon className="w-5 h-5 text-grey-900 rotate-180" />
        </button>
      )}
      <span className="text-grey-900 text-title1">{title}</span>
    </div>
    {moreLabel && (
      <button
        type="button"
        onClick={onMoreClick}
        className="flex items-center gap-1 text-grey-600 text-body2-md cursor-pointer"
      >
        {moreLabel}
        <ArrowIcon className="w-4 h-4 text-grey-400" />
      </button>
    )}
  </div>
);
