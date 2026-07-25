export interface TemplateQuestion {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
}

export interface RecordTemplate {
  id: string;
  title: string;
  description: string;
  bgClassName: string;
  borderClassName: string;
  textClassName?: string;
  isCustom?: boolean;
  author?: string;
  questions?: TemplateQuestion[];
}

export const RECORD_TEMPLATES: RecordTemplate[] = [
  {
    id: 'idea-planning',
    title: '아이디어 · 기획',
    description: '문득 떠오른 생각이 좋은 결과로 이어졌던 순간을 남겨보세요.',
    bgClassName: 'bg-category-mint-bg',
    borderClassName: 'border-category-mint',
    textClassName: 'text-category-mint-text',
    questions: [
      { id: 'situation', label: '상황', description: '어떤 문제나 기회를 발견했나요?', required: true },
      { id: 'idea', label: '아이디어', description: '어떤 아이디어를 떠올렸나요?' },
      { id: 'process', label: '실행과정', description: '아이디어를 어떻게 실행에 옮겼나요?' },
    ],
  },
  {
    id: 'collabo-conflict',
    title: '협업 · 갈등',
    description: '함께 일하며 의견을 맞춰갔던 경험을 기록해보세요.',
    bgClassName: 'bg-category-purple-bg',
    borderClassName: 'border-category-purple',
    textClassName: 'text-category-purple-text',
    questions: [
      { id: 'situation', label: '상황', description: '어떤 협업 상황이었나요?', required: true },
      { id: 'conflict', label: '갈등', description: '어떤 의견 차이나 갈등이 있었나요?' },
      { id: 'resolution', label: '해결과정', description: '갈등을 어떻게 해결했나요?' },
    ],
  },
  {
    id: 'solving-result',
    title: '문제 해결 · 성과',
    description: '고민 끝에 답을 찾고 성과를 만들었던 경험을 남겨보세요.',
    bgClassName: 'bg-category-pink-bg',
    borderClassName: 'border-category-pink',
    textClassName: 'text-category-pink-text',
    questions: [
      { id: 'problem', label: '문제 상황', description: '어떤 문제에 부딪혔나요?', required: true },
      { id: 'solution', label: '해결 방법', description: '문제를 어떻게 해결했나요?' },
      { id: 'result', label: '성과', description: '그 결과 어떤 성과를 얻었나요?' },
    ],
  },
  {
    id: 'challenge-immersion',
    title: '도전 · 몰입',
    description: '망설였지만 결국 도전했던 순간을 기록해보세요.',
    bgClassName: 'bg-category-coral-bg',
    borderClassName: 'border-category-coral',
    textClassName: 'text-category-coral-text',
    questions: [
      { id: 'motivation', label: '도전 계기', description: '무엇에 도전하게 되었나요?', required: true },
      { id: 'immersion', label: '몰입 과정', description: '어떻게 몰입해서 임했나요?' },
      { id: 'learning', label: '배운 점', description: '이 경험을 통해 무엇을 느끼거나 배웠나요?' },
    ],
  },
  {
    id: 'custon',
    title: '커스텀 템플릿',
    description: '커스텀 템플릿 설명 커스텀 템플릿 설명 커스텀 템플릿 설명',
    bgClassName: 'bg-grey-50',
    borderClassName: 'border-grey-100',
    textClassName: 'text-grey-900',
    isCustom: true,
    author: '홍길동',
  },
  {
    id: 'custom-2',
    title: '커스텀 템플릿',
    description: '커스텀 템플릿 설명 커스텀 템플릿 설명 커스텀 템플릿 설명',
    bgClassName: 'bg-grey-50',
    borderClassName: 'border-grey-100',
    textClassName: 'text-grey-900',
    isCustom: true,
    author: '홍길동',
  },
  {
    id: 'custom-3',
    title: '커스텀 템플릿',
    description: '커스텀 템플릿 설명 커스텀 템플릿 설명 커스텀 템플릿 설명',
    bgClassName: 'bg-grey-50',
    borderClassName: 'border-grey-100',
    textClassName: 'text-grey-900',
    isCustom: true,
    author: '홍길동',
  },
  {
    id: 'custom-4',
    title: '커스텀 템플릿',
    description: '커스텀 템플릿 설명 커스텀 템플릿 설명 커스텀 템플릿 설명',
    bgClassName: 'bg-grey-50',
    borderClassName: 'border-grey-100',
    textClassName: 'text-grey-900',
    isCustom: true,
    author: '홍길동',
  },
];
