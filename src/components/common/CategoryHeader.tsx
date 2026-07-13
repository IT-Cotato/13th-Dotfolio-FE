import ArrowIcon from '@/assets/arrow.svg';

interface CategoryHeaderProps {
  title: string;
  moreLabel?: string;
  onMoreClick?: () => void;
}

export const CategoryHeader = ({ title, moreLabel, onMoreClick }: CategoryHeaderProps) => (
  <div className="w-full flex items-center justify-between">
    <span className="text-grey-900 text-title1">{title}</span>
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
