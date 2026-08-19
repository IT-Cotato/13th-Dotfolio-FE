import type { InsightStrengthResponse, LatestInsightResponse } from '@/api/insight';
import AiRecordIcon from '@/assets/ai_record.svg';
import AiStarIcon from '@/assets/ai_star.svg';
import { AiStarBadge } from './AiStarBadge';

const COLORS = ['#4F72F8', '#7C5CF6', '#0EA5E9', '#EC4899', '#A855F7'];
const POSITIONS = [
  { top: 14, left: '35%' },
  { top: 40, left: '65%' },
  { top: 116, left: '83%' },
  { top: 142, left: '50%' },
  { top: 105, left: '17%' },
];

const formatPercent = (ratio: number) => Math.round(Math.max(0, Math.min(1, ratio)) * 100);

const formatRecordMonth = (value: string) => {
  const yearMonth = /^(\d{4})-(\d{2})/.exec(value);
  if (yearMonth) return `${yearMonth[1]}.${yearMonth[2]}`;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
};

interface InsightStrengthSectionProps {
  insight: LatestInsightResponse;
  selectedStrengthId: string | null;
  onSelectStrength: (strengthId: string | null) => void;
  onOpenRecord: (recordId: string) => Promise<void>;
}

export function InsightStrengthSection({ insight, selectedStrengthId, onSelectStrength, onOpenRecord }: InsightStrengthSectionProps) {
  const selectedStrength = insight.strengths.find((item) => item.strengthTagId === selectedStrengthId);

  return (
    <section className="overflow-hidden rounded-2xl border border-grey-100">
      <div className={`grid min-h-[520px] ${selectedStrength ? 'md:grid-cols-2' : ''}`}>
        <div className="flex min-w-0 flex-col p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-title2 text-grey-900">Top 5 강점</h2>
              <p className="mt-1 text-body3-md text-grey-500">AI가 {insight.analyzedRecordCount}개의 기록을 분석하여 도출한 핵심 강점이에요.</p>
            </div>
            {selectedStrength && (
              <button type="button" onClick={() => onSelectStrength(null)} className="cursor-pointer text-body2-md text-grey-500">전체 강점보기</button>
            )}
          </div>
          {selectedStrength ? (
            <StrengthCircle strength={selectedStrength} />
          ) : insight.strengths.length ? (
            <div className="relative mx-auto mt-6 h-[380px] w-full max-w-[900px]">
              {insight.strengths.map((strength, index) => (
                <StrengthBubble key={strength.strengthTagId} strength={strength} index={index} onClick={() => onSelectStrength(strength.strengthTagId)} />
              ))}
            </div>
          ) : <p className="py-20 text-center text-body2-md text-grey-500">분석된 강점이 없습니다.</p>}
          {!selectedStrength && <p className="mt-auto flex items-center gap-2 pt-6 text-body3-md text-grey-500"><AiStarBadge />강점을 클릭하면 연결된 경험을 탐색할 수 있습니다</p>}
        </div>
        {selectedStrength && <StrengthSummary strength={selectedStrength} onOpenRecord={onOpenRecord} />}
      </div>
    </section>
  );
}

function StrengthBubble({ strength, index, onClick }: { strength: InsightStrengthResponse; index: number; onClick: () => void }) {
  const color = COLORS[index % COLORS.length];
  const position = POSITIONS[index % POSITIONS.length];
  const core = Math.round(52 + Math.max(0, Math.min(1, strength.ratio)) * 48);
  return (
    <button type="button" onClick={onClick} className="absolute -translate-x-1/2 cursor-pointer text-center" style={{ left: position.left, top: position.top }}>
      <span className="relative mx-auto grid place-items-center rounded-full" style={{ width: core + 38, height: core + 38, backgroundColor: `${color}19` }}>
        <span className="grid place-items-center rounded-full text-body2-md text-white" style={{ width: core, height: core, background: `radial-gradient(circle, ${color} 0%, ${color} 42%, ${color}99 72%, ${color}1A 100%)`, boxShadow: `0 0 10px 4px ${color}40` }}>{strength.rank <= 3 ? strength.rank : ''}</span>
      </span>
      <strong className="mt-1 block text-body3-md" style={{ color }}>{strength.strengthName}</strong>
      <span className="text-label3-md text-grey-500">{strength.recordCount}개</span>
    </button>
  );
}

function StrengthCircle({ strength }: { strength: InsightStrengthResponse }) {
  const color = COLORS[(strength.rank - 1) % COLORS.length];
  return (
    <div className="relative mt-6 grid min-h-[390px] flex-1 place-items-center overflow-hidden">
      <span aria-hidden className="absolute left-[14%] top-[63%] size-11 rounded-full bg-category-purple-bg" />
      <span aria-hidden className="absolute right-[15%] top-[39%] size-16 rounded-full bg-category-purple-bg" />
      <span aria-hidden className="absolute right-[5%] top-[76%] size-12 rounded-full bg-category-mint-bg" />
      <span aria-hidden className="absolute bottom-[2%] right-[34%] size-10 rounded-full bg-category-pink-bg" />
      <div className="relative z-10 text-center">
        <span className="mx-auto grid size-36 place-items-center rounded-full text-title2 text-white" style={{ background: `radial-gradient(circle, ${color} 0%, ${color} 42%, ${color}99 68%, ${color}1A 72%)`, boxShadow: `0 0 0 18px ${color}12` }}>{strength.rank}</span>
        <strong className="mt-7 block text-title2" style={{ color }}>{strength.strengthName}</strong>
        <span className="text-body2-md text-grey-600">{strength.recordCount}개</span>
      </div>
    </div>
  );
}

function StrengthSummary({ strength, onOpenRecord }: { strength: InsightStrengthResponse; onOpenRecord: (recordId: string) => Promise<void> }) {
  return (
    <aside className="min-w-0 bg-grey-50 p-6 md:p-8">
      <div className="rounded-2xl border border-primary-100 bg-primary-50 px-5 py-4">
        <span className="mb-2 flex items-center gap-2 text-body2-md text-primary-500"><AiStarIcon className="size-4 shrink-0 [&_path]:fill-current" />AI 요약</span>
        <p className="text-label1-sb leading-6 text-grey-900">“전체 분석 기록의 {formatPercent(strength.ratio)}%에서 {strength.strengthName} 강점이 반복적으로 나타났습니다.”</p>
      </div>
      <h3 className="mb-2 mt-8 text-body2-md text-grey-600">연결된 기록 ({strength.records.length})</h3>
      <div className="max-h-[345px] overflow-y-auto scrollbar-hide">
        {strength.records.map((record) => (
          <button type="button" disabled={!record.navigationAvailable} key={record.recordId} onClick={() => void onOpenRecord(record.recordId)} className="group/record flex w-full cursor-pointer items-center justify-between border-b border-grey-100 py-5 text-left disabled:cursor-default">
            <span className="min-w-0 pr-4">
              <span className="block truncate text-sub1-sb text-grey-900 group-disabled/record:text-grey-400">{record.recordTitle}</span>
              <time dateTime={record.completedAt} className="mt-2 block text-body2-md text-grey-500 group-disabled/record:text-grey-400">{formatRecordMonth(record.completedAt)}</time>
            </span>
            <AiRecordIcon aria-hidden className="size-5 shrink-0 text-primary-500 group-disabled/record:text-grey-300" />
          </button>
        ))}
      </div>
    </aside>
  );
}
