import type { ComponentType, SVGProps } from "react";

interface PainPointCardProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  children: string;
}

export function PainPointCard({
  icon: Icon,
  title,
  children,
}: PainPointCardProps) {
  return (
    <article className="flex w-96 flex-col items-start gap-2.5 rounded-[40px] border-2 border-white bg-[rgba(255,255,255,0.70)] p-7 shadow-[0_0_15px_0_rgba(22,53,164,0.05)]">
      <div className="flex w-full flex-col items-start gap-6">
        <span className="flex size-15 aspect-square items-center justify-center gap-2.5 rounded-[18px] bg-[#EDF3FF] p-0.75">
          <Icon aria-hidden="true" />
        </span>

        <div className="flex w-full flex-col items-start gap-4">
          <h3 className="w-full text-[22px] leading-[140%] font-semibold tracking-[-0.22px] text-grey-900">
            {title}
          </h3>
          <p className="w-full whitespace-pre-line text-body-reading1-r text-grey-600">
            {children}
          </p>
        </div>
      </div>
    </article>
  );
}
