'use client';

import { mockDevices, mockPlaylists } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, MoreVertical, RefreshCw, Power } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function DeviceStatusOverview() {
  const getPlaylistName = (deviceId: string) => {
    // Find playlist assigned to this device
    const playlist = mockPlaylists.find((p) => p.assignedDevices.includes(deviceId));
    return playlist?.name || 'No Playlist';
  };

  const getUptime = (lastHeartbeat: Date) => {
    const now = new Date();
    const diff = now.getTime() - lastHeartbeat.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'now';
  };

  const isOnline = (lastHeartbeat: Date) => {
    const now = new Date();
    const diffMinutes = (now.getTime() - lastHeartbeat.getTime()) / 60000;
    return diffMinutes < 5;
  };

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-slate-600 font-medium">Total Devices</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{mockDevices.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-600 font-medium">Online</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {mockDevices.filter((d) => isOnline(d.lastHeartbeat)).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-600 font-medium">Offline</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {mockDevices.filter((d) => !isOnline(d.lastHeartbeat)).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-600 font-medium">Sync Errors</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {mockDevices.filter((d) => d.status === 'error').length}
          </p>
        </Card>
      </div>

      {/* Device cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockDevices.map((device) => {
          const online = isOnline(device.lastHeartbeat);
          const uptime = getUptime(device.lastHeartbeat);
          const playlist = getPlaylistName(device.id);

          return (
            <Card key={device.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${online ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}
                  />
                  <div>
                    <h3 className="font-semibold text-slate-900">{device.name}</h3>
                    <p className="text-xs text-slate-500">{device.deviceType}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <RefreshCw size={16} className="mr-2" />
                      Sync Content
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Power size={16} className="mr-2" />
                      Reboot
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      Remove Device
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Status badge */}
              <div className="flex items-center gap-2 mb-3">
                {online ? (
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle size={12} className="mr-1" />
                    Online
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-700">
                    <AlertCircle size={12} className="mr-1" />
                    Offline
                  </Badge>
                )}
                <span className="text-xs text-slate-500">{uptime} ago</span>
              </div>

              {/* Device info */}
              <div className="space-y-2 text-sm mb-3 pb-3 border-t border-slate-200">
                <div className="flex justify-between pt-2">
                  <span className="text-slate-600">Playlist</span>
                  <span className="font-medium text-slate-900">{playlist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Storage</span>
                  <span className="font-medium text-slate-900">{device.storage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">OS</span>
                  <span className="font-medium text-slate-900 text-xs">{device.osVersion}</span>
                </div>
              </div>

              {/* Location */}
              <div className="text-xs text-slate-500">
                📍 {device.location}
              </div>
            </Card>
          );
        })}
      </div>

      {mockDevices.length === 0 && (
        <Card className="p-12 text-center">
          <AlertCircle size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-700 font-medium">No devices registered</p>
          <p className="text-slate-500 text-sm mt-1">
            Pair your first device to begin managing content on the canvas.
          </p>
        </Card>
      )}
    </div>
  );
}
