// app/pages/login/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/app/context/authContex';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios'; // Importar axios
import {EyeSlashIcon, EyeIcon,} from '@heroicons/react/24/outline';


export default function LoginPage() {
  const router = useRouter();
  const { setAuth, setArea, areaId, area } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!areaId) {
        setError('Debes seleccionar una coordinación');
      }

      // Usar axios en lugar de fetch
      const response = await axios.post('/api/auth/login', {
        username,
        password,
        id_coordinacion: areaId,
      });

      const data = response.data;

      if (response.status == 200) {
        setArea(`${area}`, areaId);
        const redirectUrl1 = `/pages/dashboard`
        const redirectUrl2 = `/pages/admin`
        setAuth(true) 
        if (areaId != null && area != ''){
          router.push(redirectUrl1)
        }        
        if (area == 'ADMIN' && areaId == 10){
          router.push(redirectUrl2)
        }        
      } else console.log(data.message)
    } catch (err: any) {
      console.log(err)
      if (err.status == 401) setError("Coordinación no válida para este usuario");
      if (err.status == 404) setError("Credenciales Incorrectas");
      if (err.status == 500) setError("'Error en el servidor")
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
            className="rounded-full justify-self-center"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Ore Guárico</h1>
          <p className="mt-4 text-gray-500">
 {area ? `Área: ${area}` : "Por favor seleccione una coordinación"}
</p>

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
              required
            />
          </div>

          <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Contraseña"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="button"
        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeSlashIcon className="w-5 h-5" />
        ) : (
          <EyeIcon className="w-5 h-5" />
        )}
      </button>
    </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Iniciar Sesión
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/pages/auth/reset-password" className="text-blue-600 hover:text-blue-700 text-sm">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
}