'use client'

import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/authContex';

interface Bien {
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
  const { areaId } = useAuth();
  const [tipoBien, setTipoBien] = useState<string>('bienes');
  const [formData, setFormData] = useState<Bien>({
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
  const router = useRouter();

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
    
    if (areaId) try {
      const payload = {
        ...formData,
        numero_inventario: String(formData.numero_inventario),
        id_coordinacion: areaId
      };

      const response = await axios.post('/api/bienes/add', payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 201) {
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

  return (
<div className="flex items-center justify-center h-screen w-full">
  <div className="max-w-2xl mx-auto w-screen overflow-auto p-6 bg-white shadow-md rounded-lg">
    <h1 className="text-2xl font-bold mb-6 text-center">Formulario de Creación de Bienes</h1>

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

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 text-white font-semibold rounded-md shadow-sm transition-colors ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500'
          }`}
        >
          {isSubmitting ? 'Enviando...' : 'Registrar Bien'}
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default BienesForm;