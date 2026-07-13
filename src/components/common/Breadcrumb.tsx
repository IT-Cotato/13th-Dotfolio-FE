import PolygonIcon from '@/assets/polygon.svg';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => (
  <nav className="w-full flex items-center gap-1">
    {items.map((item, i) => {
      const isLast = i === items.length - 1;
      return (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <PolygonIcon className="w-[12px] h-[10px] text-grey-400 shrink-0" />}
          {isLast ? (
            <span className="text-primary-500 text-sub2-sb">{item.label}</span>
          ) : (
            <span
              onClick={item.onClick}
              className={`text-grey-500 text-body2-md ${item.onClick ? 'cursor-pointer hover:text-grey-700' : ''}`}
            >
              {item.label}
            </span>
          )}
        </span>
      );
    })}
  </nav>
);
