'use client';
import { 
  BuildingOfficeIcon,
  DocumentTextIcon,
  UsersIcon,
  TruckIcon,
  ClipboardDocumentIcon,
  ComputerDesktopIcon,
  IdentificationIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/app/context/authContex';

interface Coordination {
  id_coordinacion: number;
  nombre_coordinacion: string;
  number_coordinacion: string;
}

// Agrega esta interfaz para las coordinaciones con iconos
interface CoordinationWithIcon extends Coordination {
  icon: React.ComponentType<{ className?: string }>;
}

// Array de coordinaciones con iconos
const coordinaciones: CoordinationWithIcon[] = [
  { 
    id_coordinacion: 1, 
    nombre_coordinacion: 'Dirección General',
    number_coordinacion: '001-1 Dirección General',
    icon: BuildingOfficeIcon
  },
  { 
    id_coordinacion: 2, 
    nombre_coordinacion: 'Gestión Administrativa',
    number_coordinacion: '002-2 Gestión Administrativa',
    icon: DocumentTextIcon
  },
  { 
    id_coordinacion: 3, 
    nombre_coordinacion: 'Partidos Políticos',
    number_coordinacion: '003-3 Partidos Políticos',
    icon: UsersIcon
  },
  { 
    id_coordinacion: 4, 
    nombre_coordinacion: 'Producción y Logística',
    number_coordinacion: '004-4 Producción y Logística',
    icon: TruckIcon
  },
  { 
    id_coordinacion: 5, 
    nombre_coordinacion: 'Junta Regional',
    number_coordinacion: '005-5 Junta Regional',
    icon: ClipboardDocumentIcon
  },
  { 
    id_coordinacion: 6, 
    nombre_coordinacion: 'Tecnología de la Información',
    number_coordinacion: '006-6 Tecnología de la Información',
    icon: ComputerDesktopIcon
  },
  { 
    id_coordinacion: 7, 
    nombre_coordinacion: 'Registro Civil',
    number_coordinacion: '007-7 Registro Civil',
    icon: IdentificationIcon
  },
  { 
    id_coordinacion: 8, 
    nombre_coordinacion: 'Registro Electoral',
    number_coordinacion: '008-8 Registro Electoral',
    icon: ShieldCheckIcon
  }
];

interface Bien {
  id_bienes: number;
  tipoBien: 'bienes' | 'bienes_transitorio';
  numero_inventario: string;
  nombre_bien: string;
  nombre_empleado: string;
  marca?: string;
  modelo?: string;
  serial?: string;
  id_coordinacion?: number;
  fecha_ingreso?: string;
  coordinaciones?: Coordination;
}
const BienesTable: React.FC = () => {
  const {areaId,area } = useAuth();
  const [bienes, setBienes] = useState<Bien[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTipoBien, setSelectedTipoBien] = useState<'bienes' | 'bienes_transitorio'>('bienes');
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedCoordinacion, setSelectedCoordinacion] = useState<number | null>(null);
  const [currentAssetId, setCurrentAssetId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchBienes = async (page: number, tipoBien: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/bienes`, {
        page,
        limit: 10,
        tipoBien,
        id_coordinacion: `${areaId}` 
      },{
        headers: {
          'Content-Type': 'application/json'  // Forzar cabecera JSON
        }
      }
    );
    console.log(response.data.data)
      setBienes(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching bienes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBienes(page, selectedTipoBien);
  }, [page, selectedTipoBien, areaId]);

  const handleTipoBienChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTipoBien(e.target.value as any);
    setPage(1);
  };

  const handlePrevious = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  const handleEditar = (id: number)=>{
      console.log(id)
  }

  const handleTransferir = (id: number) => {
    setCurrentAssetId(id);
    setIsTransferDialogOpen(true);
  }
  const handleConfirmTransfer = async () => {

    alert(`asset: ${currentAssetId} coordinacion: ${selectedCoordinacion}`)
    if (!currentAssetId || !selectedCoordinacion) return;
  
    setLoading(true);
    setError(null);
    
    try {
      await axios.post('/api/notificaciones/transferir', {
        assetId: currentAssetId,
        destinoId: selectedCoordinacion
      });
  
      // Actualizar la lista de bienes después de la transferencia
      await fetchBienes(page, selectedTipoBien);
      
      // Resetear estados
      setIsTransferDialogOpen(false);
      setSelectedCoordinacion(null);
      setCurrentAssetId(null);
      
    } catch (error) {
      console.error('Error en transferencia:', error);
      setError(
        axios.isAxiosError(error) 
          ? error.response?.data?.error || 'Error en transferencia'
          : 'Error desconocido'
      );
    } finally {
      setLoading(false);
    }
  }
  
  const handleEliminar = (id: number) => {
    setCurrentAssetId(id);
    setIsDeleteDialogOpen(true);
  }
  
  const handleConfirmDelete = async () => {
    if (!currentAssetId) return;
  
    setLoading(true);
    setError(null);
  
    try {
      await axios.post('/api/notificaciones/eliminar', {
        assetId: currentAssetId
      });
  
      setIsDeleteDialogOpen(false);
      setCurrentAssetId(null);
  
    } catch (error) {
      console.error('Error en eliminación:', error);
      setError(
        axios.isAxiosError(error) 
          ? error.response?.data?.error || 'Error en eliminación'
          : 'Error desconocido'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 w-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Bienes de la {area}</h1>
        <select
          value={selectedTipoBien}
          onChange={handleTipoBienChange}
          className="p-2 border rounded-md"
        >
          <option value="bienes">Bienes</option>
          <option value="bienes_transitorio">Bienes Transitorios</option>
        </select>
      </div>
  
     {/* Diálogo de Transferencia */}
{isTransferDialogOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-4">Confirmar Transferencia</h2>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
   
      <select
        value={selectedCoordinacion || ''}
        onChange={(e) => setSelectedCoordinacion(Number(e.target.value))}
        className="p-2 border rounded-md mb-4 w-full"
      >
        <option value="">Seleccione una coordinación</option>
        {coordinaciones.map((coordinacion) => {
          return (
            <option 
              key={coordinacion.id_coordinacion} 
              value={coordinacion.id_coordinacion}
              className="flex items-center"
            >{coordinacion.nombre_coordinacion}
            </option>
          );
        })}
      </select>
   

      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            setIsTransferDialogOpen(false);
            setSelectedCoordinacion(null);
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirmTransfer}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading || !selectedCoordinacion}
        >
          {loading ? 'Procesando...' : 'Confirmar'}
        </button>
      </div>
    </div>
  </div>
)}

{/* Diálogo de Eliminación */}
{isDeleteDialogOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-4">Confirmar Eliminación</h2>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <p className="mb-4">¿Está seguro que desea eliminar este bien?</p>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setIsDeleteDialogOpen(false)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirmDelete}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          disabled={loading}
        >
          {loading ? 'Eliminando...' : 'Confirmar Eliminación'}
        </button>
      </div>
    </div>
  </div>
)}

{loading ? (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
    <p className="text-white ml-4">Cargando...</p>
  </div>
) : (
        <>
          <div className="overflow-auto max-h-screen max-w-full">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Tipo</th>
                  <th className="py-2 px-4 border-b">N° Inventario</th>
                  <th className="py-2 px-4 border-b">Nombre</th>
                  <th className="py-2 px-4 border-b">Empleado</th>
                  <th className="py-2 px-4 border-b">Marca</th>
                  <th className="py-2 px-4 border-b">Modelo</th>
                  <th className="py-2 px-4 border-b">Serial</th>
                  <th className="py-2 px-4 border-b">Coordinación</th>
                  <th className="py-2 px-4 border-b">Fecha Ingreso</th>
                </tr>
              </thead>
              <tbody>
                {bienes.map((bien) => (
                  <tr key={bien.id_bienes}>
                    <td className="py-2 px-4 border-b text-center">
                      {bien.tipoBien === 'bienes' ? 'Bien' : 'Transitorio'}
                    </td>
                    <td className="py-2 px-4 border-b text-center">{bien.numero_inventario}</td>
                    <td className="py-2 px-4 border-b text-center">{bien.nombre_bien}</td>
                    <td className="py-2 px-4 border-b text-center">{bien.nombre_empleado}</td>
                    <td className="py-2 px-4 border-b text-center">{bien.marca ?? 'N/A'}</td>
                    <td className="py-2 px-4 border-b text-center">{bien.modelo ?? 'N/A'}</td>
                    <td className="py-2 px-4 border-b text-center">{bien.serial ?? 'N/A'}</td>
                    <td className="py-2 px-4 border-b text-center">{bien.coordinaciones?.number_coordinacion ?? 'Sin coordinación'}</td>
                    <td className="py-2 px-4 border-b text-center">{bien.fecha_ingreso ?? 'No registrada'}</td>
                    <td className="py-2 px-4 border-b text-center flex justify-evenly gap-2">
                    <button
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    onClick={() => handleTransferir(bien.id_bienes)}
  >
    Transferir
  </button>
  <button
    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
    onClick={() => handleEditar(bien.id_bienes)}
  >
    Editar
  </button>
  <button
    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    onClick={() => handleEliminar(bien.id_bienes)}
  >
    Eliminar
  </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevious}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Anterior
            </button>
  
            <span>
              Página {page} de {totalPages}
            </span>
  
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>

    
  );
  
};

export default BienesTable;
