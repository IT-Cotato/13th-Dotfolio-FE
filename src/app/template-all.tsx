import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/card';
import { CategoryHeader } from '@/components/common/CategoryHeader';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { PrimaryButton } from '@/components/common/createButton';
import { CustomTemplateModal, type CustomTemplateData } from '@/components/common/CustomTemplateModal';
import { RECORD_TEMPLATES, type RecordTemplate } from '@/constants/templates';
import { Template } from '@/components/common/Template';

export default function TemplateAll() {
  const navigate = useNavigate();
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<RecordTemplate[]>([]);

  const handleCreateCustomTemplate = (data: CustomTemplateData) => {
    // TODO: 커스텀 템플릿 생성 API 연동
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
    setIsCustomModalOpen(false);
  };

  return (
    <Card>
      <Breadcrumb
        items={[
          { label: '경영 데이터분석 워크샵' },
          { label: '더 많은 템플릿 보기' },
        ]}
      />
      <div className="w-full flex flex-col gap-8">
        <CategoryHeader
          title="템플릿 선택"
          onBack={() => navigate('/record')}
          extra={<PrimaryButton label="커스텀 템플릿 만들기" onClick={() => setIsCustomModalOpen(true)} />}
        />
        <div className="w-full grid grid-cols-4 gap-6">
          {[...RECORD_TEMPLATES, ...customTemplates].map(template => (
            <Template
              key={template.id}
              title={template.title}
              description={template.description}
              bgClassName={template.bgClassName}
              borderClassName={template.borderClassName}
              footerLabel={template.author ? `${template.author}의 템플릿` : template.isCustom ? '내가 만든 템플릿' : undefined}
              onClick={() => navigate(`/record/write/${template.id}`)}
            />
          ))}
        </div>
      </div>
      <CustomTemplateModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSubmit={handleCreateCustomTemplate}
      />
    </Card>
  );
}
