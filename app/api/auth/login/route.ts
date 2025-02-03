// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request, ) {
  try {
    const { username, password, id_coordinacion } = await request.json();

    // Buscar el usuario en la base de datos
    const user = await prisma.usuarios.findUnique({
      where: { username },
      include: {
        coordinaciones: true, // Incluir la relación con coordinaciones
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Credenciales Incorrectas' },
        { status: 404 }
      );
    }

    // Verificar el id_coordinacion
    if (user.id_coordinacion !== id_coordinacion) {
      return NextResponse.json(
        { message: 'Coordinación no válida para este usuario' },
        { status: 401 }
      );
    }

    // Verificar la contraseña
    if (password !== user.contrase_a) {
      return NextResponse.json(
        { message: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    // Crear la sesión
    const session = {
      id: user.id_usuario,
      username: user.username,
      id_coordinacion: user.id_coordinacion,
      coordinacion: user.coordinaciones?.nombre_coordinacion,
    };

    // Crear la respuesta y establecer la cookie
    const response = NextResponse.json(session);

    response.cookies.set('session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error en el login:', error);
    return NextResponse.json(
      { message: 'Error en el servidor' },
      { status: 500 }
    );
  }
}