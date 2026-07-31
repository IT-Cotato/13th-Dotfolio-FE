import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AddIcon from '@/assets/add.svg';
import { RECORD_ACTIVITIES } from '@/constants/recordActivities';
import { ActivityModal } from '@/components/home/ActivityModal';

const DotOneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
  </svg>
);

const DotTwoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="12" r="2.5" fill="currentColor" />
    <circle cx="15" cy="12" r="2.5" fill="currentColor" />
  </svg>
);

const DotThreeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="5" cy="12" r="2.5" fill="currentColor" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    <circle cx="19" cy="12" r="2.5" fill="currentColor" />
  </svg>
);

const DotGridIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="9" r="2.5" fill="currentColor" />
    <circle cx="15" cy="9" r="2.5" fill="currentColor" />
    <circle cx="9" cy="15" r="2.5" fill="currentColor" />
    <circle cx="15" cy="15" r="2.5" fill="currentColor" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  hasChevron?: boolean;
  chevronOpen?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, label, hasChevron = false, chevronOpen = false, isActive = false, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-3 rounded-[14px] cursor-pointer ${
      isActive
        ? 'bg-white shadow-[0_0_30px_0_rgba(22,53,164,0.08)] text-grey-900'
        : 'bg-transparent text-grey-700'
    }`}
  >
    <div className="flex items-center gap-4">
      {icon}
      <span className={isActive ? 'text-sub2-sb' : 'text-body2-md'}>{label}</span>
    </div>
    {hasChevron && (
      <span className={`transition-transform ${chevronOpen ? 'rotate-90' : ''}`}>
        <ChevronRightIcon />
      </span>
    )}
  </button>
);

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isRecordActive = location.pathname === '/record';
  const [recordOpen, setRecordOpen] = useState(isRecordActive);
  const [selectedActivityId, setSelectedActivityId] = useState(RECORD_ACTIVITIES[1].id);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [activeBar, setActiveBar] = useState<{ top: number; height: number } | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  useLayoutEffect(() => {
    if (!recordOpen) return;
    const container = listRef.current;
    const activeEl = itemRefs.current[selectedActivityId];
    if (!container || !activeEl) return;
    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();
    setActiveBar({ top: activeRect.top - containerRect.top, height: activeRect.height });
  }, [recordOpen, selectedActivityId]);

  return (
    <nav className="w-full flex flex-col gap-3">
      <NavItem
        icon={<DotOneIcon />}
        label="홈"
        isActive={location.pathname === '/'}
        onClick={() => navigate('/')}
      />
      <NavItem
        icon={<DotTwoIcon />}
        label="메모하기"
        isActive={location.pathname === '/memo'}
        onClick={() => navigate('/memo')}
      />

      <div className="w-full flex flex-col gap-3">
        <NavItem
          icon={<DotThreeIcon />}
          label="기록하기"
          hasChevron
          chevronOpen={recordOpen}
          isActive={isRecordActive}
          onClick={() => {
            navigate('/record');
            setRecordOpen(prev => !prev);
          }}
        />
        {recordOpen && (
          <div className="w-full flex flex-col gap-3">
            <div ref={listRef} className="relative flex flex-col gap-2">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-grey-200" />
              {activeBar && (
                <div
                  className="absolute left-0 w-0.5 bg-grey-700 transition-all"
                  style={{ top: activeBar.top, height: activeBar.height }}
                />
              )}
              {RECORD_ACTIVITIES.map(activity => {
                const isSelected = activity.id === selectedActivityId;
                return (
                  <button
                    key={activity.id}
                    ref={el => { itemRefs.current[activity.id] = el; }}
                    type="button"
                    onClick={() => setSelectedActivityId(activity.id)}
                    className={`w-full text-left py-3 pl-4 pr-4 cursor-pointer transition-colors text-grey-900 ${
                      isSelected ? 'text-sub2-sb' : 'text-body2-md'
                    }`}
                  >
                    {activity.title}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setIsActivityModalOpen(true)}
              className="w-full flex gap-2 px-4 py-3 rounded-xl border border-dashed border-primary-200 text-primary-400 text-body2-md cursor-pointer"
            >
              <AddIcon className="w-5 h-5" />
              활동 추가
            </button>
          </div>
        )}
      </div>

      <NavItem icon={<DotGridIcon />} label="나의 스토리" hasChevron />

      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSubmit={() => setIsActivityModalOpen(false)}
      />
    </nav>
  );
};
