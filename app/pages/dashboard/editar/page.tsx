'use client'

import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/authContex';

interface Bien {
  id_bienes: string;
  tipoBien: string;
  numero_inventario: string;
  nombre_bien: string;
  nombre_empleado: string;
  marca?: string;
  modelo?: string;
  serial?: string;
  caracteristicas?: string;
  codigo_color?: string;
  estado_bien?: string;
  id_coordinacion?: number | null;
  fecha_ingreso: string;
}

type FieldConfig = {
  name: keyof Bien;
  label: string;
  type: string;
  required: boolean;
  showFor?: string[];
  placeholder?: string;
};

const BienesForm: React.FC = () => {
  const { areaId,idBien } = useAuth();
  const [tipoBien, setTipoBien] = useState<string>('bienes');
  const [formData, setFormData] = useState<Bien>({
    id_bienes: '',
    tipoBien: 'bienes',
    numero_inventario: '',
    nombre_bien: '',
    nombre_empleado: "",
    marca: '',
    modelo: '',
    serial: '',
    caracteristicas: '',
    codigo_color: '',
    estado_bien: '',
    id_coordinacion: areaId,
    fecha_ingreso: '',
  });

  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const bienId = idBien; // Aquí debería ir el ID del bien a editar, por ejemplo desde la URL

  const commonFields: FieldConfig[] = [
    { 
      name: 'nombre_empleado', 
      label: 'Nombre del Empleado', 
      type: 'text', 
      required: true,
      placeholder: 'Ej: Juan Pérez' 
    },
    { 
      name: 'numero_inventario', 
      label: 'Número de Inventario', 
      type: 'number', 
      required: true,
      placeholder: 'Número único del bien' 
    },
    { 
      name: 'nombre_bien', 
      label: 'Nombre del Bien', 
      type: 'text', 
      required: true,
      placeholder: 'Ej: Computadora portátil' 
    },
    { 
      name: 'fecha_ingreso', 
      label: 'Fecha de Ingreso', 
      type: 'date', 
      required: true 
    },
  ];

  const typeSpecificFields: FieldConfig[] = [
    // Campos para Bienes comunes
    { 
      name: 'marca', 
      label: 'Marca', 
      type: 'text', 
      required: false, 
      showFor: ['bienes'],
      placeholder: 'Ej: Dell, HP' 
    },
    { 
      name: 'modelo', 
      label: 'Modelo', 
      type: 'text', 
      required: false, 
      showFor: ['bienes'],
      placeholder: 'Ej: XPS 15' 
    },
    { 
      name: 'serial', 
      label: 'Serial', 
      type: 'text', 
      required: false, 
      showFor: ['bienes'],
      placeholder: 'Número de serie del equipo' 
    },
    { 
      name: 'caracteristicas', 
      label: 'Características Técnicas', 
      type: 'textarea', 
      required: false, 
      showFor: ['bienes'],
      placeholder: 'Especificaciones técnicas relevantes' 
    },
    
    // Campos para Bienes Transitorios
    { 
      name: 'codigo_color', 
      label: 'Código de Color', 
      type: 'text', 
      required: false, 
      showFor: ['bienes_transitorio'],
      placeholder: 'Código hexadecimal o referencia' 
    },
    { 
      name: 'estado_bien', 
      label: 'Estado Físico', 
      type: 'text', 
      required: false, 
      showFor: ['bienes_transitorio'],
      placeholder: 'Ej: Nuevo, Usado, Dañado' 
    }
  ];

  useEffect(() => {
    const fetchBienData = async () => {
      if (!bienId) return; // Asegurar que el ID está definido
  
      try {
        const response = await axios.post('/api/bienes/selecion', { id_bienes: bienId }); // Cambio aquí
        setFormData(response.data.data); // Acceder a `data` dentro de la respuesta
        console.log(response.data.data);
      } catch (error) {
        console.error('Error al obtener los datos del bien:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchBienData();
  }, [bienId]); // Agregar `bienId` como dependencia para ejecutar solo cuando cambia
  

  const handleTipoBienChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTipoBien = event.target.value;
    setTipoBien(selectedTipoBien);
    setFormData(prev => ({
      ...prev,
      tipoBien: selectedTipoBien,
      marca: '',
      modelo: '',
      serial: '',
      caracteristicas: '',
      codigo_color: '',
      estado_bien: '',
      id_coordinacion: areaId
    }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderField = (field: FieldConfig) => {
    return (
      <div key={field.name} className="space-y-1">
        <label className="block text-sm font-medium text-gray-700" htmlFor={field.name}>
          {field.label}
          {field.required && <span className="text-red-500"> *</span>}
        </label>
        
        {field.type === 'textarea' ? (
          <textarea
            id={field.name}
            name={field.name}
            value={formData[field.name] as string}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required={field.required}
            placeholder={field.placeholder}
            rows={4}
          />
        ) : (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={formData[field.name] as string}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required={field.required}
            placeholder={field.placeholder}
            min={field.type === 'date' ? '2000-01-01' : undefined}
          />
        )}
      </div>
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      if (!formData.id_bienes) {
        alert("El campo 'id_bienes' es obligatorio");
        return;
      }
  
      setIsLoading(true);
      const payload = {
        ...formData,
        numero_inventario: String(formData.numero_inventario),
        id_coordinacion: areaId
      };
  
      // Verificar que haya al menos un campo para actualizar
      const tieneDatos = Object.keys(payload).some(key => payload[key] !== null && payload[key] !== undefined);
      if (!tieneDatos) {
        alert("No hay datos válidos para actualizar");
        return;
      }
  
      const response = await axios.patch(`/api/bienes/editar`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (response.status === 200) {
        router.push('/pages/dashboard');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || 'Error en el servidor');
      }
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
    <p className="text-white ml-4">Cargando...</p>
  </div>
  }

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="max-w-2xl mx-auto w-screen overflow-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Formulario de Edición de Bienes</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="tipo-bien" className="block text-sm font-medium text-gray-700">
              Tipo de Bien
            </label>
            <select
              id="tipo-bien"
              value={tipoBien}
              onChange={handleTipoBienChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="bienes">Bienes Tecnológicos</option>
              <option value="bienes_transitorio">Bienes Transitorios</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commonFields.map(renderField)}
            {typeSpecificFields.map(renderField)}
          </div>

          {/* Inputs de archivo deshabilitados */}
          <div>
            <label htmlFor="foto1" className="block text-sm font-medium text-gray-700">
              Foto 1
            </label>
            <input
              type="file"
              id="foto1"
              disabled
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="foto2" className="block text-sm font-medium text-gray-700">
              Foto 2
            </label>
            <input
              type="file"
              id="foto2"
              disabled
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BienesForm;
