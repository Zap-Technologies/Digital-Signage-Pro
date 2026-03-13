'use client';

import { useState } from 'react';
import { mockPlaybackRecords } from '@/lib/mockData';
import { PlaybackRecord } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, CheckCircle2, XCircle, Clock, Play } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

const CONTENT_TYPE_COLORS: Record<string, string> = {
  image:       'bg-blue-100 text-blue-700',
  video:       'bg-purple-100 text-purple-700',
  banner:      'bg-teal-100 text-teal-700',
  news_ticker: 'bg-amber-100 text-amber-700',
  html:        'bg-slate-100 text-slate-700',
  menu:        'bg-green-100 text-green-700',
};

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

const ALL = 'all';

export function PlaybackReport() {
  const [search, setSearch]       = useState('');
  const [deviceFilter, setDevice] = useState(ALL);
  const [typeFilter, setType]     = useState(ALL);

  const deviceOptions = Array.from(
    new Map(mockPlaybackRecords.map((r) => [r.deviceId, r.deviceName])).entries()
  );

  const filtered = mockPlaybackRecords
    .filter((r) => {
      const matchesDevice = deviceFilter === ALL || r.deviceId === deviceFilter;
      const matchesType   = typeFilter   === ALL || r.contentType === typeFilter;
      const matchesSearch =
        r.contentTitle.toLowerCase().includes(search.toLowerCase()) ||
        r.deviceName.toLowerCase().includes(search.toLowerCase()) ||
        r.playlistName.toLowerCase().includes(search.toLowerCase());
      return matchesDevice && matchesType && matchesSearch;
    })
    .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());

  const totalDuration   = filtered.reduce((s, r) => s + r.durationSeconds, 0);
  const completedCount  = filtered.filter((r) => r.completed).length;
  const completionRate  = filtered.length > 0
    ? Math.round((completedCount / filtered.length) * 100)
    : 0;

  // Top content by play count
  const contentCounts = filtered.reduce<Record<string, { title: string; count: number; type: string }>>(
    (acc, r) => {
      if (!acc[r.contentId]) acc[r.contentId] = { title: r.contentTitle, count: 0, type: r.contentType };
      acc[r.contentId].count++;
      return acc;
    },
    {}
  );
  const topContent = Object.entries(contentCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-50 border-slate-200">
          <p className="text-xs font-medium text-slate-500">Total Plays</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{filtered.length}</p>
        </Card>
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-xs font-medium text-green-600">Completion Rate</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{completionRate}%</p>
        </Card>
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-xs font-medium text-blue-600">Total Duration</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{formatDuration(totalDuration)}</p>
        </Card>
        <Card className="p-4 bg-purple-50 border-purple-200">
          <p className="text-xs font-medium text-purple-600">Unique Devices</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            {new Set(filtered.map((r) => r.deviceId)).size}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters + Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4 border-0 bg-white shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  placeholder="Search content, device, or playlist..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
              <Select value={deviceFilter} onValueChange={setDevice}>
                <SelectTrigger className="w-full sm:w-48 h-9 text-sm">
                  <SelectValue placeholder="All devices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All devices</SelectItem>
                  {deviceOptions.map(([id, name]) => (
                    <SelectItem key={id} value={id}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setType}>
                <SelectTrigger className="w-full sm:w-36 h-9 text-sm">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All types</SelectItem>
                  {Object.keys(CONTENT_TYPE_COLORS).map((t) => (
                    <SelectItem key={t} value={t}>{t.replace('_', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          <Card className="border-0 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Content</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Device</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Started</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Duration</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                        No playback records match the current filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-slate-800 leading-tight">{record.contentTitle}</p>
                          <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-xs font-medium ${CONTENT_TYPE_COLORS[record.contentType] ?? 'bg-slate-100 text-slate-600'}`}>
                            {record.contentType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-slate-700">{record.deviceName}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{record.playlistName}</p>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 text-xs font-mono whitespace-nowrap">
                          {formatDateTime(record.startedAt)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1 text-slate-600 text-xs">
                            <Clock size={12} />
                            {formatDuration(record.durationSeconds)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {record.completed ? (
                            <span className="inline-flex items-center gap-1 text-green-700 text-xs font-medium">
                              <CheckCircle2 size={14} /> Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-600 text-xs font-medium">
                              <XCircle size={14} /> Interrupted
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Top content sidebar */}
        <div className="space-y-4">
          <Card className="p-5 border-0 bg-white shadow-sm">
            <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Play size={15} className="text-blue-600" />
              Most Played Content
            </h4>
            <div className="space-y-3">
              {topContent.map(([id, info], i) => (
                <div key={id} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate">{info.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${CONTENT_TYPE_COLORS[info.type] ?? 'bg-slate-100 text-slate-600'}`}>
                        {info.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-semibold text-slate-600">{info.count} plays</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 border-0 bg-white shadow-sm">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">Plays by Device</h4>
            <div className="space-y-3">
              {deviceOptions.map(([id, name]) => {
                const count = filtered.filter((r) => r.deviceId === id).length;
                const max   = Math.max(...deviceOptions.map(([did]) =>
                  filtered.filter((r) => r.deviceId === did).length
                ));
                const pct = max > 0 ? Math.round((count / max) * 100) : 0;
                return (
                  <div key={id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 truncate max-w-[160px]">{name}</span>
                      <span className="font-semibold text-slate-800 ml-2">{count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
