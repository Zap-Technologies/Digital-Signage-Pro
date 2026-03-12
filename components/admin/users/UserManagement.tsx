'use client';

import { useState } from 'react';
import { Plus, Search, MoreVertical, CheckCircle2, XCircle } from 'lucide-react';
import { mockUsers } from '@/lib/mockData';
import { User, UserRole } from '@/lib/types';
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
import { UserDetailModal } from './UserDetailModal';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const handleStatusChange = (userId: string, newStatus: User['status']) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleDelete = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-amber-100 text-amber-800',
    suspended: 'bg-red-100 text-red-800',
  };

  const roleColors = {
    super_admin: 'bg-red-100 text-red-800',
    admin: 'bg-blue-100 text-blue-800',
    moderator: 'bg-purple-100 text-purple-800',
    device_manager: 'bg-cyan-100 text-cyan-800',
    viewer: 'bg-slate-100 text-slate-800',
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Add Button */}
      <Card className="p-6 border-0 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus size={20} />
            Add User
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="border-0 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Last Login
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-900">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        roleColors[user.role]
                      }`}
                    >
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[user.status]
                      }`}
                    >
                      {user.status === 'active' ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <XCircle size={14} />
                      )}
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {user.lastLogin
                      ? user.lastLogin.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Never'}
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(
                              user.id,
                              user.status === 'active'
                                ? 'suspended'
                                : 'active'
                            )
                          }
                        >
                          {user.status === 'active'
                            ? 'Suspend User'
                            : 'Activate User'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600"
                        >
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-slate-500">No users found</p>
          </div>
        )}
      </Card>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          onRoleChange={handleRoleChange}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
