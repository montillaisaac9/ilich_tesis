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
  const { areaId, area } = useAuth();
  const [bienes, setBienes] = useState<Bien[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTipoBien, setSelectedTipoBien] = useState<'bienes' | 'bienes_transitorio'>('bienes');
  const [loading, setLoading] = useState(false);

  // Estado para el buscador
  const [searchQuery, setSearchQuery] = useState("");

  // Estados para el filtrado por rango de fechas
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // Función para resaltar en amarillo el texto que concuerde con la búsqueda
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-300">{part}</span>
      ) : (
        part
      )
    );
  };

  const fetchBienes = async (page: number, tipoBien: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `/api/bienes`,
        {
          page,
          limit: 10,
          tipoBien,
          id_coordinacion: `${areaId}`
        },
        {
          headers: {
            'Content-Type': 'application/json' // Forzar cabecera JSON
          }
        }
      );
      console.log(response.data.data);
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
  },[]);


  useEffect(() => {
    fetchBienes(page, selectedTipoBien);
  }, [page, selectedTipoBien, areaId]);

  const handleTipoBienChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTipoBien(e.target.value as 'bienes' | 'bienes_transitorio');
    setPage(1);
  };

  const handlePrevious = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  // Filtrado interno combinando búsqueda y filtrado por fechas
  const filteredBienes = bienes.filter((bien) => {
    // Filtrado por búsqueda
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || (
      bien.numero_inventario.toLowerCase().includes(query) ||
      bien.nombre_bien.toLowerCase().includes(query) ||
      bien.nombre_empleado.toLowerCase().includes(query) ||
      (bien.marca && bien.marca.toLowerCase().includes(query)) ||
      (bien.modelo && bien.modelo.toLowerCase().includes(query)) ||
      (bien.serial && bien.serial.toLowerCase().includes(query)) ||
      (bien.coordinaciones && bien.coordinaciones.number_coordinacion.toLowerCase().includes(query)) ||
      (bien.fecha_ingreso && bien.fecha_ingreso.toLowerCase().includes(query))
    );
  
    // Filtrado por rango de fechas: si no hay fechas seleccionadas, se muestran todos
    let matchesDate = true;
    if (filterStartDate !== "" || filterEndDate !== "") {
      if (!bien.fecha_ingreso) {
        matchesDate = false;
      } else {
        const bienDate = new Date(bien.fecha_ingreso).getTime();
        if (filterStartDate !== "" && bienDate < new Date(filterStartDate).getTime()) {
          matchesDate = false;
        }
        if (filterEndDate !== "" && bienDate > new Date(filterEndDate).getTime()) {
          matchesDate = false;
        }
      }
    }
    return matchesSearch && matchesDate;
  });

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
        </select>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-md w-full"
        />
      </div>

      {/* Filtrado por rango de fechas */}
      <div className="flex gap-4 mb-4">
        <div>
          <label htmlFor="startDate" className="mr-2">Desde:</label>
          <input
            type="date"
            id="startDate"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="mr-2">Hasta:</label>
          <input
            type="date"
            id="endDate"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
        {(filterStartDate || filterEndDate) && (
          <button
            onClick={() => {
              setFilterStartDate("");
              setFilterEndDate("");
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Limpiar Filtros
          </button>
        )}
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
                {filteredBienes.map((bien) => (
                  <tr key={bien.id_bienes}>
                    <td className="py-2 px-4 border-b text-center">
                      {highlightText(bien.tipoBien === 'bienes' ? 'Bien' : 'Transitorio', searchQuery)}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {highlightText(bien.numero_inventario, searchQuery)}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {highlightText(bien.nombre_bien, searchQuery)}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {highlightText(bien.nombre_empleado, searchQuery)}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {highlightText(bien.marca ?? 'N/A', searchQuery)}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {highlightText(bien.modelo ?? 'N/A', searchQuery)}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {highlightText(bien.serial ?? 'N/A', searchQuery)}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {highlightText(bien.coordinaciones?.number_coordinacion ?? 'Sin coordinación', searchQuery)}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {highlightText(bien.fecha_ingreso ?? 'No registrada', searchQuery)}
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
