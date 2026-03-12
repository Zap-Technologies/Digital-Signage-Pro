'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAdmin } from '@/lib/adminContext';
import { cn } from '@/lib/utils';

export function AdminLayout({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useAdmin();

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          'flex-1 flex flex-col overflow-hidden transition-all duration-300',
          sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'
        )}
      >
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
