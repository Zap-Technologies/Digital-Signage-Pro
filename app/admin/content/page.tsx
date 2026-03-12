'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { MediaLibrary } from '@/components/admin/content/MediaLibrary';

export default function ContentPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Media Library</h2>
          <p className="text-slate-600 mt-2">
            Upload, manage, review and publish all your digital signage content
          </p>
        </div>
        <MediaLibrary />
      </div>
    </AdminLayout>
  );
}
