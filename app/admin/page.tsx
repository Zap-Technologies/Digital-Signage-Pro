'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { DashboardOverview } from '@/components/admin/dashboard/DashboardOverview';

export default function AdminPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-600 mt-2">
            Overview of your digital signage system
          </p>
        </div>
        <DashboardOverview />
      </div>
    </AdminLayout>
  );
}
