'use client'

import Head from "next/head";
import { useState } from "react";
import axios from "axios";

// URL base para la descarga de documentos
const BASE_URL = "http://localhost:3000/";

const documents = [
  { 
    title: "Formato de Bienes Transitorios",
    fileId: "1WS73vnKYJ9iyYyc7GyUvEKb4zlDo8Dlm", 
    fileName: "FORMATO DE BIENES TRANSITORIOS.docx",
    description: "Documento para registro y control de bienes en situación transitoria"
  },
  { 
    title: "Formato Desincorporación de Bienes",
    fileId: "14x69A7fKuoASReI-vkiLwaJp0tDrmKui", 
    fileName: "FORMATO DESINCOPORACIÓN BIENES.docx",
    description: "Formulario oficial para proceso de desincorporación de activos"
  },
  { 
    title: "Formato Entrada y Salida",
    fileId: "168JxVEvhJiIVE6IVT-E0aw-d0mKUVVbI", 
    fileName: "FORMATO ENTRADA Y SALIDA.docx",
    description: "Control de movimientos de bienes en formato Word"
  },
  { 
    title: "Bienes Desincorporados 2024",
    fileId: "1MGkvgLdE9uW3ObsyNjlUo8bSsgXnf-fL", 
    fileName: "FORMATO FINAL BIENES DESINCORPORADOS 2024.xlsx",
    description: "Plantilla Excel para registro final de desincorporaciones anuales"
  },
  { 
    title: "Formato de Resguardo",
    fileId: "15VqzsCanRF5COP9ArL6tV46SK9-K_ncM", 
    fileName: "FORMATO RESGUARDO.docx",
    description: "Documento legal para asignación y custodia de bienes"
  },
  { 
    title: "Revisión Técnica",
    fileId: "1GaFLOSTIiFjQWE5HHi1KJPIMEGRY3zD8", 
    fileName: "FORMATO REVISION TECNICA.docx",
    description: "Checklist para evaluación técnica de activos"
  },
];

export default function DocsPage() {
  const [previewUrl, setPreviewUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  const handlePreview = (fileId: string) => {
    setPreviewUrl(`https://drive.google.com/file/d/${fileId}/preview`);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setPreviewUrl("");
  };

  const handleDownload = async (endpoint: string, filename: string) => {
    setIsLoading(true); // Activar loading
    try {
      const response = await axios.get(endpoint, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error descargando archivo:", error);
    } finally {
      setIsLoading(false); // Desactivar loading
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-600 overflow-auto">
      {
       isLoading ?(
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
               <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
               <p className="text-white ml-4">Cargando...</p>
             </div>
             ) : <div></div>
      }
      <Head>
        <title>Formatos Institucionales - Descargas y Previsualización</title>
      </Head>

      <header className="text-center py-16 px-4">
        <h1 className="text-5xl font-bold text-white mb-4">Formatos y Documentos Oficiales</h1>
        <p className="text-xl text-purple-200">Recursos para gestión de bienes institucionales</p>
      </header>

      <main className="container mx-auto px-4 pb-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {documents.map((doc, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform transition-all hover:scale-105 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-white mb-2">{doc.title}</h3>
              <p className="text-gray-200 mb-4">{doc.description}</p>

              <div className="flex gap-4">
                <a
                  href={`${BASE_URL}/docs/${doc.fileName}`}
                  download={doc.fileName}
                  className="bg-blue-700 hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-center transition-colors flex-1"
                >
                  Descargar
                </a>
                <button
                  onClick={() => handlePreview(doc.fileId)}
                  className="bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition-colors flex-1"
                >
                  Previsualizar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-8 text-purple-200 border-t border-white/10">
        <p>© {new Date().getFullYear()} Departamento de Patrimonio</p>
      </footer>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg overflow-hidden w-11/12 md:w-3/4 lg:w-1/2">
            <div className="flex justify-end p-2">
              <button onClick={closeModal} className="text-gray-700 hover:text-gray-900">Cerrar</button>
            </div>
            <div className="p-4">
              <iframe 
                src={previewUrl} 
                width="100%" 
                height="500px" 
                frameBorder="0" 
                allow="autoplay; encrypted-media" 
                allowFullScreen
                title="Previsualización del archivo"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de Spinner
function LoadingSpinner() {
  return (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );
}
