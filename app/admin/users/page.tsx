'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { UserManagement } from '@/components/admin/users/UserManagement';

export default function UsersPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Users</h2>
          <p className="text-slate-600 mt-2 max-w-2xl">
            Every person who touches the canvas — from the team member uploading
            content to the engineer pairing devices — works within a role that
            defines what they can see and change. Manage those accounts here.
          </p>
        </div>
        <UserManagement />
      </div>
    </AdminLayout>
  );
}
