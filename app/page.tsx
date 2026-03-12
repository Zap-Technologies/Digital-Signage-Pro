'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/lib/adminContext';

export default function Home() {
  const router = useRouter();
  const { currentUser } = useAdmin();

  useEffect(() => {
    if (currentUser) {
      router.replace('/admin');
    } else {
      router.replace('/login');
    }
  }, [currentUser, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-5 h-5 border-2 border-border border-t-foreground rounded-full animate-spin" />
    </div>
  );
}
