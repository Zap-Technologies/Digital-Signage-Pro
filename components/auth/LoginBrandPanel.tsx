'use client';

import { Monitor, Shield, BarChart3, Users } from 'lucide-react';

const features = [
  {
    icon: Monitor,
    title: 'Real-time device monitoring',
    description: 'Track every display and player across all locations instantly.',
  },
  {
    icon: Shield,
    title: 'Enterprise-grade security',
    description: 'Audit logs, role-based access, and full permission control.',
  },
  {
    icon: BarChart3,
    title: 'Deep analytics',
    description: 'Understand playback performance, engagement, and uptime.',
  },
  {
    icon: Users,
    title: 'Multi-role team management',
    description: 'Admins, moderators, device managers — everyone in one place.',
  },
];

export function LoginBrandPanel() {
  return (
    <div className="relative flex flex-col w-full bg-brand-panel text-brand-panel-foreground p-12 overflow-hidden">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />

      {/* Logo / product name */}
      <div className="relative z-10 flex items-center gap-3 mb-16">
        <div className="w-9 h-9 rounded-lg bg-brand-accent flex items-center justify-center flex-shrink-0">
          <Monitor size={18} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">Digital Signage Pro</span>
      </div>

      {/* Hero copy */}
      <div className="relative z-10 flex-1">
        <h1 className="text-4xl xl:text-5xl font-bold leading-tight text-balance mb-6">
          Manage every screen,
          <br />
          <span className="text-brand-accent">from one place.</span>
        </h1>
        <p className="text-brand-panel-muted text-lg leading-relaxed max-w-md mb-14">
          The complete digital signage control platform — content, devices, teams,
          and analytics, all under one roof.
        </p>

        {/* Feature list */}
        <ul className="space-y-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <li key={feature.title} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={16} className="text-brand-accent" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{feature.title}</p>
                  <p className="text-brand-panel-muted text-sm leading-relaxed mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer note */}
      <p className="relative z-10 text-xs text-brand-panel-muted mt-16">
        &copy; {new Date().getFullYear()} Digital Signage Pro. All rights reserved.
      </p>
    </div>
  );
}
