import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { RecordTemplate, TemplateQuestion } from '@/constants/templates';
import { getTemplates, createTemplate, type TemplateDetail } from '@/api/templates';

interface CustomTemplateFormData {
  title: string;
  description: string;
  questions: TemplateQuestion[];
}

interface TemplatesContextValue {
  templates: RecordTemplate[];
  isLoading: boolean;
  addCustomTemplate: (data: CustomTemplateFormData) => Promise<void>;
}

const TemplatesContext = createContext<TemplatesContextValue | null>(null);

// 템플릿 API가 색상 정보를 안 줘서, 기본 제공(isBuiltin) 템플릿은 순서대로 이 팔레트를 돌려씀.
const BUILTIN_PALETTE = [
  { bgClassName: 'bg-category-mint-bg', borderClassName: 'border-category-mint', textClassName: 'text-category-mint-text' },
  { bgClassName: 'bg-category-purple-bg', borderClassName: 'border-category-purple', textClassName: 'text-category-purple-text' },
  { bgClassName: 'bg-category-pink-bg', borderClassName: 'border-category-pink', textClassName: 'text-category-pink-text' },
  { bgClassName: 'bg-category-coral-bg', borderClassName: 'border-category-coral', textClassName: 'text-category-coral-text' },
];

const toRecordTemplate = (item: TemplateDetail, builtinIndex: number): RecordTemplate => {
  const questions: TemplateQuestion[] = item.questions
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(q => ({
      id: q.id,
      label: q.questionText,
      description: q.description ?? undefined,
      required: q.required,
    }));

  if (item.isBuiltin) {
    const palette = BUILTIN_PALETTE[builtinIndex % BUILTIN_PALETTE.length];
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      bgClassName: palette.bgClassName,
      borderClassName: palette.borderClassName,
      textClassName: palette.textClassName,
      questions,
    };
  }

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    bgClassName: 'bg-grey-50',
    borderClassName: 'border-grey-100',
    textClassName: 'text-grey-900',
    isCustom: true,
    questions,
  };
};

export const TemplatesProvider = ({ children }: { children: ReactNode }) => {
  const [templates, setTemplates] = useState<RecordTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const response = await getTemplates();
        if (cancelled) return;
        let builtinIndex = 0;
        setTemplates(response.data.map(item => toRecordTemplate(item, item.isBuiltin ? builtinIndex++ : 0)));
      } catch {
        if (!cancelled) setTemplates([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchTemplates();
    return () => {
      cancelled = true;
    };
  }, []);

  const addCustomTemplate = async (data: CustomTemplateFormData) => {
    const response = await createTemplate({
      title: data.title,
      description: data.description,
      questions: data.questions.map(q => ({
        questionText: q.label,
        description: q.description ?? '',
        required: q.required ?? false,
      })),
    });
    setTemplates(prev => [...prev, toRecordTemplate(response.data, 0)]);
  };

  return (
    <TemplatesContext.Provider value={{ templates, isLoading, addCustomTemplate }}>
      {children}
    </TemplatesContext.Provider>
  );
};

export const useTemplates = () => {
  const ctx = useContext(TemplatesContext);
  if (!ctx) throw new Error('useTemplates must be used within a TemplatesProvider');
  return ctx;
};
