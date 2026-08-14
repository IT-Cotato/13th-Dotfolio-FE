import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const firstTag = activity.activityTypeName;
  const endLabel = activity.endDateUnknown ? '현재 진행 중' : activity.endDate;
  const inProgress = activity.recordCount - activity.completedCount;

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        menuPanelRef.current && !menuPanelRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [menuOpen]);

  useLayoutEffect(() => {
    if (!menuOpen || !triggerRef.current || !menuPanelRef.current) {
      setMenuPos(null);
      return;
    }
    const gap = 4;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuRect = menuPanelRef.current.getBoundingClientRect();

    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const openUpward = spaceBelow < menuRect.height + gap && triggerRect.top > menuRect.height + gap;
    const top = openUpward ? triggerRect.top - menuRect.height - gap : triggerRect.bottom + gap;
    const left = Math.max(8, Math.min(triggerRect.right - menuRect.width, window.innerWidth - menuRect.width - 8));

    setMenuPos({ top, left });
  }, [menuOpen]);

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
        <div
          className="absolute bg-white"
          style={{
            top: '14px',
            right: '10px',
            bottom: 1,
            left: 2,
            borderRadius: '7.52% / 10.75%',
          }}
        />
        <FolderCard className="absolute inset-0 w-full h-full" />
      </div>

      <div className="absolute inset-0">
        <div className="absolute top-4 left-4 max-w-[calc(100%-2rem)]">
          <Tag label={firstTag} />
        </div>

        {/* 본문 */}
        <div className="absolute inset-x-4 bottom-4 flex flex-col gap-2.5" style={{ top: '30.6%' }}>
          <div className="flex flex-col gap-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sub1-sb text-grey-950 truncate">{activity.title}</p>
              <div
                ref={triggerRef}
                className="relative shrink-0"
                onClick={e => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center text-grey-500 text-body2-md cursor-pointer leading-none rounded-[5px] hover:bg-[#EAEEF4] transition-colors"
                  onClick={() => setMenuOpen(prev => !prev)}
                >
                  ···
                </button>
              </div>
              {menuOpen && createPortal(
                <div
                  ref={menuPanelRef}
                  className="fixed z-50"
                  style={{
                    top: menuPos?.top ?? 0,
                    left: menuPos?.left ?? 0,
                    visibility: menuPos ? 'visible' : 'hidden',
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <ActivityMenu
                    onEnd={() => { setMenuOpen(false); onEnd?.(); }}
                    onEdit={() => { setMenuOpen(false); onEdit?.(); }}
                    onDelete={() => { setMenuOpen(false); onDelete?.(); }}
                  />
                </div>,
                document.body
              )}
            </div>
            <p className="text-body3-md text-grey-900 truncate">
              {activity.startDate}{endLabel ? ` ~ ${endLabel}` : ''}
            </p>
          </div>

          <div className="flex flex-col gap-2 mt-auto">
            <p className="text-body3-md text-grey-700 truncate">
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
