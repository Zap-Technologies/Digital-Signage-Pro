'use client';

import { useState } from 'react';
import { Plus, Search, Eye, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { mockContent } from '@/lib/mockData';
import { Content } from '@/lib/types';
import { formatDateShort } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ContentDetailModal } from './ContentDetailModal';

export function ContentModeration() {
  const [contents, setContents] = useState<Content[]>(mockContent);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<Content['status'] | 'all'>('all');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredContents = contents.filter((content) => {
    const matchesSearch = content.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || content.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (contentId: string) => {
    setContents(
      contents.map((c) =>
        c.id === contentId
          ? { ...c, status: 'approved' as const, reviewedAt: new Date() }
          : c
      )
    );
  };

  const handleReject = (contentId: string, reason: string) => {
    setContents(
      contents.map((c) =>
        c.id === contentId
          ? {
              ...c,
              status: 'rejected' as const,
              rejectionReason: reason,
              reviewedAt: new Date(),
            }
          : c
      )
    );
  };

  const statusIcons = {
    draft: <Clock className="text-slate-400" size={20} />,
    pending_review: <AlertCircle className="text-amber-500" size={20} />,
    approved: <CheckCircle className="text-green-500" size={20} />,
    rejected: <XCircle className="text-red-500" size={20} />,
  };

  const statusColors = {
    draft: 'bg-slate-100 text-slate-800',
    pending_review: 'bg-amber-100 text-amber-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const stats = {
    total: contents.length,
    pending: contents.filter((c) => c.status === 'pending_review').length,
    approved: contents.filter((c) => c.status === 'approved').length,
    rejected: contents.filter((c) => c.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-50 border-slate-200">
          <p className="text-xs font-medium text-slate-600">Total Content</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {stats.total}
          </p>
        </Card>
        <Card className="p-4 bg-amber-50 border-amber-200">
          <p className="text-xs font-medium text-amber-700">Pending Review</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">
            {stats.pending}
          </p>
        </Card>
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-xs font-medium text-green-700">Approved</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {stats.approved}
          </p>
        </Card>
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-xs font-medium text-red-700">Rejected</p>
          <p className="text-2xl font-bold text-red-900 mt-1">
            {stats.rejected}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 border-0 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <Input
                placeholder="Search content by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending_review">Pending Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus size={20} />
            Upload Content
          </Button>
        </div>
      </Card>

      {/* Content List */}
      <Card className="border-0 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Uploaded
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Size
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredContents.map((content) => (
                <tr key={content.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="font-medium text-slate-900 truncate">
                        {content.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {content.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {content.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[content.status]
                      }`}
                    >
                      {statusIcons[content.status]}
                      {content.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {formatDateShort(content.uploadedAt)}
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {content.fileSize} MB
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={() => {
                        setSelectedContent(content);
                        setIsDetailModalOpen(true);
                      }}
                    >
                      <Eye size={16} />
                      Review
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredContents.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-slate-500">No content found</p>
          </div>
        )}
      </Card>

      {/* Content Detail Modal */}
      {selectedContent && (
        <ContentDetailModal
          content={selectedContent}
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
