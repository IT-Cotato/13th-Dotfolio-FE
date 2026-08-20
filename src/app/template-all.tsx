import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/card';
import { CategoryHeader } from '@/components/common/CategoryHeader';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { PrimaryButton } from '@/components/common/createButton';
import { CustomTemplateModal, type CustomTemplateData } from '@/components/common/CustomTemplateModal';
import { Template } from '@/components/common/Template';
import { Toast } from '@/components/common/Toast';
import { useTemplates } from '@/contexts/TemplatesContext';
import { useToast } from '@/hooks/useToast';

export default function TemplateAll() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationState = location.state as { from?: unknown } | null;
  const backPath = navigationState?.from === '/mypage' ? '/mypage' : '/record';
  const { templates, addCustomTemplate } = useTemplates();
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const { toast, fireToast } = useToast();

  const handleCreateCustomTemplate = async (data: CustomTemplateData) => {
    await addCustomTemplate(data);
    setIsCustomModalOpen(false);
    fireToast('템플릿이 성공적으로 생성되었습니다.');
  };

  return (
    <Card>
      <Breadcrumb
        items={[
          { label: '경영 데이터분석 워크샵', reverseArrowAfter: true },
          { label: '더 많은 템플릿 보기' },
        ]}
      />
      <div className="w-full flex flex-col gap-8">
        <CategoryHeader
          title="템플릿 선택"
          onBack={() => navigate(backPath)}
          extra={<PrimaryButton label="커스텀 템플릿 만들기" onClick={() => setIsCustomModalOpen(true)} size="sm" />}
        />
        <div className="w-full grid grid-cols-[repeat(auto-fill,266px)] gap-6">
          {templates.map(template => (
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

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-100">
          <Toast message={toast.message} variant={toast.variant} />
        </div>
      )}
    </Card>
  );
}
