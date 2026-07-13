import { Card } from '@/components/common/card';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { CategoryHeader } from '@/components/common/CategoryHeader';

export default function Record() {
  return (
    <Card>
      <Breadcrumb
        items={[
          { label: '기록하기' },
          { label: '경영 데이터분석 워크샵' },
        ]}
      />
      <CategoryHeader title="기록 템플릿" moreLabel="더 많은 템플릿 보기" />
    </Card>
  );
}
