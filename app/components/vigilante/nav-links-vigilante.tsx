// app/components/NavLinks.tsx
'use client';

import {
  PlusIcon,
  EyeIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link'; // Importar el componente Link de Next.js
import { usePathname } from 'next/navigation';


const operations = [
  { id: 1, name: 'Visualizar Bienes', href: '/pages/vigilante/tablas', icon: EyeIcon },
  { id: 2, name: 'Agregar Bien', href: '/pages/vigilante/add', icon: PlusIcon },
  { id: 3, name: 'Formatos', href: '/pages/vigilante', icon: DocumentIcon },
];

export default function NavLinks() {
  const pathname = usePathname(); 

  return (
    <>
      {operations.map((operation) => {
        const OperationIcon = operation.icon;
        return (
          <Link
            key={operation.id}
            href={operation.href} // Navegar a la ruta específica
            className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3  
              ${pathname === operation.href ? 'bg-sky-100 text-blue-600' : ''}`}
          >
            <OperationIcon className="w-6" />
            <p className="hidden md:block">{operation.name}</p>
          </Link>
        );
      })}
    </> 
  );
}