'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PortalBanner() {
  const { user, userType, isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Don't show banner if not authenticated or already on portal page
  if (!isAuthenticated || !userType || pathname.startsWith('/portal')) {
    return null;
  }

  const getPortalPath = () => {
    return '/portal/user';
  };

  const getPortalName = () => {
    return 'User Portal';
  };

  return (
    <div className="bg-copper-50 border-b border-copper-200">
      <div className="mx-auto max-w-6xl px-4 py-2">
        <Link 
          href={getPortalPath()}
          className="inline-flex items-center gap-2 text-sm text-copper-700 hover:text-copper-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to {getPortalName()}</span>
        </Link>
      </div>
    </div>
  );
}
