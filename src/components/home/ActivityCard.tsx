import { useState } from 'react';
import FolderCard from '@/assets/folder-card.svg';
import { Tag } from '@/components/home/folder/Tag';
import { ActivityMenu } from '@/components/home/folder/ActivityMenu';
import { ProgressBar } from '@/components/home/ProgressBar';
import type { Activity } from '@/types/activity';

interface ActivityCardProps {
  activity: Activity;
  onClick?: () => void;
  onEdit?: () => void;
  onEnd?: () => void;
  onDelete?: () => void;
}

export const ActivityCard = ({ activity, onClick, onEdit, onEnd, onDelete }: ActivityCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const firstTag = activity.tags[0] ?? '';
  const endLabel = activity.endDateUnknown ? '현재 진행 중' : activity.endDate;
  const inProgress = activity.recordCount - activity.completedCount;

  return (
    <div
      className="relative w-full cursor-pointer"
      style={{ aspectRatio: '266/186' }}
      onClick={onClick}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: '7.52% / 10.75%',
          background: 'linear-gradient(180deg, #DEE6EF 0%, rgba(222, 230, 239, 0.50) 26.32%)',
        }}
      >
        <FolderCard className="absolute inset-0 w-full h-full" />
      </div>

      <div className="absolute inset-0">
        <div className="absolute top-4 left-4">
          <Tag label={firstTag} />
        </div>

        {/* 본문 */}
        <div className="absolute inset-x-4 bottom-4 flex flex-col gap-2.5" style={{ top: '30.6%' }}>
          <div className="flex flex-col gap-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sub1-sb text-grey-950 truncate">{activity.title}</p>
              <div className="relative shrink-0">
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center text-grey-500 text-body2-md cursor-pointer leading-none rounded-[5px] hover:bg-[#EAEEF4] transition-colors"
                  onClick={e => { e.stopPropagation(); setMenuOpen(prev => !prev); }}
                >
                  ···
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-1 z-10">
                    <ActivityMenu
                      onEnd={() => { setMenuOpen(false); onEnd?.(); }}
                      onEdit={() => { setMenuOpen(false); onEdit?.(); }}
                      onDelete={() => { setMenuOpen(false); onDelete?.(); }}
                    />
                  </div>
                )}
              </div>
            </div>
            <p className="text-body3-md text-grey-900">
              {activity.startDate}{endLabel ? ` ~ ${endLabel}` : ''}
            </p>
          </div>

          <div className="flex flex-col gap-2 mt-auto">
            <p className="text-body3-md text-grey-700">
              기록 중 <span className="text-sub3-sb">{inProgress}</span> · 기록 완료{' '}
              <span className="text-sub3-sb">{activity.completedCount}</span>
            </p>
            <ProgressBar value={activity.completedCount} max={activity.recordCount} />
          </div>
        </div>
      </div>
    </div>
  );
};
