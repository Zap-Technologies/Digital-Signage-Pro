'use client';

import { AlertCircle, CheckCircle2, Users, Monitor, TrendingUp, Shield } from 'lucide-react';
import { StatCard } from './StatCard';
import { AnalyticsChart, ErrorRateChart } from './AnalyticsChart';
import { RecentActivity } from './RecentActivity';
import { mockDashboardStats } from '@/lib/mockData';

export function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          label="Total Users"
          value={mockDashboardStats.totalUsers}
          icon={Users}
          variant="default"
        />
        <StatCard
          label="Active Users"
          value={mockDashboardStats.activeUsers}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          label="Online Devices"
          value={`${mockDashboardStats.onlineDevices}/${mockDashboardStats.totalDevices}`}
          icon={Monitor}
          variant="success"
        />
        <StatCard
          label="System Health"
          value={`${mockDashboardStats.systemHealth}%`}
          icon={CheckCircle2}
          variant={mockDashboardStats.systemHealth > 90 ? 'success' : 'warning'}
        />
        <StatCard
          label="Security Score"
          value={`${mockDashboardStats.securityScore}%`}
          icon={Shield}
          variant={mockDashboardStats.securityScore > 85 ? 'success' : 'warning'}
        />
        <StatCard
          label="Pending Content"
          value={mockDashboardStats.pendingContent}
          icon={AlertCircle}
          variant={mockDashboardStats.pendingContent > 0 ? 'warning' : 'success'}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsChart />
        </div>
        <div>
          <ErrorRateChart />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <SystemStatus />
      </div>
    </div>
  );
}

function SystemStatus() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">System Status</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">API Server</span>
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-medium text-green-700">Operational</span>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Database</span>
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-medium text-green-700">Healthy</span>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Storage Service</span>
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-medium text-green-700">Operational</span>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">CDN</span>
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-medium text-green-700">Operational</span>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Backup System</span>
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full" />
            <span className="text-sm font-medium text-amber-700">Limited</span>
          </span>
        </div>
      </div>
    </div>
  );
}
