// app/pages/login/page.tsx
'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/app/stores/authStore'; // Cambiar import
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react'; // Añadir NextAuth

export default function LoginPage() {
  const router = useRouter();
  const area = useAuthStore((state) => state.area); // Obtener área del store
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Usar NextAuth para el login
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push(`/dashboard?area=${area}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
        <Image
              src="/img/logo.png" // Ruta de la imagen en la carpeta public
              alt="Logo"
              width={100} // Ancho de la imagen
              height={100} // Alto de la imagen
              className="rounded-full justify-self-center" // Opcional: si quieres que la imagen sea redonda
            />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">One Guilardo</h1>
          <p className="text-xl text-blue-600 font-semibold">Bismarcko</p>
          <p className="mt-4 text-gray-500">Área: {area}</p>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Usuario"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Iniciar Sesión
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/reset-password" className="text-blue-600 hover:text-blue-700 text-sm">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
}