'use client';
import NavLinks from '@/app/components/admin/nav-links-admin';
import { PowerIcon, BellIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

function NotificationBadge({ resetCounter }: { resetCounter: boolean }) {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/notificaciones/admin', {
          signal: controller.signal
        });
        setCount(response.data.length);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Error obteniendo notificaciones:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    const intervalId = setInterval(fetchNotifications, 30000);
    fetchNotifications();

    return () => {
      controller.abort();
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (count > 0 && resetCounter) {
      setCount(0);
    }
  }, [resetCounter]);

  if (isLoading) return null;

  return count > 0 ? (
    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-2 py-1 transform translate-x-1/2 -translate-y-1/2">
      {count}
    </span>
  ) : null;
}

export default function SideNav() {
  const router = useRouter();
  const pathname = usePathname();
  const isNotificationsPage = pathname === '/pages/admin/notificaciones';
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [showModal]);

  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/auth/logout');

      if (response.status === 200) {
        setShowModal(false);
        router.push('/pages/auth/login');
        router.refresh();
      }
    } catch (error) {
      router.push('/pages/auth/login');
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      <div className="flex h-full flex-col px-3 py-4 md:px-2">
        <div className="w-32 text-white md:w-40 mb-4">
          <Image
            src="/img/logo.png"
            alt="Logo"
            width={300}
            height={300}
            className="rounded-full object-cover"
            priority
          />
        </div>

        <div className="mb-6 relative">
          <button 
            className="flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 w-full"
            onClick={() => router.push('/pages/admin/notificaciones')}
          >
            <div className="flex items-center">
              <div className="relative">
                <BellIcon className="w-6 h-6 mr-2" />
                <NotificationBadge resetCounter={isNotificationsPage} />
              </div>
              <p className="hidden md:inline ml-2">Notificaciones</p>
            </div>
          </button>
        </div>

        <div className="flex flex-col flex-grow">
          <NavLinks />
          <div className="mt-auto">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center w-full p-3 text-gray-700 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
            >
              <PowerIcon className="w-6 h-6 mr-2" />
              <span className="hidden md:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
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
