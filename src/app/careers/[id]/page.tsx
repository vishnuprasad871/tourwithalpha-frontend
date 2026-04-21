import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCareer, formatEmploymentType, formatDepartment } from '@/lib/magento/careers';
import ApplicationForm from './ApplicationForm';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const career = await getCareer(Number(id));
  if (!career) return { title: 'Career Not Found' };
  return {
    title: `${career.title} | Careers at Alpha Travel & Tours`,
    description: career.description.slice(0, 160),
  };
}

export default async function CareerDetailPage({ params }: Props) {
  const { id } = await params;
  const career = await getCareer(Number(id));

  if (!career) notFound();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-sky-900 via-slate-900 to-amber-900 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/careers" className="inline-flex items-center gap-1 text-gray-400 hover:text-sky-400 transition-colors text-sm mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Positions
          </Link>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full border border-sky-500/30 bg-sky-500/20 text-sky-400">
              {formatDepartment(career.department)}
            </span>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full border border-white/20 bg-white/5 text-gray-300">
              {formatEmploymentType(career.employment_type)}
            </span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">{career.title}</h1>
          <div className="flex flex-wrap gap-4 text-gray-300 text-sm">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {career.location}
            </span>
            {career.salary_range && (
              <span className="flex items-center gap-1 text-sky-400 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {career.salary_range}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Job details */}
            <div className="lg:col-span-3 space-y-8">
              <div className="glass rounded-2xl p-6 lg:p-8">
                <h2 className="text-xl font-bold text-white mb-4">About the Role</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{career.description}</p>
              </div>

              <div className="glass rounded-2xl p-6 lg:p-8">
                <h2 className="text-xl font-bold text-white mb-4">Requirements</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{career.requirements}</p>
              </div>
            </div>

            {/* Application form */}
            <div className="lg:col-span-2">
              <div className="glass rounded-2xl p-6 lg:p-8 sticky top-6">
                <h2 className="text-xl font-bold text-white mb-1">Apply Now</h2>
                <p className="text-gray-400 text-sm mb-6">
                  Applying for <span className="text-sky-400">{career.title}</span>
                </p>
                <ApplicationForm careerId={career.id} careerTitle={career.title} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
