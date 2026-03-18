'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAdminToken } from '@/lib/magento/rest';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if we have a token
    const token = getAdminToken();
    
    if (!token && pathname !== '/admin/login') {
      router.replace('/admin/login');
    } else {
      setAuthorized(true);
    }
  }, [router, pathname]);

  if (!authorized && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fcd34d]"></div>
      </div>
    );
  }

  return <>{children}</>;
}
