import { useLottie } from 'lottie-react';
import readABookAnimation from '@/assets/read-a-book.json';

const MyStoryBookAnimation = () => {
  const { View } = useLottie(
    {
      animationData: readABookAnimation,
      loop: true,
      autoplay: true,
    },
    { width: 120, height: 120 },
  );

  return (
    <div role="img" aria-label="책을 읽는 애니메이션">
      {View}
    </div>
  );
};

export const MyStoryTimelineEmptyState = () => (
  <section className="flex min-h-[52vh] flex-col items-center justify-center pb-10 text-center">
    <MyStoryBookAnimation />
    <p className="mt-3 text-sub2-sb text-grey-950">타임라인에 표시할 활동이 없어요</p>
    <p className="mt-2 text-body3-r leading-6 text-grey-500">
      [홈 - 기록종료 및 보관]한 활동들이<br />
      여기에 보관돼요
    </p>
  </section>
);

export const MyStoryRecordsEmptyState = () => (
  <section className="flex min-h-48 flex-col items-center justify-center py-6 text-center">
    <MyStoryBookAnimation />
    <p className="mt-2 text-sub2-sb text-grey-900">아직 보관된 기록이 없어요</p>
    <p className="mt-2 text-body3-r text-grey-500">활동에서 작성한 기록이 여기에 표시돼요.</p>
  </section>
);

export const MyStorySearchEmptyState = ({ query }: { query: string }) => (
  <section className="grid min-h-[55vh] place-items-center text-center">
    <div>
      <p className="text-title3 text-grey-900">"{query}"에 대한 검색 결과가 없습니다.</p>
      <p className="mt-3 text-body3-r text-grey-500">다른 키워드로 검색해 보세요.</p>
    </div>
  </section>
);
