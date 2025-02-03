'use client';

import { useState } from 'react';
import {
  BuildingOfficeIcon,
  DocumentTextIcon,
  UsersIcon,
  TruckIcon,
  ClipboardDocumentIcon,
  ComputerDesktopIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/authContex';

const links = [
  { id: 1, name: '001-1 Dirección General', area: 'direccion-general', icon: BuildingOfficeIcon, isActive: true },
  { id: 2, name: '002-2 Gestión Administrativa', area: 'gestion-administrativa', icon: DocumentTextIcon, isActive: true },
  { id: 3, name: '003-3 Partidos Políticos', area: 'partidos-politicos', icon: UsersIcon, isActive: true },
  { id: 4, name: '004-4 Producción y Logística', area: 'produccion-logistica', icon: TruckIcon, isActive: true },
  { id: 5, name: '005-5 Junta Regional', area: 'junta-regional', icon: ClipboardDocumentIcon, isActive: true },
  { id: 6, name: '006-6 Tecnología de la Información', area: 'tecnologia-informacion', icon: ComputerDesktopIcon, isActive: true },
  { id: 7, name: '007-7 Registro Civil', area: 'registro-civil', icon: IdentificationIcon, isActive: true },
  { id: 8, name: '008-8 Registro Electoral', area: 'registro-electoral', icon: ShieldCheckIcon, isActive: true },
  { id: 9, name: '009-9 Vigilante', area: 'vigilante', icon: UserIcon, isActive: false },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { setArea } = useAuth();
  const router = useRouter();
  const [selectedLinkId, setSelectedLinkId] = useState<number | null>(null);

  const handleNavigation = (linkId: number, area: string) => {
    setSelectedLinkId(linkId);
    setArea(area, linkId);
    
    // Validación adicional antes de redirigir
    if (pathname !== '/pages/admin/notification') {
      router.push('/pages/admin/tablas');
    }
  };

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isSelected = selectedLinkId === link.id;

        return link.isActive ? (
          <div
            key={link.id}
            onClick={() => handleNavigation(link.id, link.area)}
            className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3 ${
              isSelected ? 'bg-sky-100 text-blue-600' : 'bg-gray-50 hover:bg-sky-100 hover:text-blue-600'
            }`}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </div>
        ) : null;
      })}
    </>
  );
}