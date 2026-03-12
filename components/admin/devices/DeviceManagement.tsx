'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  Power,
  RotateCw,
  Eye,
  AlertTriangle,
  CheckCircle,
  RadioOff,
  Thermometer,
} from 'lucide-react';
import { mockDevices } from '@/lib/mockData';
import { Device } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeviceDetailModal } from './DeviceDetailModal';

export function DeviceManagement() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredDevices = devices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.ipAddress.includes(searchTerm)
  );

  const handleReboot = (deviceId: string) => {
    setDevices(
      devices.map((device) =>
        device.id === deviceId
          ? { ...device, lastHeartbeat: new Date() }
          : device
      )
    );
  };

  const handlePowerOff = (deviceId: string) => {
    setDevices(
      devices.map((device) =>
        device.id === deviceId
          ? { ...device, status: 'offline' as const }
          : device
      )
    );
  };

  const stats = {
    total: devices.length,
    online: devices.filter((d) => d.status === 'online').length,
    offline: devices.filter((d) => d.status === 'offline').length,
    error: devices.filter((d) => d.status === 'error').length,
  };

  const statusIcons = {
    online: <CheckCircle className="text-green-500" size={20} />,
    offline: <RadioOff className="text-red-500" size={20} />,
    error: <AlertTriangle className="text-amber-500" size={20} />,
  };

  const statusColors = {
    online: 'bg-green-100 text-green-800',
    offline: 'bg-red-100 text-red-800',
    error: 'bg-amber-100 text-amber-800',
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-50 border-slate-200">
          <p className="text-xs font-medium text-slate-600">Total Devices</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
        </Card>
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-xs font-medium text-green-700">Online</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {stats.online}
          </p>
        </Card>
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-xs font-medium text-red-700">Offline</p>
          <p className="text-2xl font-bold text-red-900 mt-1">
            {stats.offline}
          </p>
        </Card>
        <Card className="p-4 bg-amber-50 border-amber-200">
          <p className="text-xs font-medium text-amber-700">Error</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">
            {stats.error}
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
                placeholder="Search devices by name, location, or IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus size={20} />
            Add Device
          </Button>
        </div>
      </Card>

      {/* Devices Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDevices.map((device) => (
          <Card key={device.id} className="p-6 border-0 bg-white shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {device.name}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      statusColors[device.status]
                    }`}
                  >
                    {statusIcons[device.status]}
                    {device.status.charAt(0).toUpperCase() +
                      device.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{device.location}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedDevice(device);
                      setIsDetailModalOpen(true);
                    }}
                  >
                    <Eye size={16} className="mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {device.status === 'online' && (
                    <>
                      <DropdownMenuItem
                        onClick={() => handleReboot(device.id)}
                      >
                        <RotateCw size={16} className="mr-2" />
                        Reboot Device
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handlePowerOff(device.id)}
                        className="text-red-600"
                      >
                        <Power size={16} className="mr-2" />
                        Power Off
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem>Assign Content</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Device Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div>
                <p className="text-xs text-slate-600 mb-1">Uptime</p>
                <p className="text-sm font-semibold text-slate-900">
                  {device.uptime}%
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Errors</p>
                <p className="text-sm font-semibold text-red-600">
                  {device.errorCount}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Last Heartbeat</p>
                <p className="text-sm font-semibold text-slate-900">
                  {Math.round(
                    (Date.now() - device.lastHeartbeat.getTime()) / 1000
                  )}s ago
                </p>
              </div>
            </div>

            {/* Device Info */}
            <div className="grid grid-cols-2 gap-4 mt-4 text-xs text-slate-600">
              <div>
                <span className="text-slate-500">IP Address:</span>
                <p className="font-mono">{device.ipAddress}</p>
              </div>
              <div>
                <span className="text-slate-500">Software:</span>
                <p>{device.softwareVersion}</p>
              </div>
              {device.temperature && (
                <div>
                  <span className="text-slate-500">Temperature:</span>
                  <div className="flex items-center gap-1 mt-1">
                    <Thermometer size={14} />
                    <span>{device.temperature}°C</span>
                  </div>
                </div>
              )}
              {device.assignedContent && device.assignedContent.length > 0 && (
                <div>
                  <span className="text-slate-500">Content:</span>
                  <p>{device.assignedContent.length} item(s)</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <Card className="p-12 text-center border-0 bg-white shadow-sm">
          <p className="text-slate-500">No devices found</p>
        </Card>
      )}

      {/* Device Detail Modal */}
      {selectedDevice && (
        <DeviceDetailModal
          device={selectedDevice}
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          onReboot={handleReboot}
          onPowerOff={handlePowerOff}
        />
      )}
    </div>
  );
}
