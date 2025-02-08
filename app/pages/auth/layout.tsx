'use client';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative flex h-screen flex-col md:flex-row md:overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed bg-[url('/img/logo.png')]">
      {/* Capa de fondo con difuminado */}
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-md"></div>

      {/* Contenido encima del fondo */}
      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
}
