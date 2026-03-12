'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { SecurityManagement } from '@/components/admin/security/SecurityManagement';

export default function SecurityPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Security Management</h2>
          <p className="text-slate-600 mt-2">
            Monitor security events, audit logs, and system access
          </p>
        </div>
        <SecurityManagement />
      </div>
    </AdminLayout>
  );
}
