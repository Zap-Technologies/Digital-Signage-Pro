'use client';

import { User, UserRole } from '@/lib/types';
import { formatDate, formatDateTime } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserDetailModalProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleChange: (userId: string, newRole: UserRole) => void;
  onStatusChange: (userId: string, newStatus: User['status']) => void;
}

const ROLES: UserRole[] = [
  'super_admin',
  'admin',
  'moderator',
  'device_manager',
  'viewer',
];

const STATUSES: User['status'][] = ['active', 'inactive', 'suspended'];

export function UserDetailModal({
  user,
  open,
  onOpenChange,
  onRoleChange,
  onStatusChange,
}: UserDetailModalProps) {
  const permissionCategories = {
    'User Management': [
      'user:create',
      'user:read',
      'user:update',
      'user:delete',
    ],
    'Content Management': [
      'content:create',
      'content:read',
      'content:moderate',
      'content:delete',
    ],
    'Device Management': [
      'device:control',
      'device:read',
      'device:reboot',
    ],
    'System': [
      'settings:read',
      'settings:update',
      'analytics:read',
      'analytics:export',
      'security:manage',
      'audit:read',
    ],
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View and manage user information and permissions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Basic Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Name
              </label>
              <p className="text-slate-900 font-medium">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <p className="text-slate-600">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Role
              </label>
              <Select value={user.role} onValueChange={(value) => onRoleChange(user.id, value as UserRole)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <Select value={user.status} onValueChange={(value) => onStatusChange(user.id, value as User['status'])}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Created & Last Login */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Created
              </label>
              <p className="text-slate-600 text-sm">
                {formatDate(user.createdAt, { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Last Login
              </label>
              <p className="text-slate-600 text-sm">
                {user.lastLogin
                  ? formatDateTime(user.lastLogin)
                  : 'Never'}
              </p>
            </div>
          </div>

          {/* Permissions */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-4">
              Permissions
            </h4>
            <div className="space-y-4">
              {Object.entries(permissionCategories).map(
                ([category, permissions]) => (
                  <div key={category}>
                    <h5 className="text-sm font-medium text-slate-700 mb-2">
                      {category}
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                      {permissions.map((permission) => {
                        const hasPermission = user.permissions.includes(
                          permission as any
                        );
                        return (
                          <div
                            key={permission}
                            className={`flex items-center gap-2 px-3 py-2 rounded text-xs ${
                              hasPermission
                                ? 'bg-green-50 text-green-700'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded border ${
                                hasPermission
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-slate-300'
                              } flex items-center justify-center`}
                            >
                              {hasPermission && (
                                <span className="text-white text-xs">✓</span>
                              )}
                            </span>
                            {permission}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
