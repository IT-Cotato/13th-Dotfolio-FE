import AddIcon from '@/assets/add.svg';

interface MemoCreateButtonProps {
  onClick: () => void;
}

export const MemoCreateButton = ({ onClick }: MemoCreateButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className="bg-primary-gradient flex h-11 items-center gap-2 rounded-xl py-2.5 pl-3.5 pr-5 text-sub2-sb text-white"
  >
    <AddIcon className="h-5 w-5" />
    <span>메모 생성</span>
  </button>
);
