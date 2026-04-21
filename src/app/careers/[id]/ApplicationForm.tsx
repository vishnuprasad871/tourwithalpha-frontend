'use client';

import { useState, useRef } from 'react';
import { submitJobApplication } from '@/lib/magento/careers';

interface Props {
  careerId: number;
  careerTitle: string;
}

export default function ApplicationForm({ careerId, careerTitle }: Props) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const form = e.currentTarget;
    const data = new FormData(form);

    let resume_base64: string | undefined;
    let resume_filename: string | undefined;

    if (resumeFile) {
      resume_filename = resumeFile.name;
      resume_base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(resumeFile);
      });
    }

    try {
      const result = await submitJobApplication({
        career_id: careerId,
        first_name: data.get('first_name') as string,
        last_name: data.get('last_name') as string,
        email: data.get('email') as string,
        phone: (data.get('phone') as string) || undefined,
        cover_letter: (data.get('cover_letter') as string) || undefined,
        resume_base64,
        resume_filename,
      });

      if (result.success) {
        setStatus('success');
        form.reset();
        setResumeFile(null);
      } else {
        setStatus('error');
        setErrorMsg(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err: unknown) {
      setStatus('error');
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrorMsg(message);
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
        <p className="text-gray-400">
          Thanks for applying for <span className="text-sky-400">{careerTitle}</span>. We&apos;ll
          be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            First Name <span className="text-red-400">*</span>
          </label>
          <input
            name="first_name"
            type="text"
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 transition-colors"
            placeholder="Jane"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Last Name <span className="text-red-400">*</span>
          </label>
          <input
            name="last_name"
            type="text"
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 transition-colors"
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 transition-colors"
            placeholder="jane@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone</label>
          <input
            name="phone"
            type="tel"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 transition-colors"
            placeholder="+1 (902) 000-0000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Cover Letter</label>
        <textarea
          name="cover_letter"
          rows={5}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 transition-colors resize-none"
          placeholder="Tell us why you'd be a great fit..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Resume <span className="text-gray-500 font-normal">(PDF / DOC / DOCX, max 5 MB)</span>
        </label>
        <div
          className="w-full px-4 py-6 bg-white/5 border border-dashed border-white/20 rounded-xl text-center cursor-pointer hover:border-sky-400/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {resumeFile ? (
            <p className="text-sky-400 text-sm font-medium">{resumeFile.name}</p>
          ) : (
            <p className="text-gray-500 text-sm">Click to upload your resume</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      {status === 'error' && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full py-4 bg-gradient-to-r from-sky-500 to-amber-500 text-white rounded-xl font-semibold hover:from-sky-400 hover:to-amber-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
      >
        {status === 'submitting' ? 'Submitting…' : 'Submit Application'}
      </button>
    </form>
  );
}
