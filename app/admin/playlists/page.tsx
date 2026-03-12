'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { PlaylistManager } from '@/components/admin/playlists/PlaylistManager';

export default function PlaylistsPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Playlists</h2>
          <p className="text-slate-600 mt-2">
            Create and manage playlists, configure content order, duration, and loop settings
          </p>
        </div>
        <PlaylistManager />
      </div>
    </AdminLayout>
  );
}
