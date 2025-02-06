'use client';

import PageWrapper from '@/components/common/PageWrapper';
import { useCurrentTime } from '@/hooks/useCurrentTime';

export default function ContactPage() {
  const { gmtFormat } = useCurrentTime();

  return (
    <PageWrapper showHeader={false} className="pageContact">
      {gmtFormat}
    </PageWrapper>
  );
}
