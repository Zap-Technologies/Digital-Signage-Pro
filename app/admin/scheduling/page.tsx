'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { SchedulingSystem } from '@/components/admin/scheduling/SchedulingSystem';

export default function SchedulingPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Scheduling</h2>
          <p className="text-slate-600 mt-2">
            Define when and where each playlist plays — by day, time slot, and date range
          </p>
        </div>
        <SchedulingSystem />
      </div>
    </AdminLayout>
  );
}
