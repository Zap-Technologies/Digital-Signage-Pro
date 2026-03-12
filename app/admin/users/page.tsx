'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { UserManagement } from '@/components/admin/users/UserManagement';

export default function UsersPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">User Management</h2>
          <p className="text-slate-600 mt-2">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <UserManagement />
      </div>
    </AdminLayout>
  );
}
