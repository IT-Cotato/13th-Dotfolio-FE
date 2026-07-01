import { Card } from '@/components/common/card';
import { HomeHeader } from '@/components/home/header';

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
    </Card>
  );
}
