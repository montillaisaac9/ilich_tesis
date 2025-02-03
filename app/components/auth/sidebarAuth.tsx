import Link from 'next/link';
import NavLinks from '@/app/components/auth/nav-links-auth';
import Image from 'next/image';
export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          {
                    <Image
                          src="/img/logo.png" // Ruta de la imagen en la carpeta public
                          alt="Logo"
                          width={300} // Ancho de la imagen
                          height={300} // Alto de la imagen
                          className="rounded-full justify-self-center" // Opcional: si quieres que la imagen sea redonda
                        />
          }
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
      </div>
    </div>
  );
}