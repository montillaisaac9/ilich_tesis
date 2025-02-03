import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Rutas protegidas (ajusta estas rutas a las que realmente usas)
  const protectedPaths = ['/dashboard', '/admin'];

  // Verificar si la ruta actual está protegida
  const isProtected = protectedPaths.some((protectedPath) =>
    path.startsWith(protectedPath)
  );

  if (isProtected) {
    console.log('Ruta protegida detectada:', path);

    // Obtener la cookie de sesión
    const session = request.cookies.get('session')?.value;

    if (!session) {
      console.log('No hay sesión. Redirigiendo a /auth/login');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      // Verificar la sesión (puedes agregar lógica adicional, como validar con un servicio externo)
      const parsedSession = JSON.parse(session);

      if (!parsedSession.id || !parsedSession.username) {
        throw new Error('Sesión inválida');
      }

      console.log('Sesión válida. Permitiendo acceso.');
      return NextResponse.next();
    } catch (error) {
      console.error('Error en el middleware:', error);

      // Eliminar la cookie de sesión si es inválida
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('session');
      return response;
    }
  }

  console.log('Ruta no protegida. Permitiendo acceso.');
  return NextResponse.next();
}

// Configuración del matcher
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
