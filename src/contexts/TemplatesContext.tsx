import { createContext, useContext, useState, type ReactNode } from 'react';
import { RECORD_TEMPLATES, type RecordTemplate, type TemplateQuestion } from '@/constants/templates';

interface CustomTemplateFormData {
  title: string;
  description: string;
  questions: TemplateQuestion[];
}

interface TemplatesContextValue {
  templates: RecordTemplate[];
  addCustomTemplate: (data: CustomTemplateFormData) => void;
}

const TemplatesContext = createContext<TemplatesContextValue | null>(null);

export const TemplatesProvider = ({ children }: { children: ReactNode }) => {
  const [customTemplates, setCustomTemplates] = useState<RecordTemplate[]>([]);

  const addCustomTemplate = (data: CustomTemplateFormData) => {
    const newTemplate: RecordTemplate = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      bgClassName: 'bg-grey-50',
      borderClassName: 'border-grey-100',
      textClassName: 'text-grey-900',
      isCustom: true,
      questions: data.questions,
    };
    setCustomTemplates(prev => [...prev, newTemplate]);
  };

  return (
    <TemplatesContext.Provider
      value={{ templates: [...RECORD_TEMPLATES, ...customTemplates], addCustomTemplate }}
    >
      {children}
    </TemplatesContext.Provider>
  );
};

export const useTemplates = () => {
  const ctx = useContext(TemplatesContext);
  if (!ctx) throw new Error('useTemplates must be used within a TemplatesProvider');
  return ctx;
};
