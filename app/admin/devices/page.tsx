'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { DeviceManagement } from '@/components/admin/devices/DeviceManagement';

export default function DevicesPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Device Management</h2>
          <p className="text-slate-600 mt-2">
            Monitor, control, and manage digital displays and servers
          </p>
        </div>
        <DeviceManagement />
      </div>
    </AdminLayout>
  );
}
