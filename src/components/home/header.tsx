export const HomeHeader = () => {
  return (
    <div className="w-full flex justify-between items-start rounded-4xl bg-grey-50 p-14">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-header text-grey-900">하루의 작은 점들이 모여</p>
          <p className="text-header">
            <span className="text-grey-900">나만의 </span>
            <span className="text-primary-500">포트폴리오</span>
            <span className="text-grey-900">가 되는 곳</span>
          </p>
        </div>
        <p className="text-body1-r text-grey-700">
          흩어진 경험을 모아<br />
          나만의 성장 스토리를 만들어보세요.
        </p>
      </div>
      {/* TODO: 캘린더 컴포넌트 */}
      <div />
    </div>
  );
};
