const ITEMS = [
  { dotClass: 'border border-grey-100 bg-transparent', label: '아직 오지 않은 날' },
  { dotClass: 'bg-grey-100', label: '아무 활동도 하지 않은 날' },
  { dotClass: 'bg-primary-100', label: '메모만 작성한 날' },
  { dotClass: 'bg-primary-gradient', label: '메모와 기록을 모두 남긴 날' },
];

export const NotiColor = () => (
  <div className="bg-white rounded-[20px] border border-grey-100 py-3 w-62">
    <p className="px-5 pb-2 text-label2-sb text-grey-900">캘린더 점 색상 안내</p>
    <div className="flex flex-col px-2">
      {ITEMS.map(({ dotClass, label }) => (
        <div key={label} className="flex items-center gap-2.5 px-2 py-2 mr-3">
          <div className={`w-10 h-10 rounded-full shrink-0 ${dotClass}`} />
          <span className="text-body2-md text-grey-900 whitespace-nowrap">{label}</span>
        </div>
      ))}
    </div>
  </div>
);
