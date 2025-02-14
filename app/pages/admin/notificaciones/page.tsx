'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { XMarkIcon, TrashIcon, TruckIcon } from '@heroicons/react/24/solid';

interface Notificacion {
  id_notificacion: number;
  tipo_operacion: string;
  descripcion: string;
  fecha_notificacion: string;
  estado: string;
  id_bienes: number;
  id_coordinacion_destino?: number;
  id_coordinacion_origen?: number;
}

export default function NotificacionesPage() {
  const [notifications, setNotifications] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notification, setNotification] = useState<Notificacion | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin');
      setNotifications(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const markNotificationReviewed = async (notificationId: number, nuevoEstado: string) => {
    await axios.patch('/api/notificaciones/actualizar', { notificacionId: notificationId, nuevoEstado }, {
      headers: { 'Content-Type': 'application/json' }
    });
  };

  const handleAction = async () => {
    if (!notification) return;
    setIsProcessing(true);
    try {
      if (notification.tipo_operacion === 'delete' && notification.id_bienes != null) {
        await axios.post('/api/bienes/delete', { assetId: notification.id_bienes }, {
          headers: { 'Content-Type': 'application/json' }
        });
      } else if (notification.tipo_operacion === 'transferencia' && notification.id_bienes != null && notification.id_coordinacion_destino != null) {
        await axios.post('/api/bienes/transfer', { assetId: notification.id_bienes, destinoId: notification.id_coordinacion_destino ?? 0 }, {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      await markNotificationReviewed(notification.id_notificacion, 'resuelto');
      fetchNotifications(); // Recargar la vista después de la acción
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la operación');
    } finally {
      setIsProcessing(false);
      setShowConfirm(false);
      setNotification(null);
    }
  };

  const ConfirmDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">
          Confirmar {notification?.tipo_operacion === 'delete' ? 'Eliminación' : 'Transferencia'}
        </h3>
        <p className="mb-4">
          ¿Estás seguro de querer {notification?.tipo_operacion === 'delete' ? 'eliminar' : 'transferir'} este bien?
        </p>
        <div className="flex gap-4 justify-end">
          <button 
            onClick={() => { setShowConfirm(false); setNotification(null); }} 
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            disabled={isProcessing}
          >
            Cancelar
          </button>
          <button 
            onClick={handleAction} 
            className={`px-4 py-2 text-white rounded ${notification?.tipo_operacion === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={isProcessing}
          >
            {isProcessing ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col">
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
          <p className="text-white ml-4">Cargando...</p>
        </div>
      )}

      <header className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-800">Panel de Notificaciones</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <div className="max-w-4xl mx-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No hay notificaciones pendientes</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {notifications.map((noti) => (
                <div key={noti.id_notificacion} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${noti.tipo_operacion === 'eliminacion' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                          {noti.tipo_operacion}
                        </span>
                        <span className="text-sm text-gray-500">{noti.fecha_notificacion}</span>
                      </div>
                      <p className="text-gray-800">{noti.descripcion}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {noti.tipo_operacion === 'eliminacion' && (
                        <button 
                          onClick={() => { setNotification(noti); setShowConfirm(true); }} 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg" 
                          title="Eliminar bien"
                          disabled={isProcessing}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                      {noti.tipo_operacion === 'transferencia' && (
                        <button 
                          onClick={() => { setNotification(noti); setShowConfirm(true); }} 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" 
                          title="Aprobar transferencia"
                          disabled={isProcessing}
                        >
                          <TruckIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button  
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg" 
                        title="Rechazar"
                        disabled={isProcessing}
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {showConfirm && notification && <ConfirmDialog />}
    </div>
  );
}
