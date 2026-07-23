import StorageIcon from '@/assets/storage.svg';
import PencilIcon from '@/assets/pencil.svg';
import TrashIcon from '@/assets/trash.svg';

interface ActivityMenuProps {
  onEnd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MenuItem = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center pl-2 pr-4 gap-2 py-2 rounded-xl text-body2-md text-grey-900 hover:bg-grey-50 transition-colors cursor-pointer"
  >
    {icon}
    {label}
  </button>
);

export const ActivityMenu = ({ onEnd, onEdit, onDelete }: ActivityMenuProps) => (
  <div
    className="flex flex-col gap-1 py-2 bg-white rounded-2xl border border-grey-100 min-w-[180px]"
    style={{ boxShadow: '0 0 30px 0 rgba(22, 53, 164, 0.08)' }}
  >
    <p className="px-4 pt-1.5 pb-1 text-label2-sb text-grey-500">활동 관리</p>

    <div className="flex flex-col px-1.5">
      <MenuItem
        icon={<StorageIcon className="w-6 h-6 text-grey-700" />}
        label="기록 종료 및 보관"
        onClick={onEnd}
      />
      <MenuItem
        icon={<PencilIcon className="w-6 h-6 text-grey-700" />}
        label="활동 수정"
        onClick={onEdit}
      />
      <MenuItem
        icon={<TrashIcon className="w-6 h-6 text-grey-700" />}
        label="활동 삭제"
        onClick={onDelete}
      />
    </div>
  </div>
);
