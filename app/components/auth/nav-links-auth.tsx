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
import { useAuth } from '@/app/context/authContex'; // Asegúrate de que la ruta sea correcta

const links = [
  { id: 1, name: '001-1 Dirección General', area: 'direccion-general', icon: BuildingOfficeIcon },
  { id: 2, name: '002-2 Gestión Administrativa', area: 'gestion-administrativa', icon: DocumentTextIcon },
  { id: 3, name: '003-3 Partidos Políticos', area: 'partidos-politicos', icon: UsersIcon },
  { id: 4, name: '004-4 Producción y Logística', area: 'produccion-logistica', icon: TruckIcon },
  { id: 5, name: '005-5 Junta Regional', area: 'junta-regional', icon: ClipboardDocumentIcon },
  { id: 6, name: '006-6 Tecnología de la Información', area: 'tecnologia-informacion', icon: ComputerDesktopIcon },
  { id: 7, name: '007-7 Registro Civil', area: 'registro-civil', icon: IdentificationIcon },
  { id: 8, name: '008-8 Registro Electoral', area: 'registro-electoral', icon: ShieldCheckIcon },
  { id: 9, name: '009-9 Vigilante', area: 'vigilante', icon: UserIcon },
  { id: 10, name: '010-1 ADMIN', area: 'admin', icon: UserIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { setArea } = useAuth(); // Usa el AuthContext para manejar el área
  // Variable de estado para controlar el enlace seleccionado, por defecto id = 1
  const [selectedLinkId, setSelectedLinkId] = useState<number>(1);

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        // Si el link está seleccionado, aplicamos estilos especiales
        const isSelected = selectedLinkId === link.id;

        return (
          <div
            key={link.id}
            onClick={() => {
              setArea(link.area, link.id); // Actualiza el área en el AuthContext
              setSelectedLinkId(link.id);  // Actualiza el enlace seleccionado
            }}
            className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3 ${
              isSelected || pathname === '/login'
                ? 'bg-sky-100 text-blue-600'
                : 'bg-gray-50 hover:bg-sky-100 hover:text-blue-600'
            }`}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </div>
        );
      })}
    </>
  );
}
