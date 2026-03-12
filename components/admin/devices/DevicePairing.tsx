'use client';

import { useState } from 'react';
import {
  Smartphone, Monitor, Tablet, Server, CheckCircle2, XCircle,
  Clock, RefreshCw, Wifi, Hash,
} from 'lucide-react';
import { mockPairingRequests } from '@/lib/mockData';
import { DevicePairingRequest } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// ─── helpers ─────────────────────────────────────────────────────────────────

const DEVICE_TYPE_META: Record<DevicePairingRequest['deviceType'], { label: string; icon: React.ElementType }> = {
  android_tv: { label: 'Android TV',  icon: Monitor },
  tablet:     { label: 'Tablet',      icon: Tablet },
  display:    { label: 'Display',     icon: Monitor },
  player:     { label: 'Player',      icon: Smartphone },
};

const STATUS_META = {
  pending:  { label: 'Pending Approval', color: 'bg-amber-100 text-amber-700',  icon: Clock },
  approved: { label: 'Approved',         color: 'bg-green-100 text-green-700',  icon: CheckCircle2 },
  rejected: { label: 'Rejected',         color: 'bg-red-100 text-red-700',      icon: XCircle },
};

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

// ─── Manual Code Entry Dialog ─────────────────────────────────────────────────

interface ManualPairDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onApprove: (code: string) => void;
}

function ManualPairDialog({ open, onOpenChange, onApprove }: ManualPairDialogProps) {
  const [code, setCode] = useState('');

  function handleSubmit() {
    if (!code.trim()) return;
    onApprove(code.trim().toUpperCase());
    setCode('');
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Pair Device by Code</DialogTitle>
          <DialogDescription>
            Enter the pairing code displayed on the device screen to approve it.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-slate-600">
          Enter the pairing code shown on the device screen (e.g. <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs">DSP-4829</code>).
        </p>
        <div>
          <Label>Pairing Code</Label>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="DSP-XXXX"
            className="mt-1 font-mono uppercase tracking-widest text-center text-lg h-12"
            maxLength={8}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSubmit} disabled={code.length < 4}>
            Approve Pairing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DevicePairing() {
  const [requests, setRequests] = useState<DevicePairingRequest[]>(mockPairingRequests);
  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [filter, setFilter] = useState<DevicePairingRequest['status'] | 'all'>('all');

  const pending = requests.filter((r) => r.status === 'pending');
  const filtered = requests.filter((r) => filter === 'all' || r.status === filter);

  function handleApprove(id: string) {
    setRequests(requests.map((r) =>
      r.id === id ? { ...r, status: 'approved', approvedBy: 'user_1', approvedAt: new Date() } : r
    ));
  }

  function handleReject(id: string) {
    setRequests(requests.map((r) => r.id === id ? { ...r, status: 'rejected' } : r));
  }

  function handleManualApprove(code: string) {
    const match = requests.find((r) => r.pairingCode === code && r.status === 'pending');
    if (match) {
      handleApprove(match.id);
    } else {
      // add a synthetic approved request
      const newReq: DevicePairingRequest = {
        id: `pair_${Date.now()}`,
        pairingCode: code,
        deviceName: 'Unknown Device',
        deviceType: 'display',
        macAddress: 'FF:FF:FF:FF:FF:FF',
        requestedAt: new Date(),
        status: 'approved',
        approvedBy: 'user_1',
        approvedAt: new Date(),
      };
      setRequests([...requests, newReq]);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-amber-50 border-amber-200">
          <p className="text-xs font-medium text-amber-700">Awaiting Approval</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">{pending.length}</p>
        </Card>
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-xs font-medium text-green-700">Approved Today</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {requests.filter((r) => r.status === 'approved').length}
          </p>
        </Card>
        <Card className="p-4 bg-white border-slate-200 col-span-2 sm:col-span-1">
          <p className="text-xs font-medium text-slate-500">Total Requests</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{requests.length}</p>
        </Card>
      </div>

      {/* How pairing works — info panel */}
      <Card className="p-5 border border-blue-100 bg-blue-50">
        <div className="flex items-start gap-3">
          <Wifi size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-900">How Device Pairing Works</p>
            <ol className="text-xs text-blue-700 mt-2 space-y-1 list-decimal list-inside">
              <li>The Flutter player app launches on the Android TV or tablet.</li>
              <li>A unique pairing code (e.g. <code className="bg-blue-100 px-1 rounded font-mono">DSP-4829</code>) is shown on screen.</li>
              <li>An admin approves the request here, or enters the code manually.</li>
              <li>The device becomes active and receives its assigned playlist.</li>
            </ol>
          </div>
        </div>
      </Card>

      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                filter === s ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              )}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {s === 'pending' && pending.length > 0 && (
                <span className="ml-1.5 bg-amber-500 text-white rounded-full px-1.5 py-0.5 text-[10px]">
                  {pending.length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5"
            onClick={() => setRequests([...requests])}>
            <RefreshCw size={13} />Refresh
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white gap-1.5 text-sm" size="sm"
            onClick={() => setManualDialogOpen(true)}>
            <Hash size={13} />Enter Code
          </Button>
        </div>
      </div>

      {/* Requests list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card className="p-12 text-center border-dashed border-2 border-slate-200 bg-white">
            <p className="text-slate-400 text-sm">No {filter !== 'all' ? filter : ''} pairing requests.</p>
          </Card>
        )}
        {filtered.map((req) => {
          const DeviceIcon = DEVICE_TYPE_META[req.deviceType].icon;
          const StatusIcon = STATUS_META[req.status].icon;
          return (
            <Card key={req.id} className={cn(
              'p-5 border bg-white transition-shadow hover:shadow-sm',
              req.status === 'pending' && 'border-amber-200 bg-amber-50/40',
            )}>
              <div className="flex items-center gap-4 flex-wrap">
                {/* Device icon */}
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <DeviceIcon size={20} className="text-slate-500" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-slate-900">{req.deviceName}</p>
                    <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full', STATUS_META[req.status].color)}>
                      <StatusIcon size={10} />
                      {STATUS_META[req.status].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 flex-wrap">
                    <span>Code: <code className="font-mono font-bold text-slate-700">{req.pairingCode}</code></span>
                    <span>{DEVICE_TYPE_META[req.deviceType].label}</span>
                    <span className="font-mono">{req.macAddress}</span>
                    <span>{timeAgo(req.requestedAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                {req.status === 'pending' && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50 gap-1.5 h-8"
                      onClick={() => handleReject(req.id)}>
                      <XCircle size={13} />Reject
                    </Button>
                    <Button size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white gap-1.5 h-8"
                      onClick={() => handleApprove(req.id)}>
                      <CheckCircle2 size={13} />Approve
                    </Button>
                  </div>
                )}
                {req.status === 'approved' && req.approvedAt && (
                  <p className="text-xs text-green-600 flex-shrink-0">
                    Approved {timeAgo(req.approvedAt)}
                  </p>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <ManualPairDialog
        open={manualDialogOpen}
        onOpenChange={setManualDialogOpen}
        onApprove={handleManualApprove}
      />
    </div>
  );
}
