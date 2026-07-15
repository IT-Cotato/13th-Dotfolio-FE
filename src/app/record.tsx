import { Card } from '@/components/common/card';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { CategoryHeader } from '@/components/common/CategoryHeader';
import { Template } from '@/components/common/Template';
import { PrimaryButton } from '@/components/common/createButton';
import { RECORD_TEMPLATES } from '@/constants/templates';

export default function Record() {
  return (
    <Card>
      <Breadcrumb
        items={[
          { label: '기록하기' },
          { label: '경영 데이터분석 워크샵' },
        ]}
      />
      <div className="w-full flex flex-col gap-6">
        <CategoryHeader title="기록 템플릿" moreLabel="더 많은 템플릿 보기" />
        <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
          {RECORD_TEMPLATES.map(template => (
            <Template
              key={template.id}
              title={template.title}
              description={template.description}
              bgClassName={template.bgClassName}
              borderClassName={template.borderClassName}
            />
          ))}
        </div>
      </div>
      <div className="w-full flex-1 flex flex-col items-center justify-center gap-8">
        <div className="max-w-[260px] flex flex-col items-center gap-2 text-center">
          <p className="text-sub1-sb text-grey-950">원하는 기록 양식이 없나요?</p>
          <p className="text-body2-r text-grey-700">
            주제와 질문을 직접 설정해 나만의 템플릿을 만들어보세요.
          </p>
        </div>
        <PrimaryButton label="템플릿 만들기" />
      </div>
    </Card>
  );
}
