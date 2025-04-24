'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/app/context/authContex';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { EyeSlashIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, setArea, areaId, area } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Array de coordinaciones usando solo id y nombre
  const coordinations = [
    { id: 1, name: '001-1 Dirección General', area: 'Dirección General'},
    { id: 2, name: '002-2 Gestión Administrativa', area: 'Gestión Administrativa'},
    { id: 3, name: '003-3 Partidos Políticos', area: 'Partidos Políticos'},
    { id: 4, name: '004-4 Producción y Logística', area: 'Producción y Logística'},
    { id: 5, name: '005-5 Junta Regional', area: 'Junta Regional'},
    { id: 6, name: '006-6 Tecnología de la Información', area: 'Tecnología de la Información'},
    { id: 7, name: '007-7 Registro Civil', area: 'Registro Civil'},
    { id: 8, name: '008-8 Registro Electoral', area: 'Registro Electoral'},
    { id: 9, name: '009-9 Vigilante', area: 'Vigilante'},
    { id: 10, name: '010-1 ADMIN', area: 'ADMIN'},
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!areaId) {
        setError('Debes seleccionar una coordinación');
        return;
      }

      // Usar axios para la petición
      const response = await axios.post('/api/auth/login', {
        username,
        password,
        id_coordinacion: areaId,
      });

      const data = response.data;

      if (response.status === 200) {
        setArea(`${area}`, areaId);
        console.log(area)
        const redirectUrl1 = `/pages/dashboard`;
        const redirectUrl2 = `/pages/admin`;
        const redirectUr13 = `/pages/vigilante`;
        setAuth(true);
        if (areaId != null && area !== '') {
          router.push(redirectUrl1);
        }
        if (area === '010-1 ADMIN' && areaId === 10) {
          router.push(redirectUrl2);
        }
        if (area === '009-9 Vigilante' && areaId === 9) {
          router.push(redirectUr13);
        }
      } else {
        console.log(data.message);
      }
    } catch (err: any) {
      console.log(err);
      if (err.status === 401) setError("Coordinación no válida para este usuario");
      if (err.status === 404) setError("Credenciales Incorrectas");
      if (err.status === 500) setError("Error en el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen w-screen flex flex-col items-center justify-center p-4">
            {loading ? (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
          <p className="text-white ml-4">Cargando...</p>
        </div>
      ) : null}
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

        {/* Select de Coordinación (solo id y nombre) */}
        <div className="mb-8">
          <select
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              const selectedCoord = coordinations.find(coord => coord.id === selectedId);
              if (selectedCoord) {
                // Actualiza el área y su id en el contexto
                setArea(selectedCoord.name, selectedCoord.id);
              }
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            defaultValue=""
          >
            <option value="" disabled>
              Seleccione una coordinación
            </option>
            {coordinations.map((coord) => (
              <option key={coord.id} value={coord.id}>
                {coord.name}
              </option>
            ))}
          </select>
        </div>

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
