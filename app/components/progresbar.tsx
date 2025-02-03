



export const progressBar = ()=>{
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
        <p className="text-white ml-4">Cargando...</p>
      </div>
    )
}

export default progressBar