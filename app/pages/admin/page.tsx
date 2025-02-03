import Head from 'next/head';

const documents = [
  { 
    title: "Formato de Bienes Transitorios",
    file: "FORMATO DE BIENES TRANSITORIOS.docx",
    description: "Documento para registro y control de bienes en situación transitoria"
  },
  { 
    title: "Formato Desincorporación de Bienes",
    file: "FORMATO DESINCOPORACIÓN BIENES.docx",
    description: "Formulario oficial para proceso de desincorporación de activos"
  },
  { 
    title: "Formato Entrada y Salida",
    file: "FORMATO ENTRADA Y SALIDA.docx",
    description: "Control de movimientos de bienes en formato Word"
  },
  { 
    title: "Bienes Desincorporados 2024",
    file: "FORMATO FINAL BIENES DESINCORPORADOS 2024.xlsx",
    description: "Plantilla Excel para registro final de desincorporaciones anuales"
  },
  { 
    title: "Formato de Resguardo",
    file: "FORMATO RESGUARDO.docx",
    description: "Documento legal para asignación y custodia de bienes"
  },
  { 
    title: "Revisión Técnica",
    file: "FORMATO REVISION TECNICA.docx",
    description: "Checklist para evaluación técnica de activos"
  },
  { 
    title: "Transferencia de Bienes",
    file: "FORMATO TRANSFERENCIA DE BIENES.docx",
    description: "Formulario para proceso de transferencia entre áreas"
  },
  { 
    title: "Sábana Caracas 2024",
    file: "SABANA CARACAS 2024.xlsx",
    description: "Plantilla Excel para inventario general de bienes 2024"
  }
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-sky-400">
      <Head>
        <title>Formatos Institucionales - Descargas</title>
      </Head>

      <header className="text-center py-16 px-4">
        <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in-down">
          Formatos y Documentos Oficiales
        </h1>
        <p className="text-xl text-purple-200">Recursos para gestión de bienes institucionales</p>
      </header>

      <main className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {documents.map((doc, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform transition-all hover:scale-105 hover:shadow-xl"
            >
              <div className="flex flex-col h-full">
                <h3 className="text-2xl font-semibold text-white mb-2">{doc.title}</h3>
                <p className="text-gray-200 flex-grow mb-4">{doc.description}</p>
                <a
                  href={`/docs/${doc.file}`}
                  download
                  className="mt-auto w-full bg-blue-700 hover:bg-blue-900 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>Descargar</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-8 text-purple-200 border-t border-white/10">
        <p>© {new Date().getFullYear()} Departamento de Patrimonio</p>
      </footer>
    </div>
  );
}