import AiStarIcon from '@/assets/ai_star.svg';

export function AiStarBadge() {
  return (
    <span className="grid size-6 shrink-0 place-items-center rounded-lg border border-primary-100 bg-primary-50">
      <AiStarIcon className="size-4 text-primary-500 [&_path]:fill-current" />
    </span>
  );
}
