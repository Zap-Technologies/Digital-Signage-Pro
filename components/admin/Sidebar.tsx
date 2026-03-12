'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  Monitor,
  Settings,
  Shield,
  BarChart3,
  Menu,
  X,
} from 'lucide-react';
import { useAdmin } from '@/lib/adminContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    roles: ['super_admin', 'admin', 'moderator', 'viewer', 'device_manager'],
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: Users,
    roles: ['super_admin', 'admin'],
  },
  {
    label: 'Content',
    href: '/admin/content',
    icon: FileText,
    roles: ['super_admin', 'admin', 'moderator'],
  },
  {
    label: 'Devices',
    href: '/admin/devices',
    icon: Monitor,
    roles: ['super_admin', 'admin', 'device_manager'],
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    roles: ['super_admin', 'admin', 'viewer'],
  },
  {
    label: 'Security',
    href: '/admin/security',
    icon: Shield,
    roles: ['super_admin', 'admin'],
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    roles: ['super_admin'],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, sidebarOpen, setSidebarOpen } = useAdmin();

  const visibleItems = navigationItems.filter((item) =>
    currentUser ? item.roles.includes(currentUser.role) : false
  );

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-4 right-4 z-40 lg:hidden"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen bg-slate-900 text-white transition-all duration-300 z-40 flex flex-col',
          sidebarOpen ? 'w-64' : 'w-0 lg:w-20',
          'lg:relative lg:z-0'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-slate-700 flex-shrink-0">
          {sidebarOpen && (
            <Link href="/admin" className="font-bold text-lg">
              DSP
            </Link>
          )}
          {!sidebarOpen && (
            <div className="text-lg font-bold">D</div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800',
                  !sidebarOpen && 'lg:justify-center'
                )}
                title={!sidebarOpen ? item.label : ''}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="border-t border-slate-700 p-4 flex-shrink-0">
          <div
            className={cn(
              'flex items-center gap-3 text-sm',
              !sidebarOpen && 'lg:justify-center'
            )}
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              {currentUser?.name.charAt(0) ?? '?'}
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="font-medium truncate">{currentUser?.name}</p>
                <p className="text-xs text-slate-400 truncate">
                  {currentUser?.role}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
