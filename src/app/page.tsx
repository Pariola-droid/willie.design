'use client';

import PageWrapper from '@/components/common/PageWrapper';
import { useCurrentTime } from '@/hooks/useCurrentTime';

export default function HomePage() {
  const { gmtFormat } = useCurrentTime();

  return (
    <PageWrapper showHeader={false} className="pageHome">
      {gmtFormat}
    </PageWrapper>
  );
}
