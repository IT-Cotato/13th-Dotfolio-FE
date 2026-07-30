import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/card';
import { CategoryHeader } from '@/components/common/CategoryHeader';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { PrimaryButton } from '@/components/common/createButton';
import { CustomTemplateModal, type CustomTemplateData } from '@/components/common/CustomTemplateModal';
import { RECORD_TEMPLATES } from '@/constants/templates';
import { Template } from '@/components/common/Template';

export default function TemplateAll() {
  const navigate = useNavigate();
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const handleCreateCustomTemplate = (data: CustomTemplateData) => {
    // TODO: 커스텀 템플릿 생성 API 연동
    console.log(data);
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
        <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
          {RECORD_TEMPLATES.map(template => (
            <Template
              key={template.id}
              title={template.title}
              description={template.description}
              bgClassName={template.bgClassName}
              borderClassName={template.borderClassName}
              footerLabel={template.author ? `${template.author}의 템플릿` : undefined}
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
