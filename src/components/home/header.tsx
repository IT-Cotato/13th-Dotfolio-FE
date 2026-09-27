import { ActivityCalendar } from './ActivityCalendar';
import { NotiColor } from './NotiColor';
import QuestionMarkIcon from '@/assets/questionmark.svg';

export const HomeHeader = () => {
  return (
    <div className="relative flex w-full flex-col items-stretch gap-6 rounded-[24px] bg-grey-50 p-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4 md:rounded-4xl md:p-14">
      <div className="flex min-w-0 flex-col gap-3">
        <div>
          <p className="text-[clamp(1.375rem,6.2vw,1.75rem)] leading-[1.35] font-bold tracking-[-0.02rem] text-grey-900 sm:text-header">
            하루의 작은 점들이 모여
          </p>
          <p className="text-[clamp(1.375rem,6.2vw,1.75rem)] leading-[1.35] font-bold tracking-[-0.02rem] sm:text-header">
            <span className="text-grey-900">나만의 </span>
            <span className="whitespace-nowrap text-primary-500">포트폴리오</span>
            <span className="text-grey-900">가</span>
            <span className="block text-grey-900 sm:inline"> 되는 곳</span>
          </p>
        </div>
        <p className="text-body1-r text-grey-700">
          흩어진 경험을 모아<br />
          나만의 성장 스토리를 만들어보세요.
        </p>
      </div>
      <div className="self-end sm:self-auto">
        <ActivityCalendar />
      </div>
      <div className="absolute bottom-0 right-0 group">
        <QuestionMarkIcon className="w-19.5 h-19.5 cursor-pointer" />
        <div className="absolute top-15.5 right-3.5 z-50 mt-2 hidden group-hover:block">
          <NotiColor />
        </div>
      </div>
    </div>
  );
};
