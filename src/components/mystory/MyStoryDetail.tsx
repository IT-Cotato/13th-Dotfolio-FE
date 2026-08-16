import type { StoryRecord } from './myStoryTypes';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Button } from '@/components/common/button';
import { CategoryHeader } from '@/components/common/CategoryHeader';
import BackIcon from '@/assets/backicon.svg';
import MyStoryCopyAsset from '@/assets/mystory_copy.svg';

interface MyStoryDetailProps {
  record: StoryRecord;
  activityTitle: string;
  values: string[];
  isSaveDisabled: boolean;
  isSaving: boolean;
  onBack: () => void;
  onSave: () => void;
  onChange: (index: number, value: string) => void;
  onCopy: (text: string) => Promise<void>;
}
export function MyStoryDetail({ record, activityTitle, values, isSaveDisabled, isSaving, onBack, onSave, onChange, onCopy }: MyStoryDetailProps) {
  return (
    <div>
      <div className="mb-10">
        <Breadcrumb items={[
          { label: '활동 보관함', onClick: onBack },
          { label: activityTitle },
          { label: record.title },
        ]} />
      </div>
      <div className="mb-8">
        <CategoryHeader
          title={record.title}
          onBack={onBack}
          backIcon={<BackIcon className="size-4" />}
          extra={(
            <div className="w-[68px]">
              <Button
                label="저장"
                disabled={isSaveDisabled || isSaving}
                onClick={onSave}
                className="!h-[42px] !rounded-xl !text-label2-sb"
              />
            </div>
          )}
        />
      </div>
      <div className="flex flex-col gap-7">
        {record.sections.map((section, index) => (
          <section key={section.id}>
            <div className="mb-3 flex items-start gap-3">
              <span className="grid w-6 h-6 shrink-0 place-items-center rounded-md bg-primary-50 text-label3-sb text-primary-500">{index + 1}</span>
              <div>
                <h2 className="text-sub1-sb text-grey-900">{section.label}</h2>
                <p className="mt-1 text-body2-md text-grey-700">{section.question}</p>
              </div>
            </div>
            <div className="relative rounded-[14px] border border-grey-100 p-4 text-body-reading2-md text-grey-900">
              <textarea
                value={values[index]}
                onChange={event => onChange(index, event.target.value)}
                rows={2}
                className="block w-[calc(100%-28px)] resize-none bg-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => void onCopy(values[index])}
                aria-label={`${section.label} 내용 복사`}
                className="absolute right-4 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center"
              >
                <MyStoryCopyAsset aria-hidden className="size-4 shrink-0" />
              </button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
