import { MyStoryRecordsEmptyState, MyStoryTimelineEmptyState } from './MyStoryEmptyState';
import type { Activity, StoryRecord } from './myStoryTypes';
import MyStoryEditIcon from '@/assets/mystory_edit.svg';
import MyStoryDeleteIcon from '@/assets/mystory_delete.svg';
import ArrowIcon from '@/assets/arrow.svg';
import MoreIcon from '@/assets/more.svg';

interface MyStoryTimelineProps {
  activities: Activity[];
  records: StoryRecord[];
  expandedIds: ReadonlySet<string>;
  onToggle: (id: string) => void;
  openMenuId: string | null;
  onOpenDetail: (record: StoryRecord) => void;
  onToggleMenu: (id: string) => void;
  onEditActivity: (activity: Activity) => void;
  onDeleteActivity: (activity: Activity) => void;
}
export function MyStoryTimeline({
  activities,
  records,
  expandedIds,
  openMenuId,
  onToggle,
  onOpenDetail,
  onToggleMenu,
  onEditActivity,
  onDeleteActivity,
}: MyStoryTimelineProps) {
  if (!activities.length) {
    return (
      <div>
        <h1 className="mb-8 text-title1 text-grey-900">타임라인</h1>
        <MyStoryTimelineEmptyState />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-title1 text-grey-900">타임라인</h1>
      <div className="relative pl-[54px]">
        <span className="absolute left-[4px] top-3 bottom-7 w-0.5 bg-[linear-gradient(180deg,#DEE6EF_0%,rgba(222,230,239,0.2)_100%)]" />
        {activities.map(activity => {
          const open = expandedIds.has(activity.id);
          const activityRecords = records.filter(record => record.activityId === activity.id);
          const period = `${activity.startDate.slice(0, 7)} ~ ${activity.endDateUnknown ? '현재' : activity.endDate.slice(0, 7)}`;
          return (
            <article key={activity.id} className="relative pb-4 last:pb-0">
              <span className="absolute -left-[54px] top-2.5 w-2.5 h-2.5 rounded-full bg-primary-500" />
              <div className="w-full text-left">
                <div className="flex items-start justify-between gap-5">
                  <button type="button" onClick={() => onToggle(activity.id)} className="cursor-pointer text-left" aria-label={`${activity.title} ${period}`}>
                    <div className="flex items-center gap-3 text-grey-900">
                      <h2 className="text-sub1-sb">{activity.title}</h2>
                      <ArrowIcon
                        className={`size-4 shrink-0 text-grey-400 transition-transform ${
                          open ? '-rotate-90' : 'rotate-90'
                        }`}
                      />
                    </div>
                    <p className="mt-1 text-body3-md text-grey-600">{period}</p>
                  </button>
                  <div className="flex items-center gap-5">
                    <span className="rounded-lg border border-grey-100 px-3 py-1 text-label3-sb text-grey-900">{activity.category}</span>
                    <div className="relative">
                      <button
                        type="button"
                        aria-label={`${activity.title} 활동 관리`}
                        onClick={() => onToggleMenu(activity.id)}
                        className={`flex size-6 items-center justify-center rounded-lg text-grey-400 cursor-pointer hover:bg-grey-50 ${openMenuId === activity.id ? 'bg-grey-50' : ''}`}
                      >
                        <MoreIcon aria-hidden="true" className="size-4" />
                      </button>
                      {openMenuId === activity.id && (
                        <div className="absolute right-0 top-8 z-20 flex w-44 flex-col gap-1 rounded-2xl border border-grey-100 bg-white py-2 shadow-[0_0_30px_rgba(22,53,164,.08)]">
                          <p className="px-4 py-2 text-label2-sb text-grey-500">활동 관리</p>
                          <button type="button" onClick={() => onEditActivity(activity)} className="flex w-full items-center gap-2 px-4 py-3 text-left text-body2-md text-grey-900 cursor-pointer hover:bg-grey-50">
                            <MyStoryEditIcon className="size-6 shrink-0" />
                            활동 수정
                          </button>
                          <button type="button" onClick={() => onDeleteActivity(activity)} className="flex w-full items-center gap-2 px-4 py-3 text-left text-body2-md text-grey-900 cursor-pointer hover:bg-grey-50">
                            <MyStoryDeleteIcon className="size-6 shrink-0" />
                            활동 삭제
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {open && (
                <div className="mt-5 border-t border-grey-100 pt-4">
                  <p className="mb-3 text-body3-md text-grey-700">
                    <strong className="text-sub3-sb text-grey-900">{activityRecords.length}</strong>개의 기록
                  </p>
                  {activityRecords.length ? (
                    <div className="flex flex-col gap-2">
                    {activityRecords.map(record => (
                      <button
                        type="button"
                        key={record.id}
                        onClick={() => onOpenDetail(record)}
                        className="flex items-center justify-between rounded-xl bg-grey-50 px-5 py-4 text-left cursor-pointer hover:bg-primary-50 transition-colors"
                      >
                        <span>
                          <strong className="block text-label1-md text-grey-900">{record.title}</strong>
                          <span className="mt-2 block text-body3-md text-grey-600">{record.date}</span>
                        </span>
                        <ArrowIcon className="size-4 shrink-0 text-grey-400" />
                      </button>
                    ))}
                    </div>
                  ) : (
                    <MyStoryRecordsEmptyState />
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
