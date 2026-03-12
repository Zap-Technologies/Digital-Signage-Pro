'use client';

import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { mockAnalytics } from '@/lib/mockData';

export function AnalyticsChart() {
  const chartData = mockAnalytics.map((item) => ({
    date: item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    devices: item.activeDevices,
    playbacks: item.totalPlaybacks,
    errors: Math.floor(item.errorRate * 10), // Scale for visibility
  }));

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          System Activity (Last 30 Days)
        </h3>
        <p className="text-sm text-slate-600">Device activity and playback metrics</p>
      </div>
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
            dataKey="devices"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="Active Devices"
          />
          <Line
            type="monotone"
            dataKey="playbacks"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            name="Total Playbacks"
          />
          <Line
            type="monotone"
            dataKey="errors"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            name="Errors (x10)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function ErrorRateChart() {
  const errorData = mockAnalytics.slice(-7).map((item) => ({
    date: item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    errorRate: parseFloat(item.errorRate.toFixed(2)),
  }));

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Error Rate (Last 7 Days)
        </h3>
        <p className="text-sm text-slate-600">System error percentage</p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={errorData}>
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
          <Bar dataKey="errorRate" fill="#ef4444" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
