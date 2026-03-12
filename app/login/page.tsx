'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { LoginBrandPanel } from '@/components/auth/LoginBrandPanel';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left brand panel — hidden on small screens */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%]">
        <LoginBrandPanel />
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12">
        <LoginForm />
      </div>
    </div>
  );
}
