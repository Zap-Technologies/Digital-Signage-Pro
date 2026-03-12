'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Shield,
  Eye,
  Filter,
} from 'lucide-react';
import { mockSecurityEvents, mockAuditLogs, mockUsers } from '@/lib/mockData';
import { formatDateTime } from '@/lib/utils';
import { SecurityEvent, AuditLog } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SecurityManagement() {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(
    mockSecurityEvents
  );

  const filteredEvents = securityEvents.filter(
    (event) => selectedSeverity === 'all' || event.severity === selectedSeverity
  );

  const severityIcons = {
    low: <AlertCircle className="text-blue-500" size={20} />,
    medium: <AlertTriangle className="text-amber-500" size={20} />,
    high: <AlertTriangle className="text-orange-500" size={20} />,
    critical: <Shield className="text-red-500" size={20} />,
  };

  const severityColors = {
    low: 'bg-blue-50 text-blue-800',
    medium: 'bg-amber-50 text-amber-800',
    high: 'bg-orange-50 text-orange-800',
    critical: 'bg-red-50 text-red-800',
  };

  const stats = {
    totalEvents: securityEvents.length,
    critical: securityEvents.filter((e) => e.severity === 'critical').length,
    high: securityEvents.filter((e) => e.severity === 'high').length,
    unresolved: securityEvents.filter((e) => !e.resolved).length,
  };

  return (
    <div className="space-y-8">
      {/* Security Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-4 bg-slate-50 border-slate-200">
          <p className="text-xs font-medium text-slate-600">Total Events</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {stats.totalEvents}
          </p>
        </Card>
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-xs font-medium text-red-700">Critical</p>
          <p className="text-2xl font-bold text-red-900 mt-1">
            {stats.critical}
          </p>
        </Card>
        <Card className="p-4 bg-orange-50 border-orange-200">
          <p className="text-xs font-medium text-orange-700">High</p>
          <p className="text-2xl font-bold text-orange-900 mt-1">
            {stats.high}
          </p>
        </Card>
        <Card className="p-4 bg-amber-50 border-amber-200">
          <p className="text-xs font-medium text-amber-700">Unresolved</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">
            {stats.unresolved}
          </p>
        </Card>
      </div>

      {/* Security Events */}
      <Card className="border-0 bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Security Events
          </h3>
          <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {filteredEvents.map((event) => {
            const user = event.userId
              ? mockUsers.find((u) => u.id === event.userId)
              : null;

            return (
              <div
                key={event.id}
                className={`flex items-start justify-between p-4 rounded-lg border ${
                  severityColors[event.severity]
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  {severityIcons[event.severity]}
                  <div className="flex-1">
                    <p className="font-medium">{event.description}</p>
                    <p className="text-sm mt-1 opacity-75">
                      {event.type.replace('_', ' ')} • {user?.name || 'System'} •{' '}
                      {formatDateTime(event.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {event.resolved ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <AlertCircle className="text-red-500" size={20} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            No security events found
          </div>
        )}
      </Card>

      {/* Audit Logs */}
      <Card className="border-0 bg-white shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          Audit Logs
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-left font-semibold text-slate-900">
                  User
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">
                  Action
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">
                  Resource
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-900">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockAuditLogs.slice(0, 10).map((log) => {
                const user = mockUsers.find((u) => u.id === log.userId);
                return (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-900">
                        {user?.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {log.resource}
                    </td>
                    <td className="px-4 py-3">
                      {log.status === 'success' ? (
                        <CheckCircle className="text-green-500" size={18} />
                      ) : (
                        <AlertCircle className="text-red-500" size={18} />
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      {formatDateTime(log.timestamp)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Security Recommendations */}
      <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm p-6 border border-blue-200">
        <div className="flex items-start gap-4">
          <Shield className="text-blue-600 flex-shrink-0 mt-1" size={24} />
          <div className="flex-1">
            <h4 className="font-semibold text-slate-900 mb-3">
              Security Recommendations
            </h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Enable two-factor authentication for all admin accounts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Review and update IP whitelist quarterly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Conduct security audit of API endpoints</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Rotate API keys and secrets every 90 days</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
