export interface RecordTemplate {
  id: string;
  title: string;
  description: string;
  bgClassName: string;
  borderClassName: string;
  textClassName?: string;
  isCustom?: boolean;
}

export const RECORD_TEMPLATES: RecordTemplate[] = [
  {
    id: 'idea-planning',
    title: '아이디어 · 기획',
    description: '문득 떠오른 생각이 좋은 결과로 이어졌던 순간을 남겨보세요.',
    bgClassName: 'bg-category-mint-bg',
    borderClassName: 'border-category-mint',
    textClassName: 'text-category-mint-text',
  },
  {
    id: 'collabo-conflict',
    title: '협업 · 갈등',
    description: '함께 일하며 의견을 맞춰갔던 경험을 기록해보세요.',
    bgClassName: 'bg-category-purple-bg',
    borderClassName: 'border-category-purple',
    textClassName: 'text-category-purple-text',
  },
  {
    id: 'solving-result',
    title: '문제 해결 · 성과',
    description: '고민 끝에 답을 찾고 성과를 만들었던 경험을 남겨보세요.',
    bgClassName: 'bg-category-pink-bg',
    borderClassName: 'border-category-pink',
    textClassName: 'text-category-pink-text',
  },
  {
    id: 'challenge-immersion',
    title: '도전 · 몰입',
    description: '망설였지만 결국 도전했던 순간을 기록해보세요.',
    bgClassName: 'bg-category-coral-bg',
    borderClassName: 'border-category-coral',
    textClassName: 'text-category-coral-text',
  },
  {
    id: 'custon',
    title: '커스텀 템플릿',
    description: '커스텀 템플릿 설명 커스텀 템플릿 설명 커스텀 템플릿 설명',
    bgClassName: 'bg-grey-50',
    borderClassName: 'border-grey-100',
    textClassName: 'text-grey-900',
    isCustom: true,
  },
  {
    id: 'custom-2',
    title: '커스텀 템플릿',
    description: '커스텀 템플릿 설명 커스텀 템플릿 설명 커스텀 템플릿 설명',
    bgClassName: 'bg-grey-50',
    borderClassName: 'border-grey-100',
    textClassName: 'text-grey-900',
    isCustom: true,
  },
  {
    id: 'custom-3',
    title: '커스텀 템플릿',
    description: '커스텀 템플릿 설명 커스텀 템플릿 설명 커스텀 템플릿 설명',
    bgClassName: 'bg-grey-50',
    borderClassName: 'border-grey-100',
    textClassName: 'text-grey-900',
    isCustom: true,
  },
  {
    id: 'custom-4',
    title: '커스텀 템플릿',
    description: '커스텀 템플릿 설명 커스텀 템플릿 설명 커스텀 템플릿 설명',
    bgClassName: 'bg-grey-50',
    borderClassName: 'border-grey-100',
    textClassName: 'text-grey-900',
    isCustom: true,
  },
];
