// app/layouts/AuthLayout.tsx
'use client';

import SideNav from '@/app/components/auth/sidebarAuth';



export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex h-screen flex-col md:flex-row md:overflow-hidden">
  <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      {children}
    </section>
  );
}