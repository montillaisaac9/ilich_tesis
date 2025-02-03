'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

const ResetPassword = () => {
  const [username, setUsername] = useState<string>('');
  const [palabraSeguridad, setPalabraSeguridad] = useState<string>('');
  const [nuevaContraseña, setNuevaContraseña] = useState<string>('');
  const [step, setStep] = useState<number>(1);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleVerificarPalabra = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/verify-security-word', {
        username,
        palabra_seguridad: palabraSeguridad,
      });

      setIdUsuario(response.data.id_usuario);
      setStep(2);
      setError('');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error || 'Error de conexión');
      } else {
        setError('Error desconocido');
      }
    }
  };

  const handleCambiarContraseña = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idUsuario) return;

    try {
      await axios.post('/api/auth/change-password', {
        id_usuario: idUsuario,
        nueva_contraseña: nuevaContraseña,
      });

      alert('Contraseña cambiada exitosamente');
      router.push('/auth/login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error || 'Error de conexión');
      } else {
        setError('Error desconocido');
      }
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Image
            src="/img/logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="rounded-full mx-auto"
          />
          <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">One Guilardo</h1>
          <p className="text-xl text-blue-600 font-semibold">Bismarcko</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            <span>{error}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleVerificarPalabra} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Usuario"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Palabra de Seguridad"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={palabraSeguridad}
                onChange={(e) => setPalabraSeguridad(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Verificar
            </button>
          </form>
        ) : (
          <form onSubmit={handleCambiarContraseña} className="space-y-6">
            <div>
              <input
                type="password"
                placeholder="Nueva Contraseña"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={nuevaContraseña}
                onChange={(e) => setNuevaContraseña(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Cambiar Contraseña
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link 
            href="/pages/auth/login" 
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Volver al Inicio de Sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;