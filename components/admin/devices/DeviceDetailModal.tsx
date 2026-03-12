'use client';

import { Device } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, RotateCw, Power, Thermometer } from 'lucide-react';

interface DeviceDetailModalProps {
  device: Device;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReboot: (deviceId: string) => void;
  onPowerOff: (deviceId: string) => void;
}

export function DeviceDetailModal({
  device,
  open,
  onOpenChange,
  onReboot,
  onPowerOff,
}: DeviceDetailModalProps) {
  const healthScore = Math.round(device.uptime * 0.6 - device.errorCount * 5);
  const isHealthy = healthScore > 80;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{device.name}</DialogTitle>
          <DialogDescription>{device.location}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Overview */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <p className="text-sm text-slate-600">Current Status</p>
              <div className="flex items-center gap-2 mt-2">
                {device.status === 'online' ? (
                  <CheckCircle className="text-green-500" size={24} />
                ) : device.status === 'offline' ? (
                  <AlertTriangle className="text-red-500" size={24} />
                ) : (
                  <AlertTriangle className="text-amber-500" size={24} />
                )}
                <span className="text-lg font-semibold text-slate-900">
                  {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Health Score</p>
              <p className={`text-lg font-bold ${
                isHealthy ? 'text-green-600' : 'text-amber-600'
              }`}>
                {Math.max(0, healthScore)}%
              </p>
            </div>
          </div>

          {/* Device Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Device Type
              </label>
              <p className="text-slate-900">
                {device.type.charAt(0).toUpperCase() + device.type.slice(1)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                IP Address
              </label>
              <p className="text-slate-600 font-mono">{device.ipAddress}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                OS Version
              </label>
              <p className="text-slate-600">{device.osVersion}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Software Version
              </label>
              <p className="text-slate-600">{device.softwareVersion}</p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-4">
              Performance Metrics
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">Uptime</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-slate-900">
                    {device.uptime}%
                  </span>
                </div>
                <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${device.uptime}%` }}
                  />
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">Error Count</p>
                <p className={`text-2xl font-bold ${
                  device.errorCount > 10
                    ? 'text-red-600'
                    : device.errorCount > 5
                      ? 'text-amber-600'
                      : 'text-green-600'
                }`}>
                  {device.errorCount}
                </p>
              </div>
              {device.temperature && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600 mb-2">Temperature</p>
                  <div className="flex items-center gap-2">
                    <Thermometer
                      size={24}
                      className={
                        device.temperature > 50
                          ? 'text-red-500'
                          : 'text-blue-500'
                      }
                    />
                    <span className="text-2xl font-bold text-slate-900">
                      {device.temperature}°C
                    </span>
                  </div>
                </div>
              )}
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">Last Heartbeat</p>
                <p className="text-sm font-medium text-slate-900">
                  {Math.round(
                    (Date.now() - device.lastHeartbeat.getTime()) / 1000
                  )}s ago
                </p>
              </div>
            </div>
          </div>

          {/* Assigned Content */}
          {device.assignedContent && device.assignedContent.length > 0 && (
            <div className="pt-4 border-t border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-3">
                Assigned Content
              </h4>
              <div className="flex flex-wrap gap-2">
                {device.assignedContent.map((contentId) => (
                  <span
                    key={contentId}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {contentId}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            {device.status === 'online' && (
              <>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    onReboot(device.id);
                    onOpenChange(false);
                  }}
                >
                  <RotateCw size={16} />
                  Reboot
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 gap-2"
                  onClick={() => {
                    onPowerOff(device.id);
                    onOpenChange(false);
                  }}
                >
                  <Power size={16} />
                  Power Off
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
