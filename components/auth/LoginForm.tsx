'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdmin } from '@/lib/adminContext';
import { mockUsers } from '@/lib/mockData';
import { User, UserRole } from '@/lib/types';
import { cn } from '@/lib/utils';

// Demo accounts — map email to password for the sandbox demo
const DEMO_CREDENTIALS: Record<string, string> = {
  'admin@digitalsignage.com': 'Admin@1234',
  'moderator@digitalsignage.com': 'Mod@1234',
  'content@digitalsignage.com': 'Content@1234',
  'device@digitalsignage.com': 'Device@1234',
  'viewer@digitalsignage.com': 'Viewer@1234',
};

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  moderator: 'Moderator',
  device_manager: 'Device Manager',
  viewer: 'Viewer',
};

const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: 'bg-red-100 text-red-700',
  admin: 'bg-blue-100 text-blue-700',
  moderator: 'bg-amber-100 text-amber-700',
  device_manager: 'bg-green-100 text-green-700',
  viewer: 'bg-slate-100 text-slate-600',
};

export function LoginForm() {
  const router = useRouter();
  const { setCurrentUser } = useAdmin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function fillDemo(user: User) {
    setEmail(user.email);
    setPassword(DEMO_CREDENTIALS[user.email] ?? '');
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a brief network delay
    await new Promise((r) => setTimeout(r, 600));

    const expectedPassword = DEMO_CREDENTIALS[email];
    const matchedUser = mockUsers.find((u) => u.email === email);

    if (!matchedUser || expectedPassword !== password) {
      setError('Invalid email or password. Try one of the demo accounts below.');
      setIsLoading(false);
      return;
    }

    setCurrentUser(matchedUser);
    router.push('/admin');
  }

  return (
    <div className="w-full max-w-md">
      {/* Mobile-only logo */}
      <div className="flex items-center gap-2 mb-10 lg:hidden">
        <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center">
          <Monitor size={16} className="text-white" />
        </div>
        <span className="font-bold text-lg">Digital Signage Pro</span>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Sign in to your account</h2>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Enter your credentials or use a demo account below.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full h-11 bg-brand-accent hover:bg-brand-accent-hover text-white font-medium"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn size={16} />
              Sign in
            </span>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs text-muted-foreground">
            Demo accounts
          </span>
        </div>
      </div>

      {/* Demo accounts */}
      <div className="space-y-2">
        {mockUsers.map((user) => (
          <button
            key={user.id}
            type="button"
            onClick={() => fillDemo(user)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border',
              'hover:border-brand-accent/50 hover:bg-muted/50 transition-colors text-left',
              email === user.email && 'border-brand-accent bg-muted/50'
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-accent/15 flex items-center justify-center text-brand-accent font-bold text-sm flex-shrink-0">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground leading-tight">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <span
              className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0',
                ROLE_COLORS[user.role]
              )}
            >
              {ROLE_LABELS[user.role]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
