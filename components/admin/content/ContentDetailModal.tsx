'use client';

import { useState } from 'react';
import { Content } from '@/lib/types';
import { mockUsers } from '@/lib/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ContentDetailModalProps {
  content: Content;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (contentId: string) => void;
  onReject: (contentId: string, reason: string) => void;
}

export function ContentDetailModal({
  content,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: ContentDetailModalProps) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const uploadedBy = mockUsers.find((u) => u.id === content.uploadedBy);
  const reviewedBy = content.reviewedBy
    ? mockUsers.find((u) => u.id === content.reviewedBy)
    : null;

  const handleApprove = () => {
    onApprove(content.id);
    onOpenChange(false);
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(content.id, rejectionReason);
      onOpenChange(false);
      setRejectionReason('');
      setIsRejecting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Content Review</DialogTitle>
          <DialogDescription>
            Review and approve or reject this content
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Content Preview */}
          <div className="bg-slate-100 rounded-lg p-8 flex items-center justify-center min-h-40">
            <div className="text-center">
              <p className="text-4xl mb-2">
                {content.type === 'image'
                  ? '🖼️'
                  : content.type === 'video'
                    ? '🎬'
                    : content.type === 'html'
                      ? '📄'
                      : '📋'}
              </p>
              <p className="text-sm text-slate-600">
                {content.type.toUpperCase()} Preview
              </p>
            </div>
          </div>

          {/* Content Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title
              </label>
              <p className="text-slate-900 font-medium">{content.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type
              </label>
              <p className="text-slate-600">{content.type}</p>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <p className="text-slate-600">{content.description}</p>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Uploaded By
              </label>
              <p className="text-slate-600 text-sm">{uploadedBy?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload Date
              </label>
              <p className="text-slate-600 text-sm">
                {content.uploadedAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                File Size
              </label>
              <p className="text-slate-600 text-sm">{content.fileSize} MB</p>
            </div>
            {content.duration && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Duration
                </label>
                <p className="text-slate-600 text-sm">
                  {Math.floor(content.duration / 60)}m{content.duration % 60}s
                </p>
              </div>
            )}
          </div>

          {/* Review Info */}
          {content.reviewedAt && (
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-sm font-medium text-slate-900 mb-3">
                Review Information
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600">Reviewed By</p>
                  <p className="font-medium text-slate-900">
                    {reviewedBy?.name}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600">Review Date</p>
                  <p className="font-medium text-slate-900">
                    {content.reviewedAt.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              {content.rejectionReason && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-sm text-slate-600 mb-2">
                    Rejection Reason
                  </p>
                  <p className="text-sm text-red-700 font-medium">
                    {content.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Rejection Reason (for pending items) */}
          {content.status === 'pending_review' && isRejecting && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                Rejection Reason
              </label>
              <Textarea
                placeholder="Explain why this content is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-24"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={() => {
                setIsRejecting(false);
                setRejectionReason('');
                onOpenChange(false);
              }}
            >
              Close
            </Button>

            {content.status === 'pending_review' && !isRejecting && (
              <>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-300"
                  onClick={() => setIsRejecting(true)}
                >
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleApprove}
                >
                  Approve
                </Button>
              </>
            )}

            {isRejecting && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsRejecting(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                >
                  Confirm Rejection
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
