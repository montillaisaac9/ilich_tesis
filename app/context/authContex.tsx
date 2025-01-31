// context/AuthContext.tsx
'use client'

import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  area: string | null;
  setArea: (area: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [area, setArea] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    // Simula una autenticación (reemplaza con tu lógica real)
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      setIsAuthenticated(true);
    } else {
      throw new Error('Credenciales inválidas');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setArea(null); // Limpia el área al cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, area, setArea }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}