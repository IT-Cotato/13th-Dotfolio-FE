import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/common/button';
import { Card } from '@/components/common/card';
import AiRecordIcon from '@/assets/ai_record.svg';
import AiStarIcon from '@/assets/ai_star.svg';

const DOCUMENT_ICON_URL = new URL('../../assets/document.png', import.meta.url).href;
const BRIEFCASE_ICON_URL = new URL('../../assets/briefcase.png', import.meta.url).href;

const TEMPLATE_STATS = [
  ['아이디어 · 기획', 43, '#607CF8'],
  ['협업 · 소통', 27, '#8B6AF0'],
  ['문제해결 · 성과', 18, '#13A8DD'],
  ['도전 · 몰입', 12, '#AD4DF1'],
] as const;

const STRENGTHS = [
  {
    rank: 1,
    name: '문제해결',
    count: 8,
    color: '#4F72F8',
    core: 100,
    halo: 138,
    top: 14,
    left: '35%',
    summary: '복잡한 문제를 분석하고 해결한 경험이 반복적으로 나타났습니다.',
    records: ['데이터 시각화 대시보드 개선', '서비스 이탈 원인 분석', '사용자 동선 개선안 도출', '운영 병목 프로세스 개선'],
  },
  {
    rank: 2,
    name: '커뮤니케이션',
    count: 7,
    color: '#7C5CF6',
    core: 82,
    halo: 120,
    top: 40,
    left: '65%',
    summary: '다양한 이해관계자의 의견을 조율하고 공동 목표를 만든 경험이 돋보입니다.',
    records: ['스타트업 팀 간 갈등 조율 및 협업 설계', '첫 팀 미팅 및 아이디어 브레인스토밍', '직군 간 일정 합의', '사용자 인터뷰 결과 공유'],
  },
  {
    rank: 3,
    name: '데이터 분석',
    count: 6,
    color: '#0EA5E9',
    core: 72,
    halo: 110,
    top: 116,
    left: '83%',
    summary: '데이터에서 핵심 지표를 찾아 의사결정 근거로 활용한 경험이 강점입니다.',
    records: ['핵심 지표 재정의', '설문 데이터 분석 및 결과 공유', '유입 경로별 전환율 분석', '실험 결과 리포트 작성'],
  },
  {
    rank: 4,
    name: '창의성',
    count: 4,
    color: '#EC4899',
    core: 52,
    halo: 90,
    top: 142,
    left: '50%',
    summary: '익숙한 문제를 새로운 관점으로 바꾸어 해결안을 제안한 경험이 나타납니다.',
    records: ['신규 온보딩 아이디어 제안', '콘텐츠 포맷 실험', '사용자 참여 캠페인 기획', '서비스 네이밍 워크숍'],
  },
  {
    rank: 5,
    name: '리더십',
    count: 5,
    color: '#A855F7',
    core: 62,
    halo: 100,
    top: 105,
    left: '17%',
    summary: '목표와 역할을 명확히 정리해 팀이 실행에 집중하도록 이끈 경험이 확인됩니다.',
    records: ['프로젝트 역할 분담 및 일정 수립', '회고 방식 개선', '신규 팀원 온보딩', '팀 목표 및 우선순위 합의'],
  },
] as const;

const ROLE_SKILLS = [
  {
    name: '문제 정의',
    title: '데이터 시각화 대시보드 개선',
    description: '사용자가 원하는 지표를 빠르게 찾지 못하는 원인을 분석하고 핵심 문제를 정보 구조로 구체화했습니다.',
    reason: '모호한 불편을 관찰 가능한 문제로 정의하고 개선 목표를 명확히 한 역량이 잘 드러납니다.',
  },
  {
    name: '커뮤니케이션',
    title: '스타트업 팀 간 갈등 조율 및 협업 설계',
    description: '개발·디자인·마케팅 팀의 의견 충돌을 워크숍으로 조율하고 분기 공통 목표를 수립하여 팀 속도를 회복했습니다.',
    reason: '다양한 이해관계자와 소통하며 갈등을 해결하고 팀 전체를 정렬한 커뮤니케이션 역량이 잘 드러납니다.',
  },
  {
    name: '데이터 분석',
    title: '사용자 행동 데이터 기반 이탈 개선',
    description: '단계별 전환 데이터를 비교해 주요 이탈 구간을 찾고 개선 우선순위를 제안했습니다.',
    reason: '데이터를 근거로 패턴을 발견하고 실행 가능한 결론으로 연결한 분석 역량이 잘 드러납니다.',
  },
  {
    name: '우선순위 설정',
    title: '제한된 일정 내 핵심 기능 범위 조정',
    description: '사용자 영향도와 개발 비용을 함께 비교해 출시 전 반드시 필요한 기능을 선별했습니다.',
    reason: '목표와 제약을 기준으로 선택지를 평가하고 팀의 실행 순서를 정한 경험이 잘 드러납니다.',
  },
  {
    name: '실행력',
    title: '반복 검증을 통한 프로토타입 완성',
    description: '사용자 피드백을 짧은 주기로 반영하며 화면 구조와 핵심 흐름을 빠르게 개선했습니다.',
    reason: '아이디어를 구체적인 결과물로 만들고 반복적으로 완성도를 높인 실행 역량이 잘 드러납니다.',
  },
] as const;

export default function MyStoryInsights() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ready = searchParams.get('state') === 'ready';
  const [selectedStrength, setSelectedStrength] = useState<number | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);
  const selectedRecommendation = ROLE_SKILLS.find(skill => skill.name === selectedSkill);

  if (ready) {
    return <InsightsReadyState />;
  }

  return (
    <Card className="items-stretch gap-0 rounded-t-[36px] p-6">
      <h1 className="mb-6 text-title1 text-grey-900">인사이트</h1>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,464px)_1fr]">
        <InsightUpdateCard cooldown={cooldown} onCreate={() => setCooldown(true)} />
        <section className="rounded-2xl border border-grey-100 p-6">
          <h2 className="text-title2 text-grey-900">기록 템플릿 분포</h2>
          <p className="mt-1 text-body3-md text-grey-500">어떤 유형의 기록을 주로 남기는지 볼 수 있어요.</p>
          <div className="mt-6 grid gap-4">
            {TEMPLATE_STATS.map(([label, value, color]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-body3-md text-grey-800">
                  <span>{label}</span>
                  <strong style={{ color }}>{value}%</strong>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-grey-100">
                  <span className="block h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 flex items-center gap-2 text-body3-md text-grey-500">
            <AiStarBadge />
            [아이디어 · 기획] 중심의 기록을 가장 많이 남기고 있어요.
          </p>
        </section>
      </div>

      <section className="mt-4 rounded-2xl border border-grey-100 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-title2 text-grey-900">Top 5 강점</h2>
            <p className="mt-1 text-body3-md text-grey-500">AI가 73개의 기록을 분석하여 도출한 핵심 강점이에요.</p>
          </div>
          {selectedStrength !== null && (
            <button type="button" onClick={() => setSelectedStrength(null)} className="cursor-pointer text-body3-md text-grey-500">
              전체 강점보기
            </button>
          )}
        </div>

        {selectedStrength === null ? (
          <div className="relative mx-auto mt-6 h-[310px] w-full max-w-[900px]">
            {STRENGTHS.map(item => (
              <StrengthBubble key={item.rank} item={item} onClick={() => setSelectedStrength(item.rank)} />
            ))}
          </div>
        ) : (
          <StrengthDetail strength={STRENGTHS.find(item => item.rank === selectedStrength)!} />
        )}

        <p className="mt-3 flex items-center gap-2 text-body3-md text-grey-400">
          <AiStarBadge />
          강점을 클릭하면 연결된 경험을 탐색할 수 있습니다
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-grey-100 p-6">
        <h2 className="text-title2 text-grey-900">
          직무역량 <span className="text-primary-500">[희망 직무: PM]</span>
        </h2>
        <p className="mt-1 text-body3-md text-grey-500">사용자의 경험 중 PM 역량을 가장 잘 보여주는 경험을 추천해요.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {ROLE_SKILLS.map(skill => (
            <button
              type="button"
              key={skill.name}
              onClick={() => setSelectedSkill(current => current === skill.name ? null : skill.name)}
              aria-pressed={selectedSkill === skill.name}
              className={`flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[14px] px-5 text-body2-md transition-colors ${
                selectedSkill === skill.name
                  ? 'border border-primary-500 bg-primary-500 text-white'
                  : 'border border-grey-100 bg-white text-grey-900'
              }`}
            >
              {selectedSkill === skill.name && <span aria-hidden className="text-[22px] leading-none">✓</span>}
              {skill.name}
            </button>
          ))}
        </div>

        {selectedSkill === null ? (
          <div className="mt-6 grid min-h-[220px] place-items-center rounded-2xl bg-grey-50 text-center text-body3-md leading-6 text-grey-600">
            5가지 역량 중 원하는 역량을 선택하면<br />AI가 추천하는 대표 경험을 보여줍니다.
          </div>
        ) : selectedRecommendation ? (
          <div className="mt-6 rounded-2xl bg-grey-50 p-6">
            <h3 className="text-sub1-sb text-grey-900">{selectedRecommendation.title}</h3>
            <p className="mt-4 text-body3-md text-grey-500">
              {selectedRecommendation.description}
            </p>
            <div className="mt-6 flex items-center gap-5 border-t border-grey-100 pt-6">
              <span className="flex shrink-0 items-center gap-2 text-body3-md text-grey-500"><AiStarBadge /> AI 추천 이유</span>
              <p className="text-body2-md text-grey-700">{selectedRecommendation.reason}</p>
              <button type="button" onClick={() => navigate('/record')} aria-label="추천 기록 보기" className="ml-auto shrink-0 cursor-pointer text-primary-500">
                <AiRecordIcon className="size-5" />
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </Card>
  );
}

function InsightsReadyState() {
  return (
    <Card className="relative items-stretch gap-0 rounded-t-[36px] p-6">
      <h1 className="text-title1 text-grey-900">인사이트</h1>
      <div className="absolute inset-0 grid place-items-center px-6 text-center">
        <div>
          <h2 className="text-sub1-sb text-grey-950">AI 인사이트를 시작하기 위한 준비</h2>
          <div className="mx-auto mt-4 w-fit rounded-xl bg-grey-50 px-5 py-4 text-body-reading2-md text-grey-800">
            <p>⚙️ 직무 설정하기 (마이페이지 &gt; 희망 직무 설정)</p>
            <p>📋 기록 10개 쌓기 (현재 7개 / 10개)</p>
          </div>
          <p className="mt-4 text-body2-md text-grey-700">희망 직무를 설정하고 기록을 채우시면,<br />맞춤형 강점과 역량을 분석해드려요.</p>
        </div>
      </div>
    </Card>
  );
}

function InsightUpdateCard({ cooldown, onCreate }: { cooldown: boolean; onCreate: () => void }) {
  return (
    <section className="flex min-h-[352px] flex-col rounded-2xl border border-grey-100 p-6">
      <h2 className="text-title2 text-grey-900">새로운 인사이트</h2>
      <p className="mt-1 text-body3-md text-grey-500">마지막 업데이트 이후 변경사항이 있어요.</p>
      <div className="mt-6 grid gap-2">
        <div className="flex items-center gap-3 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white"><img src={DOCUMENT_ICON_URL} alt="" className="size-5" /></span>
          <div><span className="text-label3-md text-grey-500">새 기록</span><strong className="block text-label2-sb text-grey-900">10개 추가됨</strong></div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-category-pink bg-category-pink-bg px-4 py-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white"><img src={BRIEFCASE_ICON_URL} alt="" className="size-5" /></span>
          <div><span className="text-label3-md text-grey-500">희망 직무 변경</span><strong className="block text-label2-sb text-grey-900">백엔드 개발자 → PM</strong></div>
        </div>
      </div>
      <div className="mt-auto pt-6">
        <Button disabled={cooldown} onClick={onCreate} label={cooldown ? '13:00:00' : '새로운 인사이트 생성'} />
      </div>
      {cooldown && <p className="mt-2 text-center text-label3-md text-grey-500">인사이트는 1일 1회 생성가능해요.</p>}
    </section>
  );
}

function StrengthBubble({ item, onClick }: { item: typeof STRENGTHS[number]; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="absolute -translate-x-1/2 cursor-pointer text-center" style={{ left: item.left, top: item.top }}>
      <span className="relative mx-auto grid place-items-center rounded-full" style={{ width: item.halo, height: item.halo, backgroundColor: `${item.color}19` }}>
        <span
          className="grid place-items-center rounded-full text-body2-md text-white"
          style={{
            width: item.core,
            height: item.core,
            background: `radial-gradient(circle, ${item.color} 0%, ${item.color} 42%, ${item.color}99 72%, ${item.color}1A 100%)`,
            filter: 'blur(0.2px)',
            boxShadow: `0 0 10px 4px ${item.color}40`,
          }}
        >{item.rank <= 3 ? item.rank : ''}</span>
      </span>
      <strong className="mt-1 block text-body3-md" style={{ color: item.color }}>{item.name}</strong>
      <span className="text-label3-md text-grey-500">{item.count}개</span>
    </button>
  );
}

function StrengthDetail({ strength }: { strength: typeof STRENGTHS[number] }) {
  const navigate = useNavigate();
  return (
    <div className="mt-6 grid min-h-[330px] gap-6 md:grid-cols-2">
      <div className="grid place-items-center rounded-2xl bg-grey-50">
        <div className="text-center">
          <span className="mx-auto grid size-32 place-items-center rounded-full text-white" style={{ background: `radial-gradient(circle, ${strength.color}, ${strength.color}33 68%, transparent 72%)` }}>{strength.rank}</span>
          <strong className="mt-2 block text-title2" style={{ color: strength.color }}>{strength.name}</strong>
          <span className="text-body3-md text-grey-500">{strength.count}개</span>
        </div>
      </div>
      <div className="rounded-2xl bg-grey-50 p-6">
        <div className="rounded-xl bg-primary-50 p-4 text-label1-md text-grey-900"><span className="mb-2 flex items-center gap-2 text-label2-md text-primary-500"><AiStarBadge /> AI 요약</span><strong>“{strength.summary}”</strong></div>
        <h3 className="mt-5 text-body2-md text-grey-600">연결된 기록 ({strength.records.length})</h3>
        {strength.records.map(record => <button type="button" key={record} onClick={() => navigate('/record')} className="flex w-full cursor-pointer items-center justify-between border-b border-grey-100 py-4 text-left text-body2-md text-grey-900"><span>{record}</span><AiRecordIcon className="size-4 shrink-0" /></button>)}
      </div>
    </div>
  );
}

function AiStarBadge() {
  return <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-primary-50"><AiStarIcon className="size-4 text-primary-500" /></span>;
}
