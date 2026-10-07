import ConstructionIcon from '@/assets/construction.svg';
import { Card } from '@/components/common/card';

export function MyStoryComingSoon({ title }: { title: string }) {
  return (
    <Card className="items-stretch gap-0 rounded-t-[24px] p-4 md:rounded-t-[36px] md:p-6">
      <h1 className="text-title1 text-grey-900">{title}</h1>
      <div className="flex min-h-[55vh] flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-2.5">
          <ConstructionIcon aria-hidden className="size-20 shrink-0" />
          <p className="text-center text-body2-md text-grey-700">
            더 나은 경험 정리를 위해<br />
            새로 준비 중인 기능이에요!
          </p>
        </div>
      </div>
    </Card>
  );
}
