import { Card } from '@/components/common/card';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { CategoryHeader } from '@/components/common/CategoryHeader';
import { Template } from '@/components/common/Template';
import { PrimaryButton } from '@/components/common/createButton';
import { Tag } from '@/components/record/tag';
import { RECORD_TEMPLATES } from '@/constants/templates';
import RECORDS from '@/mock/records.json';
import type { RecordEntry } from '@/types/record';
import TrashIcon from '@/assets/trash.svg';

const records = RECORDS as RecordEntry[];

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

      {records.length === 0 ? (
        <div className="w-full flex-1 flex flex-col items-center justify-center gap-8">
          <div className="max-w-[260px] flex flex-col items-center gap-2 text-center">
            <p className="text-sub1-sb text-grey-950">원하는 기록 양식이 없나요?</p>
            <p className="text-body2-r text-grey-700">
              주제와 질문을 직접 설정해 나만의 템플릿을 만들어보세요.
            </p>
          </div>
          <PrimaryButton label="템플릿 만들기" />
        </div>
      ) : (
        <div className="w-full flex flex-col gap-6">
          <CategoryHeader title="최근 작성한 기록" moreLabel="전체 기록 보기" />
          <div className="w-full flex flex-col divide-y divide-grey-100">
            {records.map(record => {
              const template = RECORD_TEMPLATES.find(t => t.id === record.templateId);
              return (
                <div key={record.id} className="w-full flex items-center justify-between py-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-grey-900 text-sub2-sb">제목 : {record.title}</p>
                    <p className="text-grey-700 text-body3-r">{record.date}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="px-6 py-[14px]">
                      <Tag
                        label={record.status}
                        bgClassName="bg-primary-50"
                        borderClassName="border-primary-100"
                        textClassName="text-primary-500"
                      />
                    </div>
                    {template && (
                      <div className="px-6 py-[14px]">
                        <Tag
                          label={template.title}
                          bgClassName={template.bgClassName}
                          borderClassName={template.borderClassName}
                          textClassName={template.textClassName ?? 'text-grey-700'}
                        />
                      </div>
                    )}
                    <button type="button" className="cursor-pointer">
                      <TrashIcon className="w-5 h-5 text-grey-700" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
