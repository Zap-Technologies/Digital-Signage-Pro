'use client';

import { useState } from 'react';
import {
  Plus, CalendarDays, List, Clock, Monitor, Play,
  Edit3, Trash2, ToggleLeft, ToggleRight, CheckCircle2, X,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { mockSchedules, mockPlaylists, mockDevices } from '@/lib/mockData';
import { Schedule, ScheduleDay } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// ─── constants ────────────────────────────────────────────────────────────────

const ALL_DAYS: ScheduleDay[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
];
const DAY_LABELS: Record<ScheduleDay, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
  thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
};
const DAY_FULL: Record<ScheduleDay, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
};

// hours shown on the weekly calendar (8 AM – 10 PM)
const HOUR_RANGE = Array.from({ length: 15 }, (_, i) => i + 8);

function hhmm(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minutesToPct(minutes: number, rangeStart = 8 * 60, rangeEnd = 22 * 60) {
  return ((minutes - rangeStart) / (rangeEnd - rangeStart)) * 100;
}

function getPlaylistName(id: string) {
  return mockPlaylists.find((p) => p.id === id)?.name ?? id;
}

function getDeviceName(id: string) {
  return mockDevices.find((d) => d.id === id)?.name ?? id;
}

// ─── colour palette per schedule (cycle) ─────────────────────────────────────
const PALETTE = [
  'bg-blue-100 border-blue-300 text-blue-800',
  'bg-violet-100 border-violet-300 text-violet-800',
  'bg-green-100 border-green-300 text-green-800',
  'bg-amber-100 border-amber-300 text-amber-800',
  'bg-rose-100 border-rose-300 text-rose-800',
  'bg-cyan-100 border-cyan-300 text-cyan-800',
];

function paletteFor(idx: number) { return PALETTE[idx % PALETTE.length]; }

// ─── Schedule Editor Dialog ───────────────────────────────────────────────────

interface ScheduleEditorProps {
  schedule: Schedule | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (s: Schedule) => void;
}

function ScheduleEditor({ schedule, open, onOpenChange, onSave }: ScheduleEditorProps) {
  const isNew = !schedule;

  const [name, setName] = useState(schedule?.name ?? '');
  const [playlistId, setPlaylistId] = useState(schedule?.playlistId ?? '');
  const [deviceIds, setDeviceIds] = useState<string[]>(schedule?.deviceIds ?? []);
  const [days, setDays] = useState<ScheduleDay[]>(schedule?.days ?? ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
  const [startTime, setStartTime] = useState(schedule?.timeSlot.start ?? '08:00');
  const [endTime, setEndTime] = useState(schedule?.timeSlot.end ?? '17:00');
  const [startDate, setStartDate] = useState(schedule?.startDate ?? '');
  const [endDate, setEndDate] = useState(schedule?.endDate ?? '');
  const [isActive, setIsActive] = useState(schedule?.isActive ?? true);
  const [priority, setPriority] = useState(schedule?.priority ?? 1);

  function toggleDay(d: ScheduleDay) {
    setDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  }

  function toggleDevice(id: string) {
    setDeviceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleSave() {
    const saved: Schedule = {
      id: schedule?.id ?? `sched_${Date.now()}`,
      name: name || 'Untitled Schedule',
      playlistId,
      deviceIds,
      days,
      timeSlot: { start: startTime, end: endTime },
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      isActive,
      priority,
      createdAt: schedule?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };
    onSave(saved);
    onOpenChange(false);
  }

  function handleOpen(v: boolean) {
    if (v) {
      setName(schedule?.name ?? '');
      setPlaylistId(schedule?.playlistId ?? '');
      setDeviceIds(schedule?.deviceIds ?? []);
      setDays(schedule?.days ?? ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
      setStartTime(schedule?.timeSlot.start ?? '08:00');
      setEndTime(schedule?.timeSlot.end ?? '17:00');
      setStartDate(schedule?.startDate ?? '');
      setEndDate(schedule?.endDate ?? '');
      setIsActive(schedule?.isActive ?? true);
      setPriority(schedule?.priority ?? 1);
    }
    onOpenChange(v);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Create Schedule' : `Edit: ${schedule.name}`}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Name */}
          <div>
            <Label>Schedule Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Weekday Morning Loop" className="mt-1" />
          </div>

          {/* Playlist */}
          <div>
            <Label>Playlist</Label>
            <Select value={playlistId} onValueChange={setPlaylistId}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select a playlist..." /></SelectTrigger>
              <SelectContent>
                {mockPlaylists.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Days */}
          <div>
            <Label className="block mb-2">Days of Week</Label>
            <div className="flex flex-wrap gap-2">
              {ALL_DAYS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDay(d)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                    days.includes(d)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  )}
                >
                  {DAY_FULL[d]}
                </button>
              ))}
            </div>
          </div>

          {/* Time slot */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Time</Label>
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>End Time</Label>
              <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="mt-1" />
            </div>
          </div>

          {/* Date range (optional) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date <span className="text-slate-400 font-normal">(optional)</span></Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>End Date <span className="text-slate-400 font-normal">(optional)</span></Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1" />
            </div>
          </div>

          {/* Devices */}
          <div>
            <Label className="block mb-2">Target Devices</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {mockDevices.map((device) => (
                <button
                  key={device.id}
                  type="button"
                  onClick={() => toggleDevice(device.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-left text-sm transition-colors',
                    deviceIds.includes(device.id)
                      ? 'border-blue-300 bg-blue-50 text-blue-800'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  )}
                >
                  <div className={cn(
                    'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0',
                    deviceIds.includes(device.id) ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                  )}>
                    {deviceIds.includes(device.id) && <CheckCircle2 size={10} className="text-white" />}
                  </div>
                  <Monitor size={13} className="text-slate-400 flex-shrink-0" />
                  <span className="flex-1 truncate">{device.name}</span>
                  <span className={cn('text-xs px-1.5 py-0.5 rounded-full',
                    device.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  )}>
                    {device.status}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Priority & Active */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Priority</Label>
              <Input type="number" min={1} max={10} value={priority}
                onChange={(e) => setPriority(+e.target.value)} className="mt-1" />
              <p className="text-xs text-slate-400 mt-1">Higher = takes precedence</p>
            </div>
            <div>
              <Label className="block mb-3">Active</Label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSave} disabled={!playlistId || days.length === 0}>
            {isNew ? 'Create Schedule' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Weekly Calendar View ─────────────────────────────────────────────────────

interface WeeklyCalendarProps {
  schedules: Schedule[];
  onEdit: (s: Schedule) => void;
}

function WeeklyCalendar({ schedules, onEdit }: WeeklyCalendarProps) {
  const activeSchedules = schedules.filter((s) => s.isActive);
  const RANGE_START = 8 * 60;
  const RANGE_END = 22 * 60;
  const RANGE = RANGE_END - RANGE_START;

  return (
    <Card className="bg-white border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          {/* Header row */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-slate-200 bg-slate-50">
            <div className="px-2 py-3 text-xs text-slate-400" />
            {ALL_DAYS.map((d) => (
              <div key={d} className="py-3 text-center text-xs font-semibold text-slate-600 border-l border-slate-200">
                {DAY_LABELS[d]}
              </div>
            ))}
          </div>

          {/* Time rows */}
          <div className="relative">
            {/* Hour lines */}
            {HOUR_RANGE.map((hour) => (
              <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)]"
                style={{ height: '52px' }}>
                <div className="px-2 flex items-start pt-1">
                  <span className="text-[10px] text-slate-400">
                    {hour % 12 === 0 ? 12 : hour % 12}{hour < 12 ? 'am' : 'pm'}
                  </span>
                </div>
                {ALL_DAYS.map((d) => (
                  <div key={d} className="border-l border-t border-slate-100" />
                ))}
              </div>
            ))}

            {/* Schedule blocks — absolutely positioned */}
            <div className="absolute inset-0 grid grid-cols-[60px_repeat(7,1fr)] pointer-events-none">
              <div />
              {ALL_DAYS.map((day, dayIdx) => {
                const daySchedules = activeSchedules.filter((s) => s.days.includes(day));
                return (
                  <div key={day} className="relative">
                    {daySchedules.map((s, i) => {
                      const startMin = hhmm(s.timeSlot.start);
                      const endMin = hhmm(s.timeSlot.end);
                      const top = `${minutesToPct(startMin, RANGE_START, RANGE_END)}%`;
                      const height = `${((endMin - startMin) / RANGE) * 100}%`;
                      const colorIdx = schedules.indexOf(s);
                      return (
                        <button
                          key={s.id}
                          style={{ top, height, left: 2, right: 2 }}
                          className={cn(
                            'absolute rounded border text-left px-1.5 py-1 overflow-hidden pointer-events-auto',
                            'hover:opacity-90 transition-opacity',
                            paletteFor(colorIdx),
                          )}
                          onClick={() => onEdit(s)}
                        >
                          <p className="text-[10px] font-semibold leading-tight truncate">{s.name}</p>
                          <p className="text-[9px] leading-tight truncate opacity-70">
                            {s.timeSlot.start}–{s.timeSlot.end}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── List View ────────────────────────────────────────────────────────────────

interface ScheduleListProps {
  schedules: Schedule[];
  onEdit: (s: Schedule) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

function ScheduleList({ schedules, onEdit, onDelete, onToggle }: ScheduleListProps) {
  return (
    <div className="space-y-3">
      {schedules.map((s, idx) => (
        <Card key={s.id} className={cn(
          'p-5 border bg-white hover:shadow-sm transition-shadow',
          !s.isActive && 'opacity-60',
        )}>
          <div className="flex items-start gap-4 flex-wrap">
            {/* Color dot */}
            <div className={cn('w-3 h-3 rounded-full mt-1.5 flex-shrink-0', paletteFor(idx).split(' ')[0].replace('bg-', 'bg-').replace('100', '400'))} />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-slate-900">{s.name}</p>
                <span className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded-full',
                  s.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                )}>
                  {s.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  Priority {s.priority}
                </span>
              </div>

              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Play size={12} className="text-slate-400" />
                  {getPlaylistName(s.playlistId)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} className="text-slate-400" />
                  {s.timeSlot.start} – {s.timeSlot.end}
                </span>
                <span className="flex items-center gap-1.5">
                  <Monitor size={12} className="text-slate-400" />
                  {s.deviceIds.length} device{s.deviceIds.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Day chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {ALL_DAYS.map((d) => (
                  <span key={d} className={cn(
                    'text-xs px-2 py-0.5 rounded font-medium',
                    s.days.includes(d)
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-50 text-slate-300'
                  )}>
                    {DAY_LABELS[d]}
                  </span>
                ))}
              </div>

              {(s.startDate || s.endDate) && (
                <p className="text-xs text-slate-400 mt-1.5">
                  {s.startDate && `From ${s.startDate}`}
                  {s.startDate && s.endDate && ' · '}
                  {s.endDate && `Until ${s.endDate}`}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700"
                onClick={() => onToggle(s.id)} title={s.isActive ? 'Deactivate' : 'Activate'}>
                {s.isActive ? <ToggleRight size={18} className="text-blue-500" /> : <ToggleLeft size={18} />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700"
                onClick={() => onEdit(s)}>
                <Edit3 size={15} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-300 hover:text-red-600 hover:bg-red-50"
                onClick={() => onDelete(s.id)}>
                <Trash2 size={15} />
              </Button>
            </div>
          </div>
        </Card>
      ))}
      {schedules.length === 0 && (
        <Card className="p-12 text-center border-dashed border-2 border-slate-200 bg-white">
          <p className="text-slate-400 text-sm">No schedules yet. Create one to get started.</p>
        </Card>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SchedulingSystem() {
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  function openCreate() { setEditingSchedule(null); setEditorOpen(true); }
  function openEdit(s: Schedule) { setEditingSchedule(s); setEditorOpen(true); }

  function handleSave(s: Schedule) {
    setSchedules((prev) =>
      prev.find((x) => x.id === s.id)
        ? prev.map((x) => (x.id === s.id ? s : x))
        : [s, ...prev]
    );
  }

  function handleDelete(id: string) {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  }

  function handleToggle(id: string) {
    setSchedules((prev) =>
      prev.map((s) => s.id === id ? { ...s, isActive: !s.isActive, updatedAt: new Date() } : s)
    );
  }

  const stats = {
    total: schedules.length,
    active: schedules.filter((s) => s.isActive).length,
    devices: new Set(schedules.flatMap((s) => s.deviceIds)).size,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-white border-slate-200">
          <p className="text-xs font-medium text-slate-500">Total Schedules</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
        </Card>
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-xs font-medium text-green-700">Active</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{stats.active}</p>
        </Card>
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-xs font-medium text-blue-700">Devices Covered</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.devices}</p>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* View toggle */}
        <div className="flex border border-slate-200 rounded-lg overflow-hidden">
          <button
            className={cn('flex items-center gap-1.5 px-3 py-2 text-sm transition-colors',
              viewMode === 'calendar' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700')}
            onClick={() => setViewMode('calendar')}
          >
            <CalendarDays size={15} />Weekly
          </button>
          <button
            className={cn('flex items-center gap-1.5 px-3 py-2 text-sm transition-colors',
              viewMode === 'list' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700')}
            onClick={() => setViewMode('list')}
          >
            <List size={15} />List
          </button>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2" onClick={openCreate}>
          <Plus size={16} />New Schedule
        </Button>
      </div>

      {viewMode === 'calendar' ? (
        <>
          {/* Legend */}
          <div className="flex flex-wrap gap-3">
            {schedules.filter((s) => s.isActive).map((s, idx) => (
              <div key={s.id} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className={cn('w-2.5 h-2.5 rounded-full', paletteFor(idx).split(' ')[0].replace('100', '400'))} />
                {s.name}
              </div>
            ))}
          </div>
          <WeeklyCalendar schedules={schedules} onEdit={openEdit} />
          <p className="text-xs text-slate-400 text-center">Click any block to edit. Showing 8 AM – 10 PM. Inactive schedules are hidden.</p>
        </>
      ) : (
        <ScheduleList
          schedules={schedules}
          onEdit={openEdit}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
      )}

      <ScheduleEditor
        schedule={editingSchedule}
        open={editorOpen}
        onOpenChange={setEditorOpen}
        onSave={handleSave}
      />
    </div>
  );
}
