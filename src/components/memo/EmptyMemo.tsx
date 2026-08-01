import { NotesAnimation } from './NotesAnimation';

export const EmptyMemo = () => (
  <section className="flex min-h-[calc(100vh-260px)] flex-1 flex-col items-center justify-center pb-8 text-center">
    <NotesAnimation />
    <p className="mt-2.5 text-sub1-sb text-grey-950">떠오르는 생각을 적어볼까요?</p>
    <p className="mt-2.5 text-body2-r text-grey-700">
      메모가 하나씩 쌓이면<br />
      나중에 근사한 기록으로 완성될 거예요
    </p>
  </section>
);
