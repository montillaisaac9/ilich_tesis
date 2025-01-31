import SideNav from '@/app/components/auth/sidebar';
import { AuthProvider } from '@/app/context/authContex';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <AuthProvider><div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      {children}</AuthProvider>
    </section>
  );
}
