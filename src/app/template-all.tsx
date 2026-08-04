import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/card';
import { CategoryHeader } from '@/components/common/CategoryHeader';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { PrimaryButton } from '@/components/common/createButton';
import { RECORD_TEMPLATES } from '@/constants/templates';
import { Template } from '@/components/common/Template';

const DEFAULT_TEMPLATES = RECORD_TEMPLATES.filter(template => !template.isCustom);
const CUSTOM_TEMPLATES = RECORD_TEMPLATES.filter(template => template.isCustom);

export default function TemplateAll() {
  const navigate = useNavigate();

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
          onBack={() => navigate('/record')}
          extra={<PrimaryButton label="커스텀 템플릿 만들기" />}
        />
        <div className="w-full flex flex-col gap-6">
          <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
            {DEFAULT_TEMPLATES.map(template => (
              <Template
                key={template.id}
                title={template.title}
                description={template.description}
                bgClassName={template.bgClassName}
                borderClassName={template.borderClassName}
              />
            ))}
          </div>
          <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
            {CUSTOM_TEMPLATES.map(template => (
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
      </div>
    </Card>
  );
}
