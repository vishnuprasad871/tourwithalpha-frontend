import { Metadata } from 'next';
import Link from 'next/link';
import { listCareers, formatEmploymentType, formatDepartment } from '@/lib/magento/careers';

export const metadata: Metadata = {
  title: 'Careers | Join the Alpha Travel & Tours Team',
  description:
    'Explore open positions at Alpha Travel & Tours. Join our passionate team and help create unforgettable Nova Scotia experiences for our guests.',
  alternates: { canonical: '/careers' },
  openGraph: {
    title: 'Careers — Alpha Travel & Tours',
    description: 'Join our team and help create unforgettable Nova Scotia experiences.',
    url: '/careers',
  },
};

const departmentColors: Record<string, string> = {
  operations: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  sales: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  marketing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  finance: 'bg-green-500/20 text-green-400 border-green-500/30',
  hr: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
};

function getDeptColor(dept: string) {
  return departmentColors[dept.toLowerCase()] ?? 'bg-white/10 text-gray-300 border-white/20';
}

export default async function CareersPage() {
  const { careers, total } = await listCareers(20, 1);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-sky-900 via-slate-900 to-amber-900 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
            Join Our <span className="gradient-text">Team</span>
          </h1>
          <p className="text-xl text-gray-300 animate-fade-in delay-200">
            Help us create unforgettable Nova Scotia experiences
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 bg-slate-900 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300 text-lg leading-relaxed">
            At Alpha Travel &amp; Tours, we&apos;re a passionate team dedicated to sharing the beauty of Nova Scotia
            with the world. We&apos;re always looking for enthusiastic people who love travel, hospitality, and
            delivering exceptional guest experiences.
          </p>
        </div>
      </section>

      {/* Listings */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {careers.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">
                  Open Positions{' '}
                  <span className="text-gray-400 font-normal text-lg">({total})</span>
                </h2>
              </div>

              <div className="space-y-4">
                {careers.map((career) => (
                  <Link
                    key={career.id}
                    href={`/careers/${career.id}`}
                    className="block glass rounded-2xl p-6 border border-white/10 hover:border-sky-400/50 transition-all duration-300 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${getDeptColor(career.department)}`}>
                            {formatDepartment(career.department)}
                          </span>
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full border border-white/20 bg-white/5 text-gray-300">
                            {formatEmploymentType(career.employment_type)}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors mb-1">
                          {career.title}
                        </h3>
                        <p className="text-gray-400 text-sm flex items-center gap-1">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {career.location}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        {career.salary_range && (
                          <p className="text-sky-400 font-semibold text-sm mb-2">{career.salary_range}</p>
                        )}
                        <span className="inline-flex items-center gap-1 text-sm text-gray-400 group-hover:text-sky-400 transition-colors">
                          View & Apply
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">💼</div>
              <h2 className="text-2xl font-bold text-white mb-2">No Open Positions Right Now</h2>
              <p className="text-gray-400 mb-6">
                We don&apos;t have any active listings at the moment, but we&apos;re always happy to hear from great
                people.
              </p>
              <Link
                href="/contact"
                className="inline-block px-6 py-3 bg-gradient-to-r from-sky-500 to-amber-500 text-white rounded-full font-semibold hover:from-sky-400 hover:to-amber-400 transition-all duration-300"
              >
                Get in Touch
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Culture section */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-white text-center mb-10">
            Why Work With <span className="gradient-text">Us</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🌊', title: 'Love What You Do', desc: 'Work in one of Canada\'s most scenic provinces, sharing Nova Scotia\'s beauty every day.' },
              { icon: '👥', title: 'Close-Knit Team', desc: 'We\'re a small, tight-knit team where every voice matters and contributions are recognized.' },
              { icon: '🚀', title: 'Grow With Us', desc: 'As we expand, there are real opportunities to grow your role and career with the company.' },
            ].map((item, i) => (
              <div key={i} className="glass rounded-2xl p-6 border border-white/10 text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
