import MainCaseStudyPage from '@/components/works/MainCaseStudyPage';
import {
  fetchSanityWorkBySlug,
  fetchSanityWorks,
  fetchSanityWorkSlugs,
} from '@/sanity/fetch';
import { generatePageMetadata } from '@/sanity/lib/metadata';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const works = await fetchSanityWorkSlugs();
  return works.map((work) => ({
    casestudy: work.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { casestudy: string };
}) {
  const { casestudy } = params;
  const work = await fetchSanityWorkBySlug({ slug: casestudy });

  if (!work) {
    notFound();
  }

  return generatePageMetadata({
    page: work,
    slug: `/works/${params.casestudy}`,
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: { casestudy: string };
}) {
  const { casestudy } = params;
  const work = await fetchSanityWorkBySlug({ slug: casestudy });

  if (!work) {
    notFound();
  }

  const allWorks = await fetchSanityWorks();
  const currentIndex = allWorks.findIndex((w) => w.slug?.current === casestudy);

  const nextWorkIndex = (currentIndex + 1) % allWorks.length;
  const nextWork = allWorks[nextWorkIndex];

  return (
    <div>
      <MainCaseStudyPage currentWork={work} nextWork={nextWork} />
    </div>
  );
}
