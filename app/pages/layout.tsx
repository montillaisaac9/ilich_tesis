import SideNav from '@/app/components/auth/sidebar';
import SessionSync from '@/app/components/auth/SessionSync';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <SessionSync />
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      {children}
    </section>
  );
}