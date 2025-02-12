'use client'

import Head from "next/head";
import { useState } from "react";
import axios from "axios";

// Aquí puedes mantener la URL base para la descarga de otros archivos (si es necesario)
const BASE_URL = "http://localhost:3000/";

// En lugar de 'file', vamos a agregar 'fileId' para cada archivo en Google Drive
const documents = [
  { 
    title: "Formato de Bienes Transitorios",
    // Reemplaza el valor de fileId con el ID real del archivo en Google Drive
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
  // Estado para controlar el modal de previsualización
  const [previewUrl, setPreviewUrl] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Función para abrir el modal de previsualización
  const handlePreview = (fileId) => {
    const url = `https://drive.google.com/file/d/${fileId}/preview`;
    setPreviewUrl(url);
    setShowModal(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setShowModal(false);
    setPreviewUrl("");
  };

  // Función para descargar archivos mediante axios (ya la tenías)
  const handleDownload = async (endpoint, filename) => {
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
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-sky-400">
      <Head>
        <title>Formatos Institucionales - Descargas y Previsualización</title>
      </Head>

      <header className="text-center py-16 px-4">
        <h1 className="text-5xl font-bold text-white mb-4">
          Formatos y Documentos Oficiales
        </h1>
        <p className="text-xl text-purple-200">
          Recursos para gestión de bienes institucionales
        </p>
      </header>

      <main className="container mx-auto px-4 pb-16">
        {/* Sección de descargas especiales */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Descargar Formatos Especiales
          </h2>
          <p className="text-gray-200 mb-4">
            Haz clic en los botones a continuación para descargar los formatos especiales:
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => handleDownload("/api/export/sabana", "Sabana_Caracas.xlsx")}
              className="bg-green-600 hover:bg-green-800 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Descargar Sábana Caracas 2025
            </button>
            <button
              onClick={() => handleDownload("/api/export/bienes", "Bienes_Desincorporados.xlsx")}
              className="bg-green-600 hover:bg-green-800 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Descargar Bienes Desincorporados 2025
            </button>
          </div>
        </section>

        {/* Sección de documentos estáticos con opción de previsualización */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {documents.map((doc, index) => {
            return (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <h3 className="text-2xl font-semibold text-white mb-2">{doc.title}</h3>
                <p className="text-gray-200 mb-4">{doc.description}</p>

                <div className="flex gap-4">
                  {/* Botón de descarga */}
                  <a
                    href={`${BASE_URL}/docs/${doc.fileName}`}
                    download={doc.fileName}
                    className="bg-blue-700 hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-center transition-colors flex-1"
                  >
                    Descargar
                  </a>
                  {/* Botón de previsualización */}
                  <button
                    onClick={() => handlePreview(doc.fileId)}
                    className="bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition-colors flex-1"
                  >
                    Previsualizar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="text-center py-8 text-purple-200 border-t border-white/10">
        <p>© {new Date().getFullYear()} Departamento de Patrimonio</p>
      </footer>

      {/* Modal de previsualización */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg overflow-hidden w-11/12 md:w-3/4 lg:w-1/2">
            <div className="flex justify-end p-2">
              <button onClick={closeModal} className="text-gray-700 hover:text-gray-900">
                Cerrar
              </button>
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
