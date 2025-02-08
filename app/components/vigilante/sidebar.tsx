'use client';
import NavLinks from '@/app/components/vigilante/nav-links-vigilante';
import { PowerIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useState } from 'react';

export default function SideNav() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/auth/logout', {});

      if (response.status === 200) {
        setShowModal(false); // Cierra el modal
        router.push('/pages/auth/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      if (axios.isAxiosError(error)) {
        console.error('Detalles del error:', error.response?.data);
      }
    }
  };

  return (
    <>
      <div className="flex h-full flex-col px-3 py-4 md:px-2">
        <div className="w-32 text-white md:w-40">
          <Image
            src="/img/logo.png"
            alt="Logo"
            width={300}
            height={300}
            className="rounded-full justify-self-center"
          />
        </div>
        <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
          <NavLinks />
          <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
          <button
            onClick={() => setShowModal(true)}
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-red-100 hover:text-red-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Cerrar Sesión</div>
          </button>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800">Cerrar Sesión</h2>
            <p className="text-gray-600 mt-2">
              ¿Estás seguro de que deseas cerrar sesión?
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
