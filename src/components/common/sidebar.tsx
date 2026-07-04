import { useState } from 'react';

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
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, label, hasChevron = false, isActive = false, onClick }: NavItemProps) => (
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
    {hasChevron && <ChevronRightIcon />}
  </button>
);

export const Sidebar = () => {
  const [active, setActive] = useState('홈');

  return (
    <nav className="w-full flex flex-col gap-3">
      <NavItem
        icon={<DotOneIcon />}
        label="홈"
        isActive={active === '홈'}
        onClick={() => setActive('홈')}
      />
      <NavItem
        icon={<DotTwoIcon />}
        label="메모하기"
        isActive={active === '메모하기'}
        onClick={() => setActive('메모하기')}
      />
      <NavItem
        icon={<DotThreeIcon />}
        label="기록하기"
        hasChevron
        isActive={active === '기록하기'}
        onClick={() => setActive('기록하기')}
      />
      <NavItem
        icon={<DotGridIcon />}
        label="나의 스토리"
        hasChevron
        isActive={active === '나의 스토리'}
        onClick={() => setActive('나의 스토리')}
      />
    </nav>
  );
};
