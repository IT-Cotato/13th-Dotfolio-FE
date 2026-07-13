import { useNavigate, useLocation } from 'react-router-dom';

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

const NAV_ITEMS: { icon: React.ReactNode; label: string; path?: string; hasChevron?: boolean }[] = [
  { icon: <DotOneIcon />, label: '홈', path: '/' },
  { icon: <DotTwoIcon />, label: '메모하기' },
  { icon: <DotThreeIcon />, label: '기록하기', path: '/record', hasChevron: true },
  { icon: <DotGridIcon />, label: '나의 스토리', hasChevron: true },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="w-full flex flex-col gap-3">
      {NAV_ITEMS.map(item => (
        <NavItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          hasChevron={item.hasChevron}
          isActive={item.path !== undefined && location.pathname === item.path}
          onClick={item.path !== undefined ? () => navigate(item.path!) : undefined}
        />
      ))}
    </nav>
  );
};
