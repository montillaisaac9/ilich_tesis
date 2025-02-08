// context/AuthContext.tsx
'use client';

import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  setAuth: (isAuth: boolean )=> void
  logout: () => void;
  setBien: (id: number) => void;
  idBien: number | null
  area: string | null;
  areaId: number | null; // Nuevo campo para el ID de la coordinación
  setArea: (area: string, areaId: number) => void; // Actualizado para incluir el ID
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [area, setAreaState] = useState<string | null>(null);
  const [areaId, setAreaId] = useState<number | null>(null);
  const [idBien, setIdBien] = useState<number | null>(null);

  const logout = () => {
    setIsAuthenticated(false);
    setAreaState(null);
    setAreaId(null);
  };

  const setBien = (id: number)=> {
    setIdBien(id)
  }

  const setArea = (area: string, areaId: number) => {
    setAreaId(areaId)
    setAreaState(area);
  };
  
  const setAuth = (auth: boolean)=>{
    setIsAuthenticated(auth)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuth, logout, setBien, idBien, area, areaId, setArea }}>
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