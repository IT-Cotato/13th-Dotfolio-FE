import { MemoCreateButton } from './MemoCreateButton';
import { ActivityTagDropdown } from './ActivityTagDropdown';

interface MemoHeaderProps {
  onCreate: () => void;
  tags: string[];
  selectedTag: string;
  onTagChange: (tag: string) => void;
}

export const MemoHeader = ({ onCreate, tags, selectedTag, onTagChange }: MemoHeaderProps) => {
  return (
    <header className="flex w-full items-center justify-between gap-4">
      <ActivityTagDropdown tags={tags} selectedTag={selectedTag} onChange={onTagChange} />
      <MemoCreateButton onClick={onCreate} />
    </header>
  );
};
