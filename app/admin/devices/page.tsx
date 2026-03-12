'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DeviceManagement } from '@/components/admin/devices/DeviceManagement';
import { DevicePairing } from '@/components/admin/devices/DevicePairing';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'devices', label: 'All Devices' },
  { id: 'pairing', label: 'Device Pairing' },
] as const;

type Tab = typeof TABS[number]['id'];

export default function DevicesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('devices');

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Device Management</h2>
          <p className="text-slate-600 mt-2">
            Monitor, control, and pair digital signage devices
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 border-b border-slate-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'devices' && <DeviceManagement />}
        {activeTab === 'pairing' && <DevicePairing />}
      </div>
    </AdminLayout>
  );
}
