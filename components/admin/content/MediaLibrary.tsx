'use client';

import { useState, useRef } from 'react';
import {
  Search, Plus, Grid3x3, List, Upload, X, Tag, Film, Image,
  FileCode, AlignLeft, Newspaper, BookOpen, CheckCircle, Clock,
  AlertCircle, XCircle, Eye, MoreVertical, Filter,
} from 'lucide-react';
import { mockContent } from '@/lib/mockData';
import { Content } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// ─── helpers ────────────────────────────────────────────────────────────────

const TYPE_META: Record<Content['type'], { label: string; icon: React.ElementType; color: string }> = {
  image:       { label: 'Image',       icon: Image,     color: 'bg-blue-100 text-blue-700' },
  video:       { label: 'Video',       icon: Film,      color: 'bg-purple-100 text-purple-700' },
  html:        { label: 'HTML',        icon: FileCode,  color: 'bg-orange-100 text-orange-700' },
  banner:      { label: 'Banner',      icon: AlignLeft, color: 'bg-cyan-100 text-cyan-700' },
  menu:        { label: 'Menu',        icon: BookOpen,  color: 'bg-green-100 text-green-700' },
  news_ticker: { label: 'News Ticker', icon: Newspaper, color: 'bg-rose-100 text-rose-700' },
};

const STATUS_META: Record<Content['status'], { label: string; icon: React.ElementType; color: string }> = {
  draft:          { label: 'Draft',          icon: Clock,        color: 'bg-slate-100 text-slate-700' },
  pending_review: { label: 'Pending Review', icon: AlertCircle,  color: 'bg-amber-100 text-amber-700' },
  approved:       { label: 'Approved',       icon: CheckCircle,  color: 'bg-green-100 text-green-700' },
  rejected:       { label: 'Rejected',       icon: XCircle,      color: 'bg-red-100 text-red-700' },
};

const ALL_CATEGORIES = ['All Categories', 'Marketing', 'Products', 'Information', 'News', 'Reports', 'Menu', 'Branding'];

function formatSize(mb: number) {
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(mb * 1024).toFixed(0)} KB`;
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── Upload Modal ────────────────────────────────────────────────────────────

interface UploadModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onUpload: (item: Content) => void;
}

function UploadModal({ open, onOpenChange, onUpload }: UploadModalProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<Content['type']>('image');
  const [category, setCategory] = useState('Marketing');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  function handleFile(f: File) {
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ''));
    if (f.type.startsWith('video/')) setType('video');
    else if (f.type.startsWith('image/')) setType('image');
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  }

  function handleSubmit() {
    const newItem: Content = {
      id: `content_${Date.now()}`,
      title: title || 'Untitled',
      description,
      type,
      status: 'pending_review',
      uploadedBy: 'user_1',
      uploadedAt: new Date(),
      modifiedAt: new Date(),
      fileSize: file ? +(file.size / 1024 / 1024).toFixed(2) : 0.1,
      tags,
      category,
    };
    onUpload(newItem);
    onOpenChange(false);
    setFile(null); setTitle(''); setDescription(''); setTags([]); setTagInput('');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Content</DialogTitle>
        </DialogHeader>

        {/* Drop zone */}
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            dragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400',
            file && 'border-green-500 bg-green-50',
          )}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault(); setDragging(false);
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
        >
          <input ref={fileRef} type="file" className="hidden" accept="image/*,video/*,.html"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          {file ? (
            <div>
              <p className="font-medium text-green-700">{file.name}</p>
              <p className="text-xs text-slate-500 mt-1">{formatSize(file.size / 1024 / 1024)}</p>
            </div>
          ) : (
            <div>
              <Upload size={32} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-medium text-slate-700">Click or drag & drop to upload</p>
              <p className="text-xs text-slate-400 mt-1">Images, Videos, HTML files</p>
            </div>
          )}
        </div>

        <div className="space-y-4 mt-2">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Content title" className="mt-1" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description..." className="mt-1 resize-none" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Content Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as Content['type'])}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(TYPE_META) as Content['type'][]).map((t) => (
                    <SelectItem key={t} value={t}>{TYPE_META[t].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ALL_CATEGORIES.slice(1).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mt-1">
              <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag..." className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} />
              <Button type="button" variant="outline" size="sm" onClick={addTag}>Add</Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
                    {t}
                    <button onClick={() => setTags(tags.filter((x) => x !== t))}><X size={10} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmit}>
            Upload Content
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Preview Modal ────────────────────────────────────────────────────────────

interface PreviewModalProps {
  content: Content | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

function PreviewModal({ content, open, onOpenChange, onApprove, onReject }: PreviewModalProps) {
  if (!content) return null;
  const TypeIcon = TYPE_META[content.type].icon;
  const StatusIcon = STATUS_META[content.status].icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TypeIcon size={18} className="text-slate-500" />
            {content.title}
          </DialogTitle>
        </DialogHeader>

        {/* Preview area */}
        <div className="bg-slate-900 rounded-lg aspect-video flex items-center justify-center">
          <div className="text-center">
            <TypeIcon size={48} className="mx-auto text-slate-500 mb-3" />
            <p className="text-slate-400 text-sm">{TYPE_META[content.type].label} Preview</p>
            {content.width && content.height && (
              <p className="text-slate-500 text-xs mt-1">{content.width} × {content.height}px</p>
            )}
          </div>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-500 mb-1">Status</p>
              <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', STATUS_META[content.status].color)}>
                <StatusIcon size={12} />
                {STATUS_META[content.status].label}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Type</p>
              <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', TYPE_META[content.type].color)}>
                <TypeIcon size={12} />
                {TYPE_META[content.type].label}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">File Size</p>
              <p className="font-medium text-slate-800">{formatSize(content.fileSize)}</p>
            </div>
            {content.duration && (
              <div>
                <p className="text-xs text-slate-500 mb-1">Duration</p>
                <p className="font-medium text-slate-800">{formatDuration(content.duration)}</p>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-500 mb-1">Category</p>
              <p className="font-medium text-slate-800">{content.category ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Uploaded</p>
              <p className="font-medium text-slate-800">{content.uploadedAt.toLocaleDateString()}</p>
            </div>
            {content.rejectionReason && (
              <div>
                <p className="text-xs text-red-500 mb-1">Rejection Reason</p>
                <p className="text-red-700 text-xs">{content.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>

        {content.description && (
          <p className="text-sm text-slate-600 border-t border-slate-200 pt-4">{content.description}</p>
        )}

        {content.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {content.tags.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">
                <Tag size={10} />
                {t}
              </span>
            ))}
          </div>
        )}

        {content.status === 'pending_review' && (
          <DialogFooter className="gap-2">
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => { onReject(content.id); onOpenChange(false); }}>
              <XCircle size={16} className="mr-2" />
              Reject
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => { onApprove(content.id); onOpenChange(false); }}>
              <CheckCircle size={16} className="mr-2" />
              Approve
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Grid Card ───────────────────────────────────────────────────────────────

interface ContentCardProps {
  content: Content;
  onPreview: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

function ContentCard({ content, onPreview, onApprove, onReject, onDelete }: ContentCardProps) {
  const TypeIcon = TYPE_META[content.type].icon;
  const StatusIcon = STATUS_META[content.status].icon;

  return (
    <Card className="group overflow-hidden border border-slate-200 hover:shadow-md transition-shadow bg-white">
      {/* Thumbnail */}
      <div
        className="bg-slate-100 aspect-video flex items-center justify-center relative cursor-pointer"
        onClick={onPreview}
      >
        <TypeIcon size={36} className="text-slate-300" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <Eye size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        {/* Type badge */}
        <span className={cn('absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full', TYPE_META[content.type].color)}>
          {TYPE_META[content.type].label}
        </span>
        {/* Duration */}
        {content.duration && (
          <span className="absolute bottom-2 right-2 text-xs font-medium px-2 py-0.5 rounded bg-black/60 text-white">
            {formatDuration(content.duration)}
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 truncate text-sm">{content.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">{content.category} · {timeAgo(content.uploadedAt)}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                <MoreVertical size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onPreview}><Eye size={14} className="mr-2" />Preview</DropdownMenuItem>
              <DropdownMenuSeparator />
              {content.status === 'pending_review' && (
                <>
                  <DropdownMenuItem className="text-green-600" onClick={() => onApprove(content.id)}>
                    <CheckCircle size={14} className="mr-2" />Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600" onClick={() => onReject(content.id)}>
                    <XCircle size={14} className="mr-2" />Reject
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={() => onDelete(content.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status + size row */}
        <div className="flex items-center justify-between mt-3">
          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', STATUS_META[content.status].color)}>
            <StatusIcon size={10} />
            {STATUS_META[content.status].label}
          </span>
          <span className="text-xs text-slate-400">{formatSize(content.fileSize)}</span>
        </div>

        {/* Tags */}
        {content.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {content.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{t}</span>
            ))}
            {content.tags.length > 3 && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">+{content.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function MediaLibrary() {
  const [contents, setContents] = useState<Content[]>(mockContent);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<Content['status'] | 'all'>('all');
  const [filterType, setFilterType] = useState<Content['type'] | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<Content | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const filtered = contents.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some((t) => t.includes(search.toLowerCase()));
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchType = filterType === 'all' || c.type === filterType;
    const matchCat = filterCategory === 'All Categories' || c.category === filterCategory;
    return matchSearch && matchStatus && matchType && matchCat;
  });

  const stats = {
    total: contents.length,
    pending: contents.filter((c) => c.status === 'pending_review').length,
    approved: contents.filter((c) => c.status === 'approved').length,
    totalSize: contents.reduce((a, c) => a + c.fileSize, 0),
  };

  function handleUpload(item: Content) { setContents([item, ...contents]); }

  function handleApprove(id: string) {
    setContents(contents.map((c) => c.id === id ? { ...c, status: 'approved', reviewedAt: new Date() } : c));
  }

  function handleReject(id: string) {
    setContents(contents.map((c) => c.id === id ? { ...c, status: 'rejected', rejectionReason: 'Rejected by admin', reviewedAt: new Date() } : c));
  }

  function handleDelete(id: string) { setContents(contents.filter((c) => c.id !== id)); }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-slate-200">
          <p className="text-xs font-medium text-slate-500">Total Files</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
        </Card>
        <Card className="p-4 bg-amber-50 border-amber-200">
          <p className="text-xs font-medium text-amber-700">Pending Review</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">{stats.pending}</p>
        </Card>
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-xs font-medium text-green-700">Approved</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{stats.approved}</p>
        </Card>
        <Card className="p-4 bg-slate-50 border-slate-200">
          <p className="text-xs font-medium text-slate-600">Storage Used</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatSize(stats.totalSize)}</p>
        </Card>
      </div>

      {/* Toolbar */}
      <Card className="p-4 border-0 bg-white shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input placeholder="Search by title or tag..." value={search}
              onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending_review">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {(Object.keys(TYPE_META) as Content['type'][]).map((t) => (
                  <SelectItem key={t} value={t}>{TYPE_META[t].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ALL_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* View toggle + Upload */}
          <div className="flex items-center gap-2">
            <div className="flex border border-slate-200 rounded-lg overflow-hidden">
              <button
                className={cn('px-3 py-2 transition-colors', viewMode === 'grid' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600')}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Grid3x3 size={16} />
              </button>
              <button
                className={cn('px-3 py-2 transition-colors', viewMode === 'list' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600')}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List size={16} />
              </button>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2" onClick={() => setUploadOpen(true)}>
              <Plus size={16} />
              Upload
            </Button>
          </div>
        </div>
      </Card>

      {/* Content — Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((content) => (
            <ContentCard
              key={content.id}
              content={content}
              onPreview={() => { setPreviewContent(content); setPreviewOpen(true); }}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        /* Content — List */
        <Card className="border-0 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {['Title', 'Type', 'Category', 'Status', 'Size', 'Uploaded', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((content) => {
                  const TypeIcon = TYPE_META[content.type].icon;
                  const StatusIcon = STATUS_META[content.status].icon;
                  return (
                    <tr key={content.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className={cn('w-8 h-8 rounded flex items-center justify-center', TYPE_META[content.type].color)}>
                            <TypeIcon size={14} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{content.title}</p>
                            {content.tags.length > 0 && (
                              <p className="text-xs text-slate-400">{content.tags.slice(0, 2).join(', ')}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', TYPE_META[content.type].color)}>
                          {TYPE_META[content.type].label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-600">{content.category ?? '—'}</td>
                      <td className="px-5 py-3">
                        <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full', STATUS_META[content.status].color)}>
                          <StatusIcon size={10} />
                          {STATUS_META[content.status].label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-600">{formatSize(content.fileSize)}</td>
                      <td className="px-5 py-3 text-sm text-slate-600">{timeAgo(content.uploadedAt)}</td>
                      <td className="px-5 py-3">
                        <Button variant="ghost" size="sm" className="gap-1 h-7"
                          onClick={() => { setPreviewContent(content); setPreviewOpen(true); }}>
                          <Eye size={13} />Preview
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-slate-400 text-sm">No content matches your filters.</div>
          )}
        </Card>
      )}

      {filtered.length === 0 && viewMode === 'grid' && (
        <div className="py-16 text-center text-slate-400 text-sm">No content matches your filters.</div>
      )}

      <UploadModal open={uploadOpen} onOpenChange={setUploadOpen} onUpload={handleUpload} />
      <PreviewModal
        content={previewContent}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
