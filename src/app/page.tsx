'use client';

import { styled } from '@/styles';

export default function Home() {
  return (
    <PageContainer>
      <div>willie</div>
    </PageContainer>
  );
}

const PageContainer = styled('div', {
  width: '100%',
  minHeight: '100dvh',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'space-between',
  paddingBlock: '3rem 5rem',

  '@bp1': {
    paddingBlock: '3rem 5.5rem',
  },
});
