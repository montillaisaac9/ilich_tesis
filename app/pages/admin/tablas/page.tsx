'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/app/context/authContex';
import { progressBar } from '@/app/components/progresbar';

interface Coordination {
  id_coordinacion: number;
  nombre_coordinacion: string;
  number_coordinacion: string;
}

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
  const [loading, setLoading] = useState(false);


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


{loading ? (
  progressBar()
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
