import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RequestBody {
  id_usuario: number;
  nueva_contraseña: string;
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { id_usuario, nueva_contraseña } = body;

    await prisma.usuarios.update({
      where: { id_usuario },
      data: { contrase_a: nueva_contraseña },
    });

    return NextResponse.json(
      { message: 'Contraseña actualizada' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la contraseña' },
      { status: 500 }
    );
  }
}