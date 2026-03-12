'use client';

import { useState, useRef } from 'react';
import {
  Plus, GripVertical, Trash2, Clock, RotateCw, Monitor,
  ChevronUp, ChevronDown, CheckCircle, FilmIcon, Image,
  AlignLeft, FileCode, Newspaper, BookOpen, Edit3, X,
  PlayCircle, Pause, Archive,
} from 'lucide-react';
import { mockPlaylists, mockContent } from '@/lib/mockData';
import { Playlist, PlaylistItem, Content } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// ─── helpers ─────────────────────────────────────────────────────────────────

const TYPE_ICON: Record<Content['type'], React.ElementType> = {
  image: Image, video: FilmIcon, html: FileCode,
  banner: AlignLeft, menu: BookOpen, news_ticker: Newspaper,
};

const STATUS_CONFIG = {
  draft:    { label: 'Draft',    color: 'bg-slate-100 text-slate-700', icon: Edit3 },
  active:   { label: 'Active',  color: 'bg-green-100 text-green-700', icon: PlayCircle },
  archived: { label: 'Archived', color: 'bg-slate-100 text-slate-400', icon: Archive },
};

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (m >= 60) return `${Math.floor(m / 60)}h ${m % 60}m`;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function getContentById(id: string) {
  return mockContent.find((c) => c.id === id);
}

// ─── Playlist Card ─────────────────────────────────────────────────────────

interface PlaylistCardProps {
  playlist: Playlist;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: Playlist['status']) => void;
}

function PlaylistCard({ playlist, onEdit, onDelete, onStatusChange }: PlaylistCardProps) {
  const StatusIcon = STATUS_CONFIG[playlist.status].icon;
  const totalSecs = playlist.items.reduce((a, i) => a + i.duration, 0);

  return (
    <Card className="bg-white border border-slate-200 hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-slate-900 truncate">{playlist.name}</h3>
              <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full', STATUS_CONFIG[playlist.status].color)}>
                <StatusIcon size={10} />
                {STATUS_CONFIG[playlist.status].label}
              </span>
            </div>
            {playlist.description && (
              <p className="text-sm text-slate-500 mt-1 line-clamp-1">{playlist.description}</p>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400">Items</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">{playlist.items.length}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Duration</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">{formatDuration(totalSecs)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Devices</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">{playlist.assignedDevices.length}</p>
          </div>
        </div>

        {/* Loop badge */}
        {playlist.loop && (
          <div className="flex items-center gap-1.5 mt-3 text-xs text-blue-600">
            <RotateCw size={12} />
            Loop enabled
          </div>
        )}

        {/* Content thumbnails preview */}
        {playlist.items.length > 0 && (
          <div className="flex gap-1.5 mt-3">
            {playlist.items.slice(0, 5).map((item) => {
              const content = getContentById(item.contentId);
              if (!content) return null;
              const Icon = TYPE_ICON[content.type];
              return (
                <div key={item.id} className="w-9 h-9 rounded bg-slate-100 flex items-center justify-center flex-shrink-0" title={content.title}>
                  <Icon size={14} className="text-slate-400" />
                </div>
              );
            })}
            {playlist.items.length > 5 && (
              <div className="w-9 h-9 rounded bg-slate-100 flex items-center justify-center text-xs text-slate-400 font-medium">
                +{playlist.items.length - 5}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={onEdit}>
          <Edit3 size={13} />Edit Playlist
        </Button>
        <div className="flex items-center gap-1">
          {playlist.status !== 'active' && (
            <Button variant="ghost" size="sm" className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50 gap-1"
              onClick={() => onStatusChange('active')}>
              <PlayCircle size={13} />Activate
            </Button>
          )}
          {playlist.status === 'active' && (
            <Button variant="ghost" size="sm" className="h-8 text-amber-600 hover:bg-amber-50 gap-1"
              onClick={() => onStatusChange('archived')}>
              <Archive size={13} />Archive
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
            onClick={onDelete}>
            <Trash2 size={13} />
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ─── Playlist Editor ──────────────────────────────────────────────────────────

interface PlaylistEditorProps {
  playlist: Playlist | null; // null = create new
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (p: Playlist) => void;
}

function PlaylistEditor({ playlist, open, onOpenChange, onSave }: PlaylistEditorProps) {
  const isNew = !playlist;
  const [name, setName] = useState(playlist?.name ?? '');
  const [description, setDescription] = useState(playlist?.description ?? '');
  const [loop, setLoop] = useState(playlist?.loop ?? true);
  const [items, setItems] = useState<PlaylistItem[]>(playlist?.items ?? []);
  const [addContentId, setAddContentId] = useState('');
  const [addDuration, setAddDuration] = useState(10);
  const dragIdx = useRef<number | null>(null);

  // Reset when opening
  function resetAndOpen(open: boolean) {
    if (open) {
      setName(playlist?.name ?? '');
      setDescription(playlist?.description ?? '');
      setLoop(playlist?.loop ?? true);
      setItems(playlist?.items ?? []);
    }
    onOpenChange(open);
  }

  const approvedContent = mockContent.filter((c) => c.status === 'approved');

  function addItem() {
    if (!addContentId) return;
    const newItem: PlaylistItem = {
      id: `pli_${Date.now()}`,
      contentId: addContentId,
      order: items.length,
      duration: addDuration,
    };
    setItems([...items, newItem]);
    setAddContentId('');
    setAddDuration(10);
  }

  function removeItem(id: string) { setItems(items.filter((i) => i.id !== id)); }

  function updateDuration(id: string, val: number) {
    setItems(items.map((i) => i.id === id ? { ...i, duration: Math.max(1, val) } : i));
  }

  function moveItem(idx: number, dir: -1 | 1) {
    const next = [...items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setItems(next.map((item, i) => ({ ...item, order: i })));
  }

  function handleDragStart(idx: number) { dragIdx.current = idx; }
  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    if (dragIdx.current === null || dragIdx.current === idx) return;
    const next = [...items];
    const [moved] = next.splice(dragIdx.current, 1);
    next.splice(idx, 0, moved);
    dragIdx.current = idx;
    setItems(next.map((item, i) => ({ ...item, order: i })));
  }

  const totalSecs = items.reduce((a, i) => a + i.duration, 0);

  function handleSave() {
    const saved: Playlist = {
      id: playlist?.id ?? `playlist_${Date.now()}`,
      name: name || 'Untitled Playlist',
      description,
      items: items.map((item, i) => ({ ...item, order: i })),
      loop,
      totalDuration: totalSecs,
      status: playlist?.status ?? 'draft',
      createdBy: playlist?.createdBy ?? 'user_1',
      createdAt: playlist?.createdAt ?? new Date(),
      updatedAt: new Date(),
      assignedDevices: playlist?.assignedDevices ?? [],
    };
    onSave(saved);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={resetAndOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Create New Playlist' : `Edit: ${playlist.name}`}</DialogTitle>
          <DialogDescription>
            {isNew ? 'Add content items, set durations, and configure looping for your new playlist.' : 'Reorder items, adjust durations, and update playlist settings.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Name & Description */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>Playlist Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Lobby Welcome Loop" className="mt-1" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..." className="mt-1 resize-none" rows={2} />
            </div>
          </div>

          {/* Loop toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <p className="text-sm font-medium text-slate-800">Loop Playback</p>
              <p className="text-xs text-slate-500">Continuously repeat the playlist when it ends</p>
            </div>
            <Switch checked={loop} onCheckedChange={setLoop} />
          </div>

          {/* Duration summary */}
          <div className="flex items-center gap-4 text-sm text-slate-600 bg-blue-50 rounded-lg p-3 border border-blue-100">
            <Clock size={16} className="text-blue-500 flex-shrink-0" />
            <span>Total duration: <strong className="text-slate-800">{formatDuration(totalSecs)}</strong></span>
            <span className="text-slate-400">·</span>
            <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Items list */}
          <div>
            <Label className="mb-2 block">Playlist Items</Label>
            {items.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center text-slate-400 text-sm">
                No items yet. Add content from the section below.
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item, idx) => {
                  const content = getContentById(item.contentId);
                  if (!content) return null;
                  const Icon = TYPE_ICON[content.type];
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-blue-300 transition-colors cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical size={16} className="text-slate-300 flex-shrink-0" />
                      <span className="w-5 h-5 text-xs font-bold text-slate-400 flex-shrink-0 text-center">{idx + 1}</span>
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Icon size={14} className="text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{content.title}</p>
                        <p className="text-xs text-slate-400">{content.type}</p>
                      </div>
                      {/* Duration input */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Input
                          type="number" min={1} max={3600}
                          value={item.duration}
                          onChange={(e) => updateDuration(item.id, +e.target.value)}
                          className="w-16 h-7 text-xs text-center"
                        />
                        <span className="text-xs text-slate-400">s</span>
                      </div>
                      {/* Move up/down */}
                      <div className="flex flex-col gap-0.5 flex-shrink-0">
                        <button onClick={() => moveItem(idx, -1)} disabled={idx === 0}
                          className="p-0.5 rounded hover:bg-slate-100 disabled:opacity-30 transition-colors">
                          <ChevronUp size={12} />
                        </button>
                        <button onClick={() => moveItem(idx, 1)} disabled={idx === items.length - 1}
                          className="p-0.5 rounded hover:bg-slate-100 disabled:opacity-30 transition-colors">
                          <ChevronDown size={12} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)}
                        className="p-1 rounded hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors flex-shrink-0">
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add content */}
          <div className="border-t border-slate-200 pt-4">
            <Label className="mb-2 block">Add Content</Label>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Select value={addContentId} onValueChange={setAddContentId}>
                  <SelectTrigger><SelectValue placeholder="Select approved content..." /></SelectTrigger>
                  <SelectContent>
                    {approvedContent.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title} ({c.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-24">
                <Label className="text-xs text-slate-500">Duration (s)</Label>
                <Input type="number" min={1} max={3600} value={addDuration}
                  onChange={(e) => setAddDuration(+e.target.value)} className="mt-0.5 h-9" />
              </div>
              <Button variant="outline" className="gap-1.5 h-9" onClick={addItem} disabled={!addContentId}>
                <Plus size={15} />Add
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave}>
            {isNew ? 'Create Playlist' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function PlaylistManager() {
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);

  function openCreate() { setEditingPlaylist(null); setEditorOpen(true); }
  function openEdit(p: Playlist) { setEditingPlaylist(p); setEditorOpen(true); }

  function handleSave(p: Playlist) {
    setPlaylists((prev) =>
      prev.find((x) => x.id === p.id)
        ? prev.map((x) => x.id === p.id ? p : x)
        : [p, ...prev]
    );
  }

  function handleDelete(id: string) { setPlaylists((prev) => prev.filter((p) => p.id !== id)); }

  function handleStatusChange(id: string, status: Playlist['status']) {
    setPlaylists((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
  }

  const stats = {
    total: playlists.length,
    active: playlists.filter((p) => p.status === 'active').length,
    totalItems: playlists.reduce((a, p) => a + p.items.length, 0),
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border-slate-200">
          <p className="text-xs font-medium text-slate-500">Total Playlists</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
        </Card>
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-xs font-medium text-green-700">Active</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{stats.active}</p>
        </Card>
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-xs font-medium text-blue-700">Total Items</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalItems}</p>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{playlists.length} playlist{playlists.length !== 1 ? 's' : ''}</p>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2" onClick={openCreate}>
          <Plus size={16} />New Playlist
        </Button>
      </div>

      {/* Grid */}
      {playlists.length === 0 ? (
        <Card className="p-16 text-center border-dashed border-2 border-slate-200 bg-white">
          <PlayCircle size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">No playlists yet</p>
          <p className="text-slate-400 text-sm mt-1">Create your first playlist to assign content to devices.</p>
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white gap-2" onClick={openCreate}>
            <Plus size={16} />Create Playlist
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {playlists.map((p) => (
            <PlaylistCard
              key={p.id}
              playlist={p}
              onEdit={() => openEdit(p)}
              onDelete={() => handleDelete(p.id)}
              onStatusChange={(status) => handleStatusChange(p.id, status)}
            />
          ))}
        </div>
      )}

      <PlaylistEditor
        playlist={editingPlaylist}
        open={editorOpen}
        onOpenChange={setEditorOpen}
        onSave={handleSave}
      />
    </div>
  );
}
