'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentModeration } from '@/components/admin/content/ContentModeration';

export default function ContentPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Content Moderation</h2>
          <p className="text-slate-600 mt-2">
            Review, approve, and manage digital signage content
          </p>
        </div>
        <ContentModeration />
      </div>
    </AdminLayout>
  );
}
