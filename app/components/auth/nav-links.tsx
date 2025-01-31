// app/components/NavLinks.tsx
'use client'

import { BuildingOfficeIcon, DocumentTextIcon, UsersIcon, TruckIcon, ClipboardDocumentIcon, ComputerDesktopIcon, IdentificationIcon, ShieldCheckIcon, UserIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/authContex';

const links = [
  { name: '001-1 Dirección General', area: 'direccion-general', icon: BuildingOfficeIcon },
  { name: '002-2 Gestión Administrativa', area: 'gestion-administrativa', icon: DocumentTextIcon },
  { name: '003-3 Partidos Políticos', area: 'partidos-politicos', icon: UsersIcon },
  { name: '004-4 Producción y Logística', area: 'produccion-logistica', icon: TruckIcon },
  { name: '005-5 Junta Regional', area: 'junta-regional', icon: ClipboardDocumentIcon },
  { name: '006-6 Tecnología de la Información', area: 'tecnologia-informacion', icon: ComputerDesktopIcon },
  { name: '007-7 Registro Civil', area: 'registro-civil', icon: IdentificationIcon },
  { name: '008-8 Registro Electoral', area: 'registro-electoral', icon: ShieldCheckIcon },
  { name: '009-9 Vigilante', area: 'vigilante', icon: UserIcon },
  { name: '010-1 ADMIN', area: 'admin', icon: UserIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { setArea } = useAuth(); // Usa el AuthContext para manejar el área

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <div
            key={link.name}
            onClick={() => setArea(link.area)} // Actualiza el área en el AuthContext
            className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3  
              ${pathname === '/login' ? 'bg-sky-100 text-blue-600' : ''}
              `}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </div>
        );
      })}
    </>
  );
}