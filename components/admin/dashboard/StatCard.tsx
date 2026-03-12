'use client';

import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  variant = 'default',
}: StatCardProps) {
  const variantClasses = {
    default: 'bg-blue-50 text-blue-600 border-blue-200',
    success: 'bg-green-50 text-green-600 border-green-200',
    warning: 'bg-amber-50 text-amber-600 border-amber-200',
    danger: 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <Card className={cn('p-6 border', variantClasses[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend !== undefined && (
            <p className={cn(
              'text-xs font-medium mt-2',
              trend > 0 ? 'text-green-600' : 'text-red-600'
            )}>
              {trend > 0 ? '+' : ''}{trend}% from last period
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', {
          'bg-blue-100': variant === 'default',
          'bg-green-100': variant === 'success',
          'bg-amber-100': variant === 'warning',
          'bg-red-100': variant === 'danger',
        })}>
          <Icon size={24} />
        </div>
      </div>
    </Card>
  );
}
