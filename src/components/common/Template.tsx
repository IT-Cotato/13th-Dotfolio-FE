import DocumentIcon from '@/assets/document.svg';
import ArrowForwardIcon from '@/assets/arrow_forward.svg';

interface TemplateProps {
  title: string;
  description: string;
  bgClassName: string;
  borderClassName: string;
  footerLabel?: string;
  onClick?: () => void;
}

export const Template = ({
  title,
  description,
  bgClassName,
  borderClassName,
  footerLabel = '도트폴리오의 템플릿',
  onClick,
}: TemplateProps) => (
  <div
    className={`w-full flex flex-col rounded-2xl border overflow-hidden cursor-pointer ${borderClassName}`}
    style={{ aspectRatio: '266/201' }}
    onClick={onClick}
  >
    <div className={`w-full flex-1 flex flex-col items-start gap-4 px-4 pt-4 pb-13 border-b ${borderClassName} ${bgClassName}`}>
      <p className="text-grey-950 text-sub1-sb">{title}</p>
      <p className="text-grey-700 text-body3-r">{description}</p>
    </div>
    <div className="w-full shrink-0 flex items-center justify-between p-4 bg-grey-0">
      <span className="flex items-center gap-1 text-grey-600 text-caption1">
        <DocumentIcon className="w-4 h-4 text-grey-600" />
        {footerLabel}
      </span>
      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-grey-700 text-grey-0">
        <ArrowForwardIcon className="w-4 h-4" />
      </span>
    </div>
  </div>
);
