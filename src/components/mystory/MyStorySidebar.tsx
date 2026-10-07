import { useLocation, useNavigate } from 'react-router-dom';
import LockIcon from '@/assets/lock.svg';

const MY_STORY_ROUTES = [
  { path: '/mystory/archive', label: '활동 보관함' },
  { path: '/mystory/insights', label: '인사이트', locked: true },
  { path: '/mystory/ai-matching', label: 'AI 기록 매칭', locked: true },
];

export const MyStorySidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="relative flex flex-col">
      <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-grey-200" />
      {MY_STORY_ROUTES.map(item => {
        const selected = location.pathname === item.path;
        return (
          <button
            type="button"
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`relative w-full py-3 pl-4 pr-2 text-left cursor-pointer ${
              selected ? 'text-sub2-sb text-grey-900' : 'text-body2-md text-grey-700'
            }`}
          >
            {selected && <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-grey-700" />}
            <span className="flex items-center gap-2">
              {item.locked && <LockIcon aria-hidden className="size-[22px] shrink-0" />}
              <span>{item.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
