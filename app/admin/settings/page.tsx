'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { SystemSettings } from '@/components/admin/settings/SystemSettings';

export default function SettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">System Settings</h2>
          <p className="text-slate-600 mt-2">
            Configure system-wide settings and policies
          </p>
        </div>
        <SystemSettings />
      </div>
    </AdminLayout>
  );
}
