'use client';

import { mockAnalytics } from '@/lib/mockData';
import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Download, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AnalyticsModule() {
  const chartData = mockAnalytics.map((item) => ({
    date: item.date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    devices: item.activeDevices,
    playbacks: item.totalPlaybacks,
    views: Math.floor(item.totalViews / 100),
    errors: Math.floor(item.errorRate * 100),
  }));

  const pieData = [
    { name: 'Displays', value: 8 },
    { name: 'Servers', value: 2 },
    { name: 'Players', value: 2 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  const stats = [
    {
      label: 'Total Playbacks',
      value: mockAnalytics.reduce((acc, item) => acc + item.totalPlaybacks, 0),
      trend: '+12.5%',
    },
    {
      label: 'Average Duration',
      value: Math.round(
        mockAnalytics.reduce((acc, item) => acc + item.averagePlayDuration, 0) /
          mockAnalytics.length
      ) + 'm',
      trend: '+2.3%',
    },
    {
      label: 'System Availability',
      value: '99.2%',
      trend: '+0.8%',
    },
    {
      label: 'Content Approvals',
      value: mockAnalytics.reduce((acc, item) => acc + item.contentApprovals, 0),
      trend: '+5.2%',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 border-0 bg-white shadow-sm">
            <p className="text-sm text-slate-600">{stat.label}</p>
            <div className="flex items-end justify-between mt-2">
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                <TrendingUp size={16} />
                {stat.trend}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Activity Chart */}
        <div className="lg:col-span-2">
          <Card className="p-6 border-0 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              System Activity
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="playbacks"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="Playbacks"
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  name="Views (x100)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Device Distribution */}
        <Card className="p-6 border-0 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Device Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{item.name}</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="font-medium text-slate-900">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Error Trends */}
      <Card className="p-6 border-0 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          Error Rate Trends
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value) => `${value}%`}
            />
            <Bar
              dataKey="errors"
              fill="#ef4444"
              radius={[8, 8, 0, 0]}
              name="Error Rate (%)"
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Export */}
      <div className="flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Download size={18} />
          Export Report
        </Button>
      </div>
    </div>
  );
}
