'use client';

import { useState } from 'react';
import { mockDeviceActivity } from '@/lib/mockData';
import { DeviceActivityEvent } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Wifi,
  WifiOff,
  Heart,
  AlertTriangle,
  RotateCw,
  RefreshCw,
  Search,
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

const EVENT_META: Record<
  DeviceActivityEvent['eventType'],
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  online:       { label: 'Online',       icon: <Wifi size={14} />,         color: 'text-green-700',  bg: 'bg-green-100'  },
  offline:      { label: 'Offline',      icon: <WifiOff size={14} />,      color: 'text-red-700',    bg: 'bg-red-100'    },
  heartbeat:    { label: 'Heartbeat',    icon: <Heart size={14} />,         color: 'text-blue-700',   bg: 'bg-blue-100'   },
  error:        { label: 'Error',        icon: <AlertTriangle size={14} />, color: 'text-amber-700',  bg: 'bg-amber-100'  },
  reboot:       { label: 'Reboot',       icon: <RotateCw size={14} />,      color: 'text-violet-700', bg: 'bg-violet-100' },
  content_sync: { label: 'Content Sync', icon: <RefreshCw size={14} />,     color: 'text-teal-700',   bg: 'bg-teal-100'   },
};

const ALL_DEVICES = 'all';
const ALL_EVENTS  = 'all';

export function DeviceActivityLog() {
  const [search, setSearch]         = useState('');
  const [deviceFilter, setDevice]   = useState(ALL_DEVICES);
  const [eventFilter, setEvent]     = useState(ALL_EVENTS);

  const deviceOptions = Array.from(
    new Map(mockDeviceActivity.map((e) => [e.deviceId, e.deviceName])).entries()
  );

  const filtered = mockDeviceActivity
    .filter((e) => {
      const matchesDevice = deviceFilter === ALL_DEVICES || e.deviceId === deviceFilter;
      const matchesEvent  = eventFilter  === ALL_EVENTS  || e.eventType === eventFilter;
      const matchesSearch = e.deviceName.toLowerCase().includes(search.toLowerCase()) ||
                            e.message.toLowerCase().includes(search.toLowerCase());
      return matchesDevice && matchesEvent && matchesSearch;
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const counts = {
    total:  mockDeviceActivity.length,
    errors: mockDeviceActivity.filter((e) => e.eventType === 'error').length,
    syncs:  mockDeviceActivity.filter((e) => e.eventType === 'content_sync').length,
    reboots:mockDeviceActivity.filter((e) => e.eventType === 'reboot').length,
  };

  return (
    <div className="space-y-6">
      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-50 border-slate-200">
          <p className="text-xs font-medium text-slate-500">Total Events</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{counts.total}</p>
        </Card>
        <Card className="p-4 bg-amber-50 border-amber-200">
          <p className="text-xs font-medium text-amber-600">Errors</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">{counts.errors}</p>
        </Card>
        <Card className="p-4 bg-teal-50 border-teal-200">
          <p className="text-xs font-medium text-teal-600">Content Syncs</p>
          <p className="text-2xl font-bold text-teal-900 mt-1">{counts.syncs}</p>
        </Card>
        <Card className="p-4 bg-violet-50 border-violet-200">
          <p className="text-xs font-medium text-violet-600">Reboots</p>
          <p className="text-2xl font-bold text-violet-900 mt-1">{counts.reboots}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 border-0 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              placeholder="Search device name or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Select value={deviceFilter} onValueChange={setDevice}>
            <SelectTrigger className="w-full sm:w-52 h-9 text-sm">
              <SelectValue placeholder="All devices" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_DEVICES}>All devices</SelectItem>
              {deviceOptions.map(([id, name]) => (
                <SelectItem key={id} value={id}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={eventFilter} onValueChange={setEvent}>
            <SelectTrigger className="w-full sm:w-44 h-9 text-sm">
              <SelectValue placeholder="All events" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_EVENTS}>All events</SelectItem>
              {(Object.keys(EVENT_META) as DeviceActivityEvent['eventType'][]).map((k) => (
                <SelectItem key={k} value={k}>{EVENT_META[k].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Log table */}
      <Card className="border-0 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-36">Time</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-40">Device</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-32">Event</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-slate-400">
                    No events match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((event) => {
                  const meta = EVENT_META[event.eventType];
                  return (
                    <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-xs whitespace-nowrap">
                        {formatDateTime(event.timestamp)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-medium text-slate-800">{event.deviceName}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${meta.bg} ${meta.color}`}>
                          {meta.icon}
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{event.message}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
