const ITEMS = [
  { dotClass: 'border border-grey-100 bg-transparent', label: '아직 오지 않은 날' },
  { dotClass: 'bg-grey-100', label: '아무 활동도 하지 않은 날' },
  { dotClass: 'bg-primary-100', label: '메모만 작성한 날' },
  { dotClass: 'bg-primary-gradient', label: '메모와 기록을 모두 남긴 날' },
];

export const NotiColor = () => (
  <div className="bg-white rounded-[16px] border border-grey-100 py-2 w-52">
    <p className="px-4 pb-1.5 text-label3-sb text-grey-900">캘린더 점 색상 안내</p>
    <div className="flex flex-col px-1.5">
      {ITEMS.map(({ dotClass, label }) => (
        <div key={label} className="flex items-center gap-2 px-1.5 py-1.5 mr-2">
          <div className={`w-7 h-7 rounded-full shrink-0 ${dotClass}`} />
          <span className="text-body3-md text-grey-900 whitespace-nowrap">{label}</span>
        </div>
      ))}
    </div>
  </div>
);
