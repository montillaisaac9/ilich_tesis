'use client'

import React, { useState, useEffect, FormEvent } from 'react';
import axios, { AxiosResponse } from 'axios';
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

interface UploadResponse {
  fileUrl: string;
}

const BienesForm: React.FC = () => {
  const { areaId, idBien } = useAuth();
  const router = useRouter();
  
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
  const [uploadProgress, setUploadProgress] = useState<{ foto1: number; foto2: number }>({ foto1: 0, foto2: 0 });
  const [uploading, setUploading] = useState<{ foto1: boolean; foto2: boolean }>({ foto1: false, foto2: false });

  const bienId = idBien; // ID del bien a editar

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
        const response = await axios.post('/api/bienes/selecion', { id_bienes: bienId });
        setFormData(response.data.data);
        console.log("Datos obtenidos:", response.data.data);
      } catch (error) {
        console.error('Error al obtener los datos del bien:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchBienData();
  }, [bienId]);

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

  // Función para subir un único archivo (por foto) que retorna la URL
  const handleFileUpload = async (file: File, field: 'foto1' | 'foto2'): Promise<void> => {
    const fileData = new FormData();
    fileData.append('image', file);
    
    setUploading(prev => ({ ...prev, [field]: true }));
    setUploadProgress(prev => ({ ...prev, [field]: 0 }));
  
    try {
      const response: AxiosResponse<UploadResponse> = await axios.post('/api/upload', fileData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = total ? Math.round((loaded * 100) / total) : 0;
          setUploadProgress(prev => ({ ...prev, [field]: percentCompleted }));
        }
      });
      if (response.status === 200) {
        const fileUrl = response.data.fileUrl;
        setFormData(prev => ({ ...prev, [field]: fileUrl }));
      } else {
        console.error('Error en la carga de la imagen:', response.data);
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    } finally {
      setUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      if (!formData.id_bienes) {
        alert("El campo 'id_bienes' es obligatorio");
        return;
      }
  
      const payload = {
        ...formData,
        numero_inventario: String(formData.numero_inventario),
        id_coordinacion: areaId
      };
  
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
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
        <p className="text-white ml-4">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen w-full">
      {/* Contenedor scrollable con altura máxima definida */}
      <div className="max-w-2xl mx-auto w-screen overflow-auto p-6 bg-white shadow-md rounded-lg" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
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

          {/* Inputs para editar fotos */}
          <div>
            <label htmlFor="foto1" className="block text-sm font-medium text-gray-700">
              Foto 1
            </label>
            <input
              type="file"
              id="foto1"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0], 'foto1');
                }
              }}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {uploading.foto1 && (
              <progress value={uploadProgress.foto1} max="100" className="w-full my-2"></progress>
            )}
            {formData.foto1 && (
              <img src={formData.foto1} alt="Foto 1" className="mt-2 h-40 object-contain" />
            )}
          </div>

          <div>
            <label htmlFor="foto2" className="block text-sm font-medium text-gray-700">
              Foto 2
            </label>
            <input
              type="file"
              id="foto2"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0], 'foto2');
                }
              }}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {uploading.foto2 && (
              <progress value={uploadProgress.foto2} max="100" className="w-full my-2"></progress>
            )}
            {formData.foto2 && (
              <img src={formData.foto2} alt="Foto 2" className="mt-2 h-40 object-contain" />
            )}
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
