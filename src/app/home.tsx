import { Card } from '@/components/common/card';
import { HomeHeader } from '@/components/home/header';
import { PrimaryButton } from '@/components/common/createButton';

export default function Home() {
  const activityCount = 0;

  return (
    <Card>
      <HomeHeader />
      <section className="w-full">
        <div className="flex items-center gap-2">
          <span className="text-title1 text-grey-900">기록 중인 활동</span>
          <span className="text-title1 text-grey-900">{activityCount}</span>
        </div>
      </section>
      {activityCount === 0 && (
        <section className="w-full flex flex-col items-center text-center gap-8">
          <div className="flex flex-col items-center gap-2.5">
            <img src="/book.gif" alt="book" />
            <div className="flex flex-col gap-3">
              <p className="text-sub1-sb text-grey-950">첫 기록을 남겨볼까요?</p>
              <p className="text-body2-r text-grey-700">
                경험을 하나씩 쌓다 보면 어느새 그럴싸한<br />
                포트폴리오가 되어 있을 거예요
              </p>
            </div>
          </div>
          <PrimaryButton label="활동 기록하기" />
        </section>
      )}
    </Card>
  );
}
