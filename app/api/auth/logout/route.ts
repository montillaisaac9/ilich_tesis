import { NextResponse } from 'next/server';

export async function POST() {
  // Crear respuesta y eliminar la cookie
  const response = NextResponse.json(
    { message: 'Sesión cerrada exitosamente' },
    { status: 200 }
  );

  // Eliminar la cookie de sesión
  response.cookies.set('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0), // Fecha de expiración en el pasado
    path: '/',
  });

  return response;
}