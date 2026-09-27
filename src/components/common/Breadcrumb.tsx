import PolygonIcon from '@/assets/polygon.svg';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  reverseArrowAfter?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => (
  <nav className="flex w-full min-w-0 items-center gap-1 overflow-hidden whitespace-nowrap">
    {items.map((item, i) => {
      const isLast = i === items.length - 1;
      const isMobileIntermediate = items.length > 2 && i > 0 && !isLast;
      return (
        <span
          key={i}
          className={`${isMobileIntermediate ? 'hidden sm:flex' : 'flex'} min-w-0 items-center gap-1 ${isLast ? 'flex-1' : 'shrink-0'}`}
        >
          {i > 0 && (
            <PolygonIcon
              className={`w-[12px] h-[10px] text-grey-400 shrink-0 ${
                items[i - 1].reverseArrowAfter ? 'rotate-180' : ''
              }`}
            />
          )}
          {isLast ? (
            <span className="block min-w-0 truncate text-primary-500 text-sub2-sb" title={item.label}>{item.label}</span>
          ) : (
            <span
              onClick={item.onClick}
              className={`whitespace-nowrap text-grey-500 text-body2-md ${item.onClick ? 'cursor-pointer hover:text-grey-700' : ''}`}
            >
              {item.label}
            </span>
          )}
        </span>
      );
    })}
  </nav>
);
