import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RequestBody {
  username: string;
  palabra_seguridad: string;
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { username, palabra_seguridad } = body;

    const usuario = await prisma.usuarios.findUnique({
      where: { username },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    if (usuario.palabra_seguridad !== palabra_seguridad) {
      return NextResponse.json(
        { error: 'Palabra de seguridad incorrecta' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Palabra correcta', id_usuario: usuario.id_usuario },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}