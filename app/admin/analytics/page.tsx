'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { AnalyticsModule } from '@/components/admin/analytics/AnalyticsModule';

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Analytics</h2>
          <p className="text-slate-600 mt-2">
            System performance, usage statistics, and detailed reports
          </p>
        </div>
        <AnalyticsModule />
      </div>
    </AdminLayout>
  );
}
